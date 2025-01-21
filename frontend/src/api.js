import axios from 'axios';

// Base URL of the API
const API_URL = 'https://quizz-app-backend-beta.vercel.app';
axios.defaults.withCredentials = true;
// Fetch Questions
export const fetchQuestions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Submit Quiz
export const submitQuiz = async (answers) => {
  try {
    const response = await axios.post(`${API_URL}/submit`, { answers });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};
