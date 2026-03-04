import { test, expect } from './fixtures'
import { ProductsPage } from '../pages/ProductsPage'
import { Header } from '../pages/Header'
import { CartPage } from '../pages/CartPage'

test('update quantity and remove item', async ({ page }) => {
  const products = new ProductsPage(page)
  const header = new Header(page)
  const cart = new CartPage(page)

  await products.goto()
  await products.expectHasProducts()
  await products.addFirstProductToCart()

  await header.goCart()
  await cart.expectLoaded()
  await expect(cart.table()).toBeVisible()

  const qty = cart.firstRowQuantityInput()
  await expect(qty).toBeVisible()
  await qty.fill('2')
  await qty.press('Tab')
  await expect(qty).toHaveValue('2')

  page.once('dialog', (d) => d.accept())
  await cart.firstRowRemoveButton().click()
  await expect(cart.emptyState()).toBeVisible()
})

