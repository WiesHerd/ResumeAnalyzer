import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import FileUpload from './components/FileUpload';
import PromptInput from './components/PromptInput';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeResume } from './services/resumeService';

function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt);
  };

  const handleAnalyze = async () => {
    if (!file || !prompt) {
      alert('Please upload a file and enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      const analysisResults = await analyzeResume(file, prompt);
      setResults(analysisResults);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('An error occurred while analyzing the resume');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Resume Analyzer
      </Typography>
      <Box mb={3}>
        <FileUpload onFileUpload={handleFileUpload} />
      </Box>
      <Box mb={3}>
        <PromptInput
          prompt={prompt}
          onPromptChange={handlePromptChange}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
      </Box>
      {results && <ResultsDisplay results={results} />}
    </Container>
  );
}

export default App;