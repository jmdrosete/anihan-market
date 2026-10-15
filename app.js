// Import database and auth modules
import { initDatabase, getProducts, addOrder, getOrders, getUserOrders, addProduct, updateProduct, deleteProduct, updateOrderStatus, updateProductStock, getLowStockProducts, getNextProductId, updateUser, updateUserPassword, findUserByEmail } from './database.js';
import { 
  getCurrentUser, 
  isAuthenticated, 
  isAdmin, 
  loginUser, 
  loginAdmin, 
  registerUser, 
  logout,
  hashPassword,
  verifyPassword
} from './auth.js';

// Initialize database on load
initDatabase();

let products = getProducts();
let cart = {};
let selectedCategory = "All";
let searchText = "";

const peso = n => "₱" + Number(n).toLocaleString("en-PH",{maximumFractionDigits:2});
const grid = document.getElementById("productGrid");
const toast = document.getElementById("toast");
let toastTimer;

function notify(message){
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),2400);
}

// ========================================
// AUTHENTICATION UI HANDLERS
// ========================================

// Page visibility handler (Landing page vs Marketplace)
function updatePageView() {
  const authenticated = isAuthenticated();
  const landingPage = document.getElementById("landingPage");
  const marketplacePage = document.getElementById("marketplacePage");
  
  if (authenticated) {
    landingPage?.classList.add("hidden");
    marketplacePage?.classList.remove("hidden");
  } else {
    landingPage?.classList.remove("hidden");
    marketplacePage?.classList.add("hidden");
  }
}

// Check authentication status on load
function updateAuthUI() {
  const user = getCurrentUser();
  const authButtons = document.getElementById("authButtons");
  const userInfo = document.getElementById("userInfo");
  const adminSwitch = document.getElementById("adminSwitch");
  
  if (isAuthenticated()) {
    authButtons?.classList.add("hidden");
    userInfo?.classList.remove("hidden");
    if (document.getElementById("userName") && user) {
      document.getElementById("userName").textContent = user.name;
    }
    
    // Show/hide admin button based on role
    if (isAdmin()) {
      adminSwitch?.classList.remove("hidden");
    } else {
      adminSwitch?.classList.add("hidden");
    }
  } else {
    authButtons?.classList.remove("hidden");
    userInfo?.classList.add("hidden");
    adminSwitch?.classList.add("hidden");
  }
}

// User Login
document.getElementById("userLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  const result = loginUser(email, password);
  if (result.success) {
    document.getElementById("loginDialog").close();
    notify(`Welcome back, ${result.user.name}!`);
    updateAuthUI();
    updatePageView();
    document.getElementById("userLoginForm").reset();

    // If logged in as admin, switch directly to admin dashboard
    if (result.user.role === 'admin') {
      showAdmin(true);
    } else {
      showAdmin(false);
    }
  } else {
    notify(result.error);
  }
});

// User Registration
document.getElementById("registerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const phone = document.getElementById("regPhone").value;
  const address = document.getElementById("regAddress").value;
  
  const result = registerUser({ name, email, password, phone, address });
  if (result.success) {
    document.getElementById("registerDialog").close();
    notify("Registration successful! Please login.");
    document.getElementById("registerForm").reset();
    document.getElementById("loginDialog").showModal();
  } else {
    notify(result.error);
  }
});

// Admin Login
document.getElementById("adminLoginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;
  
  const result = loginAdmin(email, password);
  if (result.success) {
    document.getElementById("adminLoginDialog").close();
    notify("Admin access granted");
    updateAuthUI();
    updatePageView();
    showAdmin(true);
    document.getElementById("adminLoginForm").reset();
  } else {
    notify(result.error);
  }
});

