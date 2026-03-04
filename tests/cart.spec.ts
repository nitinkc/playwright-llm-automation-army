import { test, expect } from './fixtures'
import { Header } from '../pages/Header'
import { ProductsPage } from '../pages/ProductsPage'
import { CartPage } from '../pages/CartPage'

test('add to cart updates cart table', async ({ page }) => {
  const header = new Header(page)
  const products = new ProductsPage(page)
  const cart = new CartPage(page)

  await products.goto()
  await products.expectHasProducts()

  await products.addFirstProductToCart()

  await header.goCart()
  await cart.expectLoaded()
  await expect(cart.table()).toBeVisible()
})
