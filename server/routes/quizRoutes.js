const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizResultModel');

// Fetch quizzes for a user
router.get('/quizzes', async (req, res) => {
  try {
    const { email } = req.query; // Get the email from query params
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const quizzes = await Quiz.find({ email : email });
    res.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;