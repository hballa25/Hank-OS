import React, { useEffect, useMemo, useState, useCallback } from 'react'
import Graph3D from './components/Graph3D.jsx'
import NotePanel from './components/NotePanel.jsx'
import FinanceTab from './components/FinanceTab.jsx'
import HealthTab from './components/HealthTab.jsx'
import { fetchGraph } from './api.js'
import { DOMAIN_COLORS, DOMAIN_LABELS } from './constants.js'

const TABS = ['Galaxy', 'Finance', 'Health']

export default function App() {
  const [graph, setGraph] = useState(null)
  const [tab, setTab] = useState('Galaxy')
  const [activeDomains, setActiveDomains] = useState(new Set(Object.keys(DOMAIN_COLORS)))
  const [query, setQuery] = useState('')
  const [openNote, setOpenNote] = useState(null)
  const [flyToId, setFlyToId] = useState(null)

  const load = useCallback(() => fetchGraph().then(setGraph), [])
  useEffect(() => {
    load()
  }, [load])

  const highlightIds = useMemo(() => {
    if (!graph || !query.trim()) return new Set()
    const q = query.trim().toLowerCase()
    return new Set(graph.nodes.filter((n) => n.name.toLowerCase().includes(q)).map((n) => n.id))
  }, [graph, query])

  const onCommand = (e) => {
    e.preventDefault()
    if (!graph) return
    const first = graph.nodes.find((n) => highlightIds.has(n.id))
    if (first) {
      setFlyToId(null)
      requestAnimationFrame(() => setFlyToId(first.id))
    }
  }

  const openByName = (name) => {
    const node = graph?.nodes.find((n) => n.name.toLowerCase() === name.toLowerCase())
    if (node) {
      setOpenNote(node.id)
      setFlyToId(null)
      requestAnimationFrame(() => setFlyToId(node.id))
    }
  }

  const toggleDomain = (d) => {
    setActiveDomains((prev) => {
      const next = new Set(prev)
      next.has(d) ? next.delete(d) : next.add(d)
      return next
    })
  }

  return (
    <div className="app">
      <header>
        <h1>
          HANK<span className="accent">OS</span>
        </h1>
        <nav>
          {TABS.map((t) => (
            <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
        <form className="command-bar" onSubmit={onCommand}>
          <input
            placeholder="⌘ Find in the galaxy… (Enter to fly)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && highlightIds.size > 0 && <span className="hits">{highlightIds.size}</span>}
        </form>
        {tab === 'Galaxy' && (
          <div className="domain-toggles">
            {Object.keys(DOMAIN_COLORS).map((d) => (
              <button
                key={d}
                className={activeDomains.has(d) ? 'domain on' : 'domain'}
                style={{ '--c': DOMAIN_COLORS[d] }}
                onClick={() => toggleDomain(d)}
                title={`Toggle ${DOMAIN_LABELS[d]}`}
              >
                {DOMAIN_LABELS[d]}
              </button>
            ))}
          </div>
        )}
      </header>

      <main>
        {!graph ? (
          <div className="tab-pad">Waking the brain…</div>
        ) : tab === 'Galaxy' ? (
          <Graph3D
            graph={graph}
            activeDomains={activeDomains}
            highlightIds={highlightIds}
            onNodeClick={(n) => setOpenNote(n.id)}
            flyToId={flyToId}
          />
        ) : tab === 'Finance' ? (
          <FinanceTab />
        ) : (
          <HealthTab />
        )}
        {openNote && graph && (
          <NotePanel
            path={openNote}
            graph={graph}
            onClose={() => setOpenNote(null)}
            onOpenByName={openByName}
            onSaved={load}
          />
        )}
      </main>
    </div>
  )
}
