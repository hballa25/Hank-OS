import React, { useEffect, useState } from 'react'
import { fetchNote } from '../api.js'

const APPS = [
  { name: 'Google Drive ×3', status: 'connected', note: 'G: personal · H: science · I: classroom — mounted via Drive for Desktop, indexed as sources below' },
  { name: 'Canva', status: 'connected', note: 'via Claude Code MCP — designs indexed as product/asset notes; generators can create + export designs' },
  { name: 'GitHub', status: 'connected', note: 'TaiGrader + XPScholar wired to hub notes. Install gh CLI (winget install GitHub.cli) for issue/PR automation' },
  { name: 'Gmail (multi-account)', status: 'setup', note: 'follow the wizard below — one script per account, unlimited accounts' },
  { name: 'TradingView', status: 'connected', note: 'live MES chart embedded in the Finance tab (no personal API exists — paper account stays in their app)' },
  { name: 'Google Gemini', status: 'pending', note: 'needs an API key in a local config file (never in chat) — say "wire up Gemini" in Claude Code once you have one' },
]

export default function ConnectionsTab({ onGraphChanged }) {
  const [sources, setSources] = useState([])
  const [form, setForm] = useState({ name: '', path: '' })
  const [msg, setMsg] = useState('')

  const [host, setHost] = useState(null)
  const loadSources = () => fetch('/api/sources').then((r) => r.json()).then(setSources)
  useEffect(() => {
    loadSources()
    fetch('/api/host-info').then((r) => r.json()).then(setHost).catch(() => {})
  }, [])

  const addSource = async (e) => {
    e.preventDefault()
    const r = await (await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })).json()
    if (r.ok) { setMsg(`✓ ${form.name} connected — check the Galaxy`); setForm({ name: '', path: '' }); loadSources(); onGraphChanged?.() }
    else setMsg(`✗ ${r.error}`)
  }

  const copyGmailScript = async () => {
    const note = await fetchNote('90 System/gmail-capture-script.md')
    const code = note.content?.match(/```javascript\n([\s\S]*?)```/)?.[1]
    try { await navigator.clipboard.writeText(code || note.content); setMsg('✓ Gmail script copied — paste into script.google.com') }
    catch { setMsg('✗ clipboard blocked — open the note in the Galaxy instead') }
  }

  return (
    <div className="tab-pad">
      <h2>🔌 Connections</h2>
      {msg && <p className="conn-msg">{msg}</p>}

      <h3 className="sect">Apps</h3>
      {APPS.map((a, i) => (
        <div key={i} className="app-row">
          <span className={`dot ${a.status}`} />
          <b>{a.name}</b>
          <span className="muted-inline">{a.note}</span>
        </div>
      ))}

      <h3 className="sect">📱 Connect your phone</h3>
      {host && (
        <div className="phone-connect">
          <p><b>At home (same WiFi) — works now:</b> on your phone's browser open{' '}
            {host.lan[0] ? <code>http://{host.lan[0]}:{host.port}</code> : '(no LAN address found)'}
            {' '}→ browser menu → <b>Add to Home Screen</b>. Full app, notes and all.</p>
          <p><b>From anywhere (cloud sync):</b> install <a href="https://tailscale.com/download" target="_blank" rel="noreferrer">Tailscale</a> (free) on this PC <i>and</i> your phone, sign into both with the same account, then open{' '}
            {host.tailscale ? <code>http://{host.tailscale}:{host.port}</code> : <>the PC's Tailscale address <code>http://100.x.x.x:{host.port}</code> (shown in Tailscale once installed)</>}
            {' '}from your phone anywhere. Encrypted, no setup on the router. The PC just needs to be on.</p>
          <p className="muted-inline">Notes you make on your phone save straight to the vault on this PC and push to GitHub — so they're backed up in the cloud even when the PC sleeps.</p>
        </div>
      )}

      <h3 className="sect">Sources — folders in the Galaxy</h3>
      {sources.map((s, i) => (
        <div key={i} className="app-row">
          <span className={`dot ${s.exists ? 'connected' : 'pending'}`} />
          <b>{s.name}</b>
          <span className="muted-inline">{s.path} · up to {s.maxFiles} files{s.exists ? '' : ' · ⚠ path not found'}</span>
          <button
            className="primary-btn small"
            title="Convert docs/PDFs/text in this source to vault .md notes (30 per click), landing in 70 Imports"
            onClick={async () => {
              setMsg(`converting ${s.name}…`)
              const r = await (
                await fetch('/api/convert-source', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: s.name }),
                })
              ).json()
              setMsg(r.ok ? `✓ ${s.name}: ${r.converted} files converted to .md${r.failed?.length ? `, ${r.failed.length} failed` : ''} — click again for the next batch` : `✗ ${r.error}`)
              if (r.ok && r.converted) onGraphChanged?.()
            }}
          >
            📥 Convert to .md
          </button>
        </div>
      ))}
      <form className="add-source" onSubmit={addSource}>
        <input placeholder="Name (e.g. Drive-Hustle)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder={'Folder path (e.g. G:\\My Drive\\Products)'} value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} />
        <button className="primary-btn">＋ Connect folder</button>
      </form>

      <h3 className="sect">Gmail — connect every account</h3>
      <ol className="wizard">
        <li>Open <a href="https://script.google.com" target="_blank" rel="noreferrer">script.google.com</a> <b>signed into the Gmail account</b> you're connecting → New project</li>
        <li><button className="primary-btn small" onClick={copyGmailScript}>📋 Copy the capture script</button> and paste it in, then Save</li>
        <li>Clock icon (Triggers) → Add trigger → <code>captureLabeledEmails</code> → time-driven → every 15 minutes</li>
        <li>In Gmail, create a label named <code>brain</code> — label any email and it becomes a note in that account's Drive</li>
        <li>Repeat for each account. Accounts synced by Drive for Desktop flow in automatically; the Gardener sweeps them nightly</li>
      </ol>
    </div>
  )
}
