# Implementation Plan: Anihan Market Full Functionality

This plan transforms the Anihan Market front-end prototype into a fully functional agricultural marketplace with user authentication, expanded product catalog (20 products), shopping cart with checkout, order management, and admin CRUD operations, all persisted in localStorage.

**Original request (Tagalog):** "paganahin mo lahat ng nasa project na ito gust ko merong user side at merong admin si user yung bibibli ng mga product then si admin ang maga monitor ng mga product patungkol ito sa agriculture at yung mga product na kailanga ilagay mo jan with images halimbawa palay at marami pang iba"

**Translation:** Make everything in this project functional. I want a user side and an admin side. The user will buy products and the admin will monitor the products. This is about agriculture and the products that need to be included with images, for example palay (rice) and many others.

---

## Implementation Order

The work is organized into 4 features, implemented sequentially:

1. **FEAT-001**: Data persistence layer (database.js)
2. **FEAT-002**: Authentication system (auth.js)
3. **FEAT-003**: Product catalog expansion (8 → 20 products, add Root Crops category)
4. **FEAT-004**: UI integration (modals, checkout flow, admin CRUD)

---

## FEAT-001: Data Persistence Layer (database.js)

### Objective
Create localStorage-based data layer with CRUD operations for products, orders, and users.

### Steps

- [ ] 1. Create `c:\MIdtermProject\anihan_market\database.js` as ES6 module
      Files: database.js
      Verify: Open index.html in browser, test import in DevTools Console

- [ ] 2. Implement product data functions
      Export: `initDatabase()` (populates anihan_products with 20-product catalog on first run), `getProducts()`, `addProduct(obj)`, `updateProduct(id, updates)`, `deleteProduct(id)`
      Files: database.js
      Verify: In DevTools Console: `import('./database.js').then(db => { db.initDatabase(); console.log(db.getProducts().length); })` — should log 20

- [ ] 3. Implement order data functions
      Export: `getOrders()`, `addOrder(orderObj)` (auto-generates id and createdAt), `updateOrderStatus(orderId, newStatus)`
      Files: database.js
      Verify: In DevTools Console test addOrder and getOrders, check localStorage

- [ ] 4. Implement user data functions
      Export: `getUsers()`, `addUser(userObj)` (auto-generates id and createdAt), `findUserByEmail(email)`
      Files: database.js
      Verify: In DevTools Console test addUser and findUserByEmail

- [ ] 5. Implement session management functions
      Export: `getSession()`, `setSession(userObj)`, `clearSession()`
      Files: database.js
      Verify: In DevTools Console test setSession/getSession/clearSession, check localStorage anihan_session key

### localStorage Schema
- `anihan_products`: array of product objects `{id, name, category, price, unit, farmer, origin, tag, emoji, image, stock, description}`
- `anihan_orders`: array of order objects `{id, userId, userName, items, total, status, deliveryAddress, phone, paymentMethod, createdAt}`
- `anihan_users`: array of user objects `{id, name, email, passwordHash, phone, address, createdAt}`
- `anihan_session`: current user object `{id, name, email, role: 'user'|'admin'}`

### Acceptance Criteria
- All 15 functions implemented and exported
- initDatabase() creates 20 products on first run
- All CRUD operations persist to localStorage
- Functions handle missing keys gracefully (return empty array or null)
- No console errors

---

## FEAT-002: Authentication System (auth.js)

### Objective
Create authentication with user registration, login, logout, session management, and hardcoded admin access.

### Steps

- [ ] 1. Create `c:\MIdtermProject\anihan_market\auth.js` as ES6 module
      Import from database.js: getUsers, addUser, findUserByEmail, getSession, setSession, clearSession
      Files: auth.js
      Verify: Import test in DevTools Console

- [ ] 2. Implement password utilities
      Export: `hashPassword(plaintext)` returns btoa(plaintext) with comment "DEMO ONLY: btoa is NOT secure for production"
      Export: `verifyPassword(plaintext, hash)` returns btoa(plaintext) === hash
      Files: auth.js
      Verify: Test in console: hashPassword and verifyPassword with test strings

