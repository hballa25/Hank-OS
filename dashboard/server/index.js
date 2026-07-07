import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildGraph, listByType } from './vaultParser.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VAULT = path.resolve(__dirname, '..', '..', 'vault')
const PORT = 5175

const app = express()
app.use(express.json({ limit: '5mb' }))

// resolve a client-supplied relative path safely inside the vault
function vaultPath(rel) {
  const full = path.resolve(VAULT, rel)
  if (!full.startsWith(VAULT)) throw new Error('path escapes vault')
  return full
}

app.get('/api/graph', (req, res) => {
  res.json(buildGraph(VAULT))
})

app.get('/api/note', (req, res) => {
  try {
    const full = vaultPath(req.query.p)
    res.json({ path: req.query.p, content: fs.readFileSync(full, 'utf-8') })
  } catch (e) {
    res.status(404).json({ error: String(e.message || e) })
  }
})

app.put('/api/note', (req, res) => {
  try {
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

// serve the built frontend when present (production mode)
const dist = path.resolve(__dirname, '..', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.listen(PORT, () => console.log(`Hank OS vault API on http://localhost:${PORT} (vault: ${VAULT})`))
