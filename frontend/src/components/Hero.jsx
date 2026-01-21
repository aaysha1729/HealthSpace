import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="hero">
      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="hero-label" variants={itemVariants}>
          SIMPLE • PRIVATE • DESIGNED FOR YOU
        </motion.p>
        <motion.h1 className="hero-title" variants={itemVariants}>
          Understanding your<br />
          health,<br />
          <motion.span 
            className="hero-title-italic"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            quietly.
          </motion.span>
        </motion.h1>
        <motion.p className="hero-description" variants={itemVariants}>
          A digital notebook for your cycle and well-being. No alerts, no data<br />
          selling, just a calm space for you to observe and learn.
        </motion.p>
        <motion.div className="hero-buttons" variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(26, 26, 46, 0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/signup" className="btn btn-primary">
              Open the Notebook
            </Link>
          </motion.div>
          <motion.a 
            href="#" 
            className="btn btn-text"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Read about our privacy →
          </motion.a>
        </motion.div>
      </motion.div>
      <motion.div 
        className="hero-decoration hero-decoration-left"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      />
      <motion.div 
        className="hero-decoration hero-decoration-right"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
      />
    </section>
  );
};

export default Hero;
