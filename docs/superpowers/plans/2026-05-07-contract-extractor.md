# Contract Extractor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React + Express web app that extracts key contract fields (party names, dates, payment terms, etc.) from pasted contract text using the Groq LLM API.

**Architecture:** A React frontend on localhost:3000 collects contract text and displays extracted fields as labeled cards. An Express backend on localhost:3001 proxies requests to Groq, keeping the API key server-side. The frontend communicates with the backend via a single POST endpoint.

**Tech Stack:** React (Create React App), axios, Express, groq-sdk, dotenv, cors

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `server/package.json` | Create | Server dependencies |
| `server/.env` | Create | GROQ_API_KEY (not committed) |
| `server/.gitignore` | Create | Ignore .env and node_modules |
| `server/server.js` | Create | Express app, POST /api/extract route |
| `client/` | Create | CRA scaffold |
| `client/src/App.jsx` | Modify | Root state: contractText, extractedData, loading, error |
| `client/src/App.css` | Modify | App-level layout styles |
| `client/src/components/ContractInput.jsx` | Create | Textarea + Extract button |
| `client/src/components/ResultsPanel.jsx` | Create | Grid of FieldCards |
| `client/src/components/FieldCard.jsx` | Create | Single labeled field display |

---

## Task 1: Scaffold the server

**Files:**
- Create: `server/package.json`
- Create: `server/.gitignore`
- Create: `server/.env`

- [ ] **Step 1: Create the server directory and package.json**

```bash
mkdir -p server
cd server
```

Create `server/package.json`:
```json
{
  "name": "xtractor-server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "groq-sdk": "^0.5.0"
  }
}
```

- [ ] **Step 2: Create .gitignore and .env**

Create `server/.gitignore`:
```
node_modules/
.env
```

Create `server/.env`:
```
GROQ_API_KEY=your_key_here
```

- [ ] **Step 3: Install server dependencies**

```bash
cd server && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 4: Commit**

```bash
git init
git add server/package.json server/.gitignore
git commit -m "feat: scaffold server package"
```

---

## Task 2: Build the Express server

**Files:**
- Create: `server/server.js`

- [ ] **Step 1: Write server.js**

Create `server/server.js`:
```javascript
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
```

- [ ] **Step 2: Start the server and verify it runs**

```bash
cd server && node server.js
```

Expected output:
```
Server running on http://localhost:3001
```

Stop the server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add server/server.js
git commit -m "feat: add Express server with /api/extract route"
```

---

## Task 3: Scaffold the React client

**Files:**
- Create: `client/` (CRA scaffold)

- [ ] **Step 1: Create the React app**

```bash
npx create-react-app client
```

Expected: `client/` directory created with default CRA structure.

- [ ] **Step 2: Install axios**

```bash
cd client && npm install axios
```

- [ ] **Step 3: Add client .gitignore entry (if not already present)**

Verify `client/.gitignore` contains `node_modules/`. CRA adds this by default.

- [ ] **Step 4: Commit**

```bash
git add client/package.json client/public client/src
git commit -m "feat: scaffold React client with CRA"
```

---

## Task 4: Build FieldCard component

**Files:**
- Create: `client/src/components/FieldCard.jsx`

- [ ] **Step 1: Create the components directory and FieldCard**

```bash
mkdir -p client/src/components
```

Create `client/src/components/FieldCard.jsx`:
```jsx
function FieldCard({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.label}>{label}</div>
      {value ? (
        <div style={styles.value}>{value}</div>
      ) : (
        <div style={styles.notFound}>Not found</div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#64748b',
  },
  value: {
    fontSize: '14px',
    color: '#1e293b',
    lineHeight: '1.5',
  },
  notFound: {
    fontSize: '14px',
    color: '#cbd5e1',
    fontStyle: 'italic',
  },
};

export default FieldCard;
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/FieldCard.jsx
git commit -m "feat: add FieldCard component"
```

---

## Task 5: Build ResultsPanel component

**Files:**
- Create: `client/src/components/ResultsPanel.jsx`

- [ ] **Step 1: Create ResultsPanel.jsx**

Create `client/src/components/ResultsPanel.jsx`:
```jsx
import FieldCard from './FieldCard';

const FIELD_LABELS = [
  { key: 'partyNames', label: 'Party Names' },
  { key: 'effectiveDate', label: 'Effective Date' },
  { key: 'expirationDeadline', label: 'Expiration / Deadline' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'governingLaw', label: 'Governing Law' },
  { key: 'noticeRequirements', label: 'Notice Requirements' },
  { key: 'keyObligations', label: 'Key Obligations' },
];

function ResultsPanel({ data }) {
  return (
    <div style={styles.grid}>
      {FIELD_LABELS.map(({ key, label }) => (
        <FieldCard key={key} label={label} value={data[key]} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
    marginTop: '32px',
  },
};

export default ResultsPanel;
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ResultsPanel.jsx
git commit -m "feat: add ResultsPanel component"
```

