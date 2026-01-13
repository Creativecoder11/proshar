/**
 * Retailer API Service Layer
 * 
 * This file contains mock API functions that mimic Laravel REST API responses.
 * 
 * TO REPLACE WITH REAL API:
 * 1. Install axios: npm install axios
 * 2. Create axios instance with base URL and auth headers
 * 3. Replace each function with actual API call
 * 4. Keep the same function signatures and return types
 * 
 * Example replacement:
 * 
 * import axios from 'axios';
 * 
 * const api = axios.create({
 *   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 * });
 * 
 * // Add auth token interceptor
 * api.interceptors.request.use((config) => {
 *   const token = localStorage.getItem('auth_token');
 *   if (token) {
 *     config.headers.Authorization = `Bearer ${token}`;
 *   }
 *   return config;
 * });
 * 
 * Then replace functions like:
 * 
 * export async function retailerLogin(phoneOrEmail: string, password: string) {
 *   const response = await api.post('/retailer/login', {
 *     phone_or_email: phoneOrEmail,
 *     password,
 *   });
 *   return response.data; // Laravel returns { success, message, data }
 * }
 */

import {
  AuthResponse,
  ApiResponse,
  Retailer,
  Product,
  Order,
  Invoice,
  DashboardData,
  SignupFormData,
  RetailerWholesaler,
  Wholesaler,
} from '@/types/retailer';
import {
  mockRetailers,
  mockWholesalers,
  getWholesalerProducts,
  getRetailerOrders,
  getRetailerInvoices,
  getDashboardData,
} from './retailer-mock-data';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * POST /api/retailer/login
 * 
 * Laravel endpoint: POST /api/retailer/login
 * Body: { phone_or_email: string, password: string }
 * Response: { success: boolean, message: string, data: { token: string, retailer: Retailer } }
 */
