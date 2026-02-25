import { test, expect } from './fixtures'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { KanbanPage } from '../pages/KanbanPage'

test('projects wizard then kanban drag and drop', async ({ page }) => {
  const login = new LoginPage(page)
  const dash = new DashboardPage(page)
  const projects = new ProjectsPage(page)
  const kanban = new KanbanPage(page)

  await login.goto()
  await login.login('demo@company.com', 'Pass@123')
  await dash.expectLoaded()

  await dash.goProjects()
  await projects.createProject()
  await projects.search('P-')
  await projects.expectTableHas('P-')

  await dash.goKanban()
  await kanban.expectLoaded()
  await kanban.dragFirstTodoToDone()
})
