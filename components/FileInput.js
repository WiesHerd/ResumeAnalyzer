import React from 'react';
import { TextField, Button, Box } from '@mui/material';

function PromptInput({ prompt, onPromptChange, onAnalyze, isLoading }) {
  return (
    <Box>
      <TextField
        fullWidth
        label="Enter analysis prompt"
        variant="outlined"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={onAnalyze}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Resume'}
      </Button>
    </Box>
  );
}

export default PromptInput;