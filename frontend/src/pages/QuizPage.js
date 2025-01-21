import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import { useNavigate } from 'react-router-dom';
import './QuizPage.css';


function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // Fetch the email from sessionStorage
  const email = sessionStorage.getItem('userEmail');

  // Fetch questions from the backend in a separate useEffect
  useEffect(() => {
    axios
      .get('https://quizz-app-backend-beta.vercel.app/api/quiz/questions')
      .then((response) => {
        const fetchedQuestions = response.data;
        setQuestions(fetchedQuestions);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  // If no email is found, redirect to login page
  if (!email) {
    alert('Please log in to take the quiz.');
    navigate('/login'); // Redirect to login if no email found
    return null;
  }

  // Handle answer selection
  const handleAnswer = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = {
        ...prevAnswers,
        [questionId]: answer,
      };
      console.log('Updated Answers:', updatedAnswers); // Log updated answers
      return updatedAnswers;
    });
  
    setAttemptedQuestions((prev) => {
      const updated = new Set(prev);
      updated.add(questionId);
      console.log('Attempted Questions:', updated); // Log attempted questions
      return updated;
    });
  };

  // Handle clearing answer selection
  const handleClearSelection = (questionId) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      delete updatedAnswers[questionId];
      return updatedAnswers;
    });

    setAttemptedQuestions((prev) => {
      const updated = new Set(prev);
      updated.delete(questionId);
      return updated;
    });
  };

  // Submit quiz and save results to MongoDB
  const submitQuiz = () => {
    const confirmSubmit = window.confirm('Are you sure you want to submit the quiz?');
    if (!confirmSubmit) {
      return; // If user cancels, do nothing
    }

    if (questions.length === 0) {
      alert('No questions available to submit.');
      return;
    }

    // Calculate score
    const correctAnswersCount = questions.reduce((count, question) => {
      const userAnswer = answers[question._id];
      return userAnswer === question.correct_answer ? count + 1 : count;
    }, 0);

    const totalQuestions = questions.length;
    const score = `${correctAnswersCount} / ${totalQuestions}`;

    // Payload for backend submission
    const payload = {
      email,
      answers: questions.map((q) => ({
        questionId: q._id,  // Ensure questionId is passed correctly
        question: q.question,
        correct_answer: q.correct_answer,
        user_answer: answers[q._id] || 'Not Answered', // Ensure unanswered questions are marked
      })),
      score,
      questions,
    };

    // Save quiz result to MongoDB
    axios
      .post('https://quizz-app-backend-beta.vercel.app/api/quiz/submit', payload)
      .then((response) => {
        const quizId = response.data._id; // Get quizId from the response
        navigate(`/report/${quizId}`); // Redirect to report page with quizId
      })
      .catch((error) => console.error('Error submitting quiz:', error));
  };

  // Handle skipping a question
  const handleSkip = () => {
    const skipConfirmation = window.confirm('Are you sure you want to skip this question?');
    if (skipConfirmation) {
      setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
    }
  };

  // Navigate to a specific question
  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-sidebar">
        {/* Timer */}
        <Timer duration={1800} onTimeUp={submitQuiz} />

        {/* Question Number List */}
        <div className="question-number-list">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(index)}
              className={`question-number ${currentQuestionIndex === index ? 'selected' : ''} ${
                attemptedQuestions.has(questions[index]._id) ? 'attempted' : ''
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-container">
        <div className="main-quiz-area">
          {/* Display Question */}
          {questions.length > 0 && (
            <QuestionCard
              question={questions[currentQuestionIndex]}
              onAnswer={(answer) => handleAnswer(questions[currentQuestionIndex]._id, answer)}
              questionIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              selectedAnswer={answers[questions[currentQuestionIndex]._id]} // Pass selected answer
            />
          )}

          <div className="quiz-button-container">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestionIndex === 0}
              className="button previous-btn"
            >
              Previous
            </button>
            <button onClick={handleSkip} className="button skip-btn">
              Skip
            </button>
            <button
              onClick={() => handleClearSelection(questions[currentQuestionIndex]._id)}
              className="button clear-btn"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              className="button next-btn"
            >
              Next
            </button>
          </div>
          <button onClick={submitQuiz} className="button submit-btn">
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
