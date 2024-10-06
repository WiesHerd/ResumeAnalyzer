require('dotenv').config({ path: '.env.server' });
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const prompt = req.body.prompt;
    let text;

    if (file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(file.buffer);
      text = pdfData.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }

    // Perform analysis using Google's Generative AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(`${prompt}\n\nResume content:\n${text}`);
    const response = await result.response;
    const analysis = response.text();

    res.json({ analysis });
  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ error: 'An error occurred during analysis', details: error.message });
  }
});

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running correctly' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