---

## Task 6: Build ContractInput component

**Files:**
- Create: `client/src/components/ContractInput.jsx`

- [ ] **Step 1: Create ContractInput.jsx**

Create `client/src/components/ContractInput.jsx`:
```jsx
function ContractInput({ value, onChange, onExtract, loading }) {
  return (
    <div style={styles.container}>
      <textarea
        style={styles.textarea}
        placeholder="Paste your contract text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      />
      <button
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
        onClick={onExtract}
        disabled={loading || value.trim() === ''}
      >
        {loading ? 'Extracting...' : 'Extract'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  textarea: {
    width: '100%',
    height: '240px',
    padding: '14px',
    fontSize: '14px',
    fontFamily: 'inherit',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#1e293b',
  },
  button: {
    alignSelf: 'flex-end',
    padding: '10px 28px',
    fontSize: '14px',
    fontWeight: '600',
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    background: '#94a3b8',
    cursor: 'not-allowed',
  },
};

export default ContractInput;
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/ContractInput.jsx
git commit -m "feat: add ContractInput component"
```

---

## Task 7: Wire up App.jsx

**Files:**
- Modify: `client/src/App.jsx`
- Modify: `client/src/App.css`

- [ ] **Step 1: Replace App.jsx**

Replace the contents of `client/src/App.jsx` with:
```jsx
import { useState } from 'react';
import axios from 'axios';
import ContractInput from './components/ContractInput';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [contractText, setContractText] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const response = await axios.post('http://localhost:3001/api/extract', {
        contractText,
      });
      setExtractedData(response.data);
    } catch (err) {
      setError('Failed to extract contract data. Please check the server is running and your API key is set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Xtractor</h1>
        <p style={styles.subtitle}>Paste a contract below to extract key information.</p>

        <ContractInput
          value={contractText}
          onChange={setContractText}
          onExtract={handleExtract}
          loading={loading}
        />

        {error && (
          <div style={styles.errorBanner}>{error}</div>
        )}

        {extractedData && <ResultsPanel data={extractedData} />}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '48px 24px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: '0 0 32px',
  },
  errorBanner: {
    marginTop: '16px',
    padding: '12px 16px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    color: '#991b1b',
    fontSize: '14px',
  },
};

export default App;
```

- [ ] **Step 2: Clear App.css (CRA default styles interfere)**

Replace `client/src/App.css` with:
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/App.jsx client/src/App.css
git commit -m "feat: wire up App with state, ContractInput, and ResultsPanel"
```

---

## Task 8: End-to-end test

**Files:** None — manual verification only.

- [ ] **Step 1: Add your Groq API key**

Edit `server/.env`:
```
GROQ_API_KEY=<your actual key from console.groq.com>
```

- [ ] **Step 2: Start the server**

In terminal 1:
```bash
cd server && node server.js
```

Expected:
```
Server running on http://localhost:3001
```

- [ ] **Step 3: Start the client**

In terminal 2:
```bash
cd client && npm start
```

Expected: Browser opens at `http://localhost:3000`.

- [ ] **Step 4: Test with sample contract text**

Paste the following into the textarea and click "Extract":

```
SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of January 1, 2024 ("Effective Date") by and between Acme Corp, a Delaware corporation ("Client"), and WidgetMakers LLC, a California limited liability company ("Vendor").

This Agreement shall remain in effect until December 31, 2024 ("Expiration Date"), unless terminated earlier.

Payment Terms: Client shall pay Vendor $5,000 per month, due within 30 days of invoice.

Governing Law: This Agreement shall be governed by the laws of the State of California.

Notices: All notices must be delivered in writing via certified mail to the addresses listed in Exhibit A, with 10 days advance notice required.

Key Obligations: Vendor shall deliver software development services as described in Exhibit B. Client shall provide access to necessary systems and timely feedback.
```

Expected: ResultsPanel appears with 7 FieldCards showing extracted values.

- [ ] **Step 5: Test error state**

Stop the server (Ctrl+C in terminal 1), then click "Extract" again.

Expected: Red error banner appears — "Failed to extract contract data..."

- [ ] **Step 6: Test "Not found" state**

Paste a short, incomplete text like `"This is a simple letter of intent."` and click "Extract".

Expected: Several FieldCards show "Not found" in gray italic.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete Xtractor contract extraction demo"
```
