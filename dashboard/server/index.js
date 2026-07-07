import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildGraph, listByType } from './vaultParser.js'
import { buildIndex, search, related, isReady } from './semantic.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VAULT = path.resolve(__dirname, '..', '..', 'vault')
const PORT = 5175

const app = express()
app.use(express.json({ limit: '5mb' }))

// external sources registry — edit dashboard/sources.json to connect any local folder
// (incl. Google Drive for Desktop mounts: one entry per Google account)
function loadSources() {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'sources.json'), 'utf-8'))
  } catch {
    return []
  }
}

function sourceFilePath(p) {
  // p looks like "src:<name>/<relpath>"
  const m = p.match(/^src:([^/]+)\/(.+)$/)
  if (!m) return null
  const src = loadSources().find((s) => s.name === m[1])
  if (!src) return null
  const full = path.resolve(src.path, m[2])
  if (!full.startsWith(path.resolve(src.path))) throw new Error('path escapes source')
  return full
}

// resolve a client-supplied relative path safely inside the vault
function vaultPath(rel) {
  const full = path.resolve(VAULT, rel)
  if (!full.startsWith(VAULT)) throw new Error('path escapes vault')
  return full
}

app.get('/api/graph', (req, res) => {
  res.json(buildGraph(VAULT, loadSources()))
})

app.get('/api/note', (req, res) => {
  try {
    const p = req.query.p
    if (p.startsWith('src:')) {
      const full = sourceFilePath(p)
      if (!full) throw new Error('unknown source')
      const content = full.endsWith('.md')
        ? fs.readFileSync(full, 'utf-8')
        : `*(external file — read-only in Hank OS)*\n\n**Local path:** \`${full}\`\n\nOpen it with its native app, or link it from a vault note with a normal markdown link.`
      return res.json({ path: p, content, readOnly: true })
    }
    const full = vaultPath(p)
    res.json({ path: p, content: fs.readFileSync(full, 'utf-8') })
  } catch (e) {
    res.status(404).json({ error: String(e.message || e) })
  }
})

