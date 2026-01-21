import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    anonymousCommunity: true,
    cloudBackup: true
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/) || password.match(/[^a-zA-Z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return '#e53e3e';
    if (passwordStrength <= 50) return '#ed8936';
    if (passwordStrength <= 75) return '#ecc94b';
    return '#48bb78';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Signup:', formData, settings);
    navigate('/cycle');
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="signup-page">
      {/* Background decorations */}
      <div className="signup-bg-decoration top-left"></div>
      <div className="signup-bg-decoration bottom-right"></div>

      {/* Logo */}
      <motion.div 
        className="signup-logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4361ee"/>
        </svg>
        <span>Private Space</span>
      </motion.div>

      {/* Signup Card */}
      <motion.div 
        className="signup-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="signup-title">Create your private space</h1>
        <p className="signup-subtitle">
          No real names required. We never sell your data. Your journey belongs only to you.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com (for recovery only)"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Choose a secure password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
              />
              <button 
                type="button" 
                className="input-icon btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 1 12 1 12A18.45 18.45 0 015.06 6.06M9.9 4.24A9.12 9.12 0 0112 4C19 4 23 12 23 12A18.5 18.5 0 0119.73 16.73" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
            {/* Password Strength Bar */}
            <div className="password-strength">
              <div 
                className="strength-bar"
                style={{ 
                  width: `${passwordStrength}%`,
                  backgroundColor: getStrengthColor()
                }}
              ></div>
            </div>
            <span className="strength-label">Strength</span>
          </div>

          {/* Privacy Options */}
          <div className="privacy-options">
            <div className="privacy-option">
              <div className="option-info">
                <span className="option-icon">👥</span>
                <div>
                  <h4>Anonymous community access</h4>
                  <p>Your profile is hidden by default.</p>
                </div>
              </div>
              <motion.button 
                type="button"
                className={`toggle-btn ${settings.anonymousCommunity ? 'active' : ''}`}
                onClick={() => toggleSetting('anonymousCommunity')}
                whileTap={{ scale: 0.95 }}
              >
                <span className="toggle-slider"></span>
              </motion.button>
            </div>

            <div className="privacy-option">
              <div className="option-info">
                <span className="option-icon cloud">💧</span>
                <div>
                  <h4>Secure cloud backup</h4>
                  <p>Encrypted storage for your health notes.</p>
                </div>
              </div>
              <motion.button 
                type="button"
                className={`toggle-btn ${settings.cloudBackup ? 'active' : ''}`}
                onClick={() => toggleSetting('cloudBackup')}
                whileTap={{ scale: 0.95 }}
              >
                <span className="toggle-slider"></span>
              </motion.button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button 
            type="submit"
            className="signup-btn"
            whileHover={{ scale: 1.01, boxShadow: '0 8px 25px rgba(67, 97, 238, 0.3)' }}
            whileTap={{ scale: 0.99 }}
          >
            Begin your journey
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </form>

        {/* Terms */}
        <p className="signup-terms">
          By continuing, you agree to a space of zero judgment and total privacy.<br />
          Your peace of mind is our priority.
        </p>

        {/* Login Link */}
        <p className="login-link">
          Already have a space? <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
