import React from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';  // Import Navbar
import HomePage from './pages/HomePage';  // Your Home Page
import Dashboard from './pages/Dashboard';  // Your Dashboard Page
import QuizPage from './pages/QuizPage';  // Your Quiz Page
import ReportPage from './pages/ReportPage';  // Your Report Page
import './App.css';

function App() {
  return (
    <Router>
      <ConditionalNavbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report/:id" element={<ReportPage />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}
function ConditionalNavbar() {
  const location = useLocation();
  if (location.pathname === '/') {
    return null;
  }
  return <Navbar />;
}


export default App;