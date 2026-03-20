# SOP Training System

An AI-powered web application that converts Standard Operating Procedure (SOP) documents into structured training content instantly.

## What it does

Upload any SOP document (PDF or text) and the system automatically generates:
- A structured summary of key points
- Step-by-step training content for employees
- An evaluation quiz with correct answers

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI Model:** Groq API (LLaMA 3.3 70B)
- **File Handling:** Multer

## How to Run

### Backend
```bash
cd server
npm install
node index.js
```

### Frontend
```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

> Add your Groq API key in `server/.env` as `GROQ_API_KEY=your_key_here`

## Approach

The core problem is simple — training employees from SOP documents is slow and manual. Someone has to read the document, pull out key points, write training material, and then create a quiz. This system automates that entire process.

I built a full-stack web application where the user can either paste SOP text directly or upload a PDF file. The backend extracts the text and sends it to the Groq API with a structured prompt that instructs the LLaMA 3.3 70B model to return a JSON response containing three things: a summary, training steps, and quiz questions.

The frontend then takes that JSON and renders it in a clean, readable format — split into three clear sections. The whole flow takes under 10 seconds from input to output.

I kept the architecture simple on purpose. No database, no authentication, no unnecessary complexity. The focus was on making something that actually works and solves the real problem — turning a static document into usable training material without any manual effort.

The solution handles both text and PDF inputs, structures the AI output consistently, and presents it in a way that a non-technical HR or operations team member could use without any training.
