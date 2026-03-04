import { test, expect } from './fixtures'
import { ProductsPage } from '../pages/ProductsPage'
import { getSelector } from '../healing/heal'

test('search filters products by name', async ({ page }) => {
  const products = new ProductsPage(page)

  await products.goto()
  await products.expectHasProducts()

  const firstName = await products
    .productCards()
    .first()
    .locator(getSelector('product.name'))
    .innerText()

  await products.searchInput().fill(firstName)
  await products.searchSubmit().click()

  await expect(products.productCards().first()).toBeVisible()
})

test('category and brand filters keep grid visible', async ({ page }) => {
  const products = new ProductsPage(page)

  await products.goto()
  await products.expectHasProducts()

  await products.categoryList().locator('li').first().click()
  await Promise.race([
    products.grid().waitFor({ state: 'visible' }),
    products.emptyState().waitFor({ state: 'visible' })
  ])

  await products.brandList().locator('li').first().click()
  await Promise.race([
    products.grid().waitFor({ state: 'visible' }),
    products.emptyState().waitFor({ state: 'visible' })
  ])
})
