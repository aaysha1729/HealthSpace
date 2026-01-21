import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './InsightsPage.css';

const InsightsPage = () => {
  const [supplements, setSupplements] = useState({
    inositol: true,
    metformin: false,
    magnesium: false
  });

  // Sample cycle history data
  const cycleHistory = [
    { month: 'JAN', days: 32, height: 60 },
    { month: 'FEB', days: 45, height: 85 },
    { month: 'MAR', days: 28, height: 50 },
    { month: 'APR', days: 35, height: 65 },
    { month: 'MAY', days: 40, height: 75 },
    { month: 'JUN', days: 30, height: 55 }
  ];

  const toggleSupplement = (name) => {
    setSupplements(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="insights-page">
      {/* Header */}
      <motion.header 
        className="insights-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="insights-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#5b7a8a"/>
          </svg>
          <span>Cycle Patterns</span>
        </Link>
        <nav className="insights-nav">
          <a href="#" className="nav-link active">Dashboard</a>
          <a href="#" className="nav-link">Insights</a>
          <a href="#" className="nav-link">Library</a>
          <button className="profile-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Main Content */}
      <main className="insights-main">
        {/* Daily Insight Card */}
        <motion.section 
          className="daily-insight-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="insight-badge">
            <span className="badge-icon">✦</span>
            <span>DAILY INSIGHT</span>
          </div>
          <h1 className="insight-title">Every body has its own rhythm.</h1>
          <p className="insight-description">
            Understanding your patterns helps you care for yourself better. There is no 'perfect' cycle, only yours.
          </p>
        </motion.section>

        {/* Cycle History */}
        <motion.section 
          className="cycle-history-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-icon">⏱</span>
              <div>
                <h2>Cycle History</h2>
                <p className="card-subtitle">Last 6 months variation</p>
              </div>
            </div>
            <div className="avg-days">
              <span className="avg-number">35</span>
              <span className="avg-label">days avg.</span>
            </div>
          </div>
          
          <div className="cycle-chart">
            {cycleHistory.map((cycle, index) => (
              <motion.div 
                key={cycle.month}
                className="cycle-bar-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <motion.div 
                  className="cycle-bar"
                  initial={{ height: 0 }}
                  animate={{ height: cycle.height }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                />
                <span className="cycle-month">{cycle.month}</span>
                <span className="cycle-days">{cycle.days}d</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Cycle Range & Symptom Patterns */}
        <div className="two-column">
          <motion.section 
            className="cycle-range-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-header-small">
              <h3>Cycle Range</h3>
              <button className="settings-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className="range-display">
              <div className="range-info">
                <span className="range-label">Shortest: 28 days</span>
                <span className="range-label">Longest: 45 days</span>
              </div>
              <div className="range-bar">
                <div className="range-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div className="range-explanation">
              <h4>Why does this happen?</h4>
              <p>Fluctuations in insulin or androgen levels can sometimes delay ovulation, extending your cycle. This range is your current normal.</p>
            </div>
          </motion.section>

          <motion.section 
            className="symptom-patterns-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-header-small">
              <h3>Symptom Patterns</h3>
              <button className="chart-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M7 14L12 9L16 13L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="symptom-list">
              <div className="symptom-item">
                <div className="symptom-icon energy">⚡</div>
                <div className="symptom-info">
                  <span className="symptom-name">Energy Levels</span>
                  <span className="symptom-note">Luteal Phase dip</span>
                </div>
              </div>
              <div className="symptom-item">
                <div className="symptom-icon bloating">💨</div>
                <div className="symptom-info">
                  <span className="symptom-name">Bloating</span>
                  <span className="symptom-note">Common mid-cycle</span>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Daily Support */}
        <motion.section 
          className="daily-support-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="section-header">
            <h2>Daily Support</h2>
            <button className="manage-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M18.5 2.50001C19.3284 1.67158 20.6716 1.67158 21.5 2.50001C22.3284 3.32844 22.3284 4.67158 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Manage
            </button>
          </div>
          
          <div className="supplements-grid">
            <div className="supplement-card">
              <div className="supplement-header">
                <div className="supplement-info">
                  <h4>Inositol Complex</h4>
                  <p>2g • Morning dose</p>
                </div>
                <motion.button 
                  className={`toggle-btn ${supplements.inositol ? 'active' : ''}`}
                  onClick={() => toggleSupplement('inositol')}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="toggle-slider"></span>
                </motion.button>
              </div>
              <div className="supplement-tracking">
                <div className="tracking-dots">
                  {[1,2,3,4,5,6,7].map(i => (
                    <span key={i} className={`dot ${i <= 5 ? 'filled' : ''}`}></span>
                  ))}
                </div>
                <span className="tracking-label">Last 7 days</span>
              </div>
              <button className="reminder-btn">🔔 Reminder Settings →</button>
            </div>

            <div className="supplement-card">
              <div className="supplement-header">
                <div className="supplement-info">
                  <h4>Metformin</h4>
                  <p>500mg • With dinner</p>
                </div>
                <motion.button 
                  className={`toggle-btn ${supplements.metformin ? 'active' : ''}`}
                  onClick={() => toggleSupplement('metformin')}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="toggle-slider"></span>
                </motion.button>
              </div>
              <div className="supplement-tracking">
                <div className="tracking-dots">
                  {[1,2,3,4,5,6,7].map(i => (
                    <span key={i} className={`dot ${i <= 3 ? 'filled' : ''}`}></span>
                  ))}
                </div>
                <span className="tracking-label warning">Wait... catching up?</span>
              </div>
              <button className="reminder-btn">🔔 Reminder Settings →</button>
            </div>

            <div className="supplement-card">
              <div className="supplement-header">
                <div className="supplement-info">
                  <h4>Magnesium</h4>
                  <p>Before sleep</p>
                </div>
                <motion.button 
                  className={`toggle-btn ${supplements.magnesium ? 'active' : ''}`}
                  onClick={() => toggleSupplement('magnesium')}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="toggle-slider"></span>
                </motion.button>
              </div>
              <div className="supplement-tracking">
                <div className="tracking-dots">
                  {[1,2,3,4,5,6,7].map(i => (
                    <span key={i} className={`dot ${i <= 2 ? 'filled' : ''}`}></span>
                  ))}
                </div>
                <span className="tracking-label">Supportive tracking</span>
              </div>
              <button className="reminder-btn muted">🔕 Reminder Off →</button>
            </div>
          </div>
        </motion.section>

        {/* PCOS Basics */}
        <motion.section 
          className="pcos-basics-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="section-header">
            <h2>PCOS Basics</h2>
            <button className="view-library-btn">View Library</button>
          </div>
          
          <div className="basics-grid">
            <motion.article 
              className="basics-card"
              whileHover={{ y: -4 }}
            >
              <div className="basics-image gradient-1"></div>
              <h4>Understanding Androgens</h4>
              <p>Elevated levels aren't your fault—they are just chemical messengers asking for balance.</p>
            </motion.article>

            <motion.article 
              className="basics-card"
              whileHover={{ y: -4 }}
            >
              <div className="basics-image gradient-2"></div>
              <h4>The Role of Insulin</h4>
              <p>Why metabolic health is the engine room for your cycle regularity.</p>
            </motion.article>

            <motion.article 
              className="basics-card"
              whileHover={{ y: -4 }}
            >
              <div className="basics-image gradient-3"></div>
              <h4>Stress & Hormones</h4>
              <p>Simple ways to lower cortisol and tell your body it's safe to ovulate.</p>
            </motion.article>
          </div>
        </motion.section>

        {/* Doctor Visit CTA */}
        <motion.section 
          className="doctor-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="cta-content">
            <span className="cta-icon">📋</span>
            <div className="cta-text">
              <h3>Preparing for a visit?</h3>
              <p>Doctors can help best when they see the full picture. We've compiled your symptom patterns and cycle variations into a simple summary.</p>
            </div>
          </div>
          <motion.button 
            className="export-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 3V15M12 15L8 11M12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export Pattern Summary (PDF)
          </motion.button>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="insights-footer">
        <p>© 2023 Cycle Patterns. Designed for support, not diagnosis. Always consult a healthcare professional.</p>
      </footer>
    </div>
  );
};

export default InsightsPage;
