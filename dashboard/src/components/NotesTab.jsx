import React, { useEffect, useMemo, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { marked } from 'marked'
import { fetchNote, saveNote } from '../api.js'

// Obsidian-style workspace: folder tree left, editor right, everything is vault .md
export default function NotesTab() {
  const [tree, setTree] = useState([])
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(null)
  const [content, setContent] = useState('')
  const [dirty, setDirty] = useState(false)
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState('')
  const [collapsed, setCollapsed] = useState(new Set())

  const loadTree = () => fetch('/api/tree').then((r) => r.json()).then(setTree)
  useEffect(() => { loadTree() }, [])

  const openNote = async (p) => {
    if (dirty && !window.confirm('Discard unsaved changes?')) return
    const r = await fetchNote(p)
    setOpen(p)
    setContent(r.content ?? '')
    setDirty(false)
    setStatus('')
  }

  const save = async () => {
    if (!open) return
    const r = await saveNote(open, content)
    setStatus(r.ok ? '✓ saved' : `✗ ${r.error}`)
    if (r.ok) setDirty(false)
  }

  const newNote = async (folder = '00 Inbox') => {
    const title = window.prompt(`New note in ${folder}:`)
    if (!title) return
    const p = `${folder}/${title.replace(/[<>:"/\\|?*#]/g, '')}.md`
    await saveNote(p, `# ${title}\n\n`)
    await loadTree()
    openNote(p)
  }

  // group flat tree into folders
  const grouped = useMemo(() => {
    const dirs = {}
    for (const item of tree) {
      if (item.dir) { dirs[item.path] = dirs[item.path] || []; continue }
      const dir = item.path.includes('/') ? item.path.slice(0, item.path.lastIndexOf('/')) : ''
      ;(dirs[dir] = dirs[dir] || []).push(item.path)
    }
    return Object.entries(dirs)
      .filter(([d, files]) => files.length || d)
      .sort(([a], [b]) => a.localeCompare(b))
  }, [tree])

  const q = filter.toLowerCase()

  return (
    <div className="notes-tab">
      <aside className="notes-side">
        <div className="notes-side-head">
          <input placeholder="Filter notes…" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <button className="primary-btn small" onClick={() => newNote(open ? open.slice(0, open.lastIndexOf('/')) : '00 Inbox')} title="New note in the current folder">＋</button>
        </div>
        {grouped.map(([dir, files]) => {
          const visible = q ? files.filter((f) => f.toLowerCase().includes(q)) : files
          if (q && !visible.length) return null
          const isCollapsed = collapsed.has(dir) && !q
          return (
            <div key={dir || 'root'}>
              <div className="tree-dir" onClick={() => setCollapsed((prev) => { const n = new Set(prev); n.has(dir) ? n.delete(dir) : n.add(dir); return n })}>
                {isCollapsed ? '▸' : '▾'} {dir || 'vault'}
                <span className="tree-count">{files.length}</span>
                <button className="tree-add" title={`New note in ${dir}`} onClick={(e) => { e.stopPropagation(); newNote(dir) }}>＋</button>
              </div>
              {!isCollapsed && visible.map((f) => (
                <div key={f} className={open === f ? 'tree-note active' : 'tree-note'} onClick={() => openNote(f)}>
                  {f.split('/').pop().replace(/\.md$/, '')}
                </div>
              ))}
            </div>
          )
        })}
      </aside>
      <section className="notes-editor">
        {!open ? (
          <div className="tab-pad muted">Pick a note, or ＋ to create one. Everything here is a plain .md file in your vault — Obsidian-compatible forever, no Obsidian required.</div>
        ) : (
          <>
            <div className="notes-editor-head">
              <b>{open.split('/').pop().replace(/\.md$/, '')}</b>
              <span className="note-path">{open}</span>
              <span style={{ flex: 1 }} />
              {status && <span className="note-status">{status}</span>}
              <button className="conn" onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
              <button className={dirty ? 'primary-btn small' : 'conn'} onClick={save}>Save</button>
            </div>
            {preview ? (
              <div className="md-preview notes-preview" dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />
            ) : (
              <CodeMirror
                value={content}
                theme="dark"
                extensions={[markdown()]}
                onChange={(v) => { setContent(v); setDirty(true) }}
                onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save() } }}
                height="100%"
                style={{ flex: 1, overflow: 'auto' }}
              />
            )}
          </>
        )}
      </section>
    </div>
  )
}
