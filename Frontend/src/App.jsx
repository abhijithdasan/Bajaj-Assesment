import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import './App.css';

function App() {
  const [inputData, setInputData] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/bfhl';

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(inputData);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: parsedData.data }),
      });

      const responseData = await response.json();
      setResponse(responseData);
      setError('');
    } catch (error) {
      setError('Invalid JSON input or API error');
      setResponse(null);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const renderResponse = () => {
    if (!response) return null;

    let renderedResponse = {};

    selectedOptions.forEach(option => {
      renderedResponse[option] = response[option];
    });

    return (
      <Box mt={2}>
        <Typography variant="h6">Filtered Response:</Typography>
        <pre>{JSON.stringify(renderedResponse, null, 2)}</pre>
      </Box>
    );
  };

  return (
    <Box className="App">
      <Typography variant="h4" mb={2}>BFHL App</Typography>
      <Typography variant="h6" mb={1}>API Input</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder='Enter valid JSON (e.g., {"data": ["A","1","B","2","C","3"]})'
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
        Submit
      </Button>

      {response && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Options</InputLabel>
          <Select
            multiple
            value={selectedOptions}
            onChange={handleOptionChange}
            renderValue={(selected) => selected.join(', ')}
          >
            <MenuItem value="is_success">is_success</MenuItem>
            <MenuItem value="user_id">user_id</MenuItem>
            <MenuItem value="email">email</MenuItem>
            <MenuItem value="roll_number">roll_number</MenuItem>
            <MenuItem value="numbers">numbers</MenuItem>
            <MenuItem value="alphabets">alphabets</MenuItem>
            <MenuItem value="highest_alphabet">highest_alphabet</MenuItem>
          </Select>
        </FormControl>
      )}

      {renderResponse()}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