- [ ] 3. Implement user registration
      Export: `registerUser({name, email, password, phone, address})` validates email uniqueness, hashes password, calls addUser, returns `{success, user}` or `{success: false, error}`
      Files: auth.js
      Verify: In console register test user, check anihan_users in localStorage

- [ ] 4. Implement user login
      Export: `loginUser(email, password)` validates credentials, sets session with role: 'user', returns result object
      Files: auth.js
      Verify: In console login with test user, check anihan_session in localStorage

- [ ] 5. Implement admin login
      Export: `loginAdmin(email, password)` checks email === 'admin@anihan.ph' && password === 'anihan2024admin', sets session with role: 'admin'
      Files: auth.js
      Verify: In console login with admin credentials, verify isAdmin() returns true

- [ ] 6. Implement session helpers
      Export: `logout()`, `getCurrentUser()`, `isAuthenticated()`, `isAdmin()`, `requireAuth(callback)`, `requireAdmin(callback)`
      Files: auth.js
      Verify: Test each function in console, verify session persistence after page refresh

### Hardcoded Admin Credentials
- Email: admin@anihan.ph
- Password: anihan2024admin

### Acceptance Criteria
- All 11 auth functions implemented and exported
- Registration creates user with hashed password
- Login validates credentials and creates session
- Admin login accepts only hardcoded credentials
- Session persists across page refresh
- No console errors

---

## FEAT-003: Product Catalog Expansion

### Objective
Expand from 8 to 20 agricultural products across 4 categories, add Root Crops category tab.

### Steps

- [ ] 1. Expand products array in app.js to 20 items
      Keep existing 8, add 12 new products with Unsplash images and all required fields (id, name, category, price, unit, farmer, origin, tag, emoji, image, stock, description)
      Files: app.js
      Verify: Open index.html, verify 20 products display

- [ ] 2. Add 7 Vegetables products
      Existing: Pechay, Tomatoes, Eggplant, Red Onion
      New: Sitaw (string beans), Kangkong (water spinach), Ampalaya (bitter gourd)
      Assign appropriate Unsplash images, prices, farmers, emojis
      Files: app.js
      Verify: Click Vegetables tab, see 7 products

- [ ] 3. Add 6 Fruits products
      Existing: Carabao Mango, Lakatan Banana, Pineapple
      New: Papaya, Watermelon, Calamansi
      Assign appropriate Unsplash images, prices, farmers, emojis
      Files: app.js
      Verify: Click Fruits tab, see 6 products

- [ ] 4. Add 4 Rice & Grains products
      Existing: Brown Rice
      New: White Rice (Sinandomeng), Palay (Unmilled Rice), White Corn
      Assign appropriate Unsplash images, prices, farmers, emojis
      Files: app.js
      Verify: Click Rice & grains tab, see 4 products

- [ ] 5. Add 3 Root Crops products (NEW CATEGORY)
      New: Kamote (Sweet Potato), Gabi (Taro), Ube (Purple Yam)
      Assign appropriate Unsplash images, prices, farmers, emojis
      Files: app.js
      Verify: Products created with category "Root Crops"

- [ ] 6. Add Root Crops category tab to UI
      Modify index.html: add `<button class="category" data-category="Root Crops">🍠 Root Crops</button>` in .category-tabs after Rice & grains button
      Files: index.html
      Verify: Root Crops tab appears in UI, clicking it shows 3 products

- [ ] 7. Add description field to all 20 products
      Each product gets a brief 1-sentence description
      Files: app.js
      Verify: Inspect products array in console, all have description field

### Product Categories & Counts
- **Vegetables** (7): Pechay, Tomatoes, Eggplant, Red Onion, Sitaw, Kangkong, Ampalaya
- **Fruits** (6): Carabao Mango, Lakatan Banana, Pineapple, Papaya, Watermelon, Calamansi
- **Rice & Grains** (4): Brown Rice, White Rice Sinandomeng, Palay, White Corn
- **Root Crops** (3): Kamote, Gabi, Ube

### Acceptance Criteria
- Exactly 20 products in catalog
- All products have all required fields including stock and description
- Root Crops tab appears and works
- Category filter works for all 4 categories
- Search works with expanded catalog
- All images load from Unsplash or show emoji fallback

---

## FEAT-004: UI Integration & Complete Functionality

