import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page)
  }
})

export { expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies()
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  await page.goto('/')
})

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
