# 🚀 Anihan Market - Deployment Instructions

## GitHub Repository
**URL:** https://github.com/jmdrosete/anihan-market

---

## 📤 STEP 1: Push to GitHub

### Option A: Using the Batch Script (Easiest!)

1. Double-click: `push-to-github.bat`
2. When prompted for credentials:
   - **Username:** `jmdrosete`
   - **Password:** Use your **Personal Access Token**
     - Don't have one? Get it here: https://github.com/settings/tokens
     - Click "Generate new token (classic)"
     - Check `repo` permission
     - Copy the token and use as password

### Option B: Using Command Line

Open PowerShell or CMD in project folder:

```bash
cd c:\MIdtermProject\anihan_market

# Push to GitHub
git push -u origin master
```

When prompted:
- Username: `jmdrosete`
- Password: (Your Personal Access Token)

---

## 🌐 STEP 2: Deploy to Vercel

### Easy Method (5 minutes):

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Find `anihan-market` in the list
   - Click "Import"

3. **Configure (Important!)**
   - **Framework Preset:** Select "Other"
   - **Build Command:** Leave EMPTY
   - **Output Directory:** Leave EMPTY
   - **Install Command:** Leave EMPTY
   - Root Directory: `./` (default)

4. **Deploy!**
   - Click "Deploy" button
   - Wait 30-60 seconds
   - 🎉 Done!

5. **Get Your URL**
   - You'll get: `https://anihan-market-xxxxx.vercel.app`
   - Click "Visit" to see your live site

---

## ✅ Verify Deployment

### Test User Flow:
1. ✅ Register new account
2. ✅ Login
3. ✅ Browse 20 agricultural products
4. ✅ Add to cart
5. ✅ Checkout
6. ✅ View "My Orders"
7. ✅ Edit profile

### Test Admin Flow:
1. ✅ Click "Admin dashboard"
2. ✅ Login with:
   - Email: `admin@anihan.ph`
   - Password: `anihan2024admin`
3. ✅ View dashboard
4. ✅ Add new product
5. ✅ Update order status
6. ✅ Edit product

---

## 🔑 Demo Credentials

### Admin Account:
```
Email: admin@anihan.ph
Password: anihan2024admin
```

### User Account:
- Anyone can register
- Or create test account

---

## 🔄 Update Your Live Site

Every time you make changes:

```bash
cd c:\MIdtermProject\anihan_market

# Make your changes...

# Commit
git add .
git commit -m "feat: describe your changes"

# Push (Vercel auto-deploys!)
git push
```

Vercel will automatically redeploy in ~30 seconds!

---

## 📱 Features in Your Live Site

### User Features:
- ✅ User registration & login
- ✅ Browse 20 agricultural products
- ✅ Search & filter by category
- ✅ Shopping cart with quantity control
- ✅ Order checkout
- ✅ Order history with status tracking
- ✅ Profile management
- ✅ Password change
- ✅ Reorder functionality

### Admin Features:
- ✅ Admin login (separate)
- ✅ Dashboard with statistics
- ✅ View all orders
- ✅ Update order status
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Stock management
- ✅ Low stock alerts
- ✅ View all users' orders

### Product Categories:
- 🥬 Vegetables (7 items)
- 🍌 Fruits (6 items)
- 🌾 Rice & Grains (4 items)
- 🍠 Root Crops (3 items)

---

## 🐛 Troubleshooting

### Problem: Git push not working

**Solution:**
```bash
# Check remote
git remote -v

# If wrong, remove and re-add
git remote remove origin
git remote add origin https://github.com/jmdrosete/anihan-market.git

# Force push if needed
git push -u origin master --force
```

### Problem: Need GitHub Token

**Create Personal Access Token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "Vercel Deploy"
4. Check: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy token** (you won't see it again!)
7. Use as password when pushing

### Problem: Vercel site not working

**Check:**
1. All files in GitHub? ✅
2. Framework set to "Other"? ✅
3. No build command? ✅
4. Browser console errors? (F12)
5. Hard refresh: Ctrl + F5

---

## 📊 Project Stats

- **Lines of Code:** 1,500+
- **Features:** 15+
- **Modals:** 8
- **Products:** 20
- **Database Functions:** 20+
- **Commits:** 10+

---

## 🎯 What's Deployed

```
📦 anihan-market/
├── 📄 index.html          # Main UI with modals
├── 📄 app.js              # Application logic (ES6 modules)
├── 📄 auth.js             # Authentication system
├── 📄 database.js         # LocalStorage data layer
├── 📄 style.css           # Complete styling
├── 📄 README.md           # Project documentation
└── 📄 README-LOGIN.md     # Login instructions
```

---

## 🌟 Share Your Project

After deployment, you can share:

**Live Demo:**
```
https://your-project.vercel.app
```

**Admin Access:**
```
Email: admin@anihan.ph
Password: anihan2024admin
```

**GitHub Repo:**
```
https://github.com/jmdrosete/anihan-market
```

---

## 📞 Support

If may problema:
1. Check this guide
2. Check browser console (F12)
3. Check Vercel logs
4. Check GitHub commits

---

## 🎉 Success!

Once deployed, your Anihan Market will be:
- ✅ Live on the internet
- ✅ Accessible from anywhere
- ✅ HTTPS secure
- ✅ Fast (CDN)
- ✅ Auto-deploys on push
- ✅ Portfolio ready!

**Good luck!** 🚀🌾
