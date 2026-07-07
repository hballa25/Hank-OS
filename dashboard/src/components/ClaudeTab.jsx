import React, { useEffect, useState } from 'react'

export default function ClaudeTab() {
  const [packs, setPacks] = useState([])
  const [prompt, setPrompt] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => { fetch('/api/context-packs').then((r) => r.json()).then(setPacks) }, [])

  const launch = async (body) => {
    const r = await (await fetch('/api/launch-claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })).json()
    setMsg(r.ok ? `🚀 Claude Code opened on the PC — ${r.launched}` : `✗ ${r.error}`)
  }

  return (
    <div className="tab-pad">
      <h2>🤖 Claude Code</h2>
      <p>Launch a Claude Code session in the Hank OS repo — it starts knowing the vault rules (CLAUDE.md), the schema, and the index. Opens a terminal window on this PC.</p>

      <form className="add-source" onSubmit={(e) => { e.preventDefault(); launch(prompt ? { prompt } : {}) }}>
        <input placeholder="What should Claude build? (optional — blank opens a free session)" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button className="primary-btn">🚀 Launch Claude Code</button>
      </form>
      {msg && <p className="conn-msg">{msg}</p>}

      <h3 className="sect">Launch from a context pack</h3>
      {packs.length === 0 ? (
        <p className="muted">No packs yet — open any note in the Galaxy and hit 🚀 Deploy to create one.</p>
      ) : (
        packs.map((p, i) => (
          <div key={i} className="app-row">
            <b>{p.name}</b>
            <button className="primary-btn small" onClick={() => launch({ pack: p.path })}>🚀 Launch with this context</button>
          </div>
        ))
      )}
      <p className="muted">Works on this PC only (it opens a local terminal) — from the phone, use voice capture and pick the work up here.</p>
    </div>
  )
}
