import { test, expect } from './fixtures'
import { Header } from '../pages/Header'
import { HomePage } from '../pages/HomePage'
import { ProductsPage } from '../pages/ProductsPage'
import { LoginPage } from '../pages/LoginPage'
import { CartPage } from '../pages/CartPage'
import { byKey } from '../healing/heal'

test('smoke: key routes load', async ({ page }) => {
  const header = new Header(page)
  const home = new HomePage(page)
  const products = new ProductsPage(page)
  const login = new LoginPage(page)
  const cart = new CartPage(page)

  await home.goto()
  await expect(page).toHaveURL(/\/(?:$|[?#])/)
  await expect(home.hero()).toBeVisible()
  await expect(home.featuredProducts()).toBeVisible()
  await expect(home.recommendedProducts()).toBeVisible()
  await expect(home.testCasesButton()).toBeVisible()
  await expect(home.apiPracticeButton()).toBeVisible()

  await header.goProducts()
  await products.expectHasProducts()
  await expect(products.grid()).toBeVisible()

  await header.goLogin()
  await login.expectLoaded()

  await header.goCart()
  await cart.expectLoaded()
  await expect(cart.emptyState()).toBeVisible()

  await page.goto('/test-cases')
  await expect(byKey(page, 'scenario.list')).toBeVisible()
})
