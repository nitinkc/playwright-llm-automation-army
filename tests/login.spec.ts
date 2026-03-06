import { test, expect } from './fixtures'
import { LoginPage } from '../pages/LoginPage'
import { apiIsUp, createAuthUser, deleteAuthUsersByEmail, API_BASE_URL } from './utils/api'

test('invalid login shows error message', async ({ page }) => {
  const login = new LoginPage(page)

  await login.goto()
  await login.expectLoaded()

  await login.fillLogin('nope@example.com', 'WrongPass123')
  await login.submitLogin()

  await expect(login.authMessage()).toBeVisible()
  await expect(login.authMessage()).toContainText(/invalid email or password/i)
})

test('valid login shows success message', async ({ page, request }) => {
  const up = await apiIsUp(request)
  test.skip(!up, `API not reachable at ${API_BASE_URL}`)

  const email = `qa+1772609858051@example.com`
  const password = 'Pass@12345'

  // Keeping the user thats already present in the json db as it cant load new data in runtime after adding new data
  // await deleteAuthUsersByEmail(request, email)
  // await createAuthUser(request, { name: 'QA User', email, password })

  const login = new LoginPage(page)
  await login.goto()
  await login.expectLoaded()

  await login.fillLogin(email, password)
  await login.submitLogin()

  await expect(login.authMessage()).toBeVisible()
  await expect(login.authMessage()).toContainText(/login successful/i)
})

