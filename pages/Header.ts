import { Page } from '@playwright/test'
import { byKey } from '../healing/heal'

export class Header {
  constructor(private page: Page) {}

  async goHome() {
    await this.page.getByRole('link', { name: /home/i }).click()
  }

  async goProducts() {
    await this.page.getByRole('link', { name: /products/i }).click()
  }

  async goLogin() {
    await this.page.getByRole('link', { name: /signup\s*\/\s*login|login|sign\s*up/i }).click()
  }

  async goCart() {
    await this.page.getByRole('link', { name: /cart/i }).click()
  }

  cartNotification() {
    return byKey(this.page, 'cart.notification')
  }

  cartNotificationMessage() {
    return byKey(this.page, 'cart.notificationMessage')
  }
}
