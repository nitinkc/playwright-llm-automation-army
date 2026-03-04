# Playwright Automation Guide (Living Document)

Status: Active  
Last updated: 2026-03-04

This file defines the FE automation contract for the separate Playwright repository.
When FE behavior changes, update this file in the same PR.

---

## 1) Scope and Ownership

This repository:
- Owns frontend behavior and stable automation hooks only.
- Should remain deterministic and automation-friendly.

Separate Playwright repository:
- Owns all Playwright test logic, fixtures, assertions, and reporter setup.

Non-goal in this repo:
- Do not add or maintain Playwright test suites here as part of normal workflow.

---

## 2) Runtime and App Overview

Frontend:
- React app (`react-scripts`)
- Port comes from `.env` (`PORT=5173`)
- Base URL: `http://localhost:5173`

Backend:
- `json-server`
- Base URL: `http://localhost:5000`
- Data file: `db/db.json`

Start commands:
- Full stack: `npm start`
- FE only: `npm run client`
- API only: `npm run server`

Routes:
- `/`
- `/products`
- `/login`
- `/cart`
- `/test-cases`
- `/api-testing`
- `/contact`

State behavior:
- Auth users are loaded from API resource `authUsers`.
- Cart is localStorage based (`cart` key), not API based.
- `/test-cases` is a dedicated deterministic QA Failure Lab.

---

## 3) API Endpoints Used by UI

Auth users:
- `GET /authUsers`
- `POST /authUsers`
- `GET /authUsers/:id`
- `PUT /authUsers/:id`
- `PATCH /authUsers/:id`
- `DELETE /authUsers/:id`

Cart API resource exists but is not used by current cart UI:
- `GET /cartItems`
- `POST /cartItems`
- `GET /cartItems/:id`
- `PUT /cartItems/:id`
- `PATCH /cartItems/:id`
- `DELETE /cartItems/:id`

---

## 4) Selector Strategy

Priority order:
1. `getByTestId()`
2. `getByRole()`
3. `getByText()`
4. `getByPlaceholder()`
5. CSS selectors only as fallback

Rule:
- Prefer FE-provided stable hooks over brittle structure/text locators.

---

## 5) Stable FE Hooks by Page

Home (`/`):
- `home-hero`
- `home-test-cases-button`
- `home-api-practice-button`
- `featured-products`
- `recommended-products`

Products (`/products`):
- `products-search-input`
- `products-search-submit`
- `products-category-list`
- `products-brand-list`
- `products-grid`
- `products-empty-state`

Product card hooks:
- `product-card`
- `product-overlay`
- `add-to-cart-button`
- `view-product-button`
- `product-name`
- `product-price`

Product card attributes:
- `data-product-id` on card-level and key controls

Login (`/login`):
- `login-form`
- `login-email`
- `login-password`
- `login-submit`
- `signup-form`
- `signup-name`
- `signup-email`
- `signup-password`
- `signup-submit`
- `auth-message`

Cart (`/cart`):
- `cart-empty-state`
- `cart-table`
- `cart-row`
- `cart-quantity-control`
- `cart-quantity-input`
- `cart-remove-button`
- `clear-cart-button`
- `cart-total`
- `checkout-button`

Cart notification:
- `cart-notification`
- `cart-notification-message`

---

## 6) Recommended Test Scope (for Separate Playwright Repo)

Smoke:
1. Core routes render and key hooks are visible.
2. Header navigation links render.

Auth:
1. Signup success with unique email.
2. Duplicate signup error.
3. Login success.
4. Login invalid credentials error.
5. Logout with confirm dialog.

Products + Cart:
1. Add-to-cart from home and products.
2. Cart badge/count behavior.
3. Quantity increase/decrease.
4. Remove item.
5. Clear cart.
6. Cart totals and empty state.

Search and filters:
1. Search by name.
2. Category filter.
3. Brand filter.
4. Combined search + filters.

---

## 7) State Reset Strategy

Browser reset before each test:
- `await page.goto('/')`
- `await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); })`

Optional API cleanup:
- Delete test users from `authUsers` by unique email pattern.

Recommended test email format:
- `qa+<timestamp>@example.com`

---

## 8) QA Failure Lab (`/test-cases`)

Purpose:
- Controlled deterministic surface for reproducing complex Playwright failures.
- Isolated from normal business pages.

