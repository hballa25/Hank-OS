import React, { useEffect, useState, useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { marked } from 'marked'
import { fetchNote, saveNote } from '../api.js'

// render wikilinks as clickable spans in preview
function renderMd(src, onWikilink) {
  const html = marked.parse(
    src.replace(/\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g, (_, t, alias) =>
      `<span class="wikilink" data-target="${t.trim()}">${alias || t.trim()}</span>`
    )
  )
  return html
}

export default function NotePanel({ path, graph, onClose, onOpenByName, onSaved }) {
  const [content, setContent] = useState('')
  const [mode, setMode] = useState('preview')
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState('')

  const [relatedNotes, setRelatedNotes] = useState([])

  useEffect(() => {
    setStatus('')
    setDirty(false)
    setMode('preview')
    setRelatedNotes([])
    fetchNote(path).then((r) => setContent(r.content ?? `*(error: ${r.error})*`))
    if (!path.startsWith('src:'))
      fetch(`/api/related?p=${encodeURIComponent(path)}`)
        .then((r) => r.json())
        .then((r) => setRelatedNotes(r.related || []))
        .catch(() => {})
  }, [path])

  const connections = useMemo(() => {
    const out = []
    for (const l of graph.links) {
      const s = typeof l.source === 'object' ? l.source.id : l.source
      const t = typeof l.target === 'object' ? l.target.id : l.target
      if (s === path) out.push({ id: t, dir: '→' })
      else if (t === path) out.push({ id: s, dir: '←' })
    }
    const nameOf = (id) => graph.nodes.find((n) => n.id === id)?.name || id
    return out.map((c) => ({ ...c, name: nameOf(c.id) }))
  }, [graph, path])

  const save = async () => {
    const r = await saveNote(path, content)
    if (r.ok) {
      setDirty(false)
      setStatus('saved ✓')
      onSaved?.()
    } else setStatus(`error: ${r.error}`)
  }

  const name = path.split('/').pop().replace(/\.md$/, '')

  return (
    <div className="note-panel">
      <div className="note-head">
        <div>
          <h2>{name}</h2>
          <span className="note-path">{path}</span>
        </div>
        <div className="note-actions">
          {!path.startsWith('src:') && (
          <button
            title="Assemble a context pack (this note + all connections) and get a Claude Code command"
            onClick={async () => {
              const r = await (
                await fetch('/api/context-pack', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ path }),
                })
              ).json()
              if (r.ok) {
                try { await navigator.clipboard.writeText(r.command) } catch { /* clipboard blocked */ }
                setStatus(`context pack ready (${r.neighbors} connections) — command copied: ${r.command}`)
              } else setStatus(`error: ${r.error}`)
            }}
          >
            🚀 Deploy
          </button>
          )}
          {!path.startsWith('src:') && (
            <>
              <button onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}>
                {mode === 'edit' ? 'Preview' : 'Edit'}
              </button>
              <button onClick={save} disabled={!dirty} className={dirty ? 'primary' : ''}>
                Save
              </button>
            </>
          )}
          <button onClick={onClose}>✕</button>
        </div>
      </div>
      {status && <div className="note-status">{status}</div>}
      <div className="note-body">
        {mode === 'edit' ? (
          <CodeMirror
            value={content}
            theme="dark"
            extensions={[markdown()]}
            onChange={(v) => {
              setContent(v)
              setDirty(true)
            }}
            height="100%"
          />
        ) : (
          <div
            className="md-preview"
            dangerouslySetInnerHTML={{ __html: renderMd(content) }}
            onClick={(e) => {
              const t = e.target.closest('.wikilink')
              if (t) onOpenByName(t.dataset.target)
            }}
          />
        )}
      </div>
      {relatedNotes.length > 0 && (
        <div className="note-connections">
          <h3>Related (by meaning)</h3>
          {relatedNotes.map((r, i) => (
            <button key={i} className="conn" onClick={() => onOpenByName(r.name)} title={`similarity ${r.score}`}>
              ≈ {r.name}
            </button>
          ))}
        </div>
      )}
      {connections.length > 0 && (
        <div className="note-connections">
          <h3>Connections</h3>
          {connections.map((c, i) => (
            <button key={i} className="conn" onClick={() => onOpenByName(c.name)}>
              {c.dir} {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
