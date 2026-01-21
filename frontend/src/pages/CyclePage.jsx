import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './CyclePage.css';

const API_BASE = import.meta.env.VITE_API_BASE ? `${import.meta.env.VITE_API_BASE}/cycle` : 'http://localhost:5001/api/cycle';

const CyclePage = () => {
  // State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [settings, setSettings] = useState(null);
  const [todayEntry, setTodayEntry] = useState({
    flowIntensity: '',
    sensations: [],
    mood: null
  });
  const [monthData, setMonthData] = useState({
    entries: [],
    predictedDays: [],
    fertileDays: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const moods = ['😊', '😐', '😢', '😤', '😴'];
  const defaultSensations = ['Cramps', 'Headache', 'Bloating', 'Backache'];

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch month data when month changes
  useEffect(() => {
    fetchMonthData();
  }, [currentMonth]);

  // Fetch entry when selected date changes
  useEffect(() => {
    fetchDayEntry(selectedDate);
  }, [selectedDate]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Use default settings if API fails
      setSettings({
        currentCycleDay: Math.ceil((new Date() - new Date(new Date().getFullYear(), new Date().getMonth(), 1)) / (1000 * 60 * 60 * 24)) % 28 + 1,
        currentPhase: 'Follicular',
        averageCycleLength: 28
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthData = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const res = await fetch(`${API_BASE}/month/${year}/${month}`);
      const data = await res.json();
      setMonthData(data);
    } catch (error) {
      console.error('Error fetching month data:', error);
      setMonthData({ entries: [], predictedDays: [], fertileDays: [] });
    }
  };

  const fetchDayEntry = async (date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const res = await fetch(`${API_BASE}/entry/${dateStr}`);
      const data = await res.json();
      setTodayEntry({
        flowIntensity: data.flowIntensity || '',
        sensations: data.sensations || [],
        mood: data.mood
      });
    } catch (error) {
      console.error('Error fetching entry:', error);
      setTodayEntry({ flowIntensity: '', sensations: [], mood: null });
    }
  };

  const saveEntry = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          ...todayEntry
        })
      });
      
      if (res.ok) {
        setSaveMessage('Entry saved successfully!');
        fetchMonthData(); // Refresh calendar
        fetchSettings(); // Refresh cycle info
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      setSaveMessage('Failed to save. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDayClass = (day) => {
    const today = new Date();
    const isToday = 
      day === today.getDate() && 
      currentMonth.getMonth() === today.getMonth() && 
      currentMonth.getFullYear() === today.getFullYear();
    
    const isSelected = 
      day === selectedDate.getDate() && 
      currentMonth.getMonth() === selectedDate.getMonth() && 
      currentMonth.getFullYear() === selectedDate.getFullYear();
    
    // Check if there's an entry for this day
    const entry = monthData.entries.find(e => {
      const entryDate = new Date(e.date);
      return entryDate.getDate() === day;
    });
    
    let classes = ['day'];
    
    if (isSelected) classes.push('selected');
    if (isToday) classes.push('today');
    if (entry?.isFlowDay) classes.push('flow');
    else if (monthData.fertileDays.includes(day)) classes.push('fertile');
    else if (monthData.predictedDays.includes(day)) classes.push('predicted');
    
    return classes.join(' ');
  };

  const selectDay = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const toggleSensation = (sensation) => {
    setTodayEntry(prev => ({
      ...prev,
      sensations: prev.sensations.includes(sensation)
        ? prev.sensations.filter(s => s !== sensation)
        : [...prev.sensations, sensation]
    }));
  };

  const getPhaseMessage = () => {
    const phase = settings?.currentPhase || 'Unknown';
    const messages = {
      'Menstrual': { title: 'Rest if you need to', description: 'Your body is working. Honor what it needs.' },
      'Follicular': { title: 'Feeling energetic?', description: 'Estrogen is rising. A good time for movement.' },
      'Ovulation': { title: 'Peak energy', description: 'You might feel more social and energized.' },
      'Luteal': { title: 'Winding down', description: 'Listen to your body as it prepares for the next cycle.' },
      'Unknown': { title: 'Track to learn', description: 'Log your cycle to get personalized insights.' }
    };
    return messages[phase] || messages['Unknown'];
  };

  const formatSelectedDate = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
  };

  if (loading) {
    return (
      <div className="cycle-page loading">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading your cycle data...</p>
      </div>
    );
  }

  const phaseMessage = getPhaseMessage();

  return (
    <div className="cycle-page">
      {/* Header */}
      <motion.header 
        className="cycle-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="cycle-header-left">
          <Link to="/" className="cycle-logo">
            <h1>Your Cycle</h1>
          </Link>
          <p className="cycle-tagline">A calm space to listen to your body</p>
        </div>
        <nav className="cycle-nav">
          <a href="#" className="cycle-nav-link">Journal</a>
          <a href="#" className="cycle-nav-link">Insights</a>
          <button className="cycle-profile-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Info Banner */}
      <motion.div 
        className="info-banner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="info-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
          </svg>
        </div>
        <div className="info-content">
          <h3>Cycles aren't always regular—that's okay.</h3>
          <p>We've noticed some variation in your dates. Predictions are just estimates, so we've widened your window to give you space. Listen to how you feel rather than just the calendar.</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="cycle-content">
        {/* Left Column */}
        <div className="cycle-left">
          {/* Day Circle */}
          <motion.div 
            className="day-circle-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="day-circle">
              <svg className="progress-ring" viewBox="0 0 200 200">
                <circle
                  className="progress-ring-bg"
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  strokeWidth="8"
                />
                <motion.circle
                  className="progress-ring-fill"
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 534 }}
                  animate={{ 
                    strokeDashoffset: 534 - (534 * ((settings?.currentCycleDay || 1) / (settings?.averageCycleLength || 28))) 
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    strokeDasharray: 534,
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center'
                  }}
                />
              </svg>
              <div className="day-info">
                <span className="day-label">CURRENT</span>
                <motion.span 
                  className="day-number"
                  key={settings?.currentCycleDay}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  Day {settings?.currentCycleDay || '—'}
                </motion.span>
                <span className="day-phase">{settings?.currentPhase || 'Unknown'} Phase</span>
              </div>
            </div>
            <div className="day-message">
              <h4>{phaseMessage.title}</h4>
              <p>{phaseMessage.description}</p>
            </div>
          </motion.div>

          {/* Log Today */}
          <motion.div 
            className="log-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="log-header">
              <h3>Log Entry</h3>
              <span className="log-date">{formatSelectedDate()}</span>
            </div>

            {/* Flow Intensity */}
            <div className="log-section">
              <label className="log-label">FLOW INTENSITY</label>
              <div className="flow-options">
                {['None', 'Light', 'Medium', 'Heavy'].map((intensity) => (
                  <motion.button
                    key={intensity}
                    className={`flow-btn ${todayEntry.flowIntensity === intensity ? 'active' : ''}`}
                    onClick={() => setTodayEntry(prev => ({ ...prev, flowIntensity: intensity }))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {intensity}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sensations */}
            <div className="log-section">
              <label className="log-label">SENSATIONS</label>
              <div className="sensation-options">
                {[...defaultSensations, ...(settings?.customSensations || [])].map((sensation) => (
                  <motion.button
                    key={sensation}
                    className={`sensation-btn ${todayEntry.sensations.includes(sensation) ? 'active' : ''}`}
                    onClick={() => toggleSensation(sensation)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {sensation}
                  </motion.button>
                ))}
                <button className="sensation-btn add-btn">+ Add</button>
              </div>
            </div>

            {/* Mood */}
            <div className="log-section">
              <label className="log-label">MOOD</label>
              <div className="mood-options">
                {moods.map((emoji, index) => (
                  <motion.button
                    key={index}
                    className={`mood-btn ${todayEntry.mood === index ? 'active' : ''}`}
                    onClick={() => setTodayEntry(prev => ({ ...prev, mood: index }))}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <motion.button 
              className={`save-btn ${saving ? 'saving' : ''}`}
              onClick={saveEntry}
              disabled={saving}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </motion.button>

            {/* Save Message */}
            <AnimatePresence>
              {saveMessage && (
                <motion.p 
                  className={`save-message ${saveMessage.includes('Failed') ? 'error' : 'success'}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {saveMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Column - Calendar */}
        <motion.div 
          className="calendar-card"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="calendar-header">
            <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
            <div className="calendar-nav">
              <motion.button 
                onClick={prevMonth}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ‹
              </motion.button>
              <motion.button 
                onClick={nextMonth}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ›
              </motion.button>
            </div>
          </div>

          <div className="calendar-weekdays">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className={i === 6 ? 'weekend' : ''}>{day}</span>
            ))}
          </div>

          <div className="calendar-days">
            {/* Empty cells for days before the 1st */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <span key={`empty-${i}`} className="day empty"></span>
            ))}
            {/* Actual days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              return (
                <motion.span
                  key={day}
                  className={getDayClass(day)}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.015 }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </motion.span>
              );
            })}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-dot flow"></span>
              <span>Flow</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot fertile"></span>
              <span>Est. Fertile</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot predicted"></span>
              <span>Predicted</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        className="cycle-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>Your data is stored locally and encrypted. Privacy First.</p>
      </motion.footer>
    </div>
  );
};

export default CyclePage;
