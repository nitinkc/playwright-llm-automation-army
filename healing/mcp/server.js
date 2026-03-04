#!/usr/bin/env node
// Minimal MCP-like server over stdio (one JSON per line).
// Request: { id, method, params }
// Response: { id, result } or { id, error }

import readline from 'node:readline'
import cheerio from 'cheerio'

function normalize(s) {
  return (s || '').replace(/\s+/g, ' ').trim()
}

function scoreMatch(text, re) {
  if (!re) return 0
  const t = normalize(text).toLowerCase()
  const m = re.test(t) ? 1 : 0
  return m
}

function bestCandidate(dom, hint) {
  const $ = cheerio.load(dom)

  const candidates = []

  const scope = (() => {
    const withinSelector = hint?.withinSelector
    if (!withinSelector) return $.root()
    const scoped = $(withinSelector)
    return scoped.length ? scoped : $.root()
  })()

  const push = (el, kind) => {
    const $el = $(el)
    const tag = el.tagName?.toLowerCase() || ''
    const text = normalize($el.text())
    const testid = $el.attr('data-testid') || ''
    const aria = $el.attr('aria-label') || ''
    const placeholder = $el.attr('placeholder') || ''
    const id = $el.attr('id') || ''

    // label association by for=
    let labelText = ''
    if (id) {
      const $label = $(`label[for="${id}"]`)
      labelText = normalize($label.text())
    }
    if (!labelText && $el.parent('label').length) {
      labelText = normalize($el.parent('label').text())
    }

    const score =
      (hint.stableTestIds && hint.stableTestIds.includes(testid) ? 3 : 0) +
      (scoreMatch(text, hint.buttonText) ? 2 : 0) +
      (scoreMatch(aria, hint.ariaLabel) ? 2 : 0) +
      (scoreMatch(placeholder, hint.placeholder) ? 2 : 0) +
      (scoreMatch(labelText, hint.labelText) ? 2 : 0)

    candidates.push({
      tag,
      kind,
      score,
      testid,
      text,
      aria,
      placeholder,
      id,
      labelText,
    })
  }

  if (hint.kind === 'input') {
    scope.find('input, textarea').each((_, el) => push(el, 'input'))
  } else if (hint.kind === 'button' || hint.kind === 'nav') {
    scope.find('button, a, [role="button"]').each((_, el) => push(el, 'button'))
  } else {
    // region: any element with data-testid
    scope.find('[data-testid]').each((_, el) => push(el, 'region'))
    // also headings
    scope.find('h1,h2,h3').each((_, el) => push(el, 'region'))
  }

  candidates.sort((a, b) => b.score - a.score)
  return candidates[0] || null
}

function escapeAttr(s) {
  return String(s || '').replace(/"/g, '\\"')
}

function selectorFromCandidate(c, hint) {
  if (!c) return null

  const scoped = (sel) => (hint?.withinSelector ? `${hint.withinSelector} ${sel}` : sel)

  if (c.testid) {
    return {
      selector: `[data-testid="${c.testid}"]`,
      confidence: Math.min(0.95, 0.5 + c.score * 0.1),
      reason: `picked data-testid=${c.testid}`
    }
  }

  // For buttons, use accessible-ish name from text or aria-label
  if (c.kind === 'button') {
    const name = normalize(c.aria || c.text)
    if (name) {
      return {
        selector: scoped(`:is(button,a,[role="button"]):has-text("${escapeAttr(name)}")`),
        confidence: Math.min(0.85, 0.45 + c.score * 0.1),
        reason: `picked role button by name=${name}`
      }
    }
  }

  // For inputs, prefer stable attributes that don't require accessible names.
  if (c.kind === 'input') {
    if (c.id) {
      return {
        selector: `#${escapeAttr(c.id)}`,
        confidence: Math.min(0.85, 0.45 + c.score * 0.1),
        reason: `picked id=${c.id}`
      }
    }
    if (c.aria) {
      return {
        selector: scoped(`[aria-label="${escapeAttr(c.aria)}"]`),
        confidence: Math.min(0.8, 0.42 + c.score * 0.1),
        reason: `picked aria-label=${c.aria}`
      }
    }
    if (c.placeholder) {
      return {
        selector: scoped(`${c.tag || 'input'}[placeholder="${escapeAttr(c.placeholder)}"]`),
        confidence: Math.min(0.78, 0.4 + c.score * 0.1),
        reason: `picked placeholder=${c.placeholder}`
      }
    }
    const label = normalize(c.labelText)
    if (label) {
      return {
        selector: `role=textbox[name="${label}"]`,
        confidence: Math.min(0.75, 0.38 + c.score * 0.1),
        reason: `picked role textbox by name=${label}`
      }
    }
  }

  // Last resort: id selector
  if (c.id) {
    return { selector: `#${c.id}`, confidence: 0.5, reason: `fallback to id=${c.id}` }
  }

  return null
}

async function handle(method, params) {
  if (method === 'heal') {
    const { key, dom, hint } = params || {}
    const c = bestCandidate(dom, hint || {})
    const out = selectorFromCandidate(c, hint || {})
    if (!out) return { ok: false, key, message: 'no match' }
    return { ok: true, key, ...out, debug: c }
  }

  if (method === 'ping') return { ok: true }

  return { ok: false, message: `unknown method ${method}` }
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity })

rl.on('line', async (line) => {
  const trimmed = line.trim()
  if (!trimmed) return
  let req
  try {
    req = JSON.parse(trimmed)
  } catch (e) {
    process.stdout.write(JSON.stringify({ id: null, error: 'invalid json' }) + '\n')
    return
  }

  const id = req.id ?? null
  try {
    const result = await handle(req.method, req.params)
    process.stdout.write(JSON.stringify({ id, result }) + '\n')
  } catch (e) {
    process.stdout.write(JSON.stringify({ id, error: String(e?.message || e) }) + '\n')
  }
})