Deep-link query params:
- `scenario` (required for deterministic setup)
- `mode` (optional; defaults to scenario default mode)
- `duration` (optional ms; clamped to `500..60000` when scenario supports duration)
- `autoStart` (optional; `1` or `true` for scenarios supporting auto-start)

Examples:
- `/test-cases?scenario=ELEMENT_OBSCURED`
- `/test-cases?scenario=ASSERT_TIMEOUT&mode=never-resolve`
- `/test-cases?scenario=TEST_TIMEOUT&duration=40000&autoStart=1`

Core QA hooks:
- `scenario-list`
- `scenario-card-<CODE>`
- `active-scenario`
- `scenario-mode`
- `scenario-status`
- `scenario-reset`
- `scenario-target`

Scenario metadata attributes:
- `data-scenario-code` on active workspace
- `data-scenario-mode` on active workspace
- `data-scenario-state` on scenario status

---

## 9) QA Scenario Catalog

Scenarios currently available:
- `TEST_TIMEOUT`
- `ASSERT_TIMEOUT`
- `ACTION_TIMEOUT`
- `ELEMENT_NOT_VISIBLE`
- `ELEMENT_NOT_STABLE`
- `ELEMENT_OBSCURED`
- `ELEMENT_DISABLED`
- `LOCATOR_NOT_FOUND`
- `LOCATOR_MULTIPLE_MATCHES`
- `STALE_DOM_REFERENCE`
- `NAVIGATION_TIMEOUT`
- `NETWORK_REQUEST_FAILED`
- `PAGE_CLOSED`
- `APP_RUNTIME_ERROR`

Current default modes:
- `TEST_TIMEOUT`: `long-load`
- `ASSERT_TIMEOUT`: `never-resolve`
- `ACTION_TIMEOUT`: `blocked-overlay`
- `ELEMENT_NOT_VISIBLE`: `display-none`
- `ELEMENT_NOT_STABLE`: `continuous`
- `ELEMENT_OBSCURED`: `full-overlay`
- `ELEMENT_DISABLED`: `delayed-enable`
- `LOCATOR_NOT_FOUND`: `not-mounted`
- `LOCATOR_MULTIPLE_MATCHES`: `duplicate-buttons`
- `STALE_DOM_REFERENCE`: `auto-remount`
- `NAVIGATION_TIMEOUT`: `infinite-loading-shell`
- `NETWORK_REQUEST_FAILED`: `success`
- `PAGE_CLOSED`: `auto-close-window`
- `APP_RUNTIME_ERROR`: `throw-on-mount`

---

## 10) Known Risks and Flake Mitigation

Risks:
1. Login page has duplicate email/password concepts (login and signup sections).
2. Success banners are transient.
3. Native confirm dialogs block flow if not handled.
4. Popup-related scenarios can fail in restricted browser environments.

Mitigations:
- Prefer `data-testid` hooks over text-only locators.
- Use scoped locators for login/signup forms.
- Explicitly handle dialogs in tests.
- Keep popup lifecycle assertions tolerant to environment restrictions.

Dialog handling example:
- `page.on('dialog', d => d.accept())`

---

## 11) Suggested Playwright Config (Separate Repo)

Recommended values:
- `baseURL`: `http://localhost:5173`
- `trace`: `on-first-retry`
- `screenshot`: `only-on-failure`
- `video`: `retain-on-failure`

If you manage app startup from Playwright:
- web server command: `npm start`
- expected URL: `http://localhost:5173`
- `reuseExistingServer: true`
- startup timeout: `120000`

---

## 12) FE Validation Commands (This Repo)

Use these to verify FE contract before Playwright-repo updates:
- `CI=1 npm test`
- `npm run build`

If these fail, fix FE first, then update Playwright selectors/tests in the separate repo.

---

## 13) Change Management Checklist

When FE changes are merged, update this file with:
1. Route changes
2. Selector additions/removals
3. Auth/cart state behavior changes
4. QA Failure Lab scenario/mode/query-param changes
5. Known flake risks and mitigations

Checklist:
- [ ] Routes reviewed
- [ ] Selectors reviewed
- [ ] API/state behavior reviewed
- [ ] QA lab contract reviewed
- [ ] Risk notes reviewed
