import React, { useEffect, useState } from 'react'
import { marked } from 'marked'
import { fetchByType } from '../api.js'

function LevelLadder({ levels }) {
  const parsed = levels
    .map((l) => {
      const m = String(l).match(/([\d,]+(?:\.\d+)?)/)
      return m ? { price: parseFloat(m[1].replace(/,/g, '')), label: String(l) } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.price - a.price)
  if (parsed.length < 2) return null
  const max = parsed[0].price
  const min = parsed[parsed.length - 1].price
  const span = max - min || 1
  return (
    <div className="ladder">
      {parsed.map((p, i) => (
        <div key={i} className="ladder-row" style={{ top: `${((max - p.price) / span) * 100}%` }}>
          <span className="ladder-price">{p.price}</span>
          <span className="ladder-line" />
          <span className="ladder-label">{p.label.replace(String(p.price), '').replace(/^[\s—–:-]+/, '')}</span>
        </div>
      ))}
    </div>
  )
}

export default function FinanceTab() {
  const [plans, setPlans] = useState(null)
  useEffect(() => {
    fetchByType('trading-plan').then(setPlans)
  }, [])

  if (!plans) return <div className="tab-pad">Loading…</div>
  if (plans.length === 0)
    return (
      <div className="tab-pad">
        <h2>💹 Finance</h2>
        <p>
          No trading plans yet. The Trader writes the first one on the next market weekday at 8:32 AM —
          it lands in <code>50 Finance/Daily Plans/</code> and renders here.
        </p>
        <p>
          Rules of engagement live in <b>Trading Goals</b> and <b>Strategy Playbook</b> (Galaxy tab →
          Finance cluster). Paper phase: profitable month + zero violations before any real dollar.
        </p>
      </div>
    )

  const latest = plans[0]
  const levels = latest.frontmatter['key-levels'] || []
  return (
    <div className="tab-pad finance">
      <h2>💹 {latest.name}</h2>
      <div className="finance-grid">
        <div className="md-preview" dangerouslySetInnerHTML={{ __html: marked.parse(latest.content) }} />
        {levels.length > 0 && (
          <div className="finance-side">
            <h3>Key levels</h3>
            <LevelLadder levels={levels} />
          </div>
        )}
      </div>
      {plans.length > 1 && (
        <p className="muted">{plans.length - 1} earlier plan(s) in the vault → Galaxy tab, Finance cluster.</p>
      )}
    </div>
  )
}
