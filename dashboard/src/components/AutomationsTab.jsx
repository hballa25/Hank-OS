import React, { useEffect, useState, useCallback } from 'react'

const POLL_MS = 8000

// The Forge control surface: launch a job + the approval inbox.
// Backed by /api/forge/jobs, /api/forge/run, /api/approvals. See
// vault/90 System/automation-spine.md.
export default function AutomationsTab() {
  const [jobs, setJobs] = useState([])
  const [approvals, setApprovals] = useState([])
  const [job, setJob] = useState('')
  const [focus, setFocus] = useState('')
  const [notes, setNotes] = useState([])
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const [cfg, setCfg] = useState(null)
  const [executor, setExecutor] = useState('claude')

  const loadApprovals = useCallback(() => {
    fetch('/api/approvals').then((r) => r.json()).then(setApprovals).catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/forge/jobs')
      .then((r) => r.json())
      .then((j) => {
        setJobs(j)
        setJob((j.find((x) => x.status === 'active') || j[0] || {}).id || '')
      })
      .catch(() => {})
    fetch('/api/forge/config').then((r) => r.json()).then(setCfg).catch(() => {})
    Promise.all([
      fetch('/api/notes-by-type?type=product').then((r) => r.json()).catch(() => []),
      fetch('/api/notes-by-type?type=idea').then((r) => r.json()).catch(() => []),
    ]).then(([a, b]) => setNotes([...(a || []), ...(b || [])]))
    loadApprovals()
    const t = setInterval(loadApprovals, POLL_MS)
    return () => clearInterval(t)
  }, [loadApprovals])

  const activeJob = jobs.find((j) => j.id === job)

  const run = async () => {
    if (!focus) return setMsg('⚠ Pick a focus note first.')
    setBusy(true)
    setMsg(null)
    try {
      const r = await (
        await fetch('/api/forge/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job, focus, executor }),
        })
      ).json()
      setMsg(r.error ? `⚠ ${r.error}` : `🔨 ${r.launched} — a Forge session opened. Its draft appears below when done.`)
    } catch (e) {
      setMsg(`⚠ ${e}`)
    } finally {
      setBusy(false)
    }
  }

  const decide = async (id, decision) => {
    await fetch('/api/approvals/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, decision }),
    })
    loadApprovals()
  }

  const pending = approvals.filter((a) => a.status === 'pending')
  const settled = approvals.filter((a) => a.status !== 'pending')

  return (
    <div className="tab-pad automations">
      <section className="forge-launcher">
        <h2>🔨 Run a Forge</h2>
        <p className="muted">
          Kick off an automation. It works autonomously and drops a draft in the inbox below —
          only spending money ever needs your click.
        </p>
        <div className="forge-controls">
          <select value={job} onChange={(e) => setJob(e.target.value)}>
            {jobs.map((j) => (
              <option key={j.id} value={j.id} disabled={j.status !== 'active'}>
                {j.name}
                {j.status !== 'active' ? ' (soon)' : ''}
              </option>
            ))}
          </select>
          <input
            list="forge-notes"
            placeholder={activeJob ? `Focus note — ${activeJob.focus}` : 'Focus note (vault path)'}
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          />
          <datalist id="forge-notes">
            {notes.map((n) => (
              <option key={n.path} value={n.path}>
                {n.name}
              </option>
            ))}
          </datalist>
          <button className="tab active" onClick={run} disabled={busy || activeJob?.status !== 'active'}>
            {busy ? 'Launching…' : 'Run'}
          </button>
        </div>
        <div className="forge-executor">
          <span className="muted">Engine:</span>
          <button className={executor === 'claude' ? 'tab active' : 'tab'} onClick={() => setExecutor('claude')}>
            Solo Claude
          </button>
          <button className={executor === 'swarm' ? 'tab active' : 'tab'} onClick={() => setExecutor('swarm')}>
            Swarm (ruflo)
          </button>
          <span className="muted">
            {executor === 'swarm'
              ? 'Autonomous multi-agent hive — opens a visible terminal to watch the first runs.'
              : 'One focused Claude session. Reliable default.'}
          </span>
        </div>
        {msg && <p className="forge-msg">{msg}</p>}
        {cfg && (
          <p className="forge-brains">
            {cfg.geminiReady
              ? `⚡ Bulk tier: Gemini ready (${cfg.model || 'gemini'}) · hard reasoning: Claude`
              : '⚙ Claude-only — add a Gemini key to ~/.vibe-trading/.env for the cheap bulk tier'}
          </p>
        )}
      </section>

      <section className="approval-inbox">
        <h2>
          📥 Approval inbox {pending.length > 0 && <span className="hits">{pending.length}</span>}
        </h2>
        {pending.length === 0 ? (
          <p className="muted">Nothing waiting. Drafts the Forge finishes show up here.</p>
        ) : (
          pending.map((a) => (
            <div key={a.id} className={a.gate === 'money' ? 'approval money' : 'approval'}>
              <div className="approval-head">
                <strong>{a.name}</strong>
                {a.gate === 'money' ? (
                  <span className="badge money">💵 needs money OK{a.cost ? ` — ${a.cost}` : ''}</span>
                ) : (
                  <span className="badge">review</span>
                )}
              </div>
              {a.summary && <p className="muted approval-summary">{a.summary}</p>}
              {a.draft && <p className="muted">Draft: {a.draft}</p>}
              <div className="approval-actions">
                <button className="tab active" onClick={() => decide(a.id, 'approve')}>
                  {a.gate === 'money' ? 'Approve spend' : 'Approve'}
                </button>
                <button className="tab" onClick={() => decide(a.id, 'reject')}>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
        {settled.length > 0 && (
          <details className="settled">
            <summary className="muted">{settled.length} settled</summary>
            {settled.map((a) => (
              <div key={a.id} className="settled-row">
                {a.status === 'approved' ? '✅' : '🚫'} {a.name}
              </div>
            ))}
          </details>
        )}
      </section>
    </div>
  )
}
