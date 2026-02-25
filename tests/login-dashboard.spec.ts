import { test, expect } from './fixtures'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'

test('login then dashboard loads', async ({ page }) => {
  const login = new LoginPage(page)
  const dash = new DashboardPage(page)

  await login.goto()
  await login.login('demo@company.com', 'Pass@123')
  await dash.expectLoaded()
})
