import { Page, expect } from '@playwright/test'
import { byKey, getSelector } from '../healing/heal'

export class CartPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/cart')
  }

  emptyState() {
    return byKey(this.page, 'cart.emptyState')
  }

  table() {
    return byKey(this.page, 'cart.table')
  }

  rows() {
    return this.table().locator(getSelector('cart.row'))
  }

  firstRow() {
    return this.rows().first()
  }

  firstRowQuantityInput() {
    return this.firstRow().locator(getSelector('cart.quantityInput'))
  }

  firstRowRemoveButton() {
    return this.firstRow().locator(getSelector('cart.removeButton'))
  }

  clearCartButton() {
    return byKey(this.page, 'clearCart.button')
  }

  cartTotal() {
    return byKey(this.page, 'cart.total')
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/cart(?:$|[?#])/)
    await expect(this.page.getByRole('heading', { name: /shopping cart/i })).toBeVisible()
    await Promise.race([
      this.emptyState().waitFor({ state: 'visible' }),
      this.table().waitFor({ state: 'visible' })
    ])
  }
}
