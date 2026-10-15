# Implementation Plan: Landing Page Redesign for Anihan Market

## Overview
Redesign Anihan Market to show a beautiful landing page to ALL visitors (not logged in), with the marketplace/products section ONLY shown after successful login. The landing page will feature a Mamburao/Occidental Mindoro agricultural theme.

## Current State Analysis
After exploring the codebase:
- **Auth tracking**: Uses `localStorage` via `auth.js` with `isAuthenticated()` function
- **Session management**: Stored via `database.js` with `getSession()`, `setSession()`, `clearSession()`
- **Current UI logic**: `updateAuthUI()` in `app.js` (line ~50) shows/hides auth buttons vs user info, but does NOT gate marketplace content
- **Section visibility**: Currently buyer view (`#buyerView`) and admin view (`#adminView`) toggle, but marketplace is ALWAYS visible to anonymous users
- **Auth modals**: `#loginDialog`, `#registerDialog`, `#adminLoginDialog` already exist
- **No build system**: Plain HTML/CSS/JS, no package.json, opened directly in browser or via Live Server

## Design Decisions

### 1. Two-page structure within single HTML file
Create two main sections:
- `<section id="landingPage">` — hero, features, gallery, stats, CTA, footer (visible when NOT authenticated)
- `<section id="marketplacePage">` — wraps existing marketplace content (visible when authenticated)

**Rationale**: Keeps the single-page app structure while cleanly separating concerns. Simpler than multi-page routing for this project.

### 2. Navigation swap approach
- **Landing nav**: Logo, About, How It Works, Contact, Login, Sign Up buttons
- **Marketplace nav**: Logo, Products, My Orders, Admin Dashboard, My Profile, Logout

**Rationale**: Follows the existing pattern where topbar changes based on auth state (see `updateAuthUI()` line 50-69 in app.js).

### 3. Mamburao/Occidental Mindoro agricultural theme
Use images of:
- Rice terraces and rice farming (main agricultural product)
- Farmers in fields with carabao (water buffalo)
- Coconut plantations
- Root crops (cassava, sweet potato)
- Local harvest scenes

**Rationale**: Occidental Mindoro (where Mamburao is capital) is known for rice farming, coconut production, and root crops.

### 4. Image sources
Use Unsplash URLs with Philippine farming keywords:
- `photo-1596797038530-2c107229654b` — Philippine rice terraces
- `photo-1574943320219-553eb213f72d` — Asian farmer in field
- `photo-1587049352846-4a222e784d38` — Rice harvest
- `photo-1509440159596-0249088772ff` — Coconut plantation
- `photo-1593958812614-2db6a598c71c` — Root vegetables

**Rationale**: Unsplash is already used in existing product images, keeps consistent approach.

---

# Implementation Steps

- [ ] 1. **Restructure index.html: Create landing and marketplace sections**
      
      Wrap existing marketplace content (hero through footer) in `<section id="marketplacePage" class="hidden">`. 
      Add new `<section id="landingPage">` ABOVE it with: 
      - Hero section with full-viewport background image of Philippine rice terraces, dark overlay, heading "Fresh from Mamburao farms to your table", CTA button
      - Features section (3-column grid): "Direct from farmers", "Fair prices", "Fresh daily"
      - Image gallery (3x2 grid) showing: rice farming, farmer with carabao, harvest scene, coconut plantation, root crops, community market
      - Stats bar: "500+ Farmers", "2000+ Products", "10,000+ Happy Customers"
      - Final CTA section: "Join our community" with Login/Register buttons
      - Footer with copyright
      
      Duplicate the existing topbar and create two versions:
      - `<header class="topbar" id="landingNav">` with: Logo, About, How It Works, Contact, Login, Register buttons
      - `<header class="topbar" id="marketplaceNav" class="hidden">` (existing topbar content)
      
      Files: `c:\MIdtermProject\anihan_market\index.html`
      
      Verify: Open index.html in browser, confirm landing page is visible by default, marketplace section has class "hidden"

