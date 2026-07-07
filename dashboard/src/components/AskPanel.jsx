import React from 'react'
import { marked } from 'marked'

// Answers from /api/ask rendered as an overlay; speaks the answer when voice-initiated
export default function AskPanel({ ask, onClose, onOpenNote }) {
  return (
    <div className="ask-panel">
      <div className="ask-head">
        <h3>🧠 {ask.question}</h3>
        <button className="conn" onClick={onClose}>✕</button>
      </div>
      {ask.loading ? (
        <p className="muted">Thinking over your notes…</p>
      ) : ask.error ? (
        <p className="ask-error">{ask.error}</p>
      ) : (
        <>
          <div className="md-preview" dangerouslySetInnerHTML={{ __html: marked.parse(ask.answer || '') }} />
          {ask.sources?.length > 0 && (
            <div className="ask-sources">
              {ask.sources.map((s, i) => (
                <button key={i} className="conn" onClick={() => onOpenNote(s.path)}>
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