// Logout
document.getElementById("logoutButton")?.addEventListener("click", () => {
  logout();
  notify("Logged out successfully");
  updateAuthUI();
  updatePageView();
  showAdmin(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ========================================
// ORDER HISTORY
// ========================================

let selectedOrderFilter = "All";

/**
 * Format date to readable string
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date
 */
function formatOrderDate(isoDate) {
  const date = new Date(isoDate);
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Render order history for current user
 */
function renderOrderHistory() {
  const user = getCurrentUser();
  if (!user) return;
  
  const allOrders = getUserOrders(user.id);
  const filteredOrders = selectedOrderFilter === "All" 
    ? allOrders 
    : allOrders.filter(o => o.status === selectedOrderFilter);
  
  const container = document.getElementById("orderHistoryContainer");
  
  if (filteredOrders.length === 0) {
    const emptyMessage = allOrders.length === 0 
      ? "You haven't placed any orders yet. Start shopping!"
      : `No ${selectedOrderFilter.toLowerCase()} orders found.`;
    container.innerHTML = `<div class="order-empty-state"><strong>${emptyMessage}</strong></div>`;
    return;
  }
  
  container.innerHTML = filteredOrders.map(order => {
    const itemsList = order.items.map(item => 
      `${item.productName} (x${item.quantity})`
    ).join(', ');
    
    return `
      <div class="order-card">
        <div class="order-card-header">
          <div>
            <div class="order-card-id">${order.id}</div>
            <div class="order-card-date">${formatOrderDate(order.createdAt)}</div>
          </div>
          <span class="status ${order.status.toLowerCase()}">${order.status}</span>
        </div>
        <div class="order-card-items">
          <strong>${order.items.length} item${order.items.length > 1 ? 's' : ''}:</strong> ${itemsList}
        </div>
        <div class="order-card-footer">
          <div class="order-card-total">${peso(order.total)}</div>
          <button class="reorder-button" data-reorder="${order.id}">Reorder</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Add reorder button handlers
  container.querySelectorAll('[data-reorder]').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.dataset.reorder;
      reorderItems(orderId);
    });
  });
}

/**
 * Reorder items from a previous order
 * @param {string} orderId - Order ID to reorder
 */
function reorderItems(orderId) {
  const user = getCurrentUser();
  if (!user) return;
  
  const orders = getUserOrders(user.id);
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    notify("Order not found");
    return;
  }
  
  // Add all items from the order to cart
  order.items.forEach(item => {
    const productId = item.productId;
    cart[productId] = (cart[productId] || 0) + item.quantity;
  });
  
  updateCartCount();
  notify("Items added to your basket!");
  document.getElementById("orderHistoryDialog").close();
}

// My Orders button click handler
document.getElementById("myOrdersButton")?.addEventListener("click", () => {
  selectedOrderFilter = "All";
  renderOrderHistory();
  
  // Reset filter tabs
  document.querySelectorAll(".order-filter-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.status === "All");
  });
  
  document.getElementById("orderHistoryDialog").showModal();
});

// Order filter tab handlers
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('order-filter-tab')) {
    selectedOrderFilter = e.target.dataset.status;
    
    // Update active state
    document.querySelectorAll(".order-filter-tab").forEach(tab => {
      tab.classList.toggle("active", tab === e.target);
    });
    
    renderOrderHistory();
  }
});

// ========================================
// USER PROFILE MANAGEMENT
// ========================================

/**
 * Render user profile with stats and form data
 */
function renderProfile() {
  const user = getCurrentUser();
  if (!user) return;
  
  // Get full user data from database
  const fullUser = findUserByEmail(user.email);
  if (!fullUser) return;
  
  // Populate profile form
  document.getElementById("profileName").value = fullUser.name || '';
  document.getElementById("profilePhone").value = fullUser.phone || '';
  document.getElementById("profileAddress").value = fullUser.address || '';
  
  // Calculate and display stats
  const orders = getUserOrders(user.id);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Format member since date
  const memberDate = new Date(fullUser.createdAt);
  const memberSince = memberDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  
  document.getElementById("profileMemberSince").textContent = memberSince;
  document.getElementById("profileTotalOrders").textContent = orders.length;
  document.getElementById("profileTotalSpent").textContent = peso(totalSpent);
}

// My Profile button handler
document.getElementById("myProfileButton")?.addEventListener("click", () => {
  renderProfile();
  document.getElementById("profileDialog").showModal();
});

// Handle profile form submission
document.getElementById("profileForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) return;
  
  const updates = {
    name: document.getElementById("profileName").value.trim(),
    phone: document.getElementById("profilePhone").value.trim(),
    address: document.getElementById("profileAddress").value.trim()
  };
  
  // Validate required fields
  if (!updates.name || !updates.phone || !updates.address) {
    notify("All fields are required");
    return;
  }
  
  const result = updateUser(user.id, updates);
  
  if (result) {
    // Update the displayed username in topbar
    document.getElementById("userName").textContent = updates.name;
    notify("Profile updated successfully!");
  } else {
    notify("Failed to update profile");
  }
});

// Handle change password form submission
document.getElementById("changePasswordForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const user = getCurrentUser();
  if (!user) return;
  
  // Get form values
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  // Reset error messages
  document.getElementById("currentPasswordError").style.display = "none";
  document.getElementById("confirmPasswordError").style.display = "none";
  
  // Validate password length
  if (newPassword.length < 6) {
    notify("Password must be at least 6 characters");
    return;
  }
  
  // Validate passwords match
  if (newPassword !== confirmPassword) {
    document.getElementById("confirmPasswordError").style.display = "block";
    return;
  }
  
  // Verify current password
  const fullUser = findUserByEmail(user.email);
  if (!fullUser || !verifyPassword(currentPassword, fullUser.passwordHash)) {
    document.getElementById("currentPasswordError").style.display = "block";
    return;
  }
  
  // Update password
  const newPasswordHash = hashPassword(newPassword);
  const success = updateUserPassword(user.id, newPasswordHash);
  
  if (success) {
    notify("Password changed successfully!");
    document.getElementById("changePasswordForm").reset();
  } else {
    notify("Failed to change password");
  }
});

// Show login dialog
document.getElementById("loginButton")?.addEventListener("click", () => {
  document.getElementById("loginDialog").showModal();
});

// Show register dialog
document.getElementById("registerButton")?.addEventListener("click", () => {
  document.getElementById("registerDialog").showModal();
});

// Switch to register from login
document.getElementById("switchToRegister")?.addEventListener("click", () => {
  document.getElementById("loginDialog").close();
  document.getElementById("registerDialog").showModal();
});

// Switch to login from register
document.getElementById("switchToLogin")?.addEventListener("click", () => {
  document.getElementById("registerDialog").close();
  document.getElementById("loginDialog").showModal();
});

// ========================================
// PRODUCT DISPLAY
// ========================================

function renderProducts(){
  products = getProducts(); // Refresh from database
  const filtered=products.filter(p=>(selectedCategory==="All"||p.category===selectedCategory)&&`${p.name} ${p.category} ${p.farmer} ${p.origin}`.toLowerCase().includes(searchText.toLowerCase()));
  document.getElementById("resultsLabel").textContent=searchText?`${filtered.length} result${filtered.length===1?"":"s"} found`:selectedCategory==="All"?"Fresh picks for you":selectedCategory;
  grid.innerHTML=filtered.length?filtered.map(p=>{
    const isOutOfStock = p.stock === 0;
    const isLowStock = p.stock < 10 && p.stock > 0;
    const stockBadge = isOutOfStock 
      ? '<span class="stock-badge out-of-stock">Out of Stock</span>' 
      : isLowStock 
      ? `<span class="stock-badge low-stock">Only ${p.stock} left!</span>` 
      : '';
    const addButtonDisabled = isOutOfStock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : '';
    
    return `<article class="product-card"><div class="product-photo"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.background='#e8eee3';this.parentElement.insertAdjacentHTML('beforeend','<span style=&quot;display:grid;place-items:center;height:100%;font-size:55px&quot;>${p.emoji}</span>')"><span class="product-tag">${p.tag}</span></div><div class="product-body"><div class="product-farmer"><span>♧</span> ${p.farmer}</div><h3 class="product-name">${p.name}</h3><div class="product-origin">⌖ ${p.origin}</div>${stockBadge}<div class="product-bottom"><div class="product-price">${peso(p.price)} <small>/ ${p.unit}</small></div><button class="add-button" aria-label="Add ${p.name} to basket" data-add="${p.id}" ${addButtonDisabled}>+</button></div></div></article>`;
  }).join(""):`<div class="empty-state"><strong>No produce found just yet.</strong>Try another search or category.</div>`;
  grid.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>{
    if (b.disabled) return;
    if (!isAuthenticated()) {
      notify("Please login to add items to cart");
      document.getElementById("loginDialog").showModal();
      return;
    }
    addToCart(Number(b.dataset.add));
  }));
}

// ========================================
// SHOPPING CART
// ========================================

function addToCart(id){
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  const currentCartQuantity = cart[id] || 0;
  
  // Check if adding one more would exceed available stock
  if (currentCartQuantity + 1 > product.stock) {
    notify(`Cannot add more - only ${product.stock} in stock`);
    return;
  }
  
  cart[id] = currentCartQuantity + 1;
  updateCartCount();
  notify(`${product.name} added to your basket`);
}

function updateCartCount(){
  document.getElementById("cartCount").textContent=Object.values(cart).reduce((a,b)=>a+b,0);
}

function renderCart(){
  const items=Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>({product:products.find(p=>p.id===Number(id)),q:Number(q)}));
  const holder=document.getElementById("cartItems");
  holder.innerHTML=items.length?items.map(({product:p,q})=>`<div class="cart-item"><img src="${p.image}" alt="" onerror="this.style.visibility='hidden'"><div><strong>${p.name}</strong><small>${peso(p.price)} / ${p.unit}</small></div><div class="quantity-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><b>${q}</b><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div>`).join(""):`<div class="cart-empty">Your basket is ready for something fresh. 🥬<br><br>Add produce from the marketplace to get started.</div>`;
  holder.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>{
    const id=Number(b.dataset.qty);
    const delta=Number(b.dataset.delta);
    const product=products.find(p=>p.id===id);
    
    if(delta>0&&product){
      const newQty=(cart[id]||0)+delta;
      if(newQty>product.stock){
        notify(`Cannot add more - only ${product.stock} in stock`);
        return;
      }
    }
    
    cart[id]=(cart[id]||0)+delta;
    if(cart[id]<=0)delete cart[id];
    updateCartCount();
    renderCart();
  }));
  const subtotal=items.reduce((sum,{product:p,q})=>sum+p.price*q,0);
  document.getElementById("cartSubtotal").textContent=peso(subtotal);
  document.getElementById("cartTotal").textContent=peso(subtotal);
  document.getElementById("cartFarmerShare").textContent=peso(subtotal*.9);
}

