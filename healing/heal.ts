import { Page, Locator } from '@playwright/test'
import { HINTS } from './hints'
import { readLocators, setLocator } from './locatorStore'
import { callMcp } from './mcp/client'

const SELF_HEAL = process.env.SELF_HEAL === '1'

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
  if (!hint) return { ok: false, reason: 'no hint' }

  const dom = await page.content()
  const result = await callMcp('heal', { key, dom, hint, oldSelector })

  if (!result?.ok) return { ok: false, reason: 'server no match' }

  const newSelector = result.selector as string
  const confidence = result.confidence as number
  if (!newSelector || confidence < 0.55) {
    return { ok: false, reason: `low confidence: ${confidence}` }
  }

  setLocator(key, newSelector)
  return { ok: true, newSelector, confidence, reason: result.reason }
}

export async function smartFill(page: Page, key: string, value: string) {
  const oldSelector = getSelector(key)
  try {
    await page.locator(oldSelector).fill(value)
  } catch (e: any) {
    if (!SELF_HEAL) throw e
    const healed = await attemptHeal(page, key, oldSelector)
    if (!healed.ok) throw e
    console.log(`heal: updated ${key} -> ${healed.newSelector} (conf=${healed.confidence.toFixed(2)})`)
    await page.locator(healed.newSelector).fill(value)
  }
}

export async function smartClick(page: Page, key: string) {
  const oldSelector = getSelector(key)
  try {
    await page.locator(oldSelector).click()
  } catch (e: any) {
    if (!SELF_HEAL) throw e
    const healed = await attemptHeal(page, key, oldSelector)
    if (!healed.ok) throw e
    console.log(`heal: updated ${key} -> ${healed.newSelector} (conf=${healed.confidence.toFixed(2)})`)
    await page.locator(healed.newSelector).click()
  }
}
