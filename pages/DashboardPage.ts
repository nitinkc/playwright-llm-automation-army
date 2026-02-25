import { Page } from '@playwright/test'
import { byKey, smartClick } from '../healing/heal'

export class DashboardPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await byKey(this.page, 'dashboard.welcome').waitFor({ state: 'visible' })
  }

  async goProjects() {
    await smartClick(this.page, 'nav.projects')
  }

  async goKanban() {
    await smartClick(this.page, 'nav.kanban')
  }

  async goSettings() {
    await smartClick(this.page, 'nav.settings')
  }
}
