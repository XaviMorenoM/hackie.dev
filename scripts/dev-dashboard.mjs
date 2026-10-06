#!/usr/bin/env node
/**
 * hackie.dev dev-dashboard — 0.0.0.0:4399
 *
 * Lists open PRs, finds their local worktrees, and spins up an `astro dev`
 * preview server per branch. Access at http://<hostname>:4399/
 *
 * Always shows "main" as a baseline preview on port 4400.
 * Open PR previews start at 4401+.
 *
 * Restart required after changes (kill process, then: node scripts/dev-dashboard.mjs)
 */

import http from 'node:http'
import os from 'node:os'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const execP = promisify(execFile)
const PORT = 4399
const MAIN_PREVIEW_PORT = 4400
const PR_PREVIEW_START = 4401
// Fallback hostname for log lines; actual preview links use the request's Host header
const HOSTNAME = os.hostname().replace(/\.local$/, '')
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// ─── State ────────────────────────────────────────────────────────────────────

const previews = new Map() // key (branch) → PreviewEntry
const sseClients = new Set()
let nextPort = PR_PREVIEW_START

/** @typedef {{ key: string, label: string, branch: string, worktreePath: string, port: number, status: 'starting'|'ready'|'error'|'no-worktree', prNumber?: number, prTitle?: string, isDraft?: boolean, proc?: import('child_process').ChildProcess }} PreviewEntry */

// ─── Helpers ──────────────────────────────────────────────────────────────────

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  for (const client of sseClients) {
    try { client.write(payload) } catch {}
  }
}

function broadcastState() {
  const state = {}
  for (const [k, v] of previews) {
    // omit proc from the wire payload
    const { proc: _, ...rest } = v
    state[k] = rest
  }
  broadcast('state', state)
}

function previewUrl(port) {
  return `http://${HOSTNAME}:${port}/en/`
}

// ─── Worktree discovery ───────────────────────────────────────────────────────

