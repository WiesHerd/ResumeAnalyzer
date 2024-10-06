import React, { useState } from 'react';
import { 
  Container, Typography, Paper, TextField, Button, 
  Box, CircularProgress, Chip, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AnalyzeIcon from '@mui/icons-material/Analytics';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const IconWrapper = styled(Box)(({ theme }) => ({
  background: '#2196F3',
  borderRadius: '50%',
  padding: theme.spacing(1),
  display: 'inline-flex',
  marginRight: theme.spacing(2),
}));

const DropZone = styled(Box)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),  // Reduced from 4 to 2
  textAlign: 'center',
  color: isDragActive ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: 'all 0.3s ease-in-out',
  backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
  cursor: 'pointer',
}));

function App() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF or Word document');
      setFile(null);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file || !prompt) {
      alert('Please upload a file and enter a prompt');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', prompt);

      const response = await fetch('http://localhost:3003/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.analysis);
    } catch (error) {
      console.error('Error during analysis:', error);
      setResults('An error occurred during analysis: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
        <IconWrapper>
          <AutoAwesomeIcon sx={{ color: 'white' }} />
        </IconWrapper>
        <Box>
          <Typography variant="h4" component="h1" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
            Resume Analyzer
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            AI-powered insights in minutes
          </Typography>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}  // Increased from 4 to 6
          variant="outlined"
          label="Enter your analysis prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ mb: 2 }}
        />
        <DropZone
          isDragActive={isDragActive}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
        >
          <Typography variant="body2" gutterBottom>
            Drag and drop your resume here, or
          </Typography>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            size="small"  // Make the button smaller
          >
            Upload Resume
            <VisuallyHiddenInput 
              type="file" 
              onChange={(e) => handleFileChange(e.target.files[0])} 
              accept=".pdf,.docx" 
            />
          </Button>
        </DropZone>
        {file && (
          <Chip
            icon={file.type === 'application/pdf' ? <PictureAsPdfIcon /> : <DescriptionIcon />}
            label={file.name}
            onDelete={() => setFile(null)}
            sx={{ mt: 2 }}
          />
        )}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Supported file types: PDF, Word (.docx)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyze}
          disabled={!file || !prompt || isLoading}
          startIcon={isLoading ? <CircularProgress size={24} /> : <AnalyzeIcon />}
          sx={{ mt: 2 }}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Resume'}
        </Button>
      </Paper>

      {results && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Analysis Results
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {results}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default App;