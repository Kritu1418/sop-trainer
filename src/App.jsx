import { useState } from 'react'

export default function App() {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      let response
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        response = await fetch('http://localhost:3001/analyze', { method: 'POST', body: formData })
      } else if (text.trim()) {
        response = await fetch('http://localhost:3001/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
      } else {
        setError('Please provide a SOP document.')
        setLoading(false)
        return
      }
      const data = await response.json()
      setResult(data)
    } catch {
      setError('Server not reachable. Please start the backend.')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f4f1eb; font-family: 'Georgia', serif; color: #1a1a1a; }

        .navbar {
          width: 100%;
          background: #1a1a1a;
          padding: 18px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo { color: #f4f1eb; font-size: 15px; letter-spacing: 0.15em; text-transform: uppercase; }
        .navbar-tag { color: #666; font-size: 12px; letter-spacing: 0.1em; }

        .hero {
          width: 100%;
          background: #1a1a1a;
          padding: 80px 48px 72px;
          border-bottom: 1px solid #2e2e2e;
        }
        .hero h1 {
          font-size: 56px;
          font-weight: 400;
          color: #f4f1eb;
          line-height: 1.1;
          letter-spacing: -0.02em;
          max-width: 700px;
          margin-bottom: 20px;
        }
        .hero p {
          font-size: 16px;
          color: #888;
          max-width: 500px;
          line-height: 1.75;
        }

        .main {
          width: 100%;
          padding: 64px 48px;
        }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }

        .input-box {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 28px;
        }

        .input-box label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 14px;
        }

        textarea {
          width: 100%;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          padding: 14px;
          font-size: 14px;
          font-family: 'Georgia', serif;
          color: #1a1a1a;
          resize: vertical;
          outline: none;
          background: #fafafa;
          line-height: 1.7;
          transition: border-color 0.2s;
        }
        textarea:focus { border-color: #1a1a1a; background: #fff; }

        .file-upload-area {
          border: 1px dashed #ccc;
          border-radius: 4px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          background: #fafafa;
          transition: all 0.2s;
        }
        .file-upload-area:hover { border-color: #1a1a1a; background: #f0ede8; }
        .file-upload-area p { font-size: 13px; color: #999; margin-bottom: 12px; }
        .file-btn {
          display: inline-block;
          padding: 8px 20px;
          background: #1a1a1a;
          color: #f4f1eb;
          font-size: 12px;
          letter-spacing: 0.1em;
          border-radius: 3px;
          cursor: pointer;
          font-family: 'Georgia', serif;
        }
        .file-selected { font-size: 13px; color: #2a7a4a; margin-top: 10px; font-style: italic; }

        .analyze-btn {
          width: 100%;
          padding: 18px;
          background: #1a1a1a;
          color: #f4f1eb;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Georgia', serif;
          transition: background 0.2s;
        }
        .analyze-btn:hover { background: #333; }
        .analyze-btn:disabled { background: #999; cursor: not-allowed; }

        .error { color: #c0392b; font-size: 13px; text-align: center; margin-top: 16px; font-style: italic; }

        .results { margin-top: 64px; }

        .result-block { margin-bottom: 56px; }

        .result-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #1a1a1a;
        }
        .result-num { font-size: 12px; color: #bbb; letter-spacing: 0.1em; font-family: monospace; }
        .result-title { font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: #1a1a1a; }

        .summary-item {
          display: flex;
          gap: 20px;
          padding: 18px 0;
          border-bottom: 1px solid #e5e5e5;
          align-items: flex-start;
        }
        .summary-idx { font-size: 11px; color: #bbb; font-family: monospace; padding-top: 3px; min-width: 24px; }
        .summary-text { font-size: 15px; color: #333; line-height: 1.75; }

        .step-card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 24px 28px;
          margin-bottom: 16px;
          border-left: 3px solid #1a1a1a;
        }
        .step-num { font-size: 11px; letter-spacing: 0.15em; color: #999; margin-bottom: 8px; text-transform: uppercase; }
        .step-title { font-size: 17px; font-weight: 400; color: #1a1a1a; margin-bottom: 10px; }
        .step-content { font-size: 14px; color: #666; line-height: 1.8; }

        .quiz-card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 24px 28px;
          margin-bottom: 16px;
        }
        .quiz-q { font-size: 15px; color: #1a1a1a; margin-bottom: 16px; line-height: 1.6; }
        .quiz-option {
          padding: 10px 14px;
          border-radius: 4px;
          font-size: 13px;
          margin-bottom: 8px;
          line-height: 1.5;
        }
        .quiz-correct { background: #edf7f1; color: #2a7a4a; border: 1px solid #b8e0c8; font-weight: 500; }
        .quiz-wrong { background: #fafafa; color: #999; border: 1px solid #eee; }
      `}</style>

      <nav className="navbar">
        <span className="navbar-logo">SOP Training System</span>
        <span className="navbar-tag">AI-Powered Document Analyzer</span>
      </nav>

      <div className="hero">
        <h1>Transform documents into training content.</h1>
        <p>Upload a Standard Operating Procedure and instantly receive a structured summary, step-by-step training guide, and evaluation quiz.</p>
      </div>

      <div className="main">
        <div className="input-grid">
          <div className="input-box">
            <label>Paste SOP Text</label>
            <textarea
              rows={10}
              placeholder="Paste your Standard Operating Procedure here..."
              value={text}
              onChange={e => { setText(e.target.value); setFile(null) }}
            />
          </div>

          <div className="input-box">
            <label>Upload PDF Document</label>
            <div className="file-upload-area">
              <p>Drag and drop your PDF here, or</p>
              <label className="file-btn">
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => { setFile(e.target.files[0]); setText('') }} />
                Browse File
              </label>
              {file && <p className="file-selected">{file.name}</p>}
            </div>
          </div>
        </div>

        <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing Document...' : 'Generate Training Content'}
        </button>

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="results">

            <div className="result-block">
              <div className="result-header">
                <span className="result-num">01</span>
                <span className="result-title">Document Summary</span>
              </div>
              {result.summary.map((point, i) => (
                <div key={i} className="summary-item">
                  <span className="summary-idx">{String(i + 1).padStart(2, '0')}</span>
                  <span className="summary-text">{point}</span>
                </div>
              ))}
            </div>

            <div className="result-block">
              <div className="result-header">
                <span className="result-num">02</span>
                <span className="result-title">Training Steps</span>
              </div>
              {result.training_steps.map((step, i) => (
                <div key={i} className="step-card">
                  <p className="step-num">Step {String(step.step).padStart(2, '0')}</p>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-content">{step.content}</p>
                </div>
              ))}
            </div>

            <div className="result-block">
              <div className="result-header">
                <span className="result-num">03</span>
                <span className="result-title">Evaluation Quiz</span>
              </div>
              {result.quiz.map((q, i) => (
                <div key={i} className="quiz-card">
                  <p className="quiz-q"><strong>Q{i + 1}.</strong> {q.question}</p>
                  {q.options.map((opt, j) => (
                    <div key={j} className={`quiz-option ${opt === q.answer ? 'quiz-correct' : 'quiz-wrong'}`}>
                      {opt}
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </>
  )
}