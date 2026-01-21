import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import './Toolkit.css';

const Toolkit = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [cycleChecked, setCycleChecked] = useState(true);
  const [symptomsChecked, setSymptomsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(60);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const calendarDays = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21]
  ];

  return (
    <section className="toolkit" ref={ref}>
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          A simple toolkit
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Tools to observe patterns, track not to chase them to categories.
        </motion.p>

        <motion.div 
          className="toolkit-main"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="toolkit-card toolkit-card-large"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
          >
            <motion.span 
              className="card-badge"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.5, type: "spring" }}
            >
              SOFTTRACKING
            </motion.span>
            <h3>Confidence Ranges</h3>
            <p>
              This feature aims to help you timely. It shows all possible days as
              possible in your next beginning, representing uncertainty of DISTANCE
              to remind you not to expect too much from it.
            </p>
            <p className="card-footnote">It works when not precise! We know where we don't know.</p>
          </motion.div>
          
          <motion.div 
            className="toolkit-preview"
            variants={cardVariants}
            whileHover={{ y: -5 }}
          >
            <div className="preview-header">
              <span>SUNDAY</span>
            </div>
            <div className="preview-calendar">
              {calendarDays.map((week, weekIndex) => (
                <div className="calendar-days" key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <motion.span
                      key={day}
                      className={[11, 12, 13].includes(day) ? 'highlighted' : ''}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ 
                        delay: 0.8 + (weekIndex * 7 + dayIndex) * 0.03,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.2, 
                        backgroundColor: [11, 12, 13].includes(day) ? '#cbd5e0' : '#f0f4f8'
                      }}
                    >
                      {day}
                    </motion.span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="toolkit-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="toolkit-card"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
          >
            <motion.span 
              className="percentage"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              %
            </motion.span>
            <h3>Flexible Journaling</h3>
            <p>Track whatever you want to track. Add the simple placeholder, leave out whatever doesn't fit your routine.</p>
            <div className="card-options">
              <motion.label 
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <input 
                  type="checkbox" 
                  checked={cycleChecked}
                  onChange={() => setCycleChecked(!cycleChecked)}
                /> 
                Cycle Tracking
              </motion.label>
              <motion.label
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <input 
                  type="checkbox"
                  checked={symptomsChecked}
                  onChange={() => setSymptomsChecked(!symptomsChecked)}
                /> 
                Symptoms
              </motion.label>
            </div>
          </motion.div>
          
          <motion.div 
            className="toolkit-card"
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
          >
            <motion.div 
              className="body-icon"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V14M12 14L8 22M12 14L16 22M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
            <h3>Whole Body View</h3>
            <p>Energy, nutrition, and wellness are connected. Keep it simple with a holistic picture.</p>
            <div className="slider-demo">
              <span>Low/OK</span>
              <motion.div 
                className="slider-track"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="slider-fill"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${sliderValue}%` } : {}}
                  transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                />
                <motion.div 
                  className="slider-thumb"
                  style={{ left: `${sliderValue}%` }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0}
                  whileHover={{ scale: 1.2 }}
                  whileDrag={{ scale: 1.3 }}
                  onDrag={(e, info) => {
                    const newValue = Math.max(0, Math.min(100, sliderValue + info.delta.x * 0.5));
                    setSliderValue(newValue);
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Toolkit;