document.getElementById("searchInput").addEventListener("input",e=>{searchText=e.target.value;renderProducts()});

document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{
  selectedCategory=b.dataset.category;
  document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));
  renderProducts();
}));

document.getElementById("cartButton").addEventListener("click",()=>{
  if (!isAuthenticated()) {
    notify("Please login to view cart");
    document.getElementById("loginDialog").showModal();
    return;
  }
  renderCart();
  document.getElementById("cartDialog").showModal();
});

document.getElementById("checkoutButton").addEventListener("click",()=>{
  if(!Object.keys(cart).length){
    notify("Your basket is empty.");
    return;
  }
  
  const user = getCurrentUser();
  
  // Validate stock availability before creating order
  const stockIssues = [];
  Object.entries(cart).forEach(([id, q]) => {
    const product = products.find(p => p.id === Number(id));
    if (product && q > product.stock) {
      stockIssues.push(`${product.name} (only ${product.stock} available)`);
    }
  });
  
  if (stockIssues.length > 0) {
    notify(`Insufficient stock: ${stockIssues.join(', ')}`);
    renderCart(); // Refresh cart to show current state
    return;
  }
  
  const items = Object.entries(cart).map(([id, q]) => {
    const product = products.find(p => p.id === Number(id));
    return {
      productId: product.id,
      productName: product.name,
      quantity: q,
      price: product.price,
      unit: product.unit
    };
  });
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const order = addOrder({
    userId: user.id,
    userName: user.name,
    items: items,
    total: total,
    deliveryAddress: user.address || "Not specified",
    phone: user.phone || "Not specified",
    paymentMethod: "Cash on Delivery"
  });
  
  // Update stock for each item in the order
  items.forEach(item => {
    updateProductStock(item.productId, -item.quantity);
  });
  
  // Refresh product grid to show updated stock
  renderProducts();
  
  notify(`Order ${order.id} placed successfully!`);
  cart = {};
  updateCartCount();
  document.getElementById("cartDialog").close();
});

