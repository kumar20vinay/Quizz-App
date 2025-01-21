const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { decode } = require('html-entities');
const QuizResult = require('./models/quizResultModel'); // Model for quiz results
const User = require('./models/userModel'); // Model for user data
const quizRoutes = require('./routes/quizRoutes');
const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://vk9615420:vinaykumar@cluster0.z7uxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const API_URL = 'https://opentdb.com/api.php?amount=15';

let quizQuestions = []; // In-memory JSON object to store questions

// Middleware
app.use(cors({
  origin: 'https://quizz-app-frontend-steel.vercel.app',
  credentials: true
}));
app.use(express.json());

// Decode HTML entities
const decodeHtmlEntities = (input) => decode(input || '');

// Fetch questions and store them in memory
const fetchQuestionsToMemory = async () => {
  try {
    console.log('Fetching questions from API...');
    const response = await axios.get(API_URL);

    quizQuestions = response.data.results.map((item) => ({
      question: decodeHtmlEntities(item.question), // Decode question text
      correct_answer: decodeHtmlEntities(item.correct_answer), // Decode correct answer
      incorrect_answers: item.incorrect_answers.map(decodeHtmlEntities), // Decode incorrect answers
      category: decodeHtmlEntities(item.category), // Decode category (if necessary)
      difficulty: item.difficulty,
      type: item.type,
    }));

    console.log('Questions fetched and stored in memory.');
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
};

app.get('/', (req, res) => {
  res.send('Quiz App API');
})
// Route to register a new user
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Route to log in a user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const quizzes = await QuizResult.find({ email }).sort({ createdAt: -1 }); // Fetch user's quizzes
    res.status(200).json({ user: { email: user.email }, quizzes });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Route to get questions from memory
app.get('/api/quiz/questions',(req, res) => {
  if (quizQuestions.length > 0) {
    res.json(quizQuestions);
  } else {
    res.status(404).json({ message: 'Questions not found. Please try again later.' });
  }
});

// Route to submit quiz and store result in MongoDB
// Route to submit quiz and store result in MongoDB
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const { email, answers, score, questions } = req.body;
    
    // Create a new quiz result document
    const newQuizResult = new QuizResult({
      email,
      answers,
      score,
      questions,
    });
    
    // Save the quiz result in MongoDB
    const savedQuizResult = await newQuizResult.save();
    
    // Respond with the saved quiz result including the _id
    res.status(200).json(savedQuizResult);
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: 'Error saving quiz result' });
  }
});

// Fetch specific quiz by ID
// Route to fetch the quiz result by its ID
app.get('/api/report/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get quiz ID from request parameters
    const quiz = await QuizResult.findById(id); // Find quiz result by its MongoDB ID

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' }); // If quiz not found, send error
    }

    res.status(200).json(quiz); // If quiz found, send it in the response
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Internal server error' }); // Handle server error
  }
});

app.get('/api/quizzes', quizRoutes);

// MongoDB Connection and Server Start
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await fetchQuestionsToMemory(); // Fetch questions on startup
    app.listen(PORT, () => {
      console.log(`Server running`);
    });
  })
  .catch((error) => console.error('Database connection error:', error));

module.exports = app;
