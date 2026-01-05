// TypeScript models for Retailer Portal

export interface Retailer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  shopName: string;
  address: string;
  city: string;
  profileImage?: string;
  wholesalerId: string; // Keep for backward compatibility
  wholesalerIds?: string[]; // Support multiple wholesalers
  createdAt: string;
  updatedAt: string;
}

export interface Wholesaler {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string; // For subtitle like "MediSupply Corporation"
}

export interface RetailerWholesaler {
  id: string;
  retailerId: string;
  wholesalerId: string;
  wholesaler: Wholesaler;
  status: 'active' | 'inactive';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  manufacturer?: string;
  category?: string;
  wholesalerId: string;
  sku?: string;
  // Quantity options for product
  quantityOptions?: ProductQuantityOption[];
}

export interface ProductQuantityOption {
  boxes: number;
  tablets: number;
  label: string; // e.g., "01 Box - 30 Tablets"
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedQuantityOption?: ProductQuantityOption;
  // Stock availability
  isInStock: boolean;
  availableStock?: number;
  restockDate?: string; // When wholesaler will restock
  shipmentDate?: string; // When this item can be shipped
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  retailerId: string;
  wholesalerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  retailerId: string;
  wholesalerId: string;
  amount: number;
  dueAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    retailer: Retailer;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SignupFormData {
  // Step 1: Basic Information
  fullName: string;
  phone: string;
  email: string;
  
  // Step 2: OTP Verification (handled separately)
  otp?: string;
  
  // Step 3: Business & Location
  shopName: string;
  city: string;
  policeStation: string;
  address: string;
  
  // Step 4: Password
  password: string;
  confirmPassword: string;
  
  // Optional fields
  profileImage?: string | File;
  wholesalerCode?: string;
}

export interface DashboardData {
  retailer: Retailer;
  wholesaler: Wholesaler;
  lastOrder?: Order;
  dueAmount: number;
  totalOrders: number;
  totalSpent: number;
}
