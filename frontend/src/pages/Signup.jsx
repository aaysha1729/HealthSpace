import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    anonymous: true,
    cloudBackup: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signup(email, password);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="auth-logo">
          <Link to="/" className="logo-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>HealthSpace</span>
          </Link>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Create your private space</h1>
          <p className="auth-subtitle">No real names required. We never sell your data.</p>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="for recovery only"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="choose a secure password"
                required
                minLength={8}
              />
            </div>

            <div className="privacy-options">
              <div className="privacy-option">
                <div className="option-info">
                  <span className="option-title">Anonymous community</span>
                  <span className="option-desc">Profile hidden by default</span>
                </div>
                <button
                  type="button"
                  className={`toggle ${settings.anonymous ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, anonymous: !settings.anonymous})}
                >
                  <span className="toggle-slider" />
                </button>
              </div>

              <div className="privacy-option">
                <div className="option-info">
                  <span className="option-title">Secure cloud backup</span>
                  <span className="option-desc">Encrypted storage for your data</span>
                </div>
                <button
                  type="button"
                  className={`toggle ${settings.cloudBackup ? 'active' : ''}`}
                  onClick={() => setSettings({...settings, cloudBackup: !settings.cloudBackup})}
                >
                  <span className="toggle-slider" />
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Begin your journey →'}
            </button>
          </form>

          <p className="auth-note">By continuing, you agree to a space of zero judgment and total privacy.</p>

          <p className="auth-footer">
            Already have a space? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
