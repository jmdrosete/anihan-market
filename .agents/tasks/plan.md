# Implementation Plan - Anihan Market E-Commerce Features

This plan implements critical e-commerce functionality for the Anihan Market agricultural products platform. The system uses vanilla JavaScript with localStorage persistence - no build tools or backend required.

## Overview

**Current state:** Authentication (user/admin), product catalog (20 items), basic cart and checkout exist. Admin dashboard has limited functionality.

**Goal:** Complete the marketplace with order history, stock management, order status updates, product CRUD, and user profiles.

**Technology:** Pure HTML/CSS/JS with ES6 modules, localStorage data layer, responsive design.

---

## Implementation Steps

- [ ] 1. **User Order History - Database Functions**
      Add getUserOrders(userId) to database.js that filters getOrders() by userId and returns array sorted by createdAt descending (newest first).
      Files: c:\MIdtermProject\anihan_market\database.js
      Verify: Open browser console, run `import {getUserOrders} from './database.js'; console.log(getUserOrders('user_test'))` - should return filtered orders array.

- [ ] 2. **User Order History - UI and Modal**
      Add 'My Orders' button to topbar userInfo div in index.html (after userName, before logoutButton). Create orderHistoryDialog modal with modal-head (title 'My Orders'), filter tabs container (All/Pending/Processing/Delivered/Cancelled buttons with .category styling), orders list container (#ordersList), close button. In app.js, add renderOrderHistory() function that calls getUserOrders(currentUser.id), renders order cards showing order.id, formatted date, items.length, total (peso), status badge, and 'Reorder' button per order. Implement filter tabs with click handlers that filter displayed orders by status. Add 'My Orders' button click handler to show modal.
      Files: c:\MIdtermProject\anihan_market\index.html, c:\MIdtermProject\anihan_market\app.js
      Verify: Open index.html, login as user, place test orders, click 'My Orders' - modal opens showing orders. Test filter tabs. Check responsive layout on mobile viewport.

- [ ] 3. **User Order History - Reorder Functionality**
      In app.js renderOrderHistory(), add reorder button handler that reads order.items array, iterates items, sets cart[item.productId] = item.quantity, calls updateCartCount(), shows 'Items added to cart!' toast, and closes modal. Add empty state in ordersList when getUserOrders returns empty array: display message 'You haven't placed any orders yet. Start shopping!' with empty-state class.
      Files: c:\MIdtermProject\anihan_market\app.js
      Verify: Click 'Reorder' on order - verify cart count updates, cart modal shows correct items and quantities, toast appears. Test with user who has no orders - verify empty state message.

- [ ] 4. **Product Stock Management - Database Functions**
      Add updateProductStock(productId, quantityDelta) to database.js that gets products array, finds product by id, adds quantityDelta to product.stock, validates stock >= 0, saves to localStorage anihan_products, returns updated product or null if not found. Add getLowStockProducts(threshold = 10) that returns getProducts().filter(p => p.stock < threshold).
      Files: c:\MIdtermProject\anihan_market\database.js
      Verify: Browser console test: `import {updateProductStock} from './database.js'; updateProductStock(1, -5)` - check product stock decreased by 5 in localStorage.

- [ ] 5. **Product Stock Management - Checkout Integration**
      In app.js checkoutButton handler, after successful addOrder() call, iterate through cart Object.entries, call updateProductStock(Number(id), -quantity) for each item. After all stock updates, call renderProducts() to refresh product grid with new stock levels. Clear cart after as currently implemented.
      Files: c:\MIdtermProject\anihan_market\app.js
      Verify: Add items to cart, checkout - verify product stock decreased in localStorage and product grid updates to show new stock levels. Place order that depletes stock to 0 - verify next step's out-of-stock badge appears.

- [ ] 6. **Product Stock Management - UI Indicators**
      In app.js renderProducts(), add stock checks in product card template: if product.stock === 0, add `<span class="product-tag" style="background:#e74c3c;color:white;top:50px;">Out of Stock</span>` and set add-button to disabled with style="opacity:0.5;cursor:not-allowed;pointer-events:none". If product.stock < 10 && product.stock > 0, add `<div style="font-size:9px;color:#e67e22;font-weight:700;margin-top:5px;">⚠ Only ${product.stock} left!</div>` after product-price div. In addToCart(), before incrementing cart[id], check if (cart[id]||0) + 1 > products.find(p=>p.id===id).stock - if true, notify(`Cannot add more - only ${stock} in stock`) and return early.
      Files: c:\MIdtermProject\anihan_market\app.js
      Verify: Set a product stock to 0 via localStorage, refresh page - verify 'Out of Stock' badge and disabled button. Set stock to 5 - verify 'Only 5 left!' warning appears. Try adding more than available stock to cart - verify error toast.

- [ ] 7. **Product Stock Management - Admin Low Stock Alerts**
      In app.js loadAdminData(), after stats-grid, add low stock alert: call getLowStockProducts(), if array.length > 0, insert admin-note div with orange background (#fff1dc), icon ⚠, heading 'Low Stock Alert', message `${count} products below 10 units`, and list of low stock items showing name, current stock. Update productsTable to show conditional stock badges: if stock === 0, red badge 'Out of Stock', if stock < 10, orange badge `Low (${stock})`, else green badge `In Stock (${stock})`.
      Files: c:\MIdtermProject\anihan_market\app.js
      Verify: Login as admin, view dashboard - if any products have stock < 10, verify alert appears with correct count and product list. Check Products tab - verify stock badges show with correct colors.

- [ ] 8. **Admin Order Status Management - Database Enhancement**
      Modify updateOrderStatus() in database.js to add timestamp: after `orders[index].status = newStatus`, add `orders[index].updatedAt = new Date().toISOString()`.
      Files: c:\MIdtermProject\anihan_market\database.js
      Verify: Browser console: `import {updateOrderStatus} from './database.js'; updateOrderStatus('#AN-123456', 'Processing')` - check localStorage order has updatedAt field.

- [ ] 9. **Admin Order Status Management - Dropdown UI**
      Create statusChangeDialog modal in index.html with modal-head, message paragraph (#statusChangeMessage), confirm button (class checkout-button), cancel button (class text-button). In app.js loadAdminData(), change ordersTable and recentOrders status <span> to <select class="status-dropdown" data-order-id="${o.id}" style="font-size:10px;border:1px solid #e5e8df;border-radius:6px;padding:5px;"><option value="Pending">Pending</option><option value="Processing">Processing</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option></select> with selected="${o.status===value}" for current status. Style select options with class-based colors using CSS .status-dropdown option[value="Pending"]{color:#986e3a}, etc.
      Files: c:\MIdtermProject\anihan_market\index.html, c:\MIdtermProject\anihan_market\app.js
      Verify: Login as admin, Orders tab - verify dropdowns show with current status selected and colored.

- [ ] 10. **Admin Order Status Management - Change Handler with Confirmation**
       In app.js loadAdminData(), add event listener to all .status-dropdown elements. On change, capture event, get orderId from data-order-id, oldStatus from order object, newStatus from event.target.value. Show statusChangeDialog with message `Change order ${orderId} status from ${oldStatus} to ${newStatus}?`. On confirm click, call updateOrderStatus(orderId, newStatus), check result, notify success/error, close dialog, call loadAdminData() to refresh tables. On cancel click or dialog close, find dropdown by orderId and reset value to oldStatus.
       Files: c:\MIdtermProject\anihan_market\app.js
       Verify: Change order status - verify confirmation modal appears with correct info. Confirm - verify toast, table refresh, localStorage updated. Cancel - verify dropdown reverts to old status.

- [ ] 11. **Admin Order Status Management - Timestamp Display**
       In app.js loadAdminData(), for orders with updatedAt field, calculate time difference from now, format as relative time (e.g., '2h ago', '1d ago'). Add helper formatRelativeTime(isoString) that uses Date objects. In order tables, add small text after status showing `<small style="font-size:8px;color:#879188;display:block;margin-top:3px;">Updated ${formatRelativeTime(o.updatedAt)}</small>` only if o.updatedAt exists.
       Files: c:\MIdtermProject\anihan_market\app.js
       Verify: Change order status, refresh - verify timestamp appears. Check timestamp updates correctly for different time intervals.

- [ ] 12. **Admin Product CRUD - Database Helpers**
       Add getNextProductId() function to database.js that returns `Math.max(...getProducts().map(p => p.id), 0) + 1`. Export this function.
       Files: c:\MIdtermProject\anihan_market\database.js
       Verify: Browser console: `import {getNextProductId} from './database.js'; console.log(getNextProductId())` - should return highest product id + 1.

- [ ] 13. **Admin Product CRUD - Add Product Modal and Form**
       Create addProductDialog modal in index.html after existing dialogs. Include modal-head with title 'Add Product', form #addProductForm with fields: name (input text required), category (select with options Vegetables/Fruits/Rice & Grains/Root Crops, required), price (input number min=0 step=0.01 required), unit (input text required), stock (input number min=0 required), farmer (input text required), origin (input text required), tag (input text required), emoji (input text maxlength=2 required), description (textarea rows=3 required), image (input url required). Add submit button 'Add Product' with checkout-button class, cancel button with text-button class. Style form labels and inputs like registerDialog form with margin-bottom, font-size 11px labels, 12px inputs, border-radius 8px.
       Files: c:\MIdtermProject\anihan_market\index.html
       Verify: Manually open dialog via console `document.getElementById('addProductDialog').showModal()` - verify form appears with all fields styled correctly.

- [ ] 14. **Admin Product CRUD - Add Product Handler**
       In app.js, wire addProductButton to open addProductDialog. Add event listener for addProductForm submit: preventDefault, validate all fields (check required, price/stock >= 0, valid URL for image using URL constructor in try-catch), show inline errors for invalid fields (add error message div below field with red text). If valid, call getNextProductId(), create product object with id and all form values (parse numbers), call addProduct(product), notify success, close dialog, reset form, call loadAdminData() and renderProducts() to refresh both admin and buyer views.
       Files: c:\MIdtermProject\anihan_market\app.js
       Verify: Login as admin, Products tab, click '+ Add product' - modal opens. Submit with missing fields - verify validation errors. Fill valid data, submit - verify success toast, new product appears in products table and buyer product grid.

- [ ] 15. **Admin Product CRUD - Edit Product Modal and Handler**
       Create editProductDialog modal in index.html (clone addProductDialog structure but change id and title to 'Edit Product'). Add hidden input #editProductId. In app.js loadAdminData(), make productsTable rows clickable: add data-product-id="${p.id}" to <tr>, add click handler that gets productId, finds product in getProducts(), populates editProductDialog form fields with product data, shows modal. Add editProductForm submit handler: get editProductId value, get form values, call updateProduct(id, updates), notify success, close dialog, refresh views.
       Files: c:\MIdtermProject\anihan_market\index.html, c:\MIdtermProject\anihan_market\app.js
       Verify: Click product table row - verify edit modal opens with pre-filled data. Change values, submit - verify update succeeds, tables refresh, localStorage updated.

- [ ] 16. **Admin Product CRUD - Delete Product with Confirmation**
       Create deleteProductDialog confirmation modal in index.html with message paragraph #deleteProductMessage, hidden input #deleteProductId, confirm button 'Delete Product' (style="background:#e74c3c"), cancel button. Add 'Actions' column header to productsTable in index.html. In app.js loadAdminData(), add delete button to each product row: `<button class="text-button" style="color:#e74c3c;" data-delete-product="${p.id}">Delete</button>`. Add click handler that gets productId, finds product, sets deleteProductMessage text to `Delete ${product.name}? This cannot be undone.`, sets deleteProductId value, shows modal. On confirm, call deleteProduct(id), notify success, close modal, refresh views.
       Files: c:\MIdtermProject\anihan_market\index.html, c:\MIdtermProject\anihan_market\app.js
       Verify: Click Delete on product - confirm modal appears with product name. Confirm - verify product removed from table, localStorage, and buyer grid. Cancel - verify no changes.

- [ ] 17. **User Profile Management - Database Functions**
       Add updateUser(userId, updates) to database.js that gets users array, finds user by id, merges updates object into user (using Object.assign or spread), saves to localStorage anihan_users, checks if userId matches current session id and updates anihan_session with new data, returns updated user or null. Add updateUserPassword(userId, newPasswordHash) that finds user, sets user.passwordHash = newPasswordHash, saves, returns true/false.
       Files: c:\MIdtermProject\anihan_market\database.js
       Verify: Browser console test updateUser and updateUserPassword functions, check localStorage persistence.

- [ ] 18. **User Profile Management - Profile Modal UI**
       Add 'My Profile' button to userInfo div in index.html topbar (after userName, before logoutButton). Create profileDialog modal with three sections: 1) panel-card div with heading 'Profile Information', form #profileForm with pre-filled fields name, phone, address (same styling as registration form), save button. 2) panel-card div with heading 'Change Password', form #passwordForm with fields currentPassword, newPassword, confirmPassword (type=password), change button. 3) panel-card div with heading 'Account Statistics', display divs for joinedDate, totalOrders, totalSpent (read-only styled text).
       Files: c:\MIdtermProject\anihan_market\index.html
       Verify: Manually open profileDialog - verify three sections display correctly with forms and stats placeholders.

- [ ] 19. **User Profile Management - Profile and Password Handlers**
       In app.js, add 'My Profile' button click handler that calls renderProfile() and shows modal. renderProfile() gets current user, populates profileForm fields with user data, calls getUserOrders(userId), calculates totalOrders = orders.length, totalSpent = orders.reduce sum of totals, formats joinedDate from user.createdAt as 'Member since Month YYYY', displays stats. Add profileForm submit handler: validate fields not empty, call updateUser(userId, {name, phone, address}), update document.getElementById('userName').textContent, notify success. Add passwordForm submit handler: import verifyPassword and hashPassword from auth.js, validate currentPassword matches user.passwordHash using verifyPassword, validate newPassword === confirmPassword, newPassword.length >= 6, show inline errors if fail, if valid call hashPassword(newPassword) and updateUserPassword(userId, hash), notify success, reset password form.
       Files: c:\MIdtermProject\anihan_market\app.js
       Verify: Click 'My Profile' - modal opens with user data. Update name/address, save - verify success, userName updates. Change password with wrong current password - verify error. Change with valid data - logout, login with new password - verify works. Check stats display correct order count and total spent.

- [ ] 20. **Final Integration Testing and Responsive Design Check**
       Test complete user flow: register → login → browse → add to cart → checkout → view order history → reorder → view profile → update profile → change password → logout. Test admin flow: login as admin → view dashboard stats → change order status → add product → edit product → delete product → check low stock alerts. Test responsive design on mobile viewport (375px width): verify all modals fit screen, forms are usable, product grid adjusts to 2 columns, admin tables scroll horizontally. Check browser console for errors. Verify all data persists across page refreshes.
       Files: All files (integration test)
       Verify: Run through both complete flows. Test on Chrome, Firefox, Edge. Test mobile viewport. Document any issues in findings and fix before completion.

---

## Notes

- **No build step required** - all changes are to HTML/CSS/JS files loaded directly in browser
- **Manual testing only** - no automated test framework, must verify each feature in browser
- **localStorage persistence** - all data stored client-side with 'anihan_' prefix
- **Responsive design** - maintain existing mobile breakpoints (@media max-width 700px, 1000px)
- **Existing patterns to follow:**
  - Use peso() helper for currency formatting
  - Use notify() for toast messages
  - Modals use <dialog> with .showModal() and data-close attributes
  - Auth checks use isAuthenticated() and isAdmin() from auth.js
  - Database CRUD returns objects/arrays or null
  - Event listeners use arrow functions and dataset attributes
- **Color scheme:** Green #174b35, maintain existing status colors (green=delivered, orange=pending, yellow=processing)
- **Accessibility:** Add aria-labels to new buttons, maintain keyboard navigation

## Dependencies

- FEAT-002 (Stock Management) depends on FEAT-001 database patterns
- FEAT-003 (Order Status) independent
- FEAT-004 (Product CRUD) independent  
- FEAT-005 (User Profile) depends on FEAT-001 (getUserOrders for stats)

## Success Criteria

All features implemented and verified per verification steps above. Users can manage orders and profile, admin can manage products and order status, stock tracking works, all data persists in localStorage, no console errors, responsive design maintained.
