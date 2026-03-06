import { test, expect } from './fixtures'
import { LoginPage } from '../pages/LoginPage'
import { apiIsUp, deleteAuthUsersByEmail, getAuthUsersByEmail, API_BASE_URL } from './utils/api'

test('signup creates an auth user (json-server)', async ({ page, request }) => {
  const up = await apiIsUp(request)
  test.skip(!up, `API not reachable at ${API_BASE_URL}`)

  const email = `signup-test@example.com`
  const password = 'Pass@12345'

  //if test user is already present, delete it to ensure a clean state for the test
  await deleteAuthUsersByEmail(request, email)

  const login = new LoginPage(page)
  await login.goto()
  await login.expectLoaded()
  await login.signup(email, password)

  await expect.poll(async () => (await getAuthUsersByEmail(request, email)).length).toBe(1)
})

