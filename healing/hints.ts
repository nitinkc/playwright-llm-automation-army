export type HealHint = {
  kind: 'input' | 'button' | 'nav' | 'region'
  labelText?: RegExp
  placeholder?: RegExp
  ariaLabel?: RegExp
  buttonText?: RegExp
  stableTestIds?: string[]
  // Optional: narrow the search to a specific container (helps with duplicated forms).
  withinSelector?: string
}

export const HINTS: Record<string, HealHint> = {
  'home.hero': { kind: 'region', stableTestIds: ['home-hero'] },
  'home.testCasesButton': { kind: 'button', stableTestIds: ['home-test-cases-button'], buttonText: /test cases/i },
  'home.apiPracticeButton': { kind: 'button', stableTestIds: ['home-api-practice-button'], buttonText: /api/i },
  'home.featuredProducts': { kind: 'region', stableTestIds: ['featured-products'] },
  'home.recommendedProducts': { kind: 'region', stableTestIds: ['recommended-products'] },

  'products.searchInput': { kind: 'input', stableTestIds: ['products-search-input'], placeholder: /search/i },
  'products.searchSubmit': { kind: 'button', stableTestIds: ['products-search-submit'], buttonText: /search/i },
  'products.categoryList': { kind: 'region', stableTestIds: ['products-category-list'] },
  'products.brandList': { kind: 'region', stableTestIds: ['products-brand-list'] },
  'products.grid': { kind: 'region', stableTestIds: ['products-grid'] },
  'products.emptyState': { kind: 'region', stableTestIds: ['products-empty-state'] },

  'product.card': { kind: 'region', stableTestIds: ['product-card'] },
  'product.overlay': { kind: 'region', stableTestIds: ['product-overlay'] },
  'product.addToCart': { kind: 'button', stableTestIds: ['add-to-cart-button'], buttonText: /add to cart/i },
  'product.viewProduct': { kind: 'button', stableTestIds: ['view-product-button'], buttonText: /view/i },
  'product.name': { kind: 'region', stableTestIds: ['product-name'] },
  'product.price': { kind: 'region', stableTestIds: ['product-price'] },

  'login.form': { kind: 'region', stableTestIds: ['login-form'] },
  'login.email': { kind: 'input', stableTestIds: ['login-email'], labelText: /email/i },
  'login.password': { kind: 'input', stableTestIds: ['login-password'], labelText: /password/i },
  'login.submit': { kind: 'button', stableTestIds: ['login-submit'], buttonText: /login/i },

  'signup.form': { kind: 'region', stableTestIds: ['signup-form'] },
  'signup.name': { kind: 'input', stableTestIds: ['signup-name'], labelText: /name/i },
  'signup.email': { kind: 'input', stableTestIds: ['signup-email'], labelText: /email/i },
  'signup.password': { kind: 'input', stableTestIds: ['signup-password'], labelText: /password/i },
  'signup.submit': { kind: 'button', stableTestIds: ['signup-submit'], buttonText: /signup|sign up|register/i },

  'auth.message': { kind: 'region', stableTestIds: ['auth-message'] },

  'cart.emptyState': { kind: 'region', stableTestIds: ['cart-empty-state'] },
  'cart.table': { kind: 'region', stableTestIds: ['cart-table'] },
  'cart.row': { kind: 'region', stableTestIds: ['cart-row'] },
  'cart.quantityControl': { kind: 'region', stableTestIds: ['cart-quantity-control'] },
  'cart.quantityInput': { kind: 'input', stableTestIds: ['cart-quantity-input'] },
  'cart.removeButton': { kind: 'button', stableTestIds: ['cart-remove-button'] },
  'clearCart.button': { kind: 'button', stableTestIds: ['clear-cart-button'], buttonText: /clear/i },
  'cart.total': { kind: 'region', stableTestIds: ['cart-total'] },
  'checkout.button': { kind: 'button', stableTestIds: ['checkout-button'], buttonText: /checkout/i },

  'cart.notification': { kind: 'region', stableTestIds: ['cart-notification'] },
  'cart.notificationMessage': { kind: 'region', stableTestIds: ['cart-notification-message'] },

  'scenario.list': { kind: 'region', stableTestIds: ['scenario-list'] },
  'scenario.active': { kind: 'region', stableTestIds: ['active-scenario'] },
  'scenario.mode': { kind: 'region', stableTestIds: ['scenario-mode'] },
  'scenario.status': { kind: 'region', stableTestIds: ['scenario-status'] },
  'scenario.reset': { kind: 'button', stableTestIds: ['scenario-reset'], buttonText: /reset/i },
  'scenario.target': { kind: 'region', stableTestIds: ['scenario-target'] }
}
