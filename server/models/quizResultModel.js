const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  email: { type: String, required: true },
  answers: { type: Array, required: true },
  questions: { type: Array, required: true }, // Save questions for reference
  score: { type: String, required: true }, // Store the score in "correct / total" format
  submittedAt: { type: Date, default: Date.now }, // Add a timestamp for submission
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