document.getElementById("farmerInfoButton").addEventListener("click",()=>document.getElementById("farmerDialog").showModal());

document.getElementById("applyButton").addEventListener("click",()=>{
  document.getElementById("farmerDialog").close();
  notify("Farmer registration will be connected in the full version.");
});

document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.close).close()));

// ========================================
// ADMIN PANEL
// ========================================

/**
 * Get relative time string from ISO date
 * @param {string} isoDate - ISO date string
 * @returns {string} Relative time (e.g., "2h ago", "1d ago")
 */
function getTimeAgo(isoDate) {
  const now = new Date();
  const then = new Date(isoDate);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

/**
 * Show status change confirmation modal
 * @param {string} orderId - Order ID
 * @param {string} oldStatus - Current status
 * @param {string} newStatus - New status to change to
 * @param {HTMLElement} dropdown - The dropdown element
 */
function showStatusChangeConfirmation(orderId, oldStatus, newStatus, dropdown) {
  const modal = document.getElementById('statusChangeDialog');
  document.getElementById('statusChangeOrderId').textContent = orderId;
  document.getElementById('statusChangeOld').textContent = oldStatus;
  document.getElementById('statusChangeNew').textContent = newStatus;
  
  // Store data for confirmation
  modal.dataset.orderId = orderId;
  modal.dataset.newStatus = newStatus;
  modal.dataset.oldStatus = oldStatus;
  modal.dataset.dropdownIndex = Array.from(document.querySelectorAll('.status-dropdown')).indexOf(dropdown);
  
  modal.showModal();
}

/**
 * Confirm status change
 */
function confirmStatusChange() {
  const modal = document.getElementById('statusChangeDialog');
  const orderId = modal.dataset.orderId;
  const newStatus = modal.dataset.newStatus;
  
  const result = updateOrderStatus(orderId, newStatus);
  
  if (result) {
    notify(`Order ${orderId} status updated to ${newStatus}`);
    modal.close();
    loadAdminData(); // Refresh both order tables
  } else {
    notify('Failed to update order status');
  }
}

/**
 * Cancel status change
 */
function cancelStatusChange() {
  const modal = document.getElementById('statusChangeDialog');
  const dropdownIndex = parseInt(modal.dataset.dropdownIndex);
  const oldStatus = modal.dataset.oldStatus;
  
  // Revert dropdown to original status
  const dropdowns = document.querySelectorAll('.status-dropdown');
  if (dropdowns[dropdownIndex]) {
    dropdowns[dropdownIndex].value = oldStatus;
  }
  
  modal.close();
}

// Make status change functions global for onclick handlers
window.confirmStatusChange = confirmStatusChange;
window.cancelStatusChange = cancelStatusChange;

const buyer=document.getElementById("buyerView"),admin=document.getElementById("adminView");

function showAdmin(on){
  if (on && !isAdmin()) {
    document.getElementById("adminLoginDialog").showModal();
    return;
  }
  
  buyer.classList.toggle("hidden",on);
  admin.classList.toggle("hidden",!on);
  document.getElementById("adminSwitch").innerHTML=on?"🛍 View marketplace":"▦ Admin dashboard";
  window.scrollTo({top:0,behavior:"smooth"});
  
  if (on) {
    loadAdminData();
  }
}

document.getElementById("adminSwitch")?.addEventListener("click",()=>{
  if (!isAuthenticated()) {
    document.getElementById("adminLoginDialog").showModal();
    return;
  }
  showAdmin(admin.classList.contains("hidden"));
});

document.getElementById("backToShop")?.addEventListener("click",()=>showAdmin(false));

// Load admin dashboard data
function loadAdminData() {
  const orders = getOrders();
  const allProducts = getProducts();
  
  // Update stats
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  document.getElementById("grossSales").textContent = peso(totalSales);
  document.getElementById("farmerEarnings").textContent = peso(totalSales * 0.9);
  document.getElementById("platformRevenue").textContent = peso(totalSales * 0.1);
  document.getElementById("orderTotal").textContent = orders.length;
  
  // Low stock alert section
  const lowStockProducts = getLowStockProducts();
  const statsGrid = document.querySelector('.stats-grid');
  let lowStockSection = document.getElementById('lowStockAlert');
  
  if (lowStockProducts.length > 0 && !lowStockSection) {
    lowStockSection = document.createElement('div');
    lowStockSection.id = 'lowStockAlert';
    lowStockSection.className = 'admin-note low-stock-alert';
    statsGrid.insertAdjacentElement('afterend', lowStockSection);
  }
  
  if (lowStockProducts.length > 0) {
    const lowStockList = lowStockProducts.map(p => 
      `<div class="low-stock-item"><strong>${p.emoji} ${p.name}</strong><span class="stock-level ${p.stock === 0 ? 'zero' : 'low'}">${p.stock} units</span></div>`
    ).join('');
    
    lowStockSection.innerHTML = `
      <span style="color: #d97706; font-size: 20px;">⚠</span>
      <div>
        <strong>Low Stock Alert (${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's' : ''})</strong>
        <p>The following products are running low on inventory:</p>
        <div class="low-stock-list">${lowStockList}</div>
      </div>
    `;
  } else if (lowStockSection) {
    lowStockSection.remove();
  }
  
  // Recent orders
  document.getElementById("recentOrders").innerHTML = orders.slice(-4).reverse().map(o=>
    `<tr><td class="order-id">${o.id}</td><td>${o.userName}</td><td>${peso(o.total)}</td><td><span class="status ${o.status.toLowerCase()}">${o.status}</span></td></tr>`
  ).join("");
  
  // All orders with status dropdown
  document.getElementById("ordersTable").innerHTML = orders.slice().reverse().map(o=>{
    const timeAgo = o.updatedAt && o.status !== 'Pending' ? `<small style="display:block;font-size:9px;color:#89938a;margin-top:3px;">Updated ${getTimeAgo(o.updatedAt)}</small>` : '';
    return `<tr>
      <td class="order-id">${o.id}</td>
      <td>${o.userName}</td>
      <td>${o.items.length} items</td>
      <td>${peso(o.total)}</td>
      <td>
        <select class="status-dropdown status ${o.status.toLowerCase()}" data-order-id="${o.id}" data-current-status="${o.status}">
          <option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option>
          <option value="Processing" ${o.status==='Processing'?'selected':''}>Processing</option>
          <option value="Delivered" ${o.status==='Delivered'?'selected':''}>Delivered</option>
          <option value="Cancelled" ${o.status==='Cancelled'?'selected':''}>Cancelled</option>
        </select>
        ${timeAgo}
      </td>
    </tr>`;
  }).join("");
  
  // Add event listeners to status dropdowns
  document.querySelectorAll('.status-dropdown').forEach(dropdown => {
    dropdown.addEventListener('change', (e) => {
      const orderId = e.target.dataset.orderId;
      const oldStatus = e.target.dataset.currentStatus;
      const newStatus = e.target.value;
      
      if (oldStatus !== newStatus) {
        showStatusChangeConfirmation(orderId, oldStatus, newStatus, e.target);
      }
    });
  });
  
  // Products table with color-coded stock levels, clickable rows, and delete buttons
  document.getElementById("productsTable").innerHTML = allProducts.map(p=>{
    let stockBadge, stockClass;
    if (p.stock === 0) {
      stockBadge = 'Out of stock';
      stockClass = 'cancelled';
    } else if (p.stock < 10) {
      stockBadge = `Low stock (${p.stock})`;
      stockClass = 'pending';
    } else {
      stockBadge = `In stock (${p.stock})`;
      stockClass = 'approved';
    }
    
    return `<tr style="cursor: pointer;" data-product-id="${p.id}">
      <td onclick="openEditProductModal(${p.id})"><strong>${p.emoji} ${p.name}</strong></td>
      <td onclick="openEditProductModal(${p.id})">${p.category}</td>
      <td onclick="openEditProductModal(${p.id})">${peso(p.price)} / ${p.unit}</td>
      <td onclick="openEditProductModal(${p.id})">${p.farmer}</td>
      <td onclick="openEditProductModal(${p.id})"><span class="status ${stockClass}">${stockBadge}</span></td>
      <td><button onclick="event.stopPropagation(); openDeleteProductModal(${p.id})" style="background: #fee; color: #b91c1c; border: 0; padding: 6px 10px; border-radius: 6px; font-size: 9px; font-weight: 700; cursor: pointer;">Delete</button></td>
    </tr>`;
  }).join("");
  
  // Top products (mock data)
  const topItems=[["🥭","Carabao Mangoes","34 orders","₱4,080"],["🥬","Fresh Pechay","29 orders","₱1,015"],["🌾","Brown Rice","24 orders","₱1,392"],["🍅","Organic Tomatoes","21 orders","₱1,365"]];
  document.getElementById("topProducts").innerHTML=topItems.map(([emoji,name,orders,amount])=>`<div class="top-product"><div class="top-product-emoji">${emoji}</div><div><strong>${name}</strong><small>${orders}</small></div><b>${amount}</b></div>`).join("");
}

function activatePanel(panel){
  document.querySelectorAll(".admin-tab").forEach(b=>b.classList.toggle("active",b.dataset.panel===panel));
  document.querySelectorAll(".admin-panel").forEach(p=>p.classList.add("hidden"));
  document.getElementById("admin"+panel[0].toUpperCase()+panel.slice(1)).classList.remove("hidden");
  
  if (panel === "overview" || panel === "orders" || panel === "products") {
    loadAdminData();
  }
}

document.querySelectorAll(".admin-tab").forEach(b=>b.addEventListener("click",()=>activatePanel(b.dataset.panel)));
document.querySelectorAll("[data-open-panel]").forEach(b=>b.addEventListener("click",()=>activatePanel(b.dataset.openPanel)));

// ========================================
// PRODUCT CRUD
// ========================================

// Open Add Product modal
document.getElementById("addProductButton")?.addEventListener("click",()=>{
  document.getElementById("addProductForm").reset();
  document.getElementById("addProductDialog").showModal();
});

// Handle Add Product form submission
document.getElementById("addProductForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const newProduct = {
    id: getNextProductId(),
    name: document.getElementById("addProductName").value,
    category: document.getElementById("addProductCategory").value,
    price: parseFloat(document.getElementById("addProductPrice").value),
    unit: document.getElementById("addProductUnit").value,
    stock: parseInt(document.getElementById("addProductStock").value),
    farmer: document.getElementById("addProductFarmer").value,
    origin: document.getElementById("addProductOrigin").value,
    tag: document.getElementById("addProductTag").value,
    emoji: document.getElementById("addProductEmoji").value,
    image: document.getElementById("addProductImage").value,
    description: document.getElementById("addProductDescription").value
  };
  
  addProduct(newProduct);
  notify(`${newProduct.name} added successfully!`);
  document.getElementById("addProductDialog").close();
  document.getElementById("addProductForm").reset();
  loadAdminData();
  renderProducts(); // Refresh buyer view products too
});

