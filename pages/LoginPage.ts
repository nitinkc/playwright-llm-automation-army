import { Page } from '@playwright/test'
import { smartClick, smartFill, byKey, getSelector } from '../healing/heal'

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  loginForm() {
    return byKey(this.page, 'login.form')
  }

  loginEmail() {
    return this.loginForm().locator(getSelector('login.email'))
  }

  loginPassword() {
    return this.loginForm().locator(getSelector('login.password'))
  }

  loginSubmit() {
    return this.loginForm().locator(getSelector('login.submit'))
  }

  signupForm() {
    return byKey(this.page, 'signup.form')
  }

  signupEmail() {
    return this.signupForm().locator(getSelector('signup.email'))
  }

  signupName() {
    return this.signupForm().locator(getSelector('signup.name'))
  }

  signupPassword() {
    return this.signupForm().locator(getSelector('signup.password'))
  }

  signupSubmit() {
    return this.signupForm().locator(getSelector('signup.submit'))
  }

  authMessage() {
    return this.page.locator('[data-testid="auth-message"], .message')
  }

  async fillLogin(email: string, password: string) {
    await smartFill(this.page, 'login.email', email)
    await smartFill(this.page, 'login.password', password)
  }

  async submitLogin() {
    await smartClick(this.page, 'login.submit')
  }

  async login(email: string, password: string) {
    await this.fillLogin(email, password)
    await this.submitLogin()
  }

  async fillSignup(email: string, password: string, name = 'QA User') {
    await smartFill(this.page, 'signup.name', name)
    await smartFill(this.page, 'signup.email', email)
    await smartFill(this.page, 'signup.password', password)
  }

  async submitSignup() {
    await smartClick(this.page, 'signup.submit')
  }

  async signup(email: string, password: string, name = 'QA User') {
    await this.fillSignup(email, password, name)
    await this.submitSignup()
  }

  async expectLoaded() {
    await byKey(this.page, 'login.form').waitFor({ state: 'visible' })
    await byKey(this.page, 'signup.form').waitFor({ state: 'visible' })
  }
}