async function getWorktreeBranchMap() {
  // Returns Map<branch, absPath>
  let out
  try {
    ;({ stdout: out } = await execP('git', ['worktree', 'list', '--porcelain'], { cwd: REPO_ROOT }))
  } catch {
    return new Map()
  }
  const map = new Map()
  const entries = out.trim().split(/\n\n+/)
  for (const entry of entries) {
    const lines = entry.split('\n')
    let wpath = null, branch = null
    for (const line of lines) {
      if (line.startsWith('worktree ')) wpath = line.slice(9).trim()
      if (line.startsWith('branch ')) branch = line.slice(7).trim().replace(/^refs\/heads\//, '')
    }
    if (wpath && branch) map.set(branch, wpath)
  }
  return map
}

// ─── PR discovery ─────────────────────────────────────────────────────────────

async function getOpenPRs() {
  try {
    const { stdout } = await execP('gh', ['pr', 'list', '--json', 'number,title,headRefName,isDraft', '--limit', '50'], { cwd: REPO_ROOT })
    return JSON.parse(stdout)
  } catch {
    return []
  }
}

// ─── Server management ────────────────────────────────────────────────────────

function spawnPreview(entry) {
  if (entry.proc) return // already running
  if (!existsSync(entry.worktreePath)) {
    entry.status = 'no-worktree'
    return
  }
  const nmBin = path.join(entry.worktreePath, 'node_modules/.bin/astro')
  if (!existsSync(nmBin)) {
    // Try running npm install first, non-blocking
    entry.status = 'starting'
    const install = spawn('npm', ['install', '--prefer-offline'], {
      cwd: entry.worktreePath,
      stdio: 'ignore',
      detached: false,
    })
    install.on('close', (code) => {
      if (code === 0) spawnAstro(entry)
      else { entry.status = 'error'; broadcastState() }
    })
    return
  }
  spawnAstro(entry)
}

function spawnAstro(entry) {
  entry.status = 'starting'
  broadcastState()
  const proc = spawn(
    path.join(entry.worktreePath, 'node_modules/.bin/astro'),
    ['dev', '--port', String(entry.port), '--host'],
    {
      cwd: entry.worktreePath,
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false,
    }
  )
  entry.proc = proc

  // Parse actual bound port from Astro's stdout, e.g. "http://localhost:4401/"
  const portRe = /https?:\/\/(?:localhost|0\.0\.0\.0|\[::\]|\S+?):(\d+)/
  const setReady = (actualPort) => {
    if (actualPort && actualPort !== entry.port) {
      console.log(`[dashboard] ${entry.key}: asked for :${entry.port}, got :${actualPort}`)
      entry.port = actualPort
    }
    if (entry.status !== 'ready') {
      entry.status = 'ready'
      broadcastState()
    }
  }

  proc.stdout.on('data', (chunk) => {
    const s = chunk.toString()
    const m = s.match(portRe)
    if (m) setReady(Number(m[1]))
    else if (s.includes('ready') || s.includes('http://')) setReady()
  })
  proc.stderr.on('data', (chunk) => {
    const s = chunk.toString()
    const m = s.match(portRe)
    if (m) setReady(Number(m[1]))
  })
  proc.on('close', (code) => {
    entry.proc = null
    entry.status = code === 0 || code === null ? 'ready' : 'error'
    broadcastState()
  })
  // Optimistically mark ready after 12 seconds if still starting
  setTimeout(() => {
    if (entry.status === 'starting') setReady()
  }, 12000)
}

function stopPreview(entry) {
  if (entry.proc) {
    try { entry.proc.kill('SIGTERM') } catch {}
    entry.proc = null
  }
}

// ─── Sync loop ────────────────────────────────────────────────────────────────

async function syncPreviews() {
  const [prs, wtMap] = await Promise.all([getOpenPRs(), getWorktreeBranchMap()])

  // Always ensure main exists
  if (!previews.has('main')) {
    const mainPath = REPO_ROOT
    const port = MAIN_PREVIEW_PORT
    const entry = {
      key: 'main',
      label: 'main',
      branch: 'main',
      worktreePath: mainPath,
      port,
      status: 'starting',
      prNumber: undefined,
      prTitle: 'Production baseline',
      isDraft: false,
    }
    previews.set('main', entry)
    spawnPreview(entry)
  }

  // Track which PR keys are still open
  const activePRKeys = new Set(['main'])

  for (const pr of prs) {
    const key = `pr-${pr.number}`
    activePRKeys.add(key)

    if (!previews.has(key)) {
      const wtPath = wtMap.get(pr.headRefName)
      const port = nextPort++
      const entry = {
        key,
        label: `PR #${pr.number}`,
        branch: pr.headRefName,
        worktreePath: wtPath || '',
        port,
        status: wtPath ? 'starting' : 'no-worktree',
        prNumber: pr.number,
        prTitle: pr.title,
        isDraft: pr.isDraft,
      }
      previews.set(key, entry)
      if (wtPath) spawnPreview(entry)
    } else {
      // Update title/draft status if changed
      const entry = previews.get(key)
      entry.prTitle = pr.title
      entry.isDraft = pr.isDraft
      // If worktree appeared since last sync
      if (entry.status === 'no-worktree' && wtMap.has(pr.headRefName)) {
        entry.worktreePath = wtMap.get(pr.headRefName)
        spawnPreview(entry)
      }
    }
  }

  // Remove entries for closed/merged PRs
  for (const [key, entry] of previews) {
    if (!activePRKeys.has(key)) {
      stopPreview(entry)
      previews.delete(key)
    }
  }

  broadcastState()
}

// ─── Dashboard HTML ───────────────────────────────────────────────────────────

function renderDashboard(reqHost) {
  // reqHost is e.g. "mac-mini:4399" — strip the port to get the bare hostname
  const clientHost = (reqHost || HOSTNAME).replace(/:\d+$/, '')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>hackie.dev · PR Previews</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  :root {
    --bg: #0B0B0C;
    --surface: rgba(255,255,255,0.05);
    --surface-hover: rgba(255,255,255,0.08);
    --border: rgba(255,255,255,0.08);
    --lime: #A8E63D;
    --text: #E8E8E8;
    --muted: #888;
    --red: #f87171;
    --yellow: #fbbf24;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{min-height:100%;background:var(--bg);color:var(--text);font-family:'Inter',sans-serif}
  header{padding:28px 32px 0;display:flex;align-items:center;gap:12px}
  .dot{width:10px;height:10px;border-radius:50%;background:var(--lime);box-shadow:0 0 10px var(--lime);animation:pulse 2s ease-in-out infinite;flex-shrink:0}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .logo{font-size:15px;font-weight:700;color:var(--lime);letter-spacing:.04em}
  .subtitle{font-size:14px;color:var(--muted)}
  .right{margin-left:auto;display:flex;align-items:center;gap:10px}
  .conn{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)}
  .conn-dot{width:7px;height:7px;border-radius:50%;background:var(--lime)}
  .conn-dot.off{background:var(--red)}
  .divider{height:1px;background:var(--border);margin:20px 32px 0}
  main{padding:28px 32px;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:12px;transition:border-color .2s,background .2s}
  .card:hover{background:var(--surface-hover);border-color:rgba(255,255,255,.14)}
  .card.main-card{border-color:rgba(168,230,61,.18)}
  .card-top{display:flex;align-items:flex-start;gap:10px}
  .pr-badge{background:rgba(168,230,61,.12);color:var(--lime);border:1px solid rgba(168,230,61,.2);border-radius:6px;padding:3px 9px;font-size:12px;font-weight:700;flex-shrink:0;line-height:1.5}
  .pr-badge.main-badge{background:rgba(255,255,255,.08);color:var(--text);border-color:var(--border)}
  .pr-badge.draft{opacity:.6}
  .title{font-size:13px;font-weight:500;line-height:1.45;flex:1;word-break:break-word}
  .branch{font-size:11px;color:var(--muted);font-family:monospace;margin-top:2px}
  .status-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .status-pill{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600}
  .status-pill.ready{background:rgba(110,231,183,.12);color:#6ee7b7;border:1px solid rgba(110,231,183,.25)}
  .status-pill.starting{background:rgba(251,191,36,.1);color:var(--yellow);border:1px solid rgba(251,191,36,.2)}
  .status-pill.error{background:rgba(248,113,113,.1);color:var(--red);border:1px solid rgba(248,113,113,.2)}
  .status-pill.no-worktree{background:rgba(255,255,255,.05);color:var(--muted);border:1px solid var(--border)}
  .spin{display:inline-block;animation:spin .8s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .preview-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 13px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:var(--text);text-decoration:none;transition:background .15s,border-color .15s}
  .preview-btn:hover{background:rgba(255,255,255,.13);border-color:rgba(255,255,255,.22)}
  .preview-btn.disabled{opacity:.4;pointer-events:none}
  .empty{text-align:center;padding:60px 32px;color:var(--muted);font-size:14px}
  footer{padding:16px 32px;font-size:11px;color:var(--muted);border-top:1px solid var(--border);text-align:center}
  .hostname{font-family:monospace;color:var(--text)}
</style>
</head>
<body>
<header>
  <div class="dot"></div>
  <span class="logo">hackie.dev</span>
  <span class="subtitle">PR Previews</span>
  <div class="right">
    <div class="conn"><div class="conn-dot off" id="conn-dot"></div><span id="conn-label">Connecting…</span></div>
  </div>
</header>
<div class="divider"></div>
<main id="board"><div class="empty">Loading previews…</div></main>
<footer>Running on <span class="hostname">${clientHost}:${PORT}</span> · previews at <span class="hostname">${clientHost}:4400+</span></footer>

<script>
const HOSTNAME = ${JSON.stringify(clientHost)}
let state = {}

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

function statusPill(s){
  if(s==='ready') return '<span class="status-pill ready">● Ready</span>'
  if(s==='starting') return '<span class="status-pill starting"><span class="spin">↻</span> Starting…</span>'
  if(s==='error') return '<span class="status-pill error">✕ Error</span>'
  return '<span class="status-pill no-worktree">No local worktree</span>'
}

function previewUrl(port){ return 'http://'+HOSTNAME+':'+port+'/en/' }

function renderCard(v){
  const isMain = v.key === 'main'
  const canPreview = v.status === 'ready' || v.status === 'starting'
  const badge = isMain
    ? '<span class="pr-badge main-badge">main</span>'
    : '<span class="pr-badge'+(v.isDraft?' draft':'')+'">PR #'+esc(v.prNumber)+(v.isDraft?' · draft':'')+' </span>'
  const previewBtn = canPreview
    ? '<a class="preview-btn" href="'+previewUrl(v.port)+'" target="_blank">↗ :'+v.port+'</a>'
    : '<a class="preview-btn disabled" href="#">↗ :'+v.port+'</a>'
  return '<div class="card'+(isMain?' main-card':'')+'" id="card-'+CSS.escape(v.key)+'">'+
    '<div class="card-top">'+badge+'<div><div class="title">'+esc(v.prTitle||v.label)+'</div>'+
    '<div class="branch">'+esc(v.branch)+'</div></div></div>'+
    '<div class="status-row">'+statusPill(v.status)+previewBtn+'</div>'+
    '</div>'
}

function renderBoard(){
  const entries = Object.values(state).sort((a,b)=>{
    if(a.key==='main') return -1
    if(b.key==='main') return 1
    return (a.prNumber||0)-(b.prNumber||0)
  })
  const board = document.getElementById('board')
  if(entries.length===0){ board.innerHTML='<div class="empty">No open PRs</div>'; return }
  board.innerHTML = entries.map(renderCard).join('')
}

const connDot = document.getElementById('conn-dot')
const connLabel = document.getElementById('conn-label')
function setConn(ok){ connDot.className='conn-dot'+(ok?'':' off'); connLabel.textContent=ok?'Live':'Reconnecting…' }

function connect(){
  const es = new EventSource('/events')
  es.addEventListener('state', e=>{ state=JSON.parse(e.data); renderBoard(); setConn(true) })
  es.addEventListener('error', ()=>{ setConn(false); es.close(); setTimeout(connect,3000) })
}

fetch('/api/state').then(r=>r.json()).then(s=>{ state=s; renderBoard() }).catch(()=>{})
connect()
</script>
</body>
</html>`
}

// ─── HTTP server ──────────────────────────────────────────────────────────────

function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = ''
    req.on('data', c => buf += c)
    req.on('end', () => { try { resolve(JSON.parse(buf || '{}')) } catch { reject(new Error('bad JSON')) } })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost')

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' })
    return res.end()
  }

  if (req.method === 'GET' && pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })
    res.write(': connected\n\n')
    // Send current state immediately
    const state = {}
    for (const [k, v] of previews) { const { proc: _, ...rest } = v; state[k] = rest }
    res.write('event: state\ndata: ' + JSON.stringify(state) + '\n\n')
    sseClients.add(res)
    req.on('close', () => sseClients.delete(res))
    return
  }

  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(renderDashboard(req.headers.host))
  }

  if (req.method === 'GET' && pathname === '/api/state') {
    const state = {}
    for (const [k, v] of previews) { const { proc: _, ...rest } = v; state[k] = rest }
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    return res.end(JSON.stringify(state))
  }

  // Legacy pipeline API (kept for backwards compat with any agents still posting)
  if (req.method === 'POST' && (pathname === '/api/register' || pathname === '/api/stage' || pathname === '/api/done')) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    return res.end(JSON.stringify({ ok: true, ignored: true }))
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(PORT, '0.0.0.0', async () => {
  console.log(`[dev-dashboard] http://${HOSTNAME}:${PORT}/  (pid ${process.pid})`)
  await syncPreviews()
  // Re-sync every 60 seconds to pick up new/closed PRs
  setInterval(syncPreviews, 60_000)
})

process.on('SIGTERM', () => { for (const [, e] of previews) stopPreview(e); server.close(); process.exit(0) })
process.on('SIGINT', () => { for (const [, e] of previews) stopPreview(e); server.close(); process.exit(0) })
