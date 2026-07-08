import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { buildGraph, listByType } from './vaultParser.js'
import { buildIndex, search, related, isReady } from './semantic.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VAULT = path.resolve(__dirname, '..', '..', 'vault')
const PORT = 5175

// Load the LLM key the Forge needs from the single gitignored config the user
// edits by hand (~/.vibe-trading/.env). Only the Gemini vars are pulled into this
// process so the server and any agent/ruflo subprocess it spawns inherit them —
// no secret is ever copied into the repo. Existing env wins.
function loadForgeEnv() {
  try {
    const home = process.env.USERPROFILE || process.env.HOME
    const raw = fs.readFileSync(path.join(home, '.vibe-trading', '.env'), 'utf-8')
    for (const key of ['GEMINI_API_KEY', 'GEMINI_BASE_URL', 'LANGCHAIN_MODEL_NAME']) {
      if (process.env[key]) continue
      const m = raw.match(new RegExp('^' + key + '=(.*)$', 'm'))
      if (m && m[1].trim() && !m[1].includes('PASTE_YOUR')) process.env[key] = m[1].trim()
    }
  } catch { /* config not present yet — Forge falls back to Claude-only */ }
}
loadForgeEnv()

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

// Host info — powers the "Connect your phone" helper with the live LAN address
app.get('/api/host-info', async (req, res) => {
  const os = await import('os')
  const ifaces = os.networkInterfaces()
  const lan = []
  let tailscale = null
  for (const addrs of Object.values(ifaces)) {
    for (const a of addrs || []) {
      if (a.family === 'IPv4' && !a.internal) {
        if (a.address.startsWith('100.')) tailscale = a.address
        else lan.push(a.address)
      }
    }
  }
  res.json({ lan, tailscale, port: 5173 })
})

