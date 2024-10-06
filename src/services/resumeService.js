import axios from 'axios';

export const analyzeResume = async (file, prompt) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('prompt', prompt);

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};