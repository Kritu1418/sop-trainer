const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const fs = require('fs');

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/analyze', upload.single('file'), async (req, res) => {
  try {
    let sopText = '';

    if (req.file) {
      // Read PDF as buffer and extract readable text
      const buffer = fs.readFileSync(req.file.path);
      const text = buffer.toString('latin1');
      const matches = text.match(/BT[\s\S]*?ET/g) || [];
      let extracted = '';
      matches.forEach(block => {
        const tjMatches = block.match(/\(([^)]+)\)\s*Tj/g) || [];
        tjMatches.forEach(tj => {
          const content = tj.match(/\(([^)]+)\)/);
          if (content) extracted += content[1] + ' ';
        });
      });
      sopText = extracted.trim() || 'Could not extract text. Please paste text directly.';
      fs.unlinkSync(req.file.path);
    } else if (req.body.text) {
      sopText = req.body.text;
    } else {
      return res.status(400).json({ error: 'No input provided' });
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are a training content generator. Analyze this SOP document and return ONLY a JSON object with no markdown, no backticks, just raw JSON.

SOP Document:
${sopText}

Return this exact JSON structure:
{
  "summary": ["point1", "point2", "point3"],
  "training_steps": [
    { "step": 1, "title": "title here", "content": "content here" }
  ],
  "quiz": [
    { "question": "question here", "options": ["A", "B", "C", "D"], "answer": "A" }
  ]
}`
      }]
    });

    const raw = response.choices[0].message.content.trim();
    const result = JSON.parse(raw);
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));