import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import PricingPage from './pages/PricingPage';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardC from './pages/DashboardC';
import DashboardU from './pages/DashboardU';
import DashboardA from './pages/DashboardA';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResetPassword from './pages/ResetPassword';
import ForgetPassword from './pages/ForgetPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';

// --- NEW: Service Detail Pages ---
import UnifiedDashboardPage from './pages/services/UnifiedDashboardPage';
import CourseManagementPage from './pages/services/CourseManagementPage';
import OnlineClassesPage from './pages/services/OnlineClassesPage';
import ExamsAssessmentsPage from './pages/services/ExamsAssessmentsPage';
import CommunicationPage from './pages/services/CommunicationPage';
import AnalyticsPage from './pages/services/AnalyticsPage';

function App() {
  return (
    <Router>
      <div className="App overflow-x-hidden">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricingpage" element={<PricingPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* ★★★ FIX: Use `requiresAdmin` for the Admin Dashboard ★★★ */}
        <Route element={<ProtectedRoute requiresAdmin={true} />}>
          <Route path="/DashboardA" element={<DashboardA />} />
        </Route>

        {/* Protected Consultant Route (This remains unchanged and correct) */}
        <Route element={<ProtectedRoute allowedTypes={['consultant']} />}>
          <Route path="/DashboardC" element={<DashboardC />} />
        </Route>

        {/* Protected Employee Route (This remains unchanged and correct) */}
        <Route element={<ProtectedRoute allowedTypes={['employee']} />}>
          <Route path="/DashboardE" element={<DashboardU />} />
        </Route>
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/services/unified-dashboard" element={<UnifiedDashboardPage />} />
          <Route path="/services/course-management" element={<CourseManagementPage />} />
          <Route path="/services/online-classes" element={<OnlineClassesPage />} />
          <Route path="/services/exams-assessments" element={<ExamsAssessmentsPage />} />
          <Route path="/services/communication" element={<CommunicationPage />} />
          <Route path="/services/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;