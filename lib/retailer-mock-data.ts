// Mock data for Retailer Portal
// This will be replaced with real API calls later

import { Retailer, Wholesaler, Product, Order, Invoice, DashboardData } from '@/types/retailer';

// Mock Wholesalers
export const mockWholesalers: Wholesaler[] = [
  {
    id: 'wh-001',
    name: 'MediSupplyCo.',
    code: 'MEDISUPPLY2024',
    address: '9-g, Motijheel Commercial Area',
    phone: '+8801712229656',
    email: 'contact@ahmedpharma.com',
    description: 'MediSupply Corporation',
  },
  {
    id: 'wh-002',
    name: 'Bismillah Pharma',
    code: 'BISMILLAH2024',
    address: 'Dhaka, Bangladesh',
    phone: '+8801712345678',
    email: 'info@bismillahpharma.com',
    description: 'Bismillah Pharmaceuticals Ltd.',
  },
  {
    id: 'wh-003',
    name: 'Square Pharmaceuticals',
    code: 'SQUARE2024',
    address: 'Dhaka, Bangladesh',
    phone: '+8801712345679',
    email: 'info@squarepharma.com',
    description: 'Square Pharmaceuticals Ltd.',
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Napa Extend',
    description: 'Paracetamol Extended Release Tablet',
    price: 100.99,
    stock: 150,
    image: '/api/placeholder/200/200',
    manufacturer: 'Beximco Pharmaceuticals PLC',
    category: 'Pain Relief',
    wholesalerId: 'wh-001',
    sku: 'NAP-EXT-001',
  },
  {
    id: 'prod-002',
    name: 'Ceevit Vitamin C',
    description: 'Vitamin C 500mg Tablet',
    price: 100.99,
    stock: 200,
    image: '/api/placeholder/200/200',
    manufacturer: 'Beximco Pharmaceuticals PLC',
    category: 'Vitamins',
    wholesalerId: 'wh-001',
    sku: 'CEV-VIT-002',
  },
  {
    id: 'prod-003',
    name: 'Sergel',
    description: 'Omeprazole 20mg Capsule',
    price: 100.99,
    stock: 120,
    image: '/api/placeholder/200/200',
    manufacturer: 'Beximco Pharmaceuticals PLC',
    category: 'Gastrointestinal',
    wholesalerId: 'wh-001',
    sku: 'SER-OME-003',
  },
  {
    id: 'prod-004',
    name: 'Monas 10',
    description: 'Montelukast 10mg Tablet',
    price: 100.99,
    stock: 180,
    image: '/api/placeholder/200/200',
    manufacturer: 'Beximco Pharmaceuticals PLC',
    category: 'Respiratory',
    wholesalerId: 'wh-001',
    sku: 'MON-MON-004',
  },
  {
    id: 'prod-005',
    name: 'Ace 500',
    description: 'Paracetamol 500mg Tablet',
    price: 85.50,
    stock: 300,
    image: '/api/placeholder/200/200',
    manufacturer: 'Square Pharmaceuticals',
    category: 'Pain Relief',
    wholesalerId: 'wh-001',
    sku: 'ACE-500-005',
  },
  {
    id: 'prod-006',
    name: 'Napa 500',
    description: 'Paracetamol 500mg Tablet',
    price: 90.00,
    stock: 250,
    image: '/api/placeholder/200/200',
    manufacturer: 'Beximco Pharmaceuticals PLC',
    category: 'Pain Relief',
    wholesalerId: 'wh-001',
    sku: 'NAP-500-006',
  },
];

// Mock Retailers
export const mockRetailers: Retailer[] = [
  {
    id: 'ret-001',
    fullName: 'Hasan Mahady',
    phone: '+8801711111111',
    email: 'hasan@example.com',
    shopName: 'BGD Pharmacy',
    address: '123 Main Street',
    city: 'Dhaka',
    wholesalerId: '', // No default wholesaler - must be added manually
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    retailerId: 'ret-001',
    wholesalerId: 'wh-001',
    items: [
      {
        id: 'item-001',
        productId: 'prod-001',
        product: mockProducts[0],
        quantity: 10,
        price: 100.99,
        subtotal: 1009.90,
      },
      {
        id: 'item-002',
        productId: 'prod-002',
        product: mockProducts[1],
        quantity: 5,
        price: 100.99,
        subtotal: 504.95,
      },
    ],
    total: 1514.85,
    status: 'delivered',
    orderDate: '2024-01-20T10:00:00Z',
    deliveryDate: '2024-01-22T14:00:00Z',
    notes: 'Please deliver before 5 PM',
  },
  {
    id: 'ord-002',
    retailerId: 'ret-001',
    wholesalerId: 'wh-001',
    items: [
      {
        id: 'item-003',
        productId: 'prod-003',
        product: mockProducts[2],
        quantity: 20,
        price: 100.99,
        subtotal: 2019.80,
      },
    ],
    total: 2019.80,
    status: 'processing',
    orderDate: '2024-01-25T09:00:00Z',
    notes: 'Urgent order',
  },
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    orderId: 'ord-001',
    retailerId: 'ret-001',
    wholesalerId: 'wh-001',
    amount: 1514.85,
    dueAmount: 0,
    status: 'paid',
    issueDate: '2024-01-20T10:00:00Z',
    dueDate: '2024-02-20T10:00:00Z',
    paidDate: '2024-01-21T15:00:00Z',
  },
  {
    id: 'inv-002',
    orderId: 'ord-002',
    retailerId: 'ret-001',
    wholesalerId: 'wh-001',
    amount: 2019.80,
    dueAmount: 2019.80,
    status: 'unpaid',
    issueDate: '2024-01-25T09:00:00Z',
    dueDate: '2024-02-25T09:00:00Z',
  },
];