export async function retailerLogin(
  phoneOrEmail: string,
  password: string
): Promise<AuthResponse> {
  await delay(800); // Simulate network delay
  
  // Demo mode: Accept any credentials, just require minimum password length
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Try to find existing retailer
  let retailer = mockRetailers.find(
    r => r.phone === phoneOrEmail || r.email === phoneOrEmail
  );
  
  // If retailer doesn't exist, create a demo retailer for testing
  if (!retailer) {
    retailer = {
      id: 'ret-demo',
      fullName: phoneOrEmail.includes('@') 
        ? phoneOrEmail.split('@')[0].charAt(0).toUpperCase() + phoneOrEmail.split('@')[0].slice(1)
        : 'Demo User',
      phone: phoneOrEmail.includes('@') ? '+8801700000000' : phoneOrEmail,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'demo@example.com',
      shopName: 'Demo Pharmacy',
      address: '123 Demo Street',
      city: 'Dhaka',
      wholesalerId: 'wh-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  // Generate mock JWT token
  const mockToken = `mock_jwt_token_${retailer.id}_${Date.now()}`;
  
  return {
    success: true,
    message: 'Login successful',
    data: {
      token: mockToken,
      retailer,
    },
  };
}

/**
 * POST /api/retailer/send-otp
 * 
 * Laravel endpoint: POST /api/retailer/send-otp
 * Body: { phone: string }
 * Response: { success: boolean, message: string, data: { sent: boolean } }
 */
export async function sendOTP(phone: string): Promise<ApiResponse<{ sent: boolean }>> {
  await delay(800);
  
  // Mock: Always succeed
  return {
    success: true,
    message: 'OTP sent successfully',
    data: { sent: true },
  };
}

/**
 * POST /api/retailer/verify-otp
 * 
 * Laravel endpoint: POST /api/retailer/verify-otp
 * Body: { phone: string, otp: string }
 * Response: { success: boolean, message: string, data: { verified: boolean } }
 */
export async function verifyOTP(
  phone: string,
  otp: string
): Promise<ApiResponse<{ verified: boolean }>> {
  await delay(600);
  
  // Mock: Accept any 6-digit OTP
  if (!/^\d{6}$/.test(otp)) {
    throw new Error('Invalid OTP format');
  }
  
  return {
    success: true,
    message: 'OTP verified successfully',
    data: { verified: true },
  };
}

/**
 * POST /api/retailer/register
 * 
 * Laravel endpoint: POST /api/retailer/register
 * Body: SignupFormData
 * Response: { success: boolean, message: string, data: { token: string, retailer: Retailer } }
 */
export async function retailerRegister(
  formData: SignupFormData
): Promise<AuthResponse> {
  await delay(1000);
  
  // Check if email or phone already exists
  const existingRetailer = mockRetailers.find(
    r => r.email === formData.email || r.phone === formData.phone
  );
  if (existingRetailer) {
    throw new Error('Email or phone number already registered');
  }
  
  // Create new retailer (mock - assign to first wholesaler)
  const newRetailer: Retailer = {
    id: `ret-${Date.now()}`,
    fullName: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    shopName: formData.shopName,
    address: formData.address,
    city: formData.city,
    wholesalerId: mockWholesalers[0]?.id || 'wh-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // In real implementation, this would be saved to database
  // mockRetailers.push(newRetailer);
  
  const mockToken = `mock_jwt_token_${newRetailer.id}_${Date.now()}`;
  
  return {
    success: true,
    message: 'Registration successful',
    data: {
      token: mockToken,
      retailer: newRetailer,
    },
  };
}

/**
 * POST /api/retailer/forgot-password
 * 
 * Laravel endpoint: POST /api/retailer/forgot-password
 * Body: { phone: string }
 * Response: { success: boolean, message: string, data: { sent: boolean } }
 */
export async function forgotPassword(phone: string): Promise<ApiResponse<{ sent: boolean }>> {
  await delay(800);
  
  // Mock: Always succeed
  return {
    success: true,
    message: 'OTP sent successfully',
    data: { sent: true },
  };
}

/**
 * POST /api/retailer/reset-password
 * 
 * Laravel endpoint: POST /api/retailer/reset-password
 * Body: { phone: string, otp: string, password: string }
 * Response: { success: boolean, message: string, data: { reset: boolean } }
 */
export async function resetPassword(
  phone: string,
  otp: string,
  password: string
): Promise<ApiResponse<{ reset: boolean }>> {
  await delay(800);
  
  // Mock: Accept any valid OTP and password
  if (!/^\d{6}$/.test(otp)) {
    throw new Error('Invalid OTP format');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  return {
    success: true,
    message: 'Password reset successfully',
    data: { reset: true },
  };
}

/**
 * POST /api/retailer/validate-wholesaler-code
 * 
 * Laravel endpoint: POST /api/retailer/validate-wholesaler-code
 * Body: { code: string }
 * Response: { success: boolean, message: string, data: { valid: boolean, wholesaler?: Wholesaler } }
 */
export async function validateWholesalerCode(
  code: string
): Promise<ApiResponse<{ valid: boolean; wholesaler?: { id: string; name: string } }>> {
  await delay(500);
  
  const wholesaler = mockWholesalers.find(w => w.code === code);
  
  if (!wholesaler) {
    return {
      success: false,
      message: 'Invalid wholesaler access code',
      data: { valid: false },
    };
  }
  
  return {
    success: true,
    message: 'Wholesaler code is valid',
    data: {
      valid: true,
      wholesaler: {
        id: wholesaler.id,
        name: wholesaler.name,
      },
    },
  };
}

/**
 * Helper function to get retailer by ID, creating a demo one if not found
 */
function getRetailerById(retailerId: string): Retailer {
  let retailer = mockRetailers.find(r => r.id === retailerId);
  
  if (!retailer) {
    // Create a demo retailer if not found (no default wholesaler)
    retailer = {
      id: retailerId,
      fullName: 'Demo User',
      phone: '+8801700000000',
      email: 'demo@example.com',
      shopName: 'Demo Pharmacy',
      address: '123 Demo Street',
      city: 'Dhaka',
      wholesalerId: '', // No default wholesaler - must be added manually
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Add to mockRetailers so subsequent lookups work
    mockRetailers.push(retailer);
  }
  
  return retailer;
}

/**
 * Helper functions to persist retailer-wholesaler relationships in localStorage
 */
function getStoredWholesalerIds(retailerId: string): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(`retailer-wholesalers-${retailerId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading stored wholesaler IDs:', e);
  }
  
  return [];
}

function saveWholesalerIds(retailerId: string, wholesalerIds: string[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`retailer-wholesalers-${retailerId}`, JSON.stringify(wholesalerIds));
  } catch (e) {
    console.error('Error saving wholesaler IDs:', e);
  }
}

/**
 * GET /api/retailer/profile
 * 
 * Laravel endpoint: GET /api/retailer/profile
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string, data: Retailer }
 */
export async function getRetailerProfile(token: string): Promise<ApiResponse<Retailer>> {
  await delay(600);
  
  // Extract retailer ID from mock token
  const retailerId = token.split('_')[3] || 'ret-001';
  const retailer = getRetailerById(retailerId);
  
  return {
    success: true,
    message: 'Profile retrieved successfully',
    data: retailer,
  };
}

/**
 * PUT /api/retailer/profile
 * 
 * Laravel endpoint: PUT /api/retailer/profile
 * Headers: Authorization: Bearer {token}
 * Body: Partial<Retailer>
 * Response: { success: boolean, message: string, data: Retailer }
 */
export async function updateRetailerProfile(
  token: string,
  updates: Partial<Retailer>
): Promise<ApiResponse<Retailer>> {
  await delay(800);
  
  const retailerId = token.split('_')[3] || 'ret-001';
  const retailer = getRetailerById(retailerId);
  
  // Update retailer (in real app, this would update database)
  const updatedRetailer = { ...retailer, ...updates, updatedAt: new Date().toISOString() };
  
  return {
    success: true,
    message: 'Profile updated successfully',
    data: updatedRetailer,
  };
}

/**
 * GET /api/retailer/dashboard
 * 
 * Laravel endpoint: GET /api/retailer/dashboard
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string, data: DashboardData }
 */
export async function getRetailerDashboard(token: string): Promise<ApiResponse<DashboardData>> {
  await delay(700);
  
  // Try to extract retailer ID from token
  const retailerId = token.split('_')[3] || 'ret-001';
  
  // Use the helper function which handles missing retailers
  const dashboardData = getDashboardData(retailerId);
  
  return {
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: dashboardData,
  };
}

/**
 * GET /api/retailer/products
 * 
 * Laravel endpoint: GET /api/retailer/products?search=&category=&page=1&per_page=20
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string, data: { products: Product[], total: number, page: number } }
 */
export async function getRetailerProducts(
  token: string,
  options?: {
    search?: string;
    category?: string;
    page?: number;
    perPage?: number;
  }
): Promise<ApiResponse<{ products: Product[]; total: number; page: number; perPage: number }>> {
  await delay(600);
  
  const retailerId = token.split('_')[3] || 'ret-001';
  const retailer = getRetailerById(retailerId);
  
  let products = getWholesalerProducts(retailer.wholesalerId);
  
  // Apply search filter
  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.manufacturer?.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply category filter
  if (options?.category) {
    products = products.filter(p => p.category === options.category);
  }
  
  const total = products.length;
  const page = options?.page || 1;
  const perPage = options?.perPage || 20;
  const startIndex = (page - 1) * perPage;
  const paginatedProducts = products.slice(startIndex, startIndex + perPage);
  
  return {
    success: true,
    message: 'Products retrieved successfully',
    data: {
      products: paginatedProducts,
      total,
      page,
      perPage,
    },
  };
}

/**
 * GET /api/retailer/products/{id}
 * 
 * Laravel endpoint: GET /api/retailer/products/{id}
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string, data: Product }
 */
export async function getRetailerProduct(
  token: string,
  productId: string
): Promise<ApiResponse<Product>> {
  await delay(500);
  
  const retailerId = token.split('_')[3] || 'ret-001';
  const retailer = getRetailerById(retailerId);
  
  const products = getWholesalerProducts(retailer.wholesalerId);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return {
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  };
}

/**
 * POST /api/retailer/orders
 * 
 * Laravel endpoint: POST /api/retailer/orders
 * Headers: Authorization: Bearer {token}
 * Body: { items: [{ product_id: string, quantity: number }], notes?: string }
 * Response: { success: boolean, message: string, data: Order }
 */
export async function createOrder(
  token: string,
  items: Array<{ productId: string; quantity: number }>,
  notes?: string
): Promise<ApiResponse<Order>> {
  await delay(1000);
  
  const retailerId = token.split('_')[3] || 'ret-001';
  const retailer = getRetailerById(retailerId);
  
  // Build order items
  const orderItems = items.map((item, index) => {
    const product = getWholesalerProducts(retailer.wholesalerId).find(
      p => p.id === item.productId
    );
    
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }
    
    return {
      id: `item-${Date.now()}-${index}`,
      productId: product.id,
      product,
      quantity: item.quantity,
      price: product.price,
      subtotal: product.price * item.quantity,
    };
  });
  
  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    retailerId: retailer.id,
    wholesalerId: retailer.wholesalerId,
    items: orderItems,
    total,
    status: 'pending',
    orderDate: new Date().toISOString(),
    notes,
  };
  
  // In real implementation, this would be saved to database
  // mockOrders.push(newOrder);
  
  return {
    success: true,
    message: 'Order placed successfully',
    data: newOrder,
  };
}

/**
 * GET /api/retailer/orders
 * 
 * Laravel endpoint: GET /api/retailer/orders?status=&page=1
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string, data: { orders: Order[], total: number } }
 */
export async function getRetailerOrdersList(
  token: string,
  options?: { status?: string; page?: number }
): Promise<ApiResponse<{ orders: Order[]; total: number }>> {
  await delay(600);
  
  const retailerId = token.split('_')[3] || 'ret-001';
  let orders = getRetailerOrders(retailerId);
  
  // Apply status filter
  if (options?.status) {
    orders = orders.filter(o => o.status === options.status);
  }
  
  // Sort by order date (newest first)
  orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  
  return {
    success: true,
    message: 'Orders retrieved successfully',
    data: {
      orders,
      total: orders.length,
    },
  };
}

/**
 * GET /api/retailer/orders/{id}
 * 
 * Laravel endpoint: GET /api/retailer/orders/{id}
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string, data: Order }
 */
export async function getRetailerOrder(
  token: string,
  orderId: string
): Promise<ApiResponse<Order>> {
  await delay(500);
  
  const retailerId = token.split('_')[3] || 'ret-001';
  const orders = getRetailerOrders(retailerId);
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  return {
    success: true,
    message: 'Order retrieved successfully',
    data: order,
  };
}

/**
 * GET /api/retailer/invoices
 * 
 * Laravel endpoint: GET /api/retailer/invoices?status=&page=1
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string, data: { invoices: Invoice[], total: number, dueAmount: number } }
 */
export async function getRetailerInvoicesList(
  token: string,
  options?: { status?: string; page?: number }
): Promise<ApiResponse<{ invoices: Invoice[]; total: number; dueAmount: number }>> {
  await delay(600);
  
  const retailerId = token.split('_')[3] || 'ret-001';
  let invoices = getRetailerInvoices(retailerId);
  
  // Apply status filter
  if (options?.status) {
    invoices = invoices.filter(i => i.status === options.status);
  }
  
  // Sort by issue date (newest first)
  invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  
  const dueAmount = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.dueAmount, 0);
  
  return {
    success: true,
    message: 'Invoices retrieved successfully',
    data: {
      invoices,
      total: invoices.length,
      dueAmount,
    },
  };
}

/**
 * POST /api/retailer/wholesalers/add
 * 
 * Laravel endpoint: POST /api/retailer/wholesalers/add
 * Headers: Authorization: Bearer {token}
 * Body: { code: string }
 * Response: { success: boolean, message: string, data: RetailerWholesaler }
 */
export async function addWholesaler(
  token: string,
  code: string
): Promise<ApiResponse<RetailerWholesaler>> {
  await delay(800);
  
  // Extract retailer ID from mock token
  const retailerId = token.split('_')[3] || 'ret-001';
  const retailer = getRetailerById(retailerId);
  
  // Find wholesaler by code
  const wholesaler = mockWholesalers.find(w => w.code === code);
  
  if (!wholesaler) {
    throw new Error('Invalid wholesaler code');
  }
  
  // Get existing wholesaler IDs from localStorage
  const storedIds = getStoredWholesalerIds(retailerId);
  const existingWholesalerIds = storedIds.length > 0 
    ? storedIds 
    : (retailer.wholesalerIds || (retailer.wholesalerId ? [retailer.wholesalerId] : []));
  
  // Check if already connected
  if (existingWholesalerIds.includes(wholesaler.id)) {
    throw new Error('Wholesaler already connected');
  }
  
  // Create retailer-wholesaler relationship
  const retailerWholesaler: RetailerWholesaler = {
    id: `rw-${Date.now()}`,
    retailerId: retailer.id,
    wholesalerId: wholesaler.id,
    wholesaler: wholesaler,
    status: 'active',
    totalOrders: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
  };
  
  // Update retailer's wholesaler IDs and save to localStorage
  const updatedWholesalerIds = [...existingWholesalerIds, wholesaler.id];
  retailer.wholesalerIds = updatedWholesalerIds;
  saveWholesalerIds(retailerId, updatedWholesalerIds);
  
  // Set primary wholesaler if none exists
  if (!retailer.wholesalerId) {
    retailer.wholesalerId = wholesaler.id;
  }
  
  return {
    success: true,
    message: 'Wholesaler added successfully',
    data: retailerWholesaler,
  };
}

/**
 * GET /api/retailer/wholesalers
 * 
 * Laravel endpoint: GET /api/retailer/wholesalers
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string, data: { wholesalers: RetailerWholesaler[], total: number } }
 */
export async function getRetailerWholesalers(
  token: string
): Promise<ApiResponse<{ wholesalers: RetailerWholesaler[]; total: number }>> {
  await delay(600);
  
  // Extract retailer ID from mock token
  const retailerId = token.split('_')[3] || 'ret-001';
  const retailer = getRetailerById(retailerId);
  
  // Get all wholesaler IDs from localStorage (persisted data)
  const storedIds = getStoredWholesalerIds(retailerId);
  const wholesalerIds = storedIds.length > 0 
    ? storedIds 
    : (retailer.wholesalerIds || (retailer.wholesalerId ? [retailer.wholesalerId] : []));
  
  // Create RetailerWholesaler objects
  const wholesalers: RetailerWholesaler[] = wholesalerIds.map((whId, index) => {
    const wholesaler = mockWholesalers.find(w => w.id === whId);
    if (!wholesaler) return null;
    
    // Get orders for this wholesaler
    const orders = getRetailerOrders(retailerId).filter(o => o.wholesalerId === whId);
    const invoices = getRetailerInvoices(retailerId).filter(i => i.wholesalerId === whId);
    
    return {
      id: `rw-${whId}-${retailerId}`,
      retailerId: retailer.id,
      wholesalerId: wholesaler.id,
      wholesaler: wholesaler,
      status: 'active' as const,
      totalOrders: orders.length,
      totalSpent: invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0),
      lastOrderDate: orders.length > 0 
        ? orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())[0].orderDate
        : undefined,
      createdAt: retailer.createdAt,
    };
  }).filter(Boolean) as RetailerWholesaler[];
  
  return {
    success: true,
    message: 'Wholesalers retrieved successfully',
    data: {
      wholesalers,
      total: wholesalers.length,
    },
  };
}

/**
 * DELETE /api/retailer/wholesalers/:wholesalerId
 * 
 * Laravel endpoint: DELETE /api/retailer/wholesalers/:wholesalerId
 * Headers: Authorization: Bearer {token}
 * Response: { success: boolean, message: string }
 */
export async function removeWholesaler(
  token: string,
  wholesalerId: string
): Promise<ApiResponse<{ removed: boolean }>> {
  await delay(600);
  
  // Extract retailer ID from mock token
  const retailerId = token.split('_')[3] || 'ret-001';
  const retailer = getRetailerById(retailerId);
  
  // Get wholesaler IDs from localStorage
  const storedIds = getStoredWholesalerIds(retailerId);
  const wholesalerIds = storedIds.length > 0 
    ? storedIds 
    : (retailer.wholesalerIds || (retailer.wholesalerId ? [retailer.wholesalerId] : []));
  
  // Remove wholesaler from list
  const updatedIds = wholesalerIds.filter(id => id !== wholesalerId);
  retailer.wholesalerIds = updatedIds;
  saveWholesalerIds(retailerId, updatedIds);
  
  // If this was the primary wholesaler, set a new one or clear it
  if (retailer.wholesalerId === wholesalerId) {
    if (updatedIds.length > 0) {
      retailer.wholesalerId = updatedIds[0];
    } else {
      retailer.wholesalerId = '';
    }
  }
  
  return {
    success: true,
    message: 'Wholesaler removed successfully',
    data: { removed: true },
  };
}

