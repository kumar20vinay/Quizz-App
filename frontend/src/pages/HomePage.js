
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Dashboard from './Dashboard'; // Import the new Dashboard component

function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  // Handle user login
  const login = async () => {
    if (email && password) {
      try {
        const response = await axios.post('https://quizz-app-backend-beta.vercel.app/api/auth/login', { email, password });
        setUserData(response.data.user);
        setQuizzes(response.data.quizzes);
        setIsLoggedIn(true);

        // Store the email in sessionStorage for later use in the QuizPage
        sessionStorage.setItem('userEmail', email);

        // Redirect to the Dashboard component
        navigate('/dashboard', { state: { userData: response.data.user, quizzes: response.data.quizzes } });
      } catch (error) {
        console.error('Error during login:', error);
        alert('Invalid email or password');
      }
    } else {
      alert('Please fill in both fields');
    }
  };

  // Handle user registration
  const register = async () => {
    if (email && password) {
      try {
        await axios.post('https://quizz-app-backend-beta.vercel.app/api/auth/register', { email, password });
        alert('Registration successful! Please log in.');
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed. Try a different email.');
      }
    } else {
      alert('Please fill in both fields');
    }
  };

  return (
    <div className="home-container">
      <h1 className="title">Welcome to the Quiz App</h1>

      {!isLoggedIn ? (
        <div className="auth-container">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
          />
          <button onClick={login} className="auth-button">Login</button>
          <button onClick={register} className="auth-button register-button">Register</button>
        </div>
      ) : (
        // Redirecting to Dashboard after successful login
        <div></div>
      )}
    </div>
  );
}

export default HomePage;