// Helper function to get retailer's connected wholesaler
export function getRetailerWholesaler(retailerId: string): Wholesaler | null {
  const retailer = mockRetailers.find(r => r.id === retailerId);
  if (!retailer) return null;
  return mockWholesalers.find(w => w.id === retailer.wholesalerId) || null;
}

// Helper function to get products for a wholesaler
export function getWholesalerProducts(wholesalerId: string): Product[] {
  return mockProducts.filter(p => p.wholesalerId === wholesalerId);
}

// Helper function to get orders for a retailer
export function getRetailerOrders(retailerId: string): Order[] {
  return mockOrders.filter(o => o.retailerId === retailerId);
}

// Helper function to get invoices for a retailer
export function getRetailerInvoices(retailerId: string): Invoice[] {
  return mockInvoices.filter(i => i.retailerId === retailerId);
}

// Helper function to calculate dashboard data
export function getDashboardData(retailerId: string): DashboardData {
  let retailer = mockRetailers.find(r => r.id === retailerId);
  
  // If retailer not found, create a demo retailer (no default wholesaler)
  if (!retailer) {
    retailer = {
      id: retailerId,
      fullName: 'Demo User',
      phone: '+8801700000000',
      email: 'demo@example.com',
      shopName: 'Demo Pharmacy',
      address: '123 Demo Street',
      city: 'Dhaka',
      wholesalerId: '', // No default wholesaler
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  // Get wholesaler only if retailer has one connected (no default)
  let wholesaler = getRetailerWholesaler(retailerId);
  
  // Return null if no wholesaler is connected (no auto-assignment)
  
  const orders = getRetailerOrders(retailerId);
  const invoices = getRetailerInvoices(retailerId);
  
  const lastOrder = orders.length > 0 ? orders[orders.length - 1] : undefined;
  const dueAmount = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.dueAmount, 0);
  const totalOrders = orders.length;
  const totalSpent = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  return {
    retailer,
    wholesaler,
    lastOrder,
    dueAmount,
    totalOrders,
    totalSpent,
  };
}

// Mock Manufacturers
export interface Manufacturer {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

export const mockManufacturers: Manufacturer[] = [
  {
    id: 'mfg-001',
    name: 'Square Pharmaceuticals Ltd.',
    logo: '/api/placeholder/100/100',
    productCount: 1250,
  },
  {
    id: 'mfg-002',
    name: 'Incepta Pharmaceuticals Ltd.',
    logo: '/api/placeholder/100/100',
    productCount: 980,
  },
  {
    id: 'mfg-003',
    name: 'BEXIMCO PHARMA',
    logo: '/api/placeholder/100/100',
    productCount: 1150,
  },
  {
    id: 'mfg-004',
    name: 'ARISTOPHARMA PLC.',
    logo: '/api/placeholder/100/100',
    productCount: 850,
  },
  {
    id: 'mfg-005',
    name: 'Healthcare Pharmaceuticals',
    logo: '/api/placeholder/100/100',
    productCount: 720,
  },
  {
    id: 'mfg-006',
    name: 'ACI Limited',
    logo: '/api/placeholder/100/100',
    productCount: 650,
  },
  {
    id: 'mfg-007',
    name: 'SK+F Pharmaceuticals',
    logo: '/api/placeholder/100/100',
    productCount: 580,
  },
  {
    id: 'mfg-008',
    name: 'Opsonin Pharma Limited',
    logo: '/api/placeholder/100/100',
    productCount: 520,
  },
];

// Mock Offers
export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil?: string;
}

export const mockOffers: Offer[] = [
  {
    id: 'offer-001',
    title: 'Get 20% OFF Your First Order',
    description: 'Unlock exclusive savings when you place your first order with us',
    discount: 20,
  },
  {
    id: 'offer-002',
    title: 'Get 20% OFF Your First Order',
    description: 'Unlock exclusive savings when you place your first order with us',
    discount: 20,
  },
  {
    id: 'offer-003',
    title: 'Get 20% OFF Your First Order',
    description: 'Unlock exclusive savings when you place your first order with us',
    discount: 20,
  },
];

