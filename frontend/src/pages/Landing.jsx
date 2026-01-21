import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-medium text-secondary">
            <span className="text-2xl">🌸</span>
            HealthSpace
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/login" className="text-muted hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-2 bg-green-50 text-green-700 text-sm rounded-full mb-6">
              Your health, your privacy
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">
              Understanding your health,<br />
              <span className="text-primary">quietly.</span>
            </h1>
            <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
              A private space to track your cycle, understand your body, and connect with a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary px-8">
                Start Your Journey →
              </Link>
              <a href="#features" className="btn-secondary px-8">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-serif text-center text-gray-900 mb-12">
            Everything you need, nothing you don't
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Cycle Tracking</h3>
              <p className="text-sm text-muted">Log your symptoms, predict your cycle, and understand your patterns.</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Health Insights</h3>
              <p className="text-sm text-muted">Personalized insights and patterns to help you understand your body.</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Anonymous Community</h3>
              <p className="text-sm text-muted">Connect with others who understand. Share and support, privately.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl mb-4 block">🔒</span>
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Privacy First</h2>
            <p className="text-muted mb-6">
              Your data is encrypted, never sold, and always under your control. 
              We designed this app with your privacy as the foundation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">✓ End-to-end encrypted</span>
              <span className="flex items-center gap-1">✓ No ads, ever</span>
              <span className="flex items-center gap-1">✓ No data selling</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-serif text-white mb-4">Ready to start?</h2>
          <p className="text-gray-300 mb-8">Join thousands who trust HealthSpace with their health journey.</p>
          <Link to="/signup" className="inline-block bg-white text-secondary px-8 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>© 2024 HealthSpace. Designed for support, not diagnosis.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
