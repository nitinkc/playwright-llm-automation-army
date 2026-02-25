import { Page, expect } from '@playwright/test'
import { byKey, smartClick } from '../healing/heal'

export class KanbanPage {
  constructor(private page: Page) {}

  async expectLoaded() {
    await byKey(this.page, 'kanban.todoLane').waitFor({ state: 'visible' })
    await byKey(this.page, 'kanban.doneLane').waitFor({ state: 'visible' })
  }

  async dragFirstTodoToDone() {
    const firstCard = this.page.locator('[data-testid], .card').locator('text=Drag me').first()
    // Prefer dragging by visible card container
    // If this fails in your environment, replace with a more explicit locator.
    const todo = byKey(this.page, 'kanban.todoLane')
    const done = byKey(this.page, 'kanban.doneLane')

    await todo.scrollIntoViewIfNeeded()
    await done.scrollIntoViewIfNeeded()

    // Drag a known card by text from the Todo lane.
    const card = todo.locator('text=Fix login selectors').first()
    await card.dragTo(done)
  }
}
