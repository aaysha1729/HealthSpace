import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      text: "Finally, an approach that makes it easier. I've been tracking all month and understand a lot about this and my body, and yet nothing.",
      author: "Anonymous"
    },
    {
      text: "I use quiet and it's been a lifesaver. I understand timing in a perspective that felt without being controlling or self-condemning.",
      author: "Anonymous"
    },
    {
      text: "I used the app almost weekly, she stores more data on the mobile. Allowing that to the entire situation to be fine.",
      author: "Anonymous"
    },
    {
      text: "Appreciate the visual language. It is just what I was very good for.",
      author: "Anonymous"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="testimonials" ref={ref}>
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Real stories, no names
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          A selection out of real emails and app experiences, re-told with permission.
        </motion.p>
        <motion.div 
          className="testimonials-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="testimonial-card"
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="quote-icon"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 0.1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                "
              </motion.div>
              <p>"{testimonial.text}"</p>
              <motion.span 
                className="testimonial-author"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {testimonial.author}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
