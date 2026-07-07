import React, { useEffect, useMemo, useState, useCallback } from 'react'
import Graph3D from './components/Graph3D.jsx'
import VoiceButton from './components/VoiceButton.jsx'
import ConnectionsTab from './components/ConnectionsTab.jsx'
import ClaudeTab from './components/ClaudeTab.jsx'
import BrowserTab from './components/BrowserTab.jsx'
import AskPanel from './components/AskPanel.jsx'
import { saveNote } from './api.js'
import NotePanel from './components/NotePanel.jsx'
import FinanceTab from './components/FinanceTab.jsx'
import HealthTab from './components/HealthTab.jsx'
import { fetchGraph } from './api.js'
import { DOMAIN_COLORS, DOMAIN_LABELS, colorFor } from './constants.js'

const TABS = ['Galaxy', 'Finance', 'Health', 'Connections', 'Claude', 'Browser']

export default function App() {
  const [graph, setGraph] = useState(null)
  const [tab, setTab] = useState('Galaxy')
  const [activeDomains, setActiveDomains] = useState(new Set(Object.keys(DOMAIN_COLORS)))
  const [query, setQuery] = useState('')
  const [openNote, setOpenNote] = useState(null)
  const [flyToId, setFlyToId] = useState(null)
  const [gaps, setGaps] = useState(null)
  const [ask, setAsk] = useState(null)

  const askBrain = async (question, speak = false) => {
    setAsk({ question, loading: true })
    try {
      const r = await (
        await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        })
      ).json()
      if (r.error) return setAsk({ question, error: r.error })
      setAsk({ question, answer: r.answer, sources: r.sources })
      if (speak && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(r.answer.replace(/[*_#`\[\]]/g, '').slice(0, 600))
        u.rate = 1.05
        speechSynthesis.speak(u)
      }
    } catch (e) {
      setAsk({ question, error: String(e) })
    }
  }

  const load = useCallback(() => fetchGraph().then(setGraph), [])
  useEffect(() => {
    load()
  }, [load])

  // domains are dynamic: vault folders + whatever sources.json connects
  const domains = useMemo(() => {
    if (!graph) return Object.keys(DOMAIN_COLORS)
    const known = Object.keys(DOMAIN_COLORS)
    const all = [...new Set(graph.nodes.map((n) => n.domain))]
    return [...known.filter((d) => all.includes(d)), ...all.filter((d) => !known.includes(d)).sort()]
  }, [graph])

  useEffect(() => {
    if (graph) setActiveDomains(new Set(domains))
  }, [graph, domains])

  const highlightIds = useMemo(() => {
    if (!graph || !query.trim()) return new Set()
    const q = query.trim().toLowerCase()
    return new Set(graph.nodes.filter((n) => n.name.toLowerCase().includes(q)).map((n) => n.id))
  }, [graph, query])

  const onCommand = (e) => {
    e.preventDefault()
    if (query.trim().endsWith('?')) return askBrain(query.trim()) // "?" = ask the brain
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
        <button
          className="mic"
          title="New note — created in the Inbox; the Gardener files it, or move it yourself"
          onClick={async () => {
            const title = window.prompt('New note title:')
            if (!title) return
            const p = `00 Inbox/${title.replace(/[<>:"/\\|?*#]/g, '')}.md`
            await saveNote(p, `# ${title}\n\n`)
            await load()
            setOpenNote(p)
          }}
        >
          ✚
        </button>
        <VoiceButton
          onTab={setTab}
          onAsk={(q) => askBrain(q, true)}
          onFind={(q) => {
            setTab('Galaxy')
            setQuery(q)
            const first = graph?.nodes.find((n) => n.name.toLowerCase().includes(q.toLowerCase()))
            if (first) {
              setFlyToId(null)
              requestAnimationFrame(() => setFlyToId(first.id))
            }
          }}
        />
        {tab === 'Galaxy' && (
          <button
            className={gaps ? 'tab active' : 'tab'}
            title="Find missing bridges between domains"
            onClick={async () => {
              if (gaps) return setGaps(null)
              setGaps(await (await fetch('/api/gaps')).json())
            }}
          >
            🔭 Gaps
          </button>
        )}
        {tab === 'Galaxy' && (
          <div className="domain-toggles">
            {domains.map((d) => (
              <button
                key={d}
                className={activeDomains.has(d) ? 'domain on' : 'domain'}
                style={{ '--c': colorFor(d) }}
                onClick={() => toggleDomain(d)}
                title={`Toggle ${DOMAIN_LABELS[d] || d}`}
              >
                {DOMAIN_LABELS[d] || d}
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
        ) : tab === 'Health' ? (
          <HealthTab />
        ) : tab === 'Connections' ? (
          <ConnectionsTab onGraphChanged={load} />
        ) : tab === 'Claude' ? (
          <ClaudeTab />
        ) : (
          <BrowserTab />
        )}
        {gaps && tab === 'Galaxy' && (
          <div className="gaps-panel">
            <h3>🔭 Structural gaps</h3>
            {gaps.gaps.length === 0 ? (
              <p className="muted">Every domain pair has at least one bridge. Rare air.</p>
            ) : (
              <>
                <p className="muted">Domain pairs with zero connections — each one is a bridge (or a product) waiting to exist:</p>
                {gaps.gaps.map((g, i) => (
                  <div key={i} className="gap-row">{DOMAIN_LABELS[g.a] || g.a} ✕ {DOMAIN_LABELS[g.b] || g.b}</div>
                ))}
              </>
            )}
            {gaps.insular.length > 0 && (
              <>
                <p className="muted">Well-connected notes that never leave their own domain:</p>
                {gaps.insular.map((n, i) => (
                  <button key={i} className="conn" onClick={() => { setOpenNote(n.id); setGaps(null) }}>
                    {n.name} ({DOMAIN_LABELS[n.domain] || n.domain})
                  </button>
                ))}
              </>
            )}
          </div>
        )}
        {ask && (
          <AskPanel ask={ask} onClose={() => setAsk(null)} onOpenNote={(p) => { setOpenNote(p); setAsk(null) }} />
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