// Handle Edit Product form submission
document.getElementById("editProductForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const productId = parseInt(document.getElementById("editProductId").value);
  const updates = {
    name: document.getElementById("editProductName").value,
    category: document.getElementById("editProductCategory").value,
    price: parseFloat(document.getElementById("editProductPrice").value),
    unit: document.getElementById("editProductUnit").value,
    stock: parseInt(document.getElementById("editProductStock").value),
    farmer: document.getElementById("editProductFarmer").value,
    origin: document.getElementById("editProductOrigin").value,
    tag: document.getElementById("editProductTag").value,
    emoji: document.getElementById("editProductEmoji").value,
    image: document.getElementById("editProductImage").value,
    description: document.getElementById("editProductDescription").value
  };
  
  updateProduct(productId, updates);
  notify(`${updates.name} updated successfully!`);
  document.getElementById("editProductDialog").close();
  loadAdminData();
  renderProducts();
});

// Open Edit Product modal with product data
function openEditProductModal(productId) {
  const product = getProducts().find(p => p.id === productId);
  if (!product) return;
  
  document.getElementById("editProductId").value = product.id;
  document.getElementById("editProductName").value = product.name;
  document.getElementById("editProductCategory").value = product.category;
  document.getElementById("editProductPrice").value = product.price;
  document.getElementById("editProductUnit").value = product.unit;
  document.getElementById("editProductStock").value = product.stock;
  document.getElementById("editProductFarmer").value = product.farmer;
  document.getElementById("editProductOrigin").value = product.origin;
  document.getElementById("editProductTag").value = product.tag;
  document.getElementById("editProductEmoji").value = product.emoji;
  document.getElementById("editProductImage").value = product.image;
  document.getElementById("editProductDescription").value = product.description;
  
  document.getElementById("editProductDialog").showModal();
}

