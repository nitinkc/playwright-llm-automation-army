import { Page, Locator } from '@playwright/test'
import { HINTS } from './hints'
import { readLocators, setLocator } from './locatorStore'
import { callMcp } from './mcp/client'

const SELF_HEAL = process.env.SELF_HEAL === '1'
const ACTION_TIMEOUT_MS = Number(process.env.HEAL_ACTION_TIMEOUT_MS || 2_000)

type HealAttemptOk = { ok: true; newSelector: string; confidence: number; reason?: string }
type HealAttemptFail = { ok: false; reason: string }
type HealAttempt = HealAttemptOk | HealAttemptFail

export function getSelector(key: string): string {
  const locs = readLocators()
  const sel = locs[key]
  if (!sel) throw new Error(`Missing locator key: ${key}`)
  return sel
}

export function byKey(page: Page, key: string): Locator {
  const selector = getSelector(key)
  return page.locator(selector)
}

async function attemptHeal(page: Page, key: string, oldSelector: string) {
  const hint = HINTS[key]
  if (!hint) return { ok: false, reason: 'no hint' } satisfies HealAttemptFail

  const dom = await page.content()
  const result = await callMcp('heal', { key, dom, hint, oldSelector })

  if (!result?.ok) return { ok: false, reason: 'server no match' } satisfies HealAttemptFail

  const newSelector = String(result.selector || '')
  const confidence = Number(result.confidence || 0)
  if (!newSelector || confidence < 0.55) {
    return { ok: false, reason: `low confidence: ${confidence}` } satisfies HealAttemptFail
  }

  setLocator(key, newSelector)
  return { ok: true, newSelector, confidence, reason: result.reason } satisfies HealAttemptOk
}

export async function smartFill(page: Page, key: string, value: string) {
  const oldSelector = getSelector(key)
  try {
    await page.locator(oldSelector).fill(value, { timeout: ACTION_TIMEOUT_MS })
  } catch (e: any) {
    if (!SELF_HEAL) throw e
    const healed: HealAttempt = await attemptHeal(page, key, oldSelector)
    if (!healed.ok) throw e
    console.log(`heal: updated ${key} -> ${healed.newSelector} (conf=${healed.confidence.toFixed(2)})`)
    await page.locator(healed.newSelector).fill(value, { timeout: ACTION_TIMEOUT_MS })
  }
}

export async function smartClick(page: Page, key: string) {
  const oldSelector = getSelector(key)
  try {
    await page.locator(oldSelector).click({ timeout: ACTION_TIMEOUT_MS })
  } catch (e: any) {
    if (!SELF_HEAL) throw e
    const healed: HealAttempt = await attemptHeal(page, key, oldSelector)
    if (!healed.ok) throw e
    console.log(`heal: updated ${key} -> ${healed.newSelector} (conf=${healed.confidence.toFixed(2)})`)
    await page.locator(healed.newSelector).click({ timeout: ACTION_TIMEOUT_MS })
  }
}
