import { Page, expect } from '@playwright/test'
import { byKey, smartClick, smartFill } from '../healing/heal'

export class ProjectsPage {
  constructor(private page: Page) {}

  async createProject() {
    await smartClick(this.page, 'projects.create')

    // Step 1 -> Step 2
    await smartClick(this.page, 'wizard.next')

    // Step 2 -> Step 3
    await smartClick(this.page, 'wizard.next')

    // Save
    await smartClick(this.page, 'wizard.save')

    // Toast appears
    await byKey(this.page, 'toast').waitFor({ state: 'visible' })
  }

  async search(q: string) {
    await smartFill(this.page, 'projects.search', q)
  }

  async expectTableHas(text: string) {
    await expect(this.page.locator('table')).toContainText(text)
  }
}
