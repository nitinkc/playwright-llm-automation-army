import { defineConfig } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

const baseURL = process.env.BASE_URL || 'http://localhost:5173'
const webServerCommand = process.env.WEB_SERVER_COMMAND
const webServerCwd = process.env.WEB_SERVER_CWD

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // Allure results are written to ./allure-results
    ['allure-playwright', { outputFolder: 'allure-results', detail: true, suiteTitle: false }]
  ],
  ...(webServerCommand
    ? {
        webServer: {
          command: webServerCommand,
          url: baseURL,
          reuseExistingServer: true,
          timeout: 120_000,
          ...(webServerCwd ? { cwd: webServerCwd } : {})
        }
      }
    : {}),
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
})
