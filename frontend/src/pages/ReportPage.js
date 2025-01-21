import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportPage.css';
import { useParams } from 'react-router-dom';

function ReportPage({ onBack }) {
  const { id } = useParams(); // Get quiz ID from URL
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    // Fetch quiz result by ID from backend API
    axios
      .get(`https://quizz-app-backend-beta.vercel.app/api/report/${id}`)
      .then((response) => setQuizResult(response.data))
      .catch((error) => console.error('Error fetching quiz result:', error));
  }, [id]);

  if (!quizResult) {
    return <div className="text-center full-page">Loading...</div>;
  }

  const { questions, answers } = quizResult;

  const calculateScore = () => {
    return questions.reduce((score, question) => {
      if (answers[question._id] === question.correct_answer) {
        score += 1;
      }
      return score;
    }, 0);
  };

  const totalQuestions = questions.length;
  const score = calculateScore();

  return (
    <div className="report-page">
      {/* Side Panel */}
      <div className="report-sidebar">
        <h3>Quiz Summary</h3>
        <div className="report-score-summary">
          <p>
            <strong>Total Questions:</strong> {totalQuestions}
          </p>
          <p>
            <strong>Correct Answers:</strong> {score}
          </p>
          <p>
            <strong>Score:</strong> {((score / totalQuestions) * 100).toFixed(2)}%
          </p>
        </div>
        <h3>Question Panel</h3>
        <ul className="report-question-panel">
          {questions.map((question, index) => (
            <li
              key={index}
              className={`report-question-item ${
                answers[question._id] === question.correct_answer
                  ? 'correct'
                  : 'incorrect'
              }`}
            >
              {index + 1}
            </li>
          ))}
        </ul>
        <div className="report-button-container">
          <button onClick={onBack} className="report-back-button">
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="report-main-content">
        <h1 className="report-title">Quiz Report</h1>

        <div className="report-question-details">
          {questions.map((question, index) => (
            <div key={index} className="report-question-card">
              <h2 className="question-text">
                {index + 1}. {question.question}
              </h2>
              <p>
                <strong>Your Answer:</strong>{' '}
                <span
                  className={
                    answers[question._id] === question.correct_answer
                      ? 'correct'
                      : 'incorrect'
                  }
                >
                  {answers[question._id] || 'Not Answered'}
                </span>
              </p>
              <p>
                <strong>Correct Answer:</strong>{' '}
                <span className="correct-answer">{question.correct_answer}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
