# Anihan Market - Login Instructions

## 🔐 Authentication System

Ang Anihan Market ay may dalawang type ng users:

### 1. 👥 USER/BUYER ACCOUNTS (Mga Mamimili)

**Para makapag-register:**
1. Click ang "📝 Register" button sa top right
2. Sagutan ang form:
   - Full Name
   - Email
   - Password
   - Phone Number
   - Delivery Address
3. Click "Create Account"
4. Mag-login gamit ang iyong credentials

**Para makapag-login:**
1. Click ang "🔐 Login" button
2. Enter your email at password
3. Click "Login"

**Mga kakayahan ng User:**
- ✅ Browse at search ng mga products
- ✅ Add to cart
- ✅ Checkout at place orders
- ✅ View order history
- ❌ Hindi maka-access ng admin panel

---

### 2. 👨‍💼 ADMIN ACCOUNT (Administrator)

**Admin Credentials:**
- **Email:** `admin@anihan.ph`
- **Password:** `anihan2024admin`

**Para mag-login as Admin:**
1. Click ang "▦ Admin dashboard" button sa top right
2. Enter the admin credentials sa modal
3. Click "Login as Admin"

**Mga kakayahan ng Admin:**
- ✅ View ng lahat ng orders
- ✅ View ng lahat ng products with stock levels
- ✅ View sales statistics
- ✅ Monitor farmer information
- ✅ Access lahat ng admin dashboard features
- ✅ Pwede ring mag-browse bilang regular user

---

## 📦 Features

### User Side:
- **Product Catalog** - 20 agricultural products
  - 🥬 Vegetables (Pechay, Tomatoes, Eggplant, Sitaw, Kangkong, Ampalaya, Onions)
  - 🍌 Fruits (Mango, Banana, Pineapple, Papaya, Watermelon, Calamansi)
  - 🌾 Rice & Grains (Brown Rice, White Rice, Palay, Corn)
  - 🍠 Root Crops (Kamote, Gabi, Ube)
- **Shopping Cart** - Add/remove items, adjust quantities
- **Checkout** - Place orders with delivery info
- **Search & Filter** - By category or search term
- **Responsive Design** - Mobile and desktop friendly

### Admin Side:
- **Dashboard Overview**
  - Total sales statistics
  - Farmer earnings (90%)
  - Platform revenue (10%)
  - Order counts
- **Order Management** - View all orders with status
- **Product Management** - View all products with stock
- **Farmer Management** - View verified farmers

---

## 🚀 How to Run

1. Open `index.html` sa browser
2. Or use Live Server sa VS Code
3. Lahat ng data ay naka-store sa **localStorage** (persistent sa browser)

---

## 💾 Data Storage

- **Products:** 20 pre-loaded agricultural products
- **Users:** Registered user accounts
- **Orders:** Order history with status tracking
- **Session:** Current logged-in user
- **Cart:** Shopping cart contents

Lahat ay naka-store sa browser's localStorage with prefix `anihan_`

---

## 🧪 Testing Steps

### Test User Flow:
1. ✅ Register a new user account
2. ✅ Login with your credentials
3. ✅ Browse products
4. ✅ Add items to cart
5. ✅ Checkout and place order
6. ✅ Logout

### Test Admin Flow:
1. ✅ Login using admin credentials
2. ✅ View dashboard statistics
3. ✅ Check recent orders
4. ✅ View product inventory
5. ✅ Navigate between admin tabs
6. ✅ Return to marketplace view

---

## 🎯 Key Differences

| Feature | User Account | Admin Account |
|---------|--------------|---------------|
| Login | Register then login | Fixed credentials |
| Products | Browse & Buy | View & Monitor |
| Orders | Place own orders | View all orders |
| Dashboard | No access | Full access |
| Statistics | No access | Full access |
| Role | `'user'` | `'admin'` |

---

## 📝 Notes

- Demo implementation using localStorage
- For production: need backend API, database, and secure authentication
- Password hashing is basic (btoa) - not production-ready
- Admin credentials are hardcoded for demo purposes

**🌾 Happy shopping at Anihan Market!**
