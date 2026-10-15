# Anihan Market — Front-end prototype

A responsive marketplace concept for Filipino farmers, built with plain HTML, CSS, and JavaScript.

## Files
- `index.html` — shopper storefront, cart dialog, farmer information dialog, admin dashboard
- `style.css` — responsive styling (mobile-first adjustments for shopper view; desktop-friendly admin)
- `app.js` — product catalog, search, category filters, basket quantity controls, and sample dashboard data

## Run
Open `index.html` in a browser, or use the VS Code Live Server extension.

## Concept and business model
- Farmers list products and choose the product prices.
- Buyers browse from a mobile phone and add produce to a basket.
- Marketplace service fee shown in the prototype: 10%; the farmer share is 90% of product sales before any separately disclosed delivery/payment costs.
- Admin uses a desktop-oriented dashboard for overview, products, orders, and farmers.

## Important before launch
This is a front-end demo. It does not have user accounts, database storage, real checkout, payment processing, delivery integration, or secure admin authentication. Dashboard numbers and orders are sample data. For production, build a backend/API and database, verify farmer identities, implement secure role-based access, validate prices and stock server-side, protect personal data, add order/payout reconciliation, and use a trusted payment provider. Do not rely on hiding the admin panel in JavaScript as access control.
