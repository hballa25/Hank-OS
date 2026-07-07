import React, { useState } from 'react'

const QUICK = [
  { label: 'TradingView', url: 'https://www.tradingview.com/chart/?symbol=CME_MINI%3AMES1%21' },
  { label: 'Canva', url: 'https://www.canva.com' },
  { label: 'Gmail', url: 'https://mail.google.com' },
  { label: 'Drive', url: 'https://drive.google.com' },
  { label: 'GitHub', url: 'https://github.com/hballa25' },
  { label: 'TPT', url: 'https://www.teacherspayteachers.com' },
]

export default function BrowserTab() {
  const [url, setUrl] = useState('')
  const [current, setCurrent] = useState('')

  const go = (e) => {
    e?.preventDefault()
    let u = url.trim()
    if (!u) return
    if (!/^https?:\/\//.test(u)) u = 'https://' + u
    setCurrent(u)
    setUrl(u)
  }

  return (
    <div className="browser-tab">
      <div className="browser-bar">
        <form onSubmit={go} style={{ flex: 1, display: 'flex', gap: 6 }}>
          <input placeholder="Enter a URL…" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button className="primary-btn small">Go</button>
        </form>
        {QUICK.map((q, i) => (
          <button key={i} className="conn" onClick={() => { setUrl(q.url); setCurrent(q.url) }}>{q.label}</button>
        ))}
        {current && (
          <a className="conn" href={current} target="_blank" rel="noreferrer">↗ pop out</a>
        )}
      </div>
      {current ? (
        <iframe title="browser" src={current} className="browser-frame" />
      ) : (
        <div className="tab-pad muted">
          Pick a quick link or enter a URL. Heads-up: some sites (Gmail, Canva) refuse to load inside other apps —
          use <b>↗ pop out</b> for those. TradingView charts and most reference sites embed fine.
        </div>
      )}
    </div>
  )
}