- [ ] 2. **Add CSS styling for landing page components**
      
      Add to style.css (at end of file, before media queries):
      - `.landing-hero` — full viewport height, background image with dark overlay (rgba(0,0,0,0.4)), centered content, white text
      - `.landing-hero h1` — large heading (60px desktop, 40px mobile), bold, white with text-shadow
      - `.landing-hero .cta-button` — green button matching existing `.hero-cta` style
      - `.landing-features` — 3-column grid (1 column on mobile), centered, padding 80px 0
      - `.feature-card` — white background, border-radius 15px, padding 30px, text-align center, icon at top (50px emoji or symbol)
      - `.landing-gallery` — 3-column grid (2 columns on mobile), gap 15px, padding 60px 0
      - `.gallery-item` — aspect-ratio 4/3, border-radius 12px, overflow hidden, img object-fit cover
      - `.landing-stats` — 3-column grid, background #f8f7f0, padding 40px, centered text
      - `.stat-number` — large bold number (36px), color var(--green)
      - `.landing-footer` — similar to existing footer but simplified
      - Update existing `.topbar` styles to apply to both nav versions
      
      Files: `c:\MIdtermProject\anihan_market\style.css`
      
      Verify: Refresh browser, landing page renders with proper layout, colors match green theme (#174b35), responsive on mobile (test at 375px width)

- [ ] 3. **Create updatePageView() function in app.js**
      
      Add new function `updatePageView()` after line 69 (after `updateAuthUI()`):
      ```javascript
      function updatePageView() {
        const authenticated = isAuthenticated();
        const landingPage = document.getElementById("landingPage");
        const marketplacePage = document.getElementById("marketplacePage");
        const landingNav = document.getElementById("landingNav");
        const marketplaceNav = document.getElementById("marketplaceNav");
        
        if (authenticated) {
          landingPage.classList.add("hidden");
          marketplacePage.classList.remove("hidden");
          landingNav.classList.add("hidden");
          marketplaceNav.classList.remove("hidden");
        } else {
          landingPage.classList.remove("hidden");
          marketplacePage.classList.add("hidden");
          landingNav.classList.remove("hidden");
          marketplaceNav.classList.add("hidden");
        }
      }
      ```
      
      Files: `c:\MIdtermProject\anihan_market\app.js`
      
      Verify: Add `console.log('updatePageView called', isAuthenticated())` in function, open browser console, refresh page, confirm function logs "false" on page load

- [ ] 4. **Call updatePageView() at all auth state change points**
      
      Add `updatePageView();` calls at:
      - Line ~73 (after `updateAuthUI()` initial call on load)
      - Line ~87 (inside user login success handler, after `updateAuthUI()`)
      - Line ~107 (inside registration success handler, after showing login modal)
      - Line ~125 (inside admin login success handler, after `updateAuthUI()`)
      - Line ~135 (inside logout handler, after `updateAuthUI()`)
      
      Also add `updatePageView();` call immediately after `initDatabase();` at top of app.js (around line 20) to run on page load.
      
      Files: `c:\MIdtermProject\anihan_market\app.js`
      
      Verify: Open browser, confirm landing page shows when not logged in. Click "Login" button from landing page, enter demo user credentials (or register new user), confirm marketplace page appears after successful login. Click "Logout", confirm landing page returns.

- [ ] 5. **Add landing page navigation button handlers**
      
      At end of app.js (before closing), add event listeners:
      ```javascript
      // Landing page navigation
      document.getElementById("landingLoginBtn")?.addEventListener("click", () => {
        document.getElementById("loginDialog").showModal();
      });
      
      document.getElementById("landingRegisterBtn")?.addEventListener("click", () => {
        document.getElementById("registerDialog").showModal();
      });
      
      // Smooth scroll for anchor links (About, How It Works, Contact)
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute("href"));
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
      ```
      
      Files: `c:\MIdtermProject\anihan_market\app.js`
      
      Verify: On landing page, click "Login" button, confirm login modal opens. Click "Register" button, confirm register modal opens. Click "About" link (if implemented), confirm smooth scroll to features section.

- [ ] 6. **Add Unsplash image URLs to landing page HTML**
      
      In the landing page hero section, set background-image inline style or via CSS:
      - Hero background: `https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1920&q=85` (Philippine rice terraces)
      
      In the gallery section, add img tags with src:
      - Gallery 1: `https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=85` (Asian farmer)
      - Gallery 2: `https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=85` (Rice harvest)
      - Gallery 3: `https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=85` (Coconut farm)
      - Gallery 4: `https://images.unsplash.com/photo-1593958812614-2db6a598c71c?auto=format&fit=crop&w=800&q=85` (Root vegetables)
      - Gallery 5: `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=85` (Vegetables)
      - Gallery 6: `https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=85` (Market scene)
      
      Files: `c:\MIdtermProject\anihan_market\index.html`
      
      Verify: Open browser, confirm hero section shows rice terraces background image, gallery shows all 6 images properly loaded and displayed in grid layout

- [ ] 7. **Test complete auth flow and page switching**
      
      Perform full manual test:
      1. Open index.html in fresh browser session (or clear localStorage)
      2. Confirm landing page is visible, marketplace is hidden
      3. Click "Register" from landing page
      4. Fill registration form with test data
      5. Confirm marketplace page appears after registration + login
      6. Add items to cart, test cart functionality
      7. Click "Logout"
      8. Confirm return to landing page
      9. Click "Login" from landing page
      10. Login with registered credentials
      11. Confirm marketplace page appears
      12. Test on mobile viewport (375px width)
      
      Files: None (manual testing only)
      
      Verify: All steps above complete successfully without console errors. Landing page is NEVER visible when authenticated. Marketplace is NEVER visible when not authenticated. Nav switches correctly. Mobile responsive layout works.

- [ ] 8. **Add accessibility improvements**
      
      Add to landing page HTML:
      - `aria-label` attributes on all buttons and links
      - `role="navigation"` on nav elements
      - `alt` text on all gallery images describing content
      - `<h1>`, `<h2>`, `<h3>` hierarchy for headings
      - Skip to main content link at top: `<a href="#main" class="skip-link">Skip to main content</a>`
      - Focus styles for keyboard navigation in CSS: `.feature-card:focus, .cta-button:focus { outline: 3px solid var(--green); outline-offset: 2px; }`
      
      Files: `c:\MIdtermProject\anihan_market\index.html`, `c:\MIdtermProject\anihan_market\style.css`
      
      Verify: Use browser dev tools Lighthouse accessibility audit, confirm score above 90. Test keyboard navigation (Tab key), confirm all interactive elements are reachable and have visible focus indicators.

---

## Verification Commands

Since this is a plain HTML/CSS/JS project with no build system:

1. **Open in browser**: Open `c:\MIdtermProject\anihan_market\index.html` in Chrome/Firefox/Edge
2. **Test responsive**: Use browser dev tools responsive mode, test at widths: 375px (mobile), 768px (tablet), 1440px (desktop)
3. **Check console**: Open browser console (F12), confirm no JavaScript errors
4. **Lighthouse audit**: Run Lighthouse in browser dev tools, confirm Performance > 80, Accessibility > 90

## Notes

- This plan maintains the existing single-page app structure
- No changes to database.js or auth.js required
- Existing product catalog, cart, order history, and admin features remain unchanged
- Landing page is purely informational/marketing, no functionality changes
- All images use Unsplash with Philippine agriculture theme to match Mamburao/Occidental Mindoro context
- Color scheme remains consistent with existing green theme (#174b35)
- Mobile-first responsive approach matches existing CSS patterns