// Notes tab: full vault tree
app.get('/api/tree', (req, res) => {
  const out = []
  const walk = (dir, rel) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue
      const r = rel ? `${rel}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        out.push({ path: r, dir: true })
        walk(path.join(dir, entry.name), r)
      } else if (entry.name.endsWith('.md')) out.push({ path: r, dir: false })
    }
  }
  walk(VAULT, '')
  res.json(out)
})

// Convert engine: external source files → vault .md notes (sortable, linkable, graph citizens)
async function convertFile(full, srcName) {
  const ext = path.extname(full).toLowerCase()
  const base = path.basename(full, ext)
  let md = null
  if (ext === '.md' || ext === '.txt') {
    md = fs.readFileSync(full, 'utf-8')
  } else if (ext === '.docx') {
    const mammoth = (await import('mammoth')).default
    const TurndownService = (await import('turndown')).default
    const { value: html } = await mammoth.convertToHtml({ path: full })
    md = new TurndownService({ headingStyle: 'atx' }).turndown(html)
  } else if (ext === '.pdf') {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(full)) })
    const result = await parser.getText()
    await parser.destroy?.()
    md = result.text.replace(/\n{3,}/g, '\n\n').trim()
  } else if (['.gdoc', '.gsheet', '.gslides', '.gdraw'].includes(ext)) {
    let url = ''
    try { url = JSON.parse(fs.readFileSync(full, 'utf-8')).url || '' } catch { /* opaque shortcut */ }
    md = `Google-native file — content lives in Drive.\n\n[Open in Drive](${url})`
  } else {
    md = `External file (${ext || 'no extension'}).\n\n**Local path:** \`${full}\``
  }
  const safeName = base.replace(/[<>:"/\\|?*#]/g, '').slice(0, 90)
  const rel = `70 Imports/${srcName}/${safeName}.md`
  const out = vaultPath(rel)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, `---\ntype: import\nsource: "${srcName}"\noriginal: "${full.replace(/\\/g, '/')}"\nconverted: ${new Date().toISOString()}\n---\n\n# ${base}\n\n${md.slice(0, 60000)}\n`, 'utf-8')
  return rel
}

app.post('/api/convert', async (req, res) => {
  try {
    const full = sourceFilePath(req.body.id)
    if (!full || !fs.existsSync(full)) throw new Error('source file not found')
    const srcName = req.body.id.match(/^src:([^/]+)\//)[1]
    res.json({ ok: true, path: await convertFile(full, srcName) })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

app.post('/api/convert-source', async (req, res) => {
  try {
    const src = loadSources().find((s) => s.name === req.body.name)
    if (!src) throw new Error('unknown source')
    const g = buildGraph(VAULT, [src])
    const CONVERTIBLE = ['.md', '.txt', '.docx', '.pdf', '.gdoc', '.gsheet', '.gslides']
    const targets = g.nodes
      .filter((n) => n.external && n.localPath && CONVERTIBLE.includes(path.extname(n.localPath).toLowerCase()))
      .slice(0, 30) // cap per run — click again for the next batch
    const done = [], failed = []
    for (const t of targets) {
      const rel = `70 Imports/${src.name}/${path.basename(t.localPath, path.extname(t.localPath)).replace(/[<>:"/\\|?*#]/g, '').slice(0, 90)}.md`
      if (fs.existsSync(vaultPath(rel))) continue // already converted
      try { done.push(await convertFile(t.localPath, src.name)) } catch (e) { failed.push(t.name) }
    }
    res.json({ ok: true, converted: done.length, failed })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
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

// ── The Forge: automation spine (jobs + approval inbox) ──────────────────────
// See vault/90 System/automation-spine.md. Every trigger (button/voice/schedule)
// lands here; a job runs, writes drafts + an approval item, and the dashboard
// surfaces it. Only 'money'-gate items wait for a human click.
const FORGE_JOBS = [
  { id: 'workbook', name: 'Workbook Forge', spec: '90 System/agents/workbook-forge.md', focus: 'an AI Workbooks idea/product note', status: 'active' },
  { id: 'app-copilot', name: 'App Copilot', spec: '90 System/agents/forge.md', focus: 'a TaiGrader / XPScholar issue note', status: 'planned' },
  { id: 'lesson', name: 'Lesson Forge', spec: '90 System/agents/generators.md', focus: 'a lesson or unit note', status: 'planned' },
]
const APPROVALS_DIR = path.join(VAULT, '90 System', 'approvals')

app.get('/api/forge/jobs', (req, res) => res.json(FORGE_JOBS))

// Forge config status — booleans + model only, never the key itself.
app.get('/api/forge/config', (req, res) => {
  res.json({
    geminiReady: !!process.env.GEMINI_API_KEY,
    model: process.env.LANGCHAIN_MODEL_NAME || null,
  })
})

app.get('/api/approvals', (req, res) => {
  if (!fs.existsSync(APPROVALS_DIR)) return res.json([])
  const items = fs.readdirSync(APPROVALS_DIR)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .map((f) => {
      const full = path.join(APPROVALS_DIR, f)
      let data = {}, content = ''
      try { const p = matter(fs.readFileSync(full, 'utf-8')); data = p.data || {}; content = p.content } catch { /* skip bad frontmatter */ }
      return {
        id: f,
        name: f.replace(/\.md$/, ''),
        job: data.job || '',
        status: data.status || 'pending',
        gate: data.gate || 'review',
        draft: data.draft || '',
        cost: data.cost || '',
        summary: content.trim().slice(0, 500),
        mtime: fs.statSync(full).mtimeMs,
      }
    })
    .sort((a, b) => b.mtime - a.mtime)
  res.json(items)
})

app.post('/api/approvals/decision', (req, res) => {
  try {
    const { id, decision } = req.body
    if (!['approve', 'reject'].includes(decision)) throw new Error('decision must be approve or reject')
    const full = vaultPath(`90 System/approvals/${id}`)
    if (!fs.existsSync(full)) throw new Error('approval item not found')
    const status = decision === 'approve' ? 'approved' : 'rejected'
    let raw = fs.readFileSync(full, 'utf-8')
    raw = /^status:/m.test(raw)
      ? raw.replace(/^status:.*$/m, `status: ${status}`)
      : raw.replace(/^---\n/, `---\nstatus: ${status}\n`)
    fs.writeFileSync(full, raw, 'utf-8')
    res.json({ ok: true, status })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
})

// Run a Forge job. v1 launches a seeded Claude Code session (visible terminal —
// the same trusted path as /api/launch-claude) primed with the Forge + job spec
// and the focus note; it writes drafts + an approval item back into the vault.
// (Next: headless ruflo swarm once presets + the Gemini bulk key are set — see
// automation-spine.md. Kept as a visible launch, not a hidden LAN-exposed writer.)
app.post('/api/forge/run', async (req, res) => {
  try {
    const { job, focus, executor = 'claude' } = req.body
    const def = FORGE_JOBS.find((j) => j.id === job)
    if (!def) throw new Error(`unknown job: ${job}`)
    if (def.status !== 'active') throw new Error(`${def.name} is not active yet`)
    if (!['claude', 'swarm'].includes(executor)) throw new Error(`unknown executor: ${executor}`)
    if (!focus) throw new Error('a focus note is required')
    if (!fs.existsSync(vaultPath(focus))) throw new Error(`focus note not found: ${focus}`)
    const { spawn } = await import('child_process')
    const root = path.resolve(VAULT, '..')
    // absolute paths so a swarm worker (cwd = .forge-runtime) still finds the vault
    const objective = `You are The Forge (Hank OS). Work in the Hank OS repo at '${root}'. Read '${root}/vault/90 System/agents/forge.md' and '${root}/vault/${def.spec}', then run the '${job}' job on focus note '${root}/vault/${focus}' and its 1-hop context. Produce DRAFTS in the vault, write an approval item to '${root}/vault/90 System/approvals/', and obey every CLAUDE.md guardrail: never spend money without the one-button confirm, never put student-identifiable data in a cloud call.`
    let args, cwd, label
    if (executor === 'swarm') {
      // ruflo hive-mind (autonomous multi-agent). Reasoning runs on the Claude
      // subscription; bulk on the configured Gemini provider. Visible terminal so
      // the first autonomous runs can be watched. Runs from the contained runtime.
      cwd = path.join(root, '.forge-runtime')
      if (!fs.existsSync(cwd)) throw new Error('swarm runtime not set up (.forge-runtime missing)')
      args = ['/c', 'start', `Forge ${job} (swarm)`, 'cmd', '/k', 'ruflo', 'hive-mind', 'spawn', '--claude', '-n', '4', '-o', objective]
      label = `${def.name} → ${focus} (ruflo swarm)`
    } else {
      // hands-off: auto-approve the (reversible) file writes so the run doesn't
      // stall on prompts. Guardrails live in the objective/CLAUDE.md; only money
      // needs Hank's click, and that's enforced in the approval feed, not here.
      cwd = root
      args = ['/c', 'start', `Forge ${job}`, 'cmd', '/k', 'claude', '--dangerously-skip-permissions', objective]
      label = `${def.name} → ${focus} (solo Claude)`
    }
    spawn('cmd', args, { cwd, detached: true, stdio: 'ignore' }).unref()
    res.json({ ok: true, launched: label })
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) })
  }
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
