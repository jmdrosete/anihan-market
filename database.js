// database.js - localStorage data persistence layer for Anihan Market
// All data stored in localStorage with 'anihan_' prefix

// ========================================
// INITIAL PRODUCT CATALOG (20 products)
// ========================================
const INITIAL_PRODUCTS = [
  // Existing 8 products
  {id:1, name:"Fresh Pechay", category:"Vegetables", price:35, unit:"bunch", farmer:"Juan Dela Cruz", origin:"Calapan, Oriental Mindoro", tag:"Freshly picked", emoji:"🥬", image:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=85", stock:45, description:"Crisp and fresh from our partner farms"},
  {id:2, name:"Sweet Carabao Mangoes", category:"Fruits", price:120, unit:"kg", farmer:"Maria Santos", origin:"Victoria, Oriental Mindoro", tag:"Seasonal favorite", emoji:"🥭", image:"https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=700&q=85", stock:67, description:"Premium quality carabao mangoes, naturally sweet"},
  {id:3, name:"Organic Tomatoes", category:"Vegetables", price:65, unit:"kg", farmer:"Pedro Ramos", origin:"Naujan, Oriental Mindoro", tag:"Farm fresh", emoji:"🍅", image:"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=85", stock:82, description:"Vine-ripened organic tomatoes"},
  {id:4, name:"Brown Rice", category:"Rice & Grains", price:58, unit:"kg", farmer:"Juan Dela Cruz", origin:"Calapan, Oriental Mindoro", tag:"Locally milled", emoji:"🌾", image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=85", stock:120, description:"Nutritious locally milled brown rice"},
  {id:5, name:"Sweet Lakatan Banana", category:"Fruits", price:75, unit:"saba bundle", farmer:"Maria Santos", origin:"Victoria, Oriental Mindoro", tag:"Naturally sweet", emoji:"🍌", image:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=85", stock:38, description:"Fresh lakatan bananas, perfect for snacking"},
  {id:6, name:"Fresh Eggplant", category:"Vegetables", price:48, unit:"kg", farmer:"Pedro Ramos", origin:"Naujan, Oriental Mindoro", tag:"Harvest today", emoji:"🍆", image:"https://images.unsplash.com/photo-1659261200845-bf9b2d70a6b0?auto=format&fit=crop&w=700&q=85", stock:54, description:"Freshly harvested eggplant from local farms"},
  {id:7, name:"Red Onions", category:"Vegetables", price:95, unit:"kg", farmer:"Juan Dela Cruz", origin:"Calapan, Oriental Mindoro", tag:"Kitchen essential", emoji:"🧅", image:"https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=700&q=85", stock:73, description:"Premium red onions for your kitchen needs"},
  {id:8, name:"Fresh Pineapple", category:"Fruits", price:85, unit:"piece", farmer:"Maria Santos", origin:"Victoria, Oriental Mindoro", tag:"Sweet & juicy", emoji:"🍍", image:"https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=700&q=85", stock:42, description:"Sweet and juicy pineapples harvested at peak ripeness"},
  
  // New 12 products (Vegetables: 3, Fruits: 3, Rice & Grains: 3, Root Crops: 3)
  {id:9, name:"Sitaw String Beans", category:"Vegetables", price:52, unit:"kg", farmer:"Pedro Ramos", origin:"Naujan, Oriental Mindoro", tag:"Farm fresh", emoji:"🫘", image:"https://images.unsplash.com/photo-1626436358362-cbfebde91c64?auto=format&fit=crop&w=700&q=85", stock:61, description:"Fresh string beans perfect for Filipino dishes"},
  {id:10, name:"Kangkong Water Spinach", category:"Vegetables", price:30, unit:"bunch", farmer:"Juan Dela Cruz", origin:"Calapan, Oriental Mindoro", tag:"Organic", emoji:"🥬", image:"https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=700&q=85", stock:47, description:"Organic water spinach, rich in nutrients"},
  {id:11, name:"Ampalaya Bitter Gourd", category:"Vegetables", price:55, unit:"kg", farmer:"Maria Santos", origin:"Victoria, Oriental Mindoro", tag:"Harvest today", emoji:"🥒", image:"https://images.unsplash.com/photo-1631706128229-e59d6c9e6c68?auto=format&fit=crop&w=700&q=85", stock:39, description:"Fresh bitter gourd, known for health benefits"},
  {id:12, name:"Fresh Papaya", category:"Fruits", price:68, unit:"kg", farmer:"Pedro Ramos", origin:"Naujan, Oriental Mindoro", tag:"Ripe & ready", emoji:"🍈", image:"https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=700&q=85", stock:55, description:"Ripe papayas perfect for breakfast"},
  {id:13, name:"Sweet Watermelon", category:"Fruits", price:45, unit:"kg", farmer:"Juan Dela Cruz", origin:"Calapan, Oriental Mindoro", tag:"Summer treat", emoji:"🍉", image:"https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=700&q=85", stock:78, description:"Refreshing watermelon for hot summer days"},
  {id:14, name:"Fresh Calamansi", category:"Fruits", price:80, unit:"kg", farmer:"Maria Santos", origin:"Victoria, Oriental Mindoro", tag:"Citrus burst", emoji:"🍋", image:"https://images.unsplash.com/photo-1621264448270-9ef00e88a935?auto=format&fit=crop&w=700&q=85", stock:91, description:"Fresh calamansi for cooking and drinks"},
  {id:15, name:"White Rice Sinandomeng", category:"Rice & Grains", price:52, unit:"kg", farmer:"Pedro Ramos", origin:"Naujan, Oriental Mindoro", tag:"Premium quality", emoji:"🍚", image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=85", stock:135, description:"Premium sinandomeng white rice"},
  {id:16, name:"Palay Unmilled Rice", category:"Rice & Grains", price:42, unit:"kg", farmer:"Juan Dela Cruz", origin:"Calapan, Oriental Mindoro", tag:"Direct from farm", emoji:"🌾", image:"https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=700&q=85", stock:158, description:"Unmilled palay rice direct from the fields"},
  {id:17, name:"White Corn", category:"Rice & Grains", price:48, unit:"kg", farmer:"Maria Santos", origin:"Victoria, Oriental Mindoro", tag:"Fresh harvest", emoji:"🌽", image:"https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=700&q=85", stock:89, description:"Fresh white corn kernels"},
  {id:18, name:"Kamote Sweet Potato", category:"Root Crops", price:45, unit:"kg", farmer:"Pedro Ramos", origin:"Naujan, Oriental Mindoro", tag:"Naturally sweet", emoji:"🍠", image:"https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=85", stock:102, description:"Sweet and nutritious kamote"},
  {id:19, name:"Gabi Taro", category:"Root Crops", price:58, unit:"kg", farmer:"Juan Dela Cruz", origin:"Calapan, Oriental Mindoro", tag:"Farm fresh", emoji:"🥔", image:"https://images.unsplash.com/photo-1587049332358-d3c7e40f1b95?auto=format&fit=crop&w=700&q=85", stock:67, description:"Fresh taro root for traditional Filipino dishes"},
  {id:20, name:"Ube Purple Yam", category:"Root Crops", price:95, unit:"kg", farmer:"Maria Santos", origin:"Victoria, Oriental Mindoro", tag:"Premium quality", emoji:"🍠", image:"https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=700&q=85", stock:44, description:"Premium ube for desserts and delicacies"}
];

// ========================================
// DATABASE INITIALIZATION
// ========================================

/**
 * Initialize database with default product catalog if not already present
 * Creates anihan_products in localStorage on first run
 */
export function initDatabase() {
  if (!localStorage.getItem('anihan_products')) {
    localStorage.setItem('anihan_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  // Initialize empty arrays for orders and users if they don't exist
  if (!localStorage.getItem('anihan_orders')) {
    localStorage.setItem('anihan_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('anihan_users')) {
    localStorage.setItem('anihan_users', JSON.stringify([]));
  }
}

// ========================================
// PRODUCT CRUD OPERATIONS
// ========================================

/**
 * Get all products from localStorage
 * @returns {Array} Array of product objects
 */
export function getProducts() {
  const data = localStorage.getItem('anihan_products');
  return data ? JSON.parse(data) : [];
}

/**
 * Add a new product to the catalog
 * @param {Object} productObj - Product object to add
 * @returns {Object} The added product
 */
export function addProduct(productObj) {
  const products = getProducts();
  products.push(productObj);
  localStorage.setItem('anihan_products', JSON.stringify(products));
  return productObj;
}

/**
 * Update an existing product by id
 * @param {number} id - Product id to update
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated product or null if not found
 */
export function updateProduct(id, updates) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  localStorage.setItem('anihan_products', JSON.stringify(products));
  return products[index];
}

/**
 * Delete a product by id
 * @param {number} id - Product id to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  
  localStorage.setItem('anihan_products', JSON.stringify(filtered));
  return true;
}

// ========================================
// ORDER CRUD OPERATIONS
// ========================================

/**
 * Get all orders from localStorage
 * @returns {Array} Array of order objects
 */
export function getOrders() {
  const data = localStorage.getItem('anihan_orders');
  return data ? JSON.parse(data) : [];
}

/**
 * Add a new order
 * @param {Object} orderObj - Order object (must include userId, userName, items, total, deliveryAddress, phone, paymentMethod)
 * @returns {Object} The created order with generated id and timestamp
 */
export function addOrder(orderObj) {
  const orders = getOrders();
  const newOrder = {
    ...orderObj,
    id: `#AN-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: orderObj.status || 'Pending'
  };
  orders.push(newOrder);
  localStorage.setItem('anihan_orders', JSON.stringify(orders));
  return newOrder;
}

/**
 * Update order status
 * @param {string} orderId - Order id to update
 * @param {string} newStatus - New status (Pending, Processing, Delivered, Cancelled)
 * @returns {Object|null} Updated order or null if not found
 */
export function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;
  
  orders[index].status = newStatus;
  localStorage.setItem('anihan_orders', JSON.stringify(orders));
  return orders[index];
}

// ========================================
// USER CRUD OPERATIONS
// ========================================

/**
 * Get all users from localStorage
 * @returns {Array} Array of user objects
 */
export function getUsers() {
  const data = localStorage.getItem('anihan_users');
  return data ? JSON.parse(data) : [];
}

/**
 * Add a new user
 * @param {Object} userObj - User object (must include name, email, passwordHash, phone, address)
 * @returns {Object} The created user (without password) with generated id and timestamp
 */
export function addUser(userObj) {
  const users = getUsers();
  const newUser = {
    ...userObj,
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem('anihan_users', JSON.stringify(users));
  
  // Return user without password
  const { passwordHash, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Find user by email
 * @param {string} email - Email to search for
 * @returns {Object|null} User object or null if not found
 */
export function findUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// ========================================
// SESSION MANAGEMENT
// ========================================

/**
 * Get current session
 * @returns {Object|null} Current user session or null
 */
export function getSession() {
  const data = localStorage.getItem('anihan_session');
  return data ? JSON.parse(data) : null;
}

/**
 * Set current session
 * @param {Object} userObj - User object to store in session (should include id, name, email, role)
 */
export function setSession(userObj) {
  localStorage.setItem('anihan_session', JSON.stringify(userObj));
}

/**
 * Clear current session (logout)
 */
export function clearSession() {
  localStorage.removeItem('anihan_session');
}
