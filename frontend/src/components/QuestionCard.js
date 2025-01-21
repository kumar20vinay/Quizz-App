import React, { useState, useEffect } from 'react';
import './QuestionCard.css';  // Importing the custom CSS for styling

function QuestionCard({ question, onAnswer, questionIndex, totalQuestions, selectedAnswer }) {
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(selectedAnswer || null);

  useEffect(() => {
    // Shuffle choices only once on initial render
    const shuffledChoices = [
      question.correct_answer,
      ...question.incorrect_answers
    ].sort(() => Math.random() - 0.5); // Shuffle only on initial render

    setChoices(shuffledChoices);
  }, [question]);

  useEffect(() => {
    // When selectedAnswer prop changes, update selectedChoice
    setSelectedChoice(selectedAnswer);
  }, [selectedAnswer]);

  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice); // Update the selected answer locally
    onAnswer(choice); // Notify parent with the updated answer
  };

  return (
    <div className="q-question-card">
      <div className="q-question-counter">
        <span>Question {questionIndex + 1} of {totalQuestions}</span>
      </div>
      <h2 className="q-question-text">{question.question}</h2>
      <div className="q-choices-container">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(choice)}
            className={`q-choice-btn ${selectedChoice === choice ? 'selected' : ''}`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;