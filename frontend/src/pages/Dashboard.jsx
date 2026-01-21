import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API_BASE = 'http://localhost:5001/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cycle');
  const [loading, setLoading] = useState(true);
  
  // Cycle state
  const [cycleData, setCycleData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entry, setEntry] = useState({ flowIntensity: '', sensations: [], mood: null });
  const [monthData, setMonthData] = useState({ entries: [], predictedDays: [], fertileDays: [] });

  const sensationOptions = ['Cramps', 'Headache', 'Bloating', 'Backache'];
  const flowOptions = ['None', 'Light', 'Medium', 'Heavy'];

  useEffect(() => {
    fetchCycleData();
  }, []);

  const fetchMonthData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const res = await fetch(`${API_BASE}/cycle/month/${year}/${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMonthData(data);
      }
    } catch (error) {
      console.error('Error fetching month data:', error);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchMonthData();
  }, [fetchMonthData]);

  const fetchCycleData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE}/cycle/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCycleData(data);
      }
    } catch (error) {
      console.error('Error fetching cycle data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_BASE}/cycle/log`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: selectedDate, ...entry })
      });
      fetchMonthData();
      fetchCycleData();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const getPhaseInfo = (phase) => {
    const info = {
      Menstrual: { message: 'Take it easy', tip: 'Your body is renewing. Rest when you can.' },
      Follicular: { message: 'Feeling energetic?', tip: 'Estrogen is rising. A good time for movement.' },
      Ovulation: { message: 'Peak energy', tip: 'Focus and energy are at their highest.' },
      Luteal: { message: 'Wind down', tip: 'Practice self-care and get extra rest.' }
    };
    return info[phase] || { message: 'Feeling energetic?', tip: 'Estrogen is rising. A good time for movement.' };
  };

  const toggleSensation = (sensation) => {
    setEntry(prev => ({
      ...prev,
      sensations: prev.sensations.includes(sensation)
        ? prev.sensations.filter(s => s !== sensation)
        : [...prev.sensations, sensation]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="cycle-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const cycleDay = cycleData?.currentCycleDay || 12;
  const phase = cycleData?.currentPhase || 'Follicular';
  const phaseInfo = getPhaseInfo(phase);
  const cycleLength = cycleData?.averageCycleLength || 28;
  const progress = (cycleDay / cycleLength) * 100;

  return (
    <div className="cycle-page">
      {/* Header */}
      <header className="cycle-header">
        <div className="header-left">
          <h1>Your Cycle</h1>
          <p>A calm space to listen to your body</p>
        </div>
        <nav className="header-nav">
          <button className={activeTab === 'cycle' ? 'active' : ''} onClick={() => setActiveTab('cycle')}>Journal</button>
          <button className={activeTab === 'insights' ? 'active' : ''} onClick={() => setActiveTab('insights')}>Insights</button>
          <button className={activeTab === 'community' ? 'active' : ''} onClick={() => setActiveTab('community')}>Community</button>
          <button className="user-btn" onClick={handleLogout}>👤</button>
        </nav>
      </header>

      {activeTab === 'cycle' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cycle-content">
          {/* Info Banner */}
          <div className="info-banner">
            <span className="info-icon">✨</span>
            <div className="info-text">
              <strong>Cycles aren't always regular—that's okay.</strong>
              <p>We've noticed some variation in your dates. Predictions are just estimates, so we've widened your window to give you space. Listen to how you feel rather than just the calendar.</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="main-grid">
            {/* Left Column */}
            <div className="left-column">
              {/* Cycle Ring Card */}
              <div className="ring-card">
                <div className="ring-wrapper">
                  <svg viewBox="0 0 120 120" className="ring-svg">
                    <circle cx="60" cy="60" r="54" className="ring-bg" />
                    <circle 
                      cx="60" cy="60" r="54" 
                      className="ring-progress"
                      style={{
                        strokeDasharray: `${progress * 3.39} 339`,
                        strokeDashoffset: 0
                      }}
                    />
                  </svg>
                  <div className="ring-content">
                    <span className="ring-label">CURRENT</span>
                    <span className="ring-day">Day {cycleDay}</span>
                    <span className="ring-phase">{phase} Phase</span>
                  </div>
                </div>
                <div className="phase-message">
                  <h3>{phaseInfo.message}</h3>
                  <p>{phaseInfo.tip}</p>
                </div>
              </div>

              {/* Log Today Card */}
              <div className="log-card">
                <div className="log-header">
                  <h3>Log Today</h3>
                  <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>

                <div className="log-section">
                  <label>FLOW INTENSITY</label>
                  <div className="pill-group">
                    {flowOptions.map(opt => (
                      <button
                        key={opt}
                        className={`pill ${entry.flowIntensity === opt ? 'active' : ''}`}
                        onClick={() => setEntry({...entry, flowIntensity: opt})}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="log-section">
                  <label>SENSATIONS</label>
                  <div className="pill-group">
                    {sensationOptions.map(opt => (
                      <button
                        key={opt}
                        className={`pill ${entry.sensations.includes(opt) ? 'active' : ''}`}
                        onClick={() => toggleSensation(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                    <button className="pill add-pill">+ Add</button>
                  </div>
                </div>

                <div className="log-section">
                  <label>MOOD</label>
                  <div className="mood-group">
                    {[0, 1, 2, 3, 4].map(i => (
                      <button
                        key={i}
                        className={`mood-btn ${entry.mood === i ? 'active' : ''}`}
                        onClick={() => setEntry({...entry, mood: i})}
                      >
                        <span className="mood-icon">{['😊', '😐', '😢', '😤', '😴'][i]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button className="save-btn" onClick={saveEntry}>Save Entry</button>
              </div>
            </div>

            {/* Right Column - Calendar */}
            <div className="right-column">
              <div className="calendar-card">
                <div className="cal-header">
                  <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                  <div className="cal-nav">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>‹</button>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>›</button>
                  </div>
                </div>

                <div className="cal-grid">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="cal-weekday">{d}</div>
                  ))}
                  {Array(getDaysInMonth().firstDay).fill(null).map((_, i) => (
                    <div key={`e-${i}`} className="cal-empty" />
                  ))}
                  {Array(getDaysInMonth().daysInMonth).fill(null).map((_, i) => {
                    const day = i + 1;
                    const isToday = new Date().getDate() === day && 
                                    new Date().getMonth() === currentMonth.getMonth() && 
                                    new Date().getFullYear() === currentMonth.getFullYear();
                    const isPredicted = monthData.predictedDays?.includes(day);
                    const isFertile = monthData.fertileDays?.includes(day);
                    const hasFlow = monthData.entries?.some(e => new Date(e.date).getDate() === day && e.isFlowDay);

                    let cls = 'cal-day';
                    if (isToday) cls += ' today';
                    if (hasFlow) cls += ' flow';
                    else if (isFertile) cls += ' fertile';
                    else if (isPredicted) cls += ' predicted';

                    return (
                      <button
                        key={day}
                        className={cls}
                        onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="cal-legend">
                  <span><i className="dot flow"></i> Flow</span>
                  <span><i className="dot fertile"></i> Est. Fertile</span>
                  <span><i className="dot predicted"></i> Predicted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="cycle-footer">
            <p>Your data is stored locally and encrypted. Privacy First.</p>
          </footer>
        </motion.div>
      )}

      {activeTab === 'insights' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="insights-tab">
          <div className="insight-hero">
            <span className="badge">DAILY INSIGHT</span>
            <h2>Every body has its own rhythm.</h2>
            <p>Understanding your patterns helps you care for yourself better.</p>
          </div>
          <div className="stats-row">
            <div className="stat-card">
              <span>Average Cycle</span>
              <strong>{cycleData?.averageCycleLength || 28} days</strong>
            </div>
            <div className="stat-card">
              <span>Average Period</span>
              <strong>{cycleData?.averagePeriodLength || 5} days</strong>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'community' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="community-tab">
          <div className="community-hero">
            <h2>Community</h2>
            <p>A safe space to share and connect with others on similar journeys.</p>
          </div>
          
          <div className="post-composer">
            <input type="text" placeholder="What's on your mind? Share anonymously..." />
            <button>Post</button>
          </div>

          <div className="posts-list">
            <div className="post-card">
              <div className="post-header">
                <span className="post-tag">IRREGULAR CYCLES</span>
                <span className="post-meta">Community Member • 2h ago</span>
              </div>
              <h3>Has anyone else experienced this after stopping the pill?</h3>
              <p>I stopped taking birth control about 3 months ago and my cycle has been completely unpredictable...</p>
              <div className="post-actions">
                <button>❤️ I relate (12)</button>
                <button>💬 Support</button>
              </div>
            </div>

            <div className="post-card">
              <div className="post-header">
                <span className="post-tag">PCOS SUPPORT</span>
                <span className="post-meta">Community Member • 4h ago</span>
              </div>
              <h3>Finding it hard to stay positive today.</h3>
              <p>Some days the symptoms just feel overwhelming. Fatigue is hitting me really hard this week...</p>
              <div className="post-actions">
                <button className="active">❤️ Relating (24)</button>
                <button>💬 Support</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
