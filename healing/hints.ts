export type HealHint = {
  kind: 'input' | 'button' | 'nav' | 'region'
  labelText?: RegExp
  placeholder?: RegExp
  ariaLabel?: RegExp
  buttonText?: RegExp
  stableTestIds?: string[]
  // Optional: if strict mode duplicates exist, narrow by container test id
  withinTestId?: string
}

export const HINTS: Record<string, HealHint> = {
  'login.email': {
    kind: 'input',
    labelText: /email/i,
    placeholder: /email/i,
    ariaLabel: /email/i,
    stableTestIds: ['login-email', 'auth-email', 'email']
  },
  'login.password': {
    kind: 'input',
    labelText: /password/i,
    placeholder: /password/i,
    ariaLabel: /password/i,
    stableTestIds: ['login-password', 'auth-pass', 'password']
  },
  'login.submit': {
    kind: 'button',
    buttonText: /(sign in|log in|submit)/i,
    ariaLabel: /(sign in|log in|submit)/i,
    stableTestIds: ['login-submit', 'auth-submit', 'submit']
  },

  'nav.projects': { kind: 'nav', buttonText: /projects/i, stableTestIds: ['nav-projects', 'menu-projects', 'projects'] },
  'nav.kanban': { kind: 'nav', buttonText: /kanban/i, stableTestIds: ['nav-kanban', 'menu-kanban', 'kanban'] },
  'nav.settings': { kind: 'nav', buttonText: /settings/i, stableTestIds: ['nav-settings', 'menu-settings', 'settings'] },

  'dashboard.welcome': { kind: 'region', buttonText: /welcome/i, stableTestIds: ['dash-welcome', 'dashboard-hello', 'welcome'] },

  'projects.create': { kind: 'button', buttonText: /create project/i, stableTestIds: ['projects-create', 'create-project', 'new'] },
  'projects.search': { kind: 'input', placeholder: /search/i, stableTestIds: ['projects-search', 'search-projects', 'search'] },
  'wizard.next': { kind: 'button', buttonText: /next/i, stableTestIds: ['wizard-next', 'next-step', 'next'] },
  'wizard.save': { kind: 'button', buttonText: /^save$/i, stableTestIds: ['wizard-save', 'save-project', 'save'], withinTestId: undefined },

  'kanban.todoLane': { kind: 'region', stableTestIds: ['lane-todo', 'kanban-todo', 'todo'] },
  'kanban.doneLane': { kind: 'region', stableTestIds: ['lane-done', 'kanban-done', 'done'] },

  'toast': { kind: 'region', stableTestIds: ['toast', 'snackbar'] }
}
