# Contract Extractor — Design Spec

**Date:** 2026-05-07  
**Project:** Xtractor  
**Context:** A small LLM-powered prototype that extracts key information from contract text.

---

## Overview

A React + Express web app where a user pastes contract text into a textarea, clicks "Extract", and sees a structured card panel showing key contract fields extracted by an LLM (Groq API).

---

## Architecture

Two locally-running processes:

- **Frontend:** React app on `localhost:3000`
- **Backend:** Express server on `localhost:3001`

The frontend never holds or uses the Groq API key. All LLM calls are proxied through the Express backend.

---

## Extracted Fields

The LLM extracts the following standard contract summary fields. If a field is not present in the contract, it returns `null`.

1. Party Names
2. Effective Date
3. Expiration / Deadline
4. Payment Terms
5. Governing Law
6. Notice Requirements
7. Key Obligations

---

## Components

### Frontend (`/client`)

| File | Responsibility |
|------|---------------|
| `src/App.jsx` | Root component. Holds state: `contractText`, `extractedData`, `loading`, `error`. |
| `src/components/ContractInput.jsx` | Textarea for pasting contract text + "Extract" button. Disabled while loading. |
| `src/components/ResultsPanel.jsx` | Renders a grid of `FieldCard` components once extraction is complete. |
| `src/components/FieldCard.jsx` | Single labeled field. Shows value or a subtle "Not found" label when `null`. |

### Backend (`/server`)

| File | Responsibility |
|------|---------------|
| `server.js` | Express app with single route: `POST /api/extract`. Reads `contractText` from request body, builds structured Groq prompt, parses JSON response, returns it. |
| `.env` | Holds `GROQ_API_KEY`. Never committed. |

---

## Data Flow

```
User pastes text → clicks "Extract"
  → POST /api/extract { contractText }
    → Express builds prompt → Groq API (llama3-8b-8192)
    → Groq returns JSON object with 7 fields
  → Express parses + forwards JSON
→ React renders ResultsPanel with FieldCards
```

### Groq Prompt Strategy

The backend sends a system prompt instructing the model to return a JSON object with exactly the 7 field keys. Each value is a short string or `null` if not found. No markdown, no explanation — raw JSON only.

---

## Error Handling

- **Loading state:** "Extract" button shows a spinner and is disabled while waiting for the response.
- **API error:** A visible error banner is shown below the input if the request fails.
- **Partial data:** Fields with `null` values render with a "Not found" label — no field is hidden.

---

## Project Structure

```
Xtractor/
├── client/               # React app (Create React App)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ContractInput.jsx
│   │   │   ├── ResultsPanel.jsx
│   │   │   └── FieldCard.jsx
│   │   └── index.js
│   └── package.json
├── server/
│   ├── server.js
│   ├── .env              # GROQ_API_KEY (not committed)
│   └── package.json
└── docs/
    └── superpowers/specs/
```

---

## Dependencies

### Client
- `react`, `react-dom` (via Create React App)
- `axios` — HTTP requests to backend

### Server
- `express` — HTTP server
- `groq-sdk` — Groq API client
- `dotenv` — load `.env`
- `cors` — allow requests from `localhost:3000`

---

## Setup Instructions

1. Create a free account at console.groq.com and generate an API key (~30 seconds)
2. Add key to `server/.env` as `GROQ_API_KEY=your_key_here`
3. `cd server && npm install && node server.js`
4. `cd client && npm install && npm start`
5. Open `localhost:3000`