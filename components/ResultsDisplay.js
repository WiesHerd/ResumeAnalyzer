import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

function ResultsDisplay({ results }) {
  return (
    <Paper elevation={3}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Analysis Results
        </Typography>
        <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(results, null, 2)}
        </Typography>
      </Box>
    </Paper>
  );
}

export default ResultsDisplay;