// Open Delete Product confirmation
function openDeleteProductModal(productId) {
  const product = getProducts().find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.getElementById("deleteProductDialog");
  document.getElementById("deleteProductName").textContent = `${product.emoji} ${product.name}`;
  modal.dataset.productId = productId;
  modal.showModal();
}

// Confirm delete product
function confirmDeleteProduct() {
  const modal = document.getElementById("deleteProductDialog");
  const productId = parseInt(modal.dataset.productId);
  
  const result = deleteProduct(productId);
  if (result) {
    notify("Product deleted successfully");
    modal.close();
    loadAdminData();
    renderProducts();
  } else {
    notify("Failed to delete product");
  }
}

// Cancel delete product
function cancelDeleteProduct() {
  document.getElementById("deleteProductDialog").close();
}

// Make these functions global for onclick handlers
window.openEditProductModal = openEditProductModal;
window.openDeleteProductModal = openDeleteProductModal;
window.confirmDeleteProduct = confirmDeleteProduct;
window.cancelDeleteProduct = cancelDeleteProduct;

// ========================================
// PASSWORD VISIBILITY TOGGLE
// ========================================

function initPasswordToggles() {
  const eyeOpenSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeOffSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.innerHTML = eyeOpenSvg;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const input = targetId ? document.getElementById(targetId) : btn.parentElement?.querySelector('input');
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.innerHTML = isPassword ? eyeOffSvg : eyeOpenSvg;
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.title = isPassword ? 'Hide password' : 'Show password';
    });
  });
}

// ========================================
// LANDING PAGE INTERACTION HANDLERS
// ========================================

function initLandingHandlers() {
  document.getElementById("landingLoginBtn")?.addEventListener("click", () => {
    document.getElementById("loginDialog")?.showModal();
  });

  document.getElementById("landingRegisterBtn")?.addEventListener("click", () => {
    document.getElementById("registerDialog")?.showModal();
  });

  document.getElementById("heroLoginBtn")?.addEventListener("click", () => {
    document.getElementById("loginDialog")?.showModal();
  });

  document.getElementById("heroRegisterBtn")?.addEventListener("click", () => {
    document.getElementById("registerDialog")?.showModal();
  });

  document.getElementById("previewLoginBtn")?.addEventListener("click", () => {
    document.getElementById("loginDialog")?.showModal();
  });

  document.getElementById("finalCtaBtn")?.addEventListener("click", () => {
    document.getElementById("registerDialog")?.showModal();
  });

  document.getElementById("finalLoginBtn")?.addEventListener("click", () => {
    document.getElementById("loginDialog")?.showModal();
  });

  // Smooth scroll for landing page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// ========================================
// INITIALIZE
// ========================================

renderProducts();
updateAuthUI();
updatePageView();
initPasswordToggles();
initLandingHandlers();
