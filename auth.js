// auth.js - Authentication system for Anihan Market
// Handles user registration, login, logout, session management, and admin authentication

import { 
  getUsers, 
  addUser, 
  findUserByEmail, 
  getSession, 
  setSession, 
  clearSession 
} from './database.js';

// ========================================
// PASSWORD HASHING (DEMO ONLY)
// ========================================

/**
 * Hash a password using btoa (Base64 encoding)
 * DEMO ONLY: btoa is NOT secure for production. Use bcrypt or similar server-side.
 * @param {string} plaintext - Plain text password
 * @returns {string} Base64 encoded password
 */
export function hashPassword(plaintext) {
  // DEMO ONLY: btoa is NOT secure for production. Use bcrypt or similar server-side.
  return btoa(plaintext);
}

/**
 * Verify a password against a hash
 * @param {string} plaintext - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {boolean} True if password matches
 */
export function verifyPassword(plaintext, hash) {
  return btoa(plaintext) === hash;
}

// ========================================
// USER REGISTRATION
// ========================================

/**
 * Register a new user
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password (will be hashed)
 * @param {string} userData.phone - User's phone number
 * @param {string} userData.address - User's delivery address
 * @returns {Object} Success object with user data or error object
 */
export function registerUser({ name, email, password, phone, address }) {
  // Validate required fields
  if (!name || !email || !password || !phone || !address) {
    return { 
      success: false, 
      error: 'All fields are required' 
    };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { 
      success: false, 
      error: 'Invalid email format' 
    };
  }

  // Check if email is already registered
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return { 
      success: false, 
      error: 'Email already registered' 
    };
  }

  // Hash password and create user
  const passwordHash = hashPassword(password);
  const newUser = addUser({
    name,
    email,
    passwordHash,
    phone,
    address
  });

  return { 
    success: true, 
    user: newUser 
  };
}

// ========================================
// USER LOGIN
// ========================================

/**
 * Login a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Success object with user data or error object
 */
export function loginUser(email, password) {
  // Find user by email
  const user = findUserByEmail(email);
  
  if (!user) {
    return { 
      success: false, 
      error: 'Invalid email or password' 
    };
  }

  // Verify password
  if (!verifyPassword(password, user.passwordHash)) {
    return { 
      success: false, 
      error: 'Invalid email or password' 
    };
  }

  // Create session
  const sessionData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: 'user'
  };
  
  setSession(sessionData);

  return { 
    success: true, 
    user: sessionData 
  };
}

// ========================================
// ADMIN LOGIN
// ========================================

/**
 * Login as admin with hardcoded credentials
 * Hardcoded admin: admin@anihan.ph / anihan2024admin
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Object} Success object or error object
 */
export function loginAdmin(email, password) {
  // Check hardcoded admin credentials
  if (email === 'admin@anihan.ph' && password === 'anihan2024admin') {
    const adminSession = {
      id: 'admin',
      name: 'Admin',
      email: 'admin@anihan.ph',
      role: 'admin'
    };
    
    setSession(adminSession);
    
    return { 
      success: true,
      user: adminSession
    };
  }

  return { 
    success: false, 
    error: 'Invalid admin credentials' 
  };
}

// ========================================
// LOGOUT
// ========================================

/**
 * Logout current user and clear session
 * @returns {Object} Success object
 */
export function logout() {
  clearSession();
  return { success: true };
}

// ========================================
// SESSION QUERIES
// ========================================

/**
 * Get current logged-in user from session
 * @returns {Object|null} User object or null if not logged in
 */
export function getCurrentUser() {
  return getSession();
}

/**
 * Check if a user is currently authenticated
 * @returns {boolean} True if user is logged in
 */
export function isAuthenticated() {
  return getCurrentUser() !== null;
}

/**
 * Check if current user is an admin
 * @returns {boolean} True if current user has admin role
 */
export function isAdmin() {
  return getCurrentUser()?.role === 'admin';
}

// ========================================
// AUTHORIZATION HELPERS
// ========================================

/**
 * Require authentication before executing callback
 * Shows toast notification if not authenticated
 * @param {Function} callback - Function to execute if authenticated
 */
export function requireAuth(callback) {
  if (isAuthenticated()) {
    callback();
  } else {
    // Show toast notification - assumes global notify() function exists
    if (typeof notify === 'function') {
      notify('Please log in first');
    } else {
      alert('Please log in first');
    }
  }
}

/**
 * Require admin role before executing callback
 * Shows toast notification if not admin
 * @param {Function} callback - Function to execute if admin
 */
export function requireAdmin(callback) {
  if (isAdmin()) {
    callback();
  } else {
    // Show toast notification - assumes global notify() function exists
    if (typeof notify === 'function') {
      notify('Admin access required');
    } else {
      alert('Admin access required');
    }
  }
}
