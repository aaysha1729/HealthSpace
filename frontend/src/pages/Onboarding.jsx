import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    focus: null,
    cycleLength: 28,
    periodLength: 5
  });

  const focusOptions = [
    { id: 'cycle', icon: '📅', title: 'Track my cycle', desc: 'Insights and predictions' },
    { id: 'pcos', icon: '📊', title: 'PCOS support', desc: 'Symptom management' },
    { id: 'medication', icon: '💊', title: 'Track medication', desc: 'Reminders & history' },
    { id: 'community', icon: '💬', title: 'Find community', desc: 'Connect with others' }
  ];

  const handleComplete = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const apiAuthBase = import.meta.env.VITE_API_AUTH_BASE || 'http://localhost:5001/api/auth';
        await fetch(`${apiAuthBase}/complete-onboarding`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-progress">
        <div className="progress-bar" style={{ width: `${(step / 2) * 100}%` }} />
      </div>

      <motion.div 
        className="onboarding-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="onboarding-card">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <span className="step-badge">STEP 1 OF 2</span>
              <h1 className="onboarding-title">What brings you here?</h1>
              <p className="onboarding-subtitle">Select what you'd like to focus on.</p>

              <div className="focus-grid">
                {focusOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setData({...data, focus: opt.id})}
                    className={`focus-option ${data.focus === opt.id ? 'selected' : ''}`}
                  >
                    <span className="focus-icon">{opt.icon}</span>
                    <span className="focus-title">{opt.title}</span>
                    <span className="focus-desc">{opt.desc}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!data.focus}
                className="btn btn-primary onboarding-btn"
              >
                Continue →
              </button>

              <p className="privacy-note">🔒 Private & Encrypted</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <span className="step-badge">STEP 2 OF 2</span>
              <h1 className="onboarding-title">Your cycle basics</h1>
              <p className="onboarding-subtitle">This helps us provide better insights. It's okay if it varies.</p>

              <div className="cycle-inputs">
                <div className="cycle-input-group">
                  <label>Typical cycle length <span>(in days)</span></label>
                  <div className="number-input">
                    <button onClick={() => setData({...data, cycleLength: Math.max(21, data.cycleLength - 1)})}>−</button>
                    <input
                      type="number"
                      value={data.cycleLength}
                      onChange={(e) => setData({...data, cycleLength: parseInt(e.target.value) || 28})}
                    />
                    <button onClick={() => setData({...data, cycleLength: Math.min(45, data.cycleLength + 1)})}>+</button>
                  </div>
                </div>

                <div className="cycle-input-group">
                  <label>Typical period duration <span>(in days)</span></label>
                  <div className="number-input">
                    <button onClick={() => setData({...data, periodLength: Math.max(1, data.periodLength - 1)})}>−</button>
                    <input
                      type="number"
                      value={data.periodLength}
                      onChange={(e) => setData({...data, periodLength: parseInt(e.target.value) || 5})}
                    />
                    <button onClick={() => setData({...data, periodLength: Math.min(10, data.periodLength + 1)})}>+</button>
                  </div>
                </div>
              </div>

              <div className="info-box">
                <span>💡</span>
                <p>Not sure? That's okay. We'll learn your rhythm together.</p>
              </div>

              <div className="button-row">
                <button onClick={() => setStep(1)} className="btn btn-outline">← Back</button>
                <button onClick={handleComplete} className="btn btn-primary">Enter your space →</button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
