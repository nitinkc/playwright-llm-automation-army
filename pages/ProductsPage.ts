import { Page, expect } from '@playwright/test'
import { byKey, getSelector } from '../healing/heal'

export class ProductsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/products')
  }

  searchInput() {
    return byKey(this.page, 'products.searchInput')
  }

  searchSubmit() {
    return byKey(this.page, 'products.searchSubmit')
  }

  categoryList() {
    return byKey(this.page, 'products.categoryList')
  }

  brandList() {
    return byKey(this.page, 'products.brandList')
  }

  grid() {
    return byKey(this.page, 'products.grid')
  }

  emptyState() {
    return byKey(this.page, 'products.emptyState')
  }

  productCards() {
    return this.grid().locator(getSelector('product.card'))
  }

  async expectHasProducts() {
    await expect(this.productCards().first()).toBeVisible()
  }

  async addFirstProductToCart() {
    const firstCard = this.productCards().first()
    await expect(firstCard).toBeVisible()
    await firstCard.scrollIntoViewIfNeeded()
    await firstCard.hover()
    const addBtn = firstCard.locator(getSelector('product.addToCart'))
    await expect(addBtn).toBeVisible()
    await addBtn.click()
  }
}
