import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  // Handle navigation actions
  const goHome = () => {
    navigate('/dashboard'); // Assuming the dashboard route is '/dashboard'
  };

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const logout = () => {
    sessionStorage.removeItem('userEmail'); // Clear session storage
    navigate('/'); // Redirect to the home page (or login page)
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button onClick={goHome} className="navbar-button">Home</button>
        <button onClick={goBack} className="navbar-button">Back</button>
      </div>
      <div className="navbar-right">
        <button onClick={logout} className="navbar-button logout-button">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
