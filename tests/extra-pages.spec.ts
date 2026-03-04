import { test, expect } from './fixtures'

test('api testing page loads', async ({ page }) => {
  await page.goto('/api-testing')
  await expect(page.getByText(/api testing page - coming soon/i)).toBeVisible()
})

test('contact page loads', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.getByText(/contact page - coming soon/i)).toBeVisible()
})
