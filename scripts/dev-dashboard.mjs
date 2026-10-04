#!/usr/bin/env node
/**
 * hackie.dev dev-dashboard — 0.0.0.0:4399
 * A persistent background server that tracks pipeline agents in real time.
 * Uses only Node.js built-ins + Server-Sent Events (no external packages).
 */

import http from 'node:http'

const PORT = 4399

// ─── State ───────────────────────────────────────────────────────────────────

const agents = new Map() // id → { id, ticket, description, stage, devPort?, registeredAt }
const sseClients = new Set() // res objects

// ─── SSE helpers ─────────────────────────────────────────────────────────────

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  for (const client of sseClients) {
    try {
      client.write(payload)
    } catch {}
  }
}

function broadcastState() {
  broadcast('state', Object.fromEntries(agents))
}

// ─── Request router ───────────────────────────────────────────────────────────

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(data))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = ''
    req.on('data', (chunk) => (buf += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(buf || '{}'))
      } catch {
        reject(new Error('bad JSON'))
      }
    })
    req.on('error', reject)
  })
}

const DASHBOARD_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>hackie.dev · Pipeline Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  :root {
    --bg: #0B0B0C;
    --surface: rgba(255,255,255,0.05);
    --surface-hover: rgba(255,255,255,0.08);
    --border: rgba(255,255,255,0.08);
    --lime: #A8E63D;
    --lime-dim: rgba(168,230,61,0.18);
    --text: #E8E8E8;
    --muted: #888;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }
  header {
    padding: 24px 32px 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--lime);
    box-shadow: 0 0 10px var(--lime);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .logo-text {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--lime);
  }
  .pipeline {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 16px 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .pipeline::-webkit-scrollbar { display: none; }
  .stage-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    background: var(--surface);
    white-space: nowrap;
    transition: all 0.3s ease;
  }
  .stage-pill.active {
    border-color: var(--stage-color);
    background: color-mix(in srgb, var(--stage-color) 12%, transparent);
    box-shadow: 0 0 18px color-mix(in srgb, var(--stage-color) 35%, transparent);
    color: var(--stage-color);
  }
  .stage-pill .count {
    background: var(--stage-color);
    color: #000;
    border-radius: 99px;
    padding: 1px 7px;
    font-size: 10px;
    font-weight: 700;
    min-width: 18px;
    text-align: center;
  }
  .stage-arrow {
    color: var(--muted);
    font-size: 14px;
    padding: 0 4px;
    flex-shrink: 0;
  }
  .divider {
    height: 1px;
    background: var(--border);
    margin: 0 32px;
  }
  main {
    padding: 28px 32px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    min-height: calc(100vh - 200px);
  }
  @media (max-width: 1100px) { main { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 700px) {
    main { grid-template-columns: 1fr 1fr; }
    header { padding: 16px 16px 0; }
    .divider { margin: 0 16px; }
  }
  .col { display: flex; flex-direction: column; gap: 12px; }
  .col-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .col-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--stage-color); }
  .col-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--stage-color);
  }
  .col-count { margin-left: auto; font-size: 11px; color: var(--muted); }
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    backdrop-filter: blur(8px);
    transition: border-color 0.2s ease, background 0.2s ease;
    animation: cardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .card:hover {
    background: var(--surface-hover);
    border-color: rgba(255,255,255,0.14);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .card.removing {
    animation: cardOut 0.25s ease forwards;
  }
  @keyframes cardOut {
    to { opacity: 0; transform: translateY(-8px) scale(0.95); }
  }
  .card-top { display: flex; align-items: flex-start; gap: 8px; }
  .ticket-badge {
    background: var(--lime-dim);
    color: var(--lime);
    border: 1px solid rgba(168,230,61,0.25);
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .card-desc { font-size: 13px; font-weight: 500; line-height: 1.4; flex: 1; }
  .card-meta { display: flex; flex-direction: column; gap: 5px; }
  .agent-id { font-size: 10px; color: var(--muted); font-family: 'Courier New', monospace; }
  .timer { font-size: 11px; color: var(--muted); font-variant-numeric: tabular-nums; }
  .stage-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 99px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    background: color-mix(in srgb, var(--stage-color) 15%, transparent);
    color: var(--stage-color);
    border: 1px solid color-mix(in srgb, var(--stage-color) 30%, transparent);
    align-self: flex-start;
  }
  .preview-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 7px;
    font-size: 11px;
    font-weight: 600;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text);
    text-decoration: none;
    transition: background 0.15s ease, border-color 0.15s ease;
    align-self: flex-start;
    cursor: pointer;
  }
  .preview-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }
  .empty { color: var(--muted); font-size: 12px; text-align: center; padding: 20px 0; }
  footer {
    text-align: center;
    padding: 16px;
    font-size: 11px;
    color: var(--muted);
    border-top: 1px solid var(--border);
  }
  .conn-status { display: inline-flex; align-items: center; gap: 6px; }
  .conn-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); transition: background 0.3s; }
  .conn-dot.disconnected { background: #ef4444; }
</style>
</head>
<body>
<header>
  <div class="logo-row">
    <div class="logo-dot"></div>
    <span class="logo-text">hackie.dev</span>
    <span style="color:var(--muted);font-size:13px;margin-left:4px;">Pipeline Dashboard</span>
    <span style="margin-left:auto;font-size:13px;color:var(--muted)" id="agent-count">0 agents</span>
  </div>
  <div class="pipeline" id="pipeline-bar"></div>
</header>
<div class="divider"></div>
<main id="board"></main>
<footer>
  <span class="conn-status">
    <span class="conn-dot" id="conn-dot"></span>
    <span id="conn-label">Connecting…</span>
  </span>
  &nbsp;·&nbsp; <span id="last-update">—</span>
</footer>
<script>
const STAGES = ['lead','design','implement','validate','submit'];
const STAGE_COLORS = {
  lead: '#A78BFA',
  design: '#67E8F9',
  implement: '#FCD34D',
  validate: '#7DD3FC',
  submit: '#6EE7B7',
};
let state = {};

function fmt(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return s + 's';
  const m = Math.floor(s / 60), rs = s % 60;
  if (m < 60) return m + 'm ' + String(rs).padStart(2,'0') + 's';
  const h = Math.floor(m / 60), rm = m % 60;
  return h + 'h ' + String(rm).padStart(2,'0') + 'm';
}

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderPipeline() {
  const bar = document.getElementById('pipeline-bar');
  const counts = {};
  for (const a of Object.values(state)) counts[a.stage] = (counts[a.stage]||0)+1;
  bar.innerHTML = STAGES.map((s,i) => {
    const c = counts[s]||0;
    const active = c > 0;
    return (i>0?'<span class="stage-arrow">›</span>':'') +
      '<div class="stage-pill' + (active?' active':'') + '" style="--stage-color:' + STAGE_COLORS[s] + '">' +
      s.toUpperCase() +
      (active?'<span class="count">'+c+'</span>':'') +
      '</div>';
  }).join('');
}

function renderCard(a) {
  const since = a.registeredAt ? Date.now() - a.registeredAt : 0;
  const preview = a.devPort
    ? '<a class="preview-btn" href="http://' + window.location.hostname + ':' + a.devPort + '" target="_blank">🔗 Preview :' + a.devPort + '</a>'
    : '';
  return '<div class="card" id="card-' + CSS.escape(a.id) + '" data-registered="' + (a.registeredAt||Date.now()) + '" style="--stage-color:' + STAGE_COLORS[a.stage] + '">' +
    '<div class="card-top">' +
    '<span class="ticket-badge">' + escHtml(a.ticket||'#?') + '</span>' +
    '<span class="card-desc">' + escHtml(a.description||'') + '</span>' +
    '</div>' +
    '<div class="card-meta">' +
    '<span class="agent-id">⚙ ' + a.id.slice(0,8) + '</span>' +
    '<span class="timer" id="timer-' + CSS.escape(a.id) + '">⏱ ' + fmt(since) + '</span>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
    '<span class="stage-badge">' + a.stage + '</span>' +
    preview +
    '</div></div>';
}

function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = STAGES.map(s => {
    const agents = Object.values(state).filter(a => a.stage === s);
    return '<div class="col" style="--stage-color:' + STAGE_COLORS[s] + '">' +
      '<div class="col-header"><div class="col-dot"></div>' +
      '<span class="col-label">' + s + '</span>' +
      '<span class="col-count">' + agents.length + '</span></div>' +
      (agents.length === 0 ? '<div class="empty">idle</div>' : agents.map(renderCard).join('')) +
      '</div>';
  }).join('');
  document.getElementById('agent-count').textContent = Object.keys(state).length + ' agent' + (Object.keys(state).length!==1?'s':'');
}

