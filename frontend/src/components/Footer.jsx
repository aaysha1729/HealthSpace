import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const linkColumns = [
    {
      title: "Resources",
      links: ["Guide", "Research & Whitepaper"]
    },
    {
      title: "Organization",
      links: ["About", "Open Source"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service"]
    }
  ];

  return (
    <motion.footer 
      className="footer" 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="container footer-container">
        <motion.div 
          className="footer-brand"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
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
          <p className="footer-tagline">Empowering yourself with privacy-first health tracking. Your body, your data, and no one else.</p>
          <p className="footer-copyright">Copyright here</p>
        </motion.div>
        <div className="footer-links">
          {linkColumns.map((column, colIndex) => (
            <motion.div 
              key={column.title}
              className="footer-column"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + colIndex * 0.1 }}
            >
              <h4>{column.title}</h4>
              {column.links.map((link, linkIndex) => (
                <motion.a 
                  key={link}
                  href="#"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.4 + colIndex * 0.1 + linkIndex * 0.05 }}
                  whileHover={{ x: 5, color: "#1a1a2e" }}
                >
                  {link}
                </motion.a>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
