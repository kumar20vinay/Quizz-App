import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const email = sessionStorage.getItem('userEmail');
  axios.defaults.withCredentials = true;
  useEffect(() => {
    if (email) {
      axios
        .get('https://quizz-app-backend-beta.vercel.app/api/quizzes', { params: { email } })
        .then((response) => {
          if (response.data.user) {
            setUserData(response.data.user);
          }
          if (response.data.quizzes) {
            setQuizzes(response.data.quizzes);
          }
        })
        .catch((error) => {
          console.error('Error fetching quizzes:', error);
        });
    }
  }, [email]);

  const handleQuizClick = (quiz) => {
    navigate(`/report/${quiz._id}`, { state: { quiz } });
  };

  return (
    <div className="dashboard-container">
      <h2>Hello, {email}</h2>
      <div className="quizzes-container">
        <h3>Your Previous Quizzes</h3>
        {Array.isArray(quizzes) && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="quiz-card"
              onClick={() => handleQuizClick(quiz)} // Navigate to report on click
              style={{ cursor: 'pointer' }}
            >
              <p>Quiz ID: {quiz._id}</p>
              <p>Date: {quiz.submittedAt ? new Date(quiz.submittedAt).toLocaleString() : 'Invalid Date'}</p>
              <p>Score: {quiz.score}</p>
            </div>
          ))
        ) : (
          <p>No quizzes found.</p>
        )}
      </div>

      <button
        onClick={() => {
          const confirmStart = window.confirm('Are you sure you want to start a new quiz?');
          if (confirmStart) {
            navigate('/quiz');
          }
        }}
        className="start-button"
      >
        Start New Quiz
      </button>
    </div>
  );
}

export default Dashboard;
