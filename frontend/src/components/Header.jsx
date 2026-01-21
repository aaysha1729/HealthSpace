import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Community', to: '/dashboard' },
    { label: 'About', to: '#privacy' }
  ];

  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container header-container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
            <svg className="logo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>HealthSpace</span>
          </Link>
        </motion.div>
        <nav className="nav">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
            >
              {link.to.startsWith('#') ? (
                <a href={link.to} className="nav-link">{link.label}</a>
              ) : (
                <Link to={link.to} className="nav-link">{link.label}</Link>
              )}
            </motion.div>
          ))}
        </nav>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/login" className="member-access">
            Sign In
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
