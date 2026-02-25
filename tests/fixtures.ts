import { test as base } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

export const test = base.extend({
  page: async ({ page }, use) => {
    const locatorSet = process.env.FE_LOCATOR_SET || 'v1'
    const copySet = process.env.FE_COPY_SET || 'copyA'
    const overlayEnabled = process.env.FE_OVERLAY === '1'
    const duplicateSaveButton = process.env.FE_DUPSAVE === '1'

    // This must match FE key in flags.ts
    await page.addInitScript(({ locatorSet, copySet, overlayEnabled, duplicateSaveButton }) => {
      localStorage.setItem('fe_locator_lab_flags_v1', JSON.stringify({
        locatorSet,
        copySet,
        overlayEnabled,
        duplicateSaveButton
      }))
    }, { locatorSet, copySet, overlayEnabled, duplicateSaveButton })

    await use(page)
  }
})

export { expect } from '@playwright/test'

// Attach evidence into Allure results.
// This makes the Allure bundle usable for your "download allure-results.zip then self-heal" objective.
test.afterEach(async ({ page }, testInfo) => {
  // Always attach URL (helpful even for passes)
  await testInfo.attach('page-url', {
    body: Buffer.from(page.url(), 'utf-8'),
    contentType: 'text/plain'
  })

  // Always attach DOM snapshot (cheap, and helps healing)
  try {
    const dom = await page.content()
    await testInfo.attach('dom-snapshot', {
      body: Buffer.from(dom, 'utf-8'),
      contentType: 'text/html'
    })
  } catch {
    // ignore
  }

  // On failure: add a screenshot explicitly as an Allure attachment.
  // Playwright also captures screenshots based on config, but this guarantees Allure includes one.
  if (testInfo.status !== testInfo.expectedStatus) {
    try {
      const outPath = testInfo.outputPath('failure.png')
      await page.screenshot({ path: outPath, fullPage: true })
      await testInfo.attach('failure-screenshot', {
        path: outPath,
        contentType: 'image/png'
      })
    } catch {
      // ignore
    }
  }
})