### Objective
Connect everything: auth modals, checkout flow, order history, user profile, admin CRUD for products/orders/customers.

### Steps

#### HTML Modals (index.html modifications)

- [ ] 1. Add module script tags
      Add `<script type="module" src="database.js"></script>` and `<script type="module" src="auth.js"></script>` before app.js script tag
      Convert app.js script tag to `<script type="module" src="app.js"></script>`
      Files: index.html
      Verify: No script loading errors in console

- [ ] 2. Add Login/Register modal
      Add `<dialog id="authDialog">` with two forms: loginForm and registerForm, tabs to switch between them
      Forms: login (email, password), register (name, email, password, phone, address)
      Files: index.html
      Verify: Modal appears when opened via showModal()

- [ ] 3. Add Admin Login modal
      Add `<dialog id="adminAuthDialog">` with adminLoginForm (email pre-filled with admin@anihan.ph, password)
      Files: index.html
      Verify: Modal structure correct

- [ ] 4. Add Checkout modal
      Add `<dialog id="checkoutDialog">` with checkoutForm (address textarea, phone, payment method dropdown with "Cash on Delivery", order total display)
      Files: index.html
      Verify: Modal structure correct

- [ ] 5. Add Order Confirmation modal
      Add `<dialog id="orderConfirmDialog">` showing order id and "Continue shopping" button
      Files: index.html
      Verify: Modal structure correct

- [ ] 6. Add My Orders modal
      Add `<dialog id="ordersDialog">` with empty div `#userOrdersList` for rendering order history
      Files: index.html
      Verify: Modal structure correct

- [ ] 7. Add User Profile modal
      Add `<dialog id="profileDialog">` with profileForm (name, email disabled, phone, address)
      Files: index.html
      Verify: Modal structure correct

- [ ] 8. Add Product Form modal (admin)
      Add `<dialog id="productDialog">` with productForm (all product fields: name, category, price, unit, stock, farmer, origin, tag, emoji, image URL, description, hidden id field)
      Files: index.html
      Verify: Modal structure correct

- [ ] 9. Modify topbar user actions area
      Replace .top-actions content: keep delivery pill, replace admin button with `<div id="userActions">` containing login button (will be dynamically updated by JS)
      Files: index.html
      Verify: Topbar structure correct

#### CSS Styles (style.css modifications)

- [ ] 10. Add authentication modal styles
      Add styles for: .auth-tabs, .auth-tab, .auth-form, .auth-form label/input/textarea/select, focus states
      Files: style.css
      Verify: Auth modals render correctly styled

- [ ] 11. Add user actions styles
      Add styles for: .user-actions, .user-greeting, .icon-button
      Files: style.css
      Verify: Topbar user actions area styled correctly

- [ ] 12. Add order card styles
      Add styles for: .orders-list, .order-card, .order-card-header/id/date/items/footer/total
      Files: style.css
      Verify: Order history renders correctly

- [ ] 13. Add responsive styles for new elements
      Add @media queries for user-actions and icon-button at 700px breakpoint
      Files: style.css
      Verify: New elements responsive on mobile viewport

#### JavaScript Integration (app.js modifications)

- [ ] 14. Add imports and initialization
      Add imports: `import * as db from './database.js'; import * as auth from './auth.js';`
      Replace hardcoded products array with `let products = [];`
      Add initApp() function: calls db.initDatabase(), loads products from db.getProducts(), calls renderProducts() and updateUIForAuth()
      Add DOMContentLoaded listener calling initApp()
      Files: app.js
      Verify: Page loads, products display from database

- [ ] 15. Implement updateUIForAuth()
      Checks auth.isAuthenticated() and updates topbar #userActions:
      If authenticated user: show user name, My Orders button, Profile button, Logout button
      If authenticated admin: also show Admin Dashboard button
      If not authenticated: show Log In button only
      Files: app.js
      Verify: Topbar updates correctly based on auth state

- [ ] 16. Wire up Login/Register modal
      #loginButton click → open authDialog
      #loginTab/#registerTab clicks → toggle forms
      #loginForm submit → auth.loginUser(), update UI, notify
      #registerForm submit → auth.registerUser(), auto-login, update UI, notify
      Files: app.js
      Verify: Can register and login, UI updates, session persists

