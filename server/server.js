require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const SYSTEM_PROMPT = `You are a contract analysis assistant. Extract the following fields from the contract text provided by the user. Return ONLY a raw JSON object with exactly these keys — no markdown, no explanation, no code fences:
{
  "partyNames": "string or null",
  "effectiveDate": "string or null",
  "expirationDeadline": "string or null",
  "paymentTerms": "string or null",
  "governingLaw": "string or null",
  "noticeRequirements": "string or null",
  "keyObligations": "string or null"
}
If a field is not present in the contract, set its value to null.`;

app.post('/api/extract', async (req, res) => {
  const { contractText } = req.body;

  if (!contractText || contractText.trim() === '') {
    return res.status(400).json({ error: 'contractText is required' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: contractText },
      ],
      temperature: 0,
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to extract contract data' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));