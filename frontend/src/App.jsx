import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Original Landing Page Components
import Header from './components/Header';
import Hero from './components/Hero';
import Privacy from './components/Privacy';
import Toolkit from './components/Toolkit';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Auth & App Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';

// Original Landing Page Component
const LandingPage = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Privacy />
        <Toolkit />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Original Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Redirect old routes to dashboard */}
          <Route path="/cycle" element={<Navigate to="/dashboard" replace />} />
          <Route path="/insights" element={<Navigate to="/dashboard" replace />} />
          <Route path="/community" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
