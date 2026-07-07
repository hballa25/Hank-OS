import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { walkVault } from './vaultParser.js'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_FILE = path.resolve(__dirname, '..', '.semantic-cache.json')

let extractor = null
let index = [] // [{path, name, section, text, vec}]
let ready = false

async function getExtractor() {
  if (!extractor) {
    const { pipeline } = await import('@xenova/transformers')
    // all-MiniLM-L6-v2: 25MB, runs on CPU, downloads once then cached locally
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractor
}

async function embed(text) {
  const ex = await getExtractor()
  const out = await ex(text.slice(0, 2000), { pooling: 'mean', normalize: true })
  return Array.from(out.data)
}

function chunkNote(name, body) {
  if (body.length < 1800) return [{ section: '', text: `${name}\n${body}` }]
  return body
    .split(/\n(?=## )/)
    .filter((s) => s.trim().length > 40)
    .map((s) => ({ section: s.match(/^## (.+)/)?.[1] || '', text: `${name}\n${s.slice(0, 2000)}` }))
}

// Vault-only index. Student notes are excluded — /api/ask sends retrieved text to
// Claude (a cloud call), and student-identifiable data never goes to cloud AI.
export async function buildIndex(vaultDir) {
  let cache = {}
  try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) } catch { /* first run */ }
  const nextCache = {}
  const nextIndex = []

  for (const file of walkVault(vaultDir)) {
    const rel = path.relative(vaultDir, file).replace(/\\/g, '/')
    const mtime = fs.statSync(file).mtimeMs
    const raw = fs.readFileSync(file, 'utf-8')
    let fm = {}, body = raw
    try { const p = matter(raw); fm = p.data || {}; body = p.content } catch { /* use raw */ }
    if (fm.type === 'student') continue // hard privacy rule

    if (cache[rel]?.mtime === mtime) {
      nextCache[rel] = cache[rel]
      nextIndex.push(...cache[rel].chunks.map((c) => ({ path: rel, name: path.basename(rel, '.md'), ...c })))
      continue
    }
    const chunks = []
    for (const c of chunkNote(path.basename(rel, '.md'), body)) {
      chunks.push({ ...c, vec: await embed(c.text) })
    }
    nextCache[rel] = { mtime, chunks }
    nextIndex.push(...chunks.map((c) => ({ path: rel, name: path.basename(rel, '.md'), ...c })))
  }

  fs.writeFileSync(CACHE_FILE, JSON.stringify(nextCache))
  index = nextIndex
  ready = true
  return index.length
}

function cosine(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s // vectors are normalized
}

export function isReady() {
  return ready
}

export async function search(query, k = 6) {
  if (!ready) throw new Error('semantic index still building — try again in a minute')
  const qv = await embed(query)
  return index
    .map((c) => ({ ...c, score: cosine(qv, c.vec) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k)
    .map(({ vec, ...rest }) => rest)
}

export function related(notePath, k = 5) {
  if (!ready) return []
  const own = index.filter((c) => c.path === notePath)
  if (!own.length) return []
  const scores = new Map()
  for (const c of index) {
    if (c.path === notePath) continue
    const best = Math.max(...own.map((o) => cosine(o.vec, c.vec)))
    if (!scores.has(c.path) || best > scores.get(c.path)) scores.set(c.path, best)
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([p, score]) => ({ path: p, name: path.basename(p, '.md'), score: Math.round(score * 100) / 100 }))
}