- [ ] 17. Wire up Admin Login
      Replace existing #adminSwitch logic
      If auth.isAdmin(): show admin view
      Else: open adminAuthDialog
      #adminLoginForm submit → auth.loginAdmin(), show admin view, update UI
      Files: app.js
      Verify: Admin login required to access dashboard

- [ ] 18. Wire up Checkout flow
      Replace #checkoutButton handler
      Check auth.isAuthenticated(), if not: prompt login
      Open checkoutDialog, pre-fill address/phone from user profile
      #checkoutForm submit → create order object, db.addOrder(), show confirmation, clear cart
      Files: app.js
      Verify: Complete checkout flow works, order saved to localStorage

- [ ] 19. Wire up My Orders
      Add My Orders button to userActions when authenticated
      Click → open ordersDialog
      Render user's orders from db.getOrders() filtered by userId, display as order cards (id, date, items, total, status)
      Files: app.js
      Verify: User can view their past orders

- [ ] 20. Wire up User Profile
      Add Profile button to userActions when authenticated
      Click → open profileDialog, pre-fill with user data
      #profileForm submit → update user in localStorage users array, update session, notify
      Files: app.js
      Verify: User can edit name/phone/address

- [ ] 21. Wire up Logout
      Add Logout button to userActions when authenticated
      Click → auth.logout(), updateUIForAuth(), notify, if admin view visible: switch to buyer view
      Files: app.js
      Verify: Logout clears session, UI resets

- [ ] 22. Wire up Admin Products CRUD
      Modify products table to load from db.getProducts()
      Add Edit/Delete buttons to each table row
      #addProductButton → open productDialog (empty form)
      Edit button → open productDialog (pre-filled)
      #productForm submit → if id: db.updateProduct(), else: db.addProduct(), refresh table
      Delete button → confirm, db.deleteProduct(), refresh table
      Files: app.js
      Verify: Admin can add/edit/delete products, changes persist

- [ ] 23. Wire up Admin Orders management
      Modify orders table to load from db.getOrders()
      Add status dropdown per row (Pending/Processing/Delivered)
      Dropdown change → db.updateOrderStatus(), refresh table
      Files: app.js
      Verify: Admin can update order status

- [ ] 24. Wire up Admin Customers view
      Rename Farmers tab to Customers in HTML
      Replace hardcoded farmer cards with dynamic table from db.getUsers()
      Columns: Name, Email, Phone, Registered Date, Total Orders (count from orders)
      Files: index.html, app.js
      Verify: Admin can view all registered customers

- [ ] 25. Wire up Admin Overview stats
      Calculate from db.getOrders(): total revenue, farmer earnings (90%), platform revenue (10%), order count
      Update stat card values: #grossSales, #farmerEarnings, #platformRevenue, #orderTotal
      Update recent orders table from latest orders
      Files: app.js
      Verify: Overview stats calculated from real data

- [ ] 26. Implement cart persistence
      On page load, restore cart from localStorage key 'anihan_cart'
      On cart update, save to localStorage
      Files: app.js
      Verify: Cart persists across page refresh

- [ ] 27. Wire all modal close buttons
      Ensure all new modals' [data-close] buttons work
      Files: app.js
      Verify: All modals can be closed

### Acceptance Criteria
- User can register, login, logout
- Session persists on refresh
- Logged-in user can browse, add to cart, checkout
- Checkout requires login
- Order confirmation shows order id
- My Orders shows user's past orders
- User Profile editable
- Admin login required for dashboard
- Admin can CRUD products
- Admin can view and update order status
- Admin can view customers
- Admin Overview shows calculated stats
- Cart persists on refresh
- All modals functional
- No console errors

---

## Testing Checklist

### User Flow
1. ✓ Register new account
2. ✓ Login with credentials
3. ✓ Browse 20 products across 4 categories
4. ✓ Search products
5. ✓ Add products to cart
6. ✓ Update cart quantities
7. ✓ Checkout (with login required)
8. ✓ View order confirmation
9. ✓ View order history
10. ✓ Edit profile
11. ✓ Logout
12. ✓ Session persistence (refresh page)

