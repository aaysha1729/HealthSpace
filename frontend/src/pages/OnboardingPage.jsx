import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Focus selection
  const [selectedFocus, setSelectedFocus] = useState(null);
  const focusOptions = [
    { id: 'cycle', icon: '📅', title: 'Understanding my cycle', subtitle: 'Insights and predictions', color: '#e3f2fd' },
    { id: 'pcos', icon: '📈', title: 'Support with PCOS', subtitle: 'Symptom management', color: '#f3e5f5' },
    { id: 'medication', icon: '💊', title: 'Tracking medication', subtitle: 'Reminders & history', color: '#fff3e0' },
    { id: 'community', icon: '👥', title: 'Finding community', subtitle: 'Connect with others', color: '#e8f5e9' }
  ];

  // Step 2: Cycle history
  const [cycleData, setCycleData] = useState({
    cycleLength: 28,
    periodDuration: 5
  });

  // Step 3: Medications
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([
    { id: 1, name: 'Omega-3', type: 'Daily Supplement', reminder: true },
    { id: 2, name: 'Spironolactone', type: 'Prescription', reminder: false }
  ]);
  const popularChoices = ['Inositol', 'Metformin', 'Vitamin D', 'Magnesium'];

  // Step 4: Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    periodReminders: false,
    careCheckins: true,
    communityUpdates: false,
    privacyMode: false
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/cycle');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addMedication = (name) => {
    const newMed = {
      id: Date.now(),
      name,
      type: 'Supplement',
      reminder: false
    };
    setMedications([...medications, newMed]);
    setSearchTerm('');
  };

  const removeMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const toggleReminder = (id) => {
    setMedications(medications.map(m => 
      m.id === id ? { ...m, reminder: !m.reminder } : m
    ));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            className="step-content"
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="step-badge">STEP 1 OF 4</div>
            <h1>Let's create a space that fits you</h1>
            <p className="step-description">
              What brings you here today? Select the option that best describes your focus.
            </p>
            
            <div className="focus-grid">
              {focusOptions.map((option) => (
                <motion.button
                  key={option.id}
                  className={`focus-option ${selectedFocus === option.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFocus(option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="focus-icon" style={{ backgroundColor: option.color }}>{option.icon}</span>
                  <div className="focus-text">
                    <h3>{option.title}</h3>
                    <p>{option.subtitle}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button 
              className="continue-btn"
              onClick={nextStep}
              disabled={!selectedFocus}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Continue
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <div className="privacy-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Private & Encrypted
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            className="step-content"
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="step-badge">STEP 2 OF 4</div>
            <h1>Your cycle history</h1>
            <p className="step-description">
              Knowing your typical cycle length helps us provide better insights. It's okay if it varies.
            </p>
            
            <div className="form-field">
              <label>Typical cycle length <span>(in days)</span></label>
              <div className="number-input">
                <input 
                  type="number" 
                  value={cycleData.cycleLength}
                  onChange={(e) => setCycleData({...cycleData, cycleLength: parseInt(e.target.value) || 28})}
                  min="21"
                  max="45"
                />
                <div className="number-controls">
                  <button onClick={() => setCycleData({...cycleData, cycleLength: cycleData.cycleLength + 1})}>▲</button>
                  <button onClick={() => setCycleData({...cycleData, cycleLength: Math.max(21, cycleData.cycleLength - 1)})}>▼</button>
                </div>
              </div>
            </div>

            <div className="form-field">
              <label>Typical period duration <span>(in days)</span></label>
              <div className="number-input">
                <input 
                  type="number" 
                  value={cycleData.periodDuration}
                  onChange={(e) => setCycleData({...cycleData, periodDuration: parseInt(e.target.value) || 5})}
                  min="1"
                  max="10"
                />
                <div className="number-controls">
                  <button onClick={() => setCycleData({...cycleData, periodDuration: Math.min(10, cycleData.periodDuration + 1)})}>▲</button>
                  <button onClick={() => setCycleData({...cycleData, periodDuration: Math.max(1, cycleData.periodDuration - 1)})}>▼</button>
                </div>
              </div>
            </div>

            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <p>If your cycles are irregular or you're not sure, you can leave these as they are. We'll learn your rhythm together.</p>
            </div>

            <motion.button 
              className="continue-btn"
              onClick={nextStep}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Continue
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            <button className="skip-btn" onClick={nextStep}>Skip for now</button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            className="step-content step-3"
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="step-header">
              <button className="back-btn" onClick={prevStep}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </button>
              <span className="step-indicator">Step 3 of 4</span>
            </div>

            <h1>Daily Support & Care</h1>
            <p className="step-description">
              Track any medications or supplements you use for your health. This is entirely private.
            </p>
            
            <div className="search-input">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input 
                type="text"
                placeholder="Medication or Supplement name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchTerm && addMedication(searchTerm)}
              />
            </div>

            <div className="popular-choices">
              <span className="label">POPULAR CHOICES</span>
              <div className="choice-tags">
                {popularChoices.map((choice) => (
                  <button 
                    key={choice} 
                    className="choice-tag"
                    onClick={() => addMedication(choice)}
                  >
                    + {choice}
                  </button>
                ))}
              </div>
            </div>

            {medications.length > 0 && (
              <div className="added-medications">
                <span className="label">ADDED TO YOUR ROUTINE</span>
                {medications.map((med) => (
                  <div key={med.id} className="medication-item">
                    <div className="med-icon">
                      {med.type === 'Prescription' ? '💊' : '💧'}
                    </div>
                    <div className="med-info">
                      <h4>{med.name}</h4>
                      <p>{med.type}</p>
                    </div>
                    <div className="med-actions">
                      <span className="reminder-label">Quiet reminder?</span>
                      <button 
                        className={`toggle-btn ${med.reminder ? 'active' : ''}`}
                        onClick={() => toggleReminder(med.id)}
                      >
                        <span className="toggle-slider"></span>
                      </button>
                      <button className="remove-btn" onClick={() => removeMedication(med.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <p>You can change these anytime in your Care dashboard. No pressure to add everything now.</p>
            </div>

            <motion.button 
              className="continue-btn"
              onClick={nextStep}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Continue
            </motion.button>

            <button className="skip-btn" onClick={nextStep}>Skip for now</button>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            className="step-content step-4"
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="step-header">
              <span className="final-step-label">Final Step</span>
              <span className="step-indicator">Step 4 of 4</span>
            </div>

            <h1>Your Privacy & Notifications</h1>
            <p className="step-description">
              You are in control. Choose how and when you'd like to hear from us.
            </p>
            
            <div className="privacy-options">
              <div className="privacy-option">
                <div className="option-text">
                  <h4>Quiet Period Reminders</h4>
                  <p>Subtle notifications when your period is approaching.</p>
                </div>
                <button 
                  className={`toggle-btn ${privacySettings.periodReminders ? 'active' : ''}`}
                  onClick={() => setPrivacySettings({...privacySettings, periodReminders: !privacySettings.periodReminders})}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>

              <div className="privacy-option">
                <div className="option-text">
                  <h4>Care Check-ins</h4>
                  <p>Gentle reminders for your daily medication or supplements.</p>
                </div>
                <button 
                  className={`toggle-btn ${privacySettings.careCheckins ? 'active' : ''}`}
                  onClick={() => setPrivacySettings({...privacySettings, careCheckins: !privacySettings.careCheckins})}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>

              <div className="privacy-option">
                <div className="option-text">
                  <h4>Community Updates</h4>
                  <p>Notifications for supportive replies in the anonymous forum.</p>
                </div>
                <button 
                  className={`toggle-btn ${privacySettings.communityUpdates ? 'active' : ''}`}
                  onClick={() => setPrivacySettings({...privacySettings, communityUpdates: !privacySettings.communityUpdates})}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>

              <div className="privacy-option">
                <div className="option-text">
                  <h4>Privacy Mode 🔒</h4>
                  <p>Option to use a secondary passcode or biometric lock for the app.</p>
                </div>
                <button 
                  className={`toggle-btn ${privacySettings.privacyMode ? 'active' : ''}`}
                  onClick={() => setPrivacySettings({...privacySettings, privacyMode: !privacySettings.privacyMode})}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
            </div>

            <div className="promise-box">
              <span className="promise-icon">✓</span>
              <div className="promise-text">
                <h4>Our Promise</h4>
                <p>We will never send you marketing emails or sell your contact information. Your peace of mind is our priority.</p>
              </div>
            </div>

            <motion.button 
              className="continue-btn final"
              onClick={nextStep}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Enter your safe space
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page">
      {/* Progress Bar */}
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Card Container */}
      <motion.div 
        className="onboarding-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
