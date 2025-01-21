import React from 'react';
import './report.css';

function Report({ questions, answers }) {
  const calculateScore = () => {
    return questions.reduce((score, question) => {
      if (answers[question._id] === question.correct_answer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const totalQuestions = questions.length;
  const correctAnswers = calculateScore();

  return (
    <div className="report-page">
      <div className="report-container">
        <h1 className="report-title">Quiz Summary</h1>
        <div className="summary-cards">
          <div className="summary-card">
            <h2>Total Questions</h2>
            <p>{totalQuestions}</p>
          </div>
          <div className="summary-card">
            <h2>Correct Answers</h2>
            <p>{correctAnswers}</p>
          </div>
          <div className="summary-card">
            <h2>Score</h2>
            <p>{`${((correctAnswers / totalQuestions) * 100).toFixed(2)}%`}</p>
          </div>
        </div>
        <div className="question-details">
          {questions.map((question, index) => (
            <div key={index} className="question-card">
              <h2 className="question-text">{question.question}</h2>
              <p><strong>Your Answer:</strong> {answers[question._id] || "Not Answered"}</p>
              <p><strong>Correct Answer:</strong> {question.correct_answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Report;