### Admin Flow
1. ✓ Admin login (admin@anihan.ph / anihan2024admin)
2. ✓ View Overview with calculated stats
3. ✓ Add new product
4. ✓ Edit existing product
5. ✓ Delete product
6. ✓ View all orders
7. ✓ Update order status
8. ✓ View customers list
9. ✓ Logout

### Data Persistence
1. ✓ localStorage anihan_products populated with 20 products
2. ✓ localStorage anihan_users contains registered users
3. ✓ localStorage anihan_orders contains placed orders
4. ✓ localStorage anihan_session persists on refresh
5. ✓ localStorage anihan_cart persists on refresh

### Responsive Design
1. ✓ All modals work on mobile viewport
2. ✓ Product grid responsive (4→3→2 columns)
3. ✓ Admin dashboard usable on desktop
4. ✓ Topbar responsive on mobile

---

## Risks & Edge Cases

### Security Warnings
- **btoa() password hashing is NOT secure** — demo only, plaintext reversible with atob()
- **localStorage accessible via JavaScript** — anyone with DevTools can read/modify data
- **No server-side validation** — all data trusted
- **Admin credentials hardcoded in client code** — visible in source
- Production requires: server-side auth, bcrypt/argon2, HTTPS, CSRF protection, rate limiting

### Edge Cases to Handle
1. **Empty states**: empty cart, no orders, no products
2. **Duplicate email registration**: show error message
3. **Invalid login**: show error message
4. **Cart persistence**: handle corrupted localStorage data
5. **Image loading failures**: emoji fallback already implemented
6. **Long product names/descriptions**: CSS overflow handling
7. **Admin deleting all products**: allow but show empty state
8. **User deleting own account**: not implemented (future feature)
9. **Order cancellation**: not implemented (future feature)
10. **Stock management**: stock field exists but not enforced (future feature)

### Browser Compatibility
- Requires ES6+ support (arrow functions, template literals, modules)
- Requires `<dialog>` element support (Chrome 37+, Firefox 98+, Safari 15.4+)
- Requires localStorage API
- Tested on: Chrome, Edge, Firefox (modern versions)

---

## File Changes Summary

### New Files
- `c:\MIdtermProject\anihan_market\database.js` — localStorage data layer
- `c:\MIdtermProject\anihan_market\auth.js` — authentication system

### Modified Files
- `c:\MIdtermProject\anihan_market\index.html` — add 8 modals, modify topbar, add Root Crops tab, convert scripts to modules
- `c:\MIdtermProject\anihan_market\app.js` — convert to module, integrate auth/database, expand products to 20, wire all features
- `c:\MIdtermProject\anihan_market\style.css` — add modal styles, auth form styles, order card styles, user actions styles

### Unchanged Files
- `c:\MIdtermProject\anihan_market\README.md` — (could be updated to reflect new features, but not required)

---

## Implementation Notes

1. **Feature independence**: FEAT-001, FEAT-002, FEAT-003 can be developed independently. FEAT-004 depends on all three.

2. **Testing strategy**: Each feature has its own verification steps. Manual testing in browser with DevTools open.

3. **No build process**: All files edited directly, no compilation. Refresh browser to see changes.

4. **Module system**: Using native ES6 modules (`type="module"` in script tags, import/export statements).

5. **Data initialization**: First page load calls db.initDatabase() which populates products. Subsequent loads use existing localStorage data.

6. **Session management**: anihan_session checked on page load. If exists, UI shows authenticated state.

7. **Cart behavior**: Cart in memory (cart object) + localStorage for persistence. Cleared after successful checkout.

8. **Admin access**: Admin role is separate from user role. Same session mechanism but different credentials and permissions.

9. **Order ID generation**: Simple counter-based (e.g., #AN-1001, #AN-1002). In production, use UUID or server-generated ID.

10. **Image hosting**: Using Unsplash for product images. In production, use CDN or local assets.

---

## Future Enhancements (Out of Scope)

- Server-side API and database
- Real payment processing
- Email notifications
- Order tracking/delivery integration
- Farmer onboarding/verification
- Product reviews and ratings
- Advanced search/filters (price range, location)
- Stock management enforcement
- Multi-language support (English/Tagalog toggle)
- User account deletion
- Order cancellation/refund
- Admin analytics dashboard
- Export orders to CSV
- SMS notifications

---

**End of Plan**
