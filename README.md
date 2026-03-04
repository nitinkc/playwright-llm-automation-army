# Playwright Automation + Self-Heal Lab

This repo automates the **Automation Exercise Clone** frontend (React) running at `http://localhost:5173` and demonstrates a simple self-healing approach:
1) run with a baseline locator set
2) introduce locator drift (intentionally broken selectors)
3) auto-heal by analyzing the DOM and patching `locators/locators.json`

App-specific automation requirements live in `PLAYWRIGHT_AUTOMATION.md`.

## Prereqs
- Node 18+
- Frontend running at `http://localhost:5173`
- (Optional) json-server API at `http://localhost:5000` (used by `tests/auth.spec.ts`)

If your FE project is checked out next to this repo (example: `../fe-automation-exercise-clone`):
```bash
cd ../fe-automation-exercise-clone
npm start
```

## Install
```bash
npm i
npx playwright install
```

## Run scenarios

### Common Playwright commands
- `npx playwright test` — run all tests
- `npx playwright test tests/smoke.spec.ts` — run a single test file
- `npx playwright test --ui` — open Playwright UI mode

### 1) Baseline (should pass)
```bash
npm run test:v1
```

### 2) Break selectors (should fail)
```bash
npm run test:break
```

### 3) Self heal (should pass and patch locators.json)
```bash
npm run test:heal
```

### 4) Reset locators back to v1
```bash
npm run heal:reset:v1
```

## All available scripts (purpose)
- `npm run test` — run all Playwright tests
- `npm run test:v1` — reset locators to v1 and run tests (baseline)
- `npm run test:break` — reset locators to v2 and run tests (expect failures)
- `npm run test:heal` — reset locators to v2 and run tests with self-heal enabled
- `npm run heal:reset:v1` — reset `locators/locators.json` to v1 baseline
- `npm run heal:reset:v2` — reset `locators/locators.json` to v2 baseline
- `npm run show:locators` — print current `locators/locators.json`
- `npm run allure:generate` — generate Allure report from `allure-results`
- `npm run allure:open` — open Allure report
- `npm run allure:clean` — delete Allure results and report output

## Optional: start the FE automatically from Playwright
Set these env vars:
- `WEB_SERVER_COMMAND` (example: `npm start`)
- `WEB_SERVER_CWD` (example: `../fe-automation-exercise-clone`)

Example:
```bash
WEB_SERVER_COMMAND="npm start" WEB_SERVER_CWD="../fe-automation-exercise-clone" npm run test:v1
```

## Allure + artifacts
Playwright writes Allure results to `./allure-results` and keeps trace/video/screenshot on failures.
