const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// User info
const userId = 'john_doe_17091999';
const email = 'john@xyz.com';
const rollNumber = 'ABCD123';

// Helper function to separate numbers and alphabets
const separateNumbersAndAlphabets = (data) => {
  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => isNaN(item) && typeof item === 'string' && item.length === 1);
  return { numbers, alphabets };
};

// POST endpoint
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;
    console.log('Received data:', data);

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: 'Invalid input data: data field is missing or not an array'
      });
    }

    const { numbers, alphabets } = separateNumbersAndAlphabets(data);

    const highestAlphabet = alphabets.length ?
      [alphabets.reduce((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }) > 0 ? a : b)] :
      [];

    res.json({
      is_success: true,
      user_id: userId,
      email,
      roll_number: rollNumber,
      numbers,
      alphabets,
      highest_alphabet: highestAlphabet
    });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({
      is_success: false,
      message: 'Internal server error'
    });
  }
});

// GET endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});