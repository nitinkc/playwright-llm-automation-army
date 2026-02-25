import { Page } from '@playwright/test'
import { smartClick, smartFill, byKey } from '../healing/heal'

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await smartFill(this.page, 'login.email', email)
    await smartFill(this.page, 'login.password', password)
    await smartClick(this.page, 'login.submit')
  }
}
