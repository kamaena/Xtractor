# Xtractor

An LLM-powered contract analysis tool. Paste any contract text and instantly extract key information like party names, deadlines, payment terms, and more.

Showcasing how LLMs can automate document intelligence workflows.

## What it does

Xtractor takes raw contract text and extracts:

- **Party Names** — the parties involved in the agreement
- **Effective Date** — when the contract takes effect
- **Expiration / Deadline** — when the contract ends or key deadlines
- **Payment Terms** — payment amounts, schedules, and conditions
- **Governing Law** — the jurisdiction that governs the agreement
- **Notice Requirements** — how and when notices must be delivered
- **Key Obligations** — the primary duties of each party

## Tech stack

- **Frontend:** React (Create React App)
- **Backend:** Node.js + Express
- **LLM:** [Groq](https://groq.com) — `llama-3.3-70b-versatile`

## Getting started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com) (takes ~30 seconds to create)

### Setup

1. Clone the repo and add your Groq API key to `server/.env`:

```
GROQ_API_KEY=your_key_here
```

2. Start the server:

```bash
cd server
npm install
node server.js
```

3. Start the client (in a separate terminal):

```bash
cd client
npm install
npm start
```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

Paste any contract text into the text area and click **Extract**. Use the **Sample Contract** button to try it out with a pre-loaded example.
