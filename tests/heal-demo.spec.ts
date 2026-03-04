import { test, expect } from './fixtures'
import { LoginPage } from '../pages/LoginPage'

test('login form fields are fillable (self-heal demo)', async ({ page }) => {
  const login = new LoginPage(page)
  const email = `qa+${Date.now()}@example.com`
  const password = 'Pass@12345'

  await login.goto()
  await login.expectLoaded()

  await login.fillLogin(email, password)
  await expect(login.loginEmail()).toHaveValue(email)
  await expect(login.loginPassword()).toHaveValue(password)
})

