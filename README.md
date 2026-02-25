# Playwright Self Heal Lab (MCP client/server demo)

This repo tests the **FE Locator Lab** app and demonstrates:
- multi-page Playwright tests using Page Objects
- selector drift when FE locator set changes
- self-healing that:
  1) captures DOM snapshot
  2) asks a tiny MCP-like server for a replacement selector
  3) patches `locators/locators.json`
  4) retries the failed action once

It follows an evidence-first mindset similar to your pipeline plan: capture attachments (screenshot, trace, logs) and then change the smallest surface area (usually locators). fileciteturn1file2L12-L18 fileciteturn1file2L152-L163

## Prereqs
- Node 18+
- The FE app running at http://localhost:5173

## Install
```bash
npm i
npx playwright install
```

## Run scenarios

Prior to running scenarios, please run `npm start` for automation exercise project

### 1) Baseline (should pass)
FE flags: locatorSet=v1
```bash
npm run test:v1
```

### 2) Break selectors (should fail)
FE flags: locatorSet=v2 (changes data-testid)
```bash
npm run test:break
```

### 3) Self heal (should pass and patch locators.json)
Same FE flags: locatorSet=v2, but self-healing enabled.
```bash
npm run test:heal
```

You should see logs like:
- "heal: updated login.email -> [data-testid=\"auth-email\"]"
- and then the action retries and continues.

### 4) Reset locators back to v1 (so you can demo again)
```bash
npm run heal:reset:v1
```

## How FE flags are set from tests
Tests set localStorage before navigation:
- locatorSet (v1 / v2 / v3)
- copySet (Sign in / Log in)
- overlayEnabled (timing blocker)
- duplicateSaveButton (strict mode issues)

## Allure + artifacts
Playwright is configured to keep trace/video/screenshot on failures.
In your CI pipeline you can upload these as artifacts (Allure results zip + attachments). fileciteturn1file0L1-L14 fileciteturn1file2L1-L9
