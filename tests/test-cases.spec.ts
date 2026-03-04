import { test, expect } from './fixtures'
import { byKey } from '../healing/heal'

test('test-cases page renders scenarios', async ({ page }) => {
  await page.goto('/test-cases')

  await expect(byKey(page, 'scenario.list')).toBeVisible()

  const firstCard = page.locator('[data-testid^="scenario-card-"]').first()
  await expect(firstCard).toBeVisible()
  await firstCard.click()

  await expect(byKey(page, 'scenario.active')).toBeVisible()
  await expect(byKey(page, 'scenario.status')).toBeVisible()
  await expect(byKey(page, 'scenario.target')).toBeVisible()
})

