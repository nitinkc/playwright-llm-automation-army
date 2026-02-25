# Copilot Instructions — Playwright Self-Heal Lab

## Architecture Overview

This is a **self-healing Playwright test framework** demonstrating automated locator repair via an MCP-like server.

**Core Data Flow:**
1. Tests use Page Objects (`pages/*.ts`) that call healing functions (`smartFill`, `smartClick`)
2. Healing functions read selectors from `locators/locators.json` via `healing/locatorStore.ts`
3. On failure + `SELF_HEAL=1`, `healing/heal.ts` captures DOM and calls `healing/mcp/server.js`
4. MCP server uses Cheerio + hints (`healing/hints.ts`) to find replacement selectors
5. Healed selectors are written back to `locators.json` and retried

**Key Files:**
- `locators/locators.json` — Single source of truth for all selectors (dot-notation keys)
- `healing/hints.ts` — Semantic hints per locator key enabling intelligent healing
- `healing/mcp/server.js` — Cheerio-based DOM parser that scores candidates
- `tests/fixtures.ts` — Extended Playwright fixture injecting FE flags + Allure attachments

## Developer Workflows

### Running Tests
```bash
npm run test:v1      # Baseline (should pass)
npm run test:break   # Broken selectors (should fail)
npm run test:heal    # Self-healing enabled (repairs locators.json)
npm run test:hard    # All FE chaos flags enabled
```

### Reset After Healing Demo
```bash
npm run heal:reset:v1   # Restore locators.json to v1 baseline
npm run heal:reset:v2   # Set locators.json to v2 baseline
```

### Allure Reports
```bash
npm run allure:generate && npm run allure:open
```

## Conventions & Patterns

### Locator Keys
Use dot-notation: `page.element` (e.g., `login.email`, `nav.projects`, `wizard.save`). Always add new keys to both:
- `locators/locators.json`
- `healing/hints.ts` (with semantic hints)

### Page Objects
- Import `smartFill`, `smartClick`, `byKey` from `../healing/heal`
- Use `smartFill/smartClick` for user interactions (enables healing)
- Use `byKey` for assertions/waitFor (no healing wrapper)

```typescript
// Example pattern from pages/LoginPage.ts
import { smartClick, smartFill } from '../healing/heal'
await smartFill(this.page, 'login.email', email)
await smartClick(this.page, 'login.submit')
```

### Tests
- Import from `./fixtures` (NOT `@playwright/test`) to get FE flag injection
- Use Page Object methods, not raw locators

### Hints Structure
When adding a locator, provide healing hints in `healing/hints.ts`:
```typescript
'login.email': {
  kind: 'input',                    // input | button | nav | region
  labelText: /email/i,              // Associated <label> text
  placeholder: /email/i,            // Input placeholder
  stableTestIds: ['login-email', 'auth-email']  // Known testid variants
}
```

## Environment Variables
Tests use `cross-env` to inject FE behavior flags:
- `SELF_HEAL=1` — Enable healing (default 0)
- `FE_LOCATOR_SET=v1|v2` — Which data-testid set FE uses
- `FE_COPY_SET=copyA|copyB` — Button text variants
- `FE_OVERLAY=1` — Enable timing overlay blocker
- `FE_DUPSAVE=1` — Enable duplicate save button (strict mode test)

## Test Artifacts
Configured in `playwright.config.ts` and `tests/fixtures.ts`:
- DOM snapshots always attached (enables offline healing)
- Screenshots on failure (`failure-screenshot`)
- Traces/videos retained on failure
- All artifacts flow to `allure-results/` for CI upload
