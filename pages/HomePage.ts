import { Page, expect } from '@playwright/test'
import { byKey, getSelector } from '../healing/heal'

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  hero() {
    return byKey(this.page, 'home.hero')
  }

  testCasesButton() {
    return byKey(this.page, 'home.testCasesButton')
  }

  apiPracticeButton() {
    return byKey(this.page, 'home.apiPracticeButton')
  }

  featuredProducts() {
    return byKey(this.page, 'home.featuredProducts')
  }

  recommendedProducts() {
    return byKey(this.page, 'home.recommendedProducts')
  }

  productCards() {
    return byKey(this.page, 'product.card')
  }

  async addFirstProductToCart() {
    const firstCard = this.featuredProducts().locator(getSelector('product.card')).first()
    await expect(firstCard).toBeVisible()
    await firstCard.scrollIntoViewIfNeeded()
    await firstCard.hover()
    const addBtn = firstCard.locator(getSelector('product.addToCart'))
    await expect(addBtn).toBeVisible()
    await addBtn.click()
  }
}