setInterval(() => {
  for (const a of Object.values(state)) {
    const el = document.getElementById('timer-' + CSS.escape(a.id));
    if (el && a.registeredAt) el.textContent = '⏱ ' + fmt(Date.now() - a.registeredAt);
  }
}, 1000);

const connDot = document.getElementById('conn-dot');
const connLabel = document.getElementById('conn-label');
const lastUpdate = document.getElementById('last-update');

function connect() {
  const es = new EventSource('/events');
  es.addEventListener('state', e => {
    state = JSON.parse(e.data);
    renderPipeline();
    renderBoard();
    lastUpdate.textContent = 'Updated ' + new Date().toLocaleTimeString();
    connDot.className = 'conn-dot';
    connLabel.textContent = 'Live';
  });
  es.addEventListener('open', () => {
    connDot.className = 'conn-dot';
    connLabel.textContent = 'Live';
  });
  es.addEventListener('error', () => {
    connDot.className = 'conn-dot disconnected';
    connLabel.textContent = 'Reconnecting…';
    es.close();
    setTimeout(connect, 3000);
  });
}

fetch('/api/state').then(r=>r.json()).then(s=>{state=s;renderPipeline();renderBoard();}).catch(()=>{});
connect();
</script>
</body>
</html>`

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:' + PORT)
  const path = url.pathname

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    return res.end()
  }

  if (req.method === 'GET' && path === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })
    res.write(': connected\n\n')
    res.write('event: state\ndata: ' + JSON.stringify(Object.fromEntries(agents)) + '\n\n')
    sseClients.add(res)
    req.on('close', () => sseClients.delete(res))
    return
  }

  if (req.method === 'GET' && path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(DASHBOARD_HTML)
  }

  if (req.method === 'GET' && path === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    return res.end(JSON.stringify(Object.fromEntries(agents)))
  }

  if (req.method === 'POST' && path === '/api/register') {
    try {
      const body = await readBody(req)
      const { id, ticket, description, stage = 'lead', devPort } = body
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ error: 'id required' }))
      }
      const entry = { id, ticket, description, stage, registeredAt: Date.now() }
      if (devPort) entry.devPort = devPort
      agents.set(id, entry)
      broadcastState()
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      return res.end(JSON.stringify({ ok: true, agent: entry }))
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: e.message }))
    }
  }

  if (req.method === 'POST' && path === '/api/stage') {
    try {
      const body = await readBody(req)
      const { id, stage } = body
      if (!id || !stage) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ error: 'id and stage required' }))
      }
      const entry = agents.get(id)
      if (!entry) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ error: 'agent not found' }))
      }
      entry.stage = stage
      broadcastState()
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      return res.end(JSON.stringify({ ok: true, agent: entry }))
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: e.message }))
    }
  }

  if (req.method === 'POST' && path === '/api/done') {
    try {
      const body = await readBody(req)
      const { id } = body
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ error: 'id required' }))
      }
      const existed = agents.delete(id)
      broadcastState()
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
      return res.end(JSON.stringify({ ok: true, removed: existed }))
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ error: e.message }))
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(PORT, '0.0.0.0', () => {
  import('node:os').then((os) => {
    const iface = Object.values(os.networkInterfaces())
      .flat()
      .find((a) => a.family === 'IPv4' && !a.internal)
    const networkAddr = iface ? iface.address : null
    console.log('[dev-dashboard] running on pid ' + process.pid)
    console.log('  local:   http://localhost:' + PORT)
    if (networkAddr) console.log('  network: http://' + networkAddr + ':' + PORT)
  })
})

process.on('SIGTERM', () => {
  server.close()
  process.exit(0)
})
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