app.put('/api/note', (req, res) => {
  try {
    if (String(req.body.path).startsWith('src:')) throw new Error('external sources are read-only')
    const full = vaultPath(req.body.path)
    if (!full.endsWith('.md')) throw new Error('only .md files')
    fs.mkdirSync(path.dirname(full), { recursive: true })
    fs.writeFileSync(full, req.body.content, 'utf-8')
    res.json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

app.get('/api/notes-by-type', (req, res) => {
  res.json(listByType(VAULT, req.query.type))
})

// Semantic layer: passive related-notes + ask-your-brain (answers via Claude Code, no API key)
app.get('/api/related', (req, res) => {
  res.json({ ready: isReady(), related: isReady() ? related(req.query.p) : [] })
})

app.post('/api/ask', async (req, res) => {
  try {
    const question = (req.body.question || '').trim()
    if (!question) throw new Error('empty question')
    const hits = await search(question, 6)
    const context = hits.map((h) => `--- From "${h.path}" ---\n${h.text}`).join('\n\n')
    const prompt = `You are Hank OS, Henry's second brain, answering from his own notes. Answer the question using ONLY the note excerpts below. Be direct and brief (2-5 sentences), speak like a sharp teammate, and name which note(s) the answer came from. If the notes don't contain the answer, say so plainly.\n\n${context}\n\n--- Question ---\n${question}`
    const { spawn } = await import('child_process')
    // prompt goes via stdin — as an argv it gets mangled by cmd quoting on Windows
    const answer = await new Promise((resolve, reject) => {
      const child = spawn('claude', ['-p'], { cwd: path.resolve(VAULT, '..'), shell: true, timeout: 120000 })
      let out = '', err = ''
      child.stdout.on('data', (d) => (out += d))
      child.stderr.on('data', (d) => (err += d))
      child.on('close', (code) => (code === 0 ? resolve(out.trim()) : reject(new Error(err || `claude exited ${code}`))))
      child.on('error', reject)
      child.stdin.write(prompt)
      child.stdin.end()
    })
    const seen = new Set()
    const sources = hits.filter((h) => !seen.has(h.path) && seen.add(h.path))
      .map((h) => ({ path: h.path, name: h.name, score: Math.round(h.score * 100) / 100 }))
    res.json({ answer, sources })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

// Connections tab: read + add sources without touching JSON by hand
app.get('/api/sources', (req, res) => {
  res.json(loadSources().map((s) => ({ ...s, exists: fs.existsSync(s.path) })))
})

app.post('/api/sources', (req, res) => {
  try {
    const { name, path: srcPath, maxFiles = 150, depth = 2 } = req.body
    if (!name || !srcPath) throw new Error('name and path required')
    if (!fs.existsSync(srcPath)) throw new Error(`path not found: ${srcPath}`)
    const sources = loadSources()
    if (sources.some((s) => s.name === name)) throw new Error(`source "${name}" already exists`)
    sources.push({ name, path: srcPath, maxFiles: Number(maxFiles), depth: Number(depth) })
    fs.writeFileSync(path.resolve(__dirname, '..', 'sources.json'), JSON.stringify(sources, null, 2))
    res.json({ ok: true, sources })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

// Claude tab: list context packs + launch Claude Code on this PC
app.get('/api/context-packs', (req, res) => {
  const dir = path.join(VAULT, '90 System', 'context-packs')
  if (!fs.existsSync(dir)) return res.json([])
  res.json(
    fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
      .map((f) => ({ name: f.replace(/\.md$/, ''), path: `90 System/context-packs/${f}`, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime)
  )
})

app.post('/api/launch-claude', async (req, res) => {
  try {
    const { spawn } = await import('child_process')
    const root = path.resolve(VAULT, '..')
    const prompt = req.body.pack
      ? `Read the context pack at 'vault/${req.body.pack}' and help me build from it.`
      : req.body.prompt || ''
    const args = ['/c', 'start', 'Claude Code', 'cmd', '/k', 'claude']
    if (prompt) args.push(prompt)
    spawn('cmd', args, { cwd: root, detached: true, stdio: 'ignore' }).unref()
    res.json({ ok: true, launched: prompt || '(blank session)' })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

// Voice (or any) capture → timestamped Inbox note; the Gardener files it overnight
app.post('/api/capture', (req, res) => {
  try {
    const text = (req.body.text || '').trim()
    if (!text) throw new Error('empty capture')
    const d = new Date()
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`
    const title = text.split(/\s+/).slice(0, 6).join(' ').replace(/[<>:"/\\|?*#]/g, '')
    const rel = `00 Inbox/${stamp} ${title}.md`
    const body = `---\ncaptured: ${d.toISOString()}\nsource: ${req.body.source || 'voice'}\n---\n\n${text}\n`
    const full = vaultPath(rel)
    fs.mkdirSync(path.dirname(full), { recursive: true })
    fs.writeFileSync(full, body, 'utf-8')
    res.json({ ok: true, path: rel })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

// Assemble a context pack for a note: the note + everything within 1 hop,
// written to 90 System/context-packs/ so a Claude Code session can start with full context.
app.post('/api/context-pack', (req, res) => {
  try {
    const rel = req.body.path
    const g = buildGraph(VAULT)
    const neighbors = new Set()
    for (const l of g.links) {
      if (l.source === rel) neighbors.add(l.target)
      if (l.target === rel) neighbors.add(l.source)
    }
    const read = (p) => fs.readFileSync(vaultPath(p), 'utf-8')
    const name = path.basename(rel, '.md')
    let pack = `# Context Pack: ${name}\n\n*Generated by Hank OS dashboard. Everything Claude Code needs to work on "${name}" — the note plus its direct connections.*\n\n## Focus note: ${rel}\n\n${read(rel)}\n`
    for (const n of neighbors) {
      pack += `\n---\n\n## Connected: ${n}\n\n${read(n)}\n`
    }
    pack += `\n---\n\n*Vault root: ${VAULT} — schema at 90 System/schema.md, index at 90 System/index.md. Follow CLAUDE.md rules.*\n`
    const outRel = `90 System/context-packs/${name}.md`
    const out = vaultPath(outRel)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, pack, 'utf-8')
    res.json({
      ok: true,
      path: outRel,
      neighbors: neighbors.size,
      command: `claude "Read the context pack at 'vault/${outRel}' and help me build from it."`,
    })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

// Gap Finder: domain pairs with zero cross-links + well-connected notes that never leave their domain
app.get('/api/gaps', (req, res) => {
  const g = buildGraph(VAULT)
  const domains = [...new Set(g.nodes.map((n) => n.domain))].filter((d) => d !== '90 System')
  const domainOf = Object.fromEntries(g.nodes.map((n) => [n.id, n.domain]))
  const crossCount = {}
  for (const l of g.links) {
    const a = domainOf[l.source], b = domainOf[l.target]
    if (a !== b) crossCount[[a, b].sort().join('|')] = (crossCount[[a, b].sort().join('|')] || 0) + 1
  }
  const gaps = []
  for (let i = 0; i < domains.length; i++)
    for (let j = i + 1; j < domains.length; j++) {
      const key = [domains[i], domains[j]].sort().join('|')
      if (!crossCount[key]) gaps.push({ a: domains[i], b: domains[j] })
    }
  const insular = g.nodes.filter(
    (n) =>
      n.domain !== '90 System' &&
      n.degree >= 2 &&
      g.links.every((l) => {
        const other = l.source === n.id ? l.target : l.target === n.id ? l.source : null
        return !other || domainOf[other] === n.domain
      })
  )
  res.json({ gaps, insular: insular.map((n) => ({ id: n.id, name: n.name, domain: n.domain, degree: n.degree })) })
})

// serve the built frontend when present (production mode)
const dist = path.resolve(__dirname, '..', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.listen(PORT, () => console.log(`Hank OS vault API on http://localhost:${PORT} (vault: ${VAULT})`))

// build the semantic index in the background (first run downloads the 25MB model)
buildIndex(VAULT)
  .then((n) => console.log(`semantic index ready: ${n} chunks`))
  .catch((e) => console.error('semantic index failed:', e.message))
