# Proshar - Retailer Portal

A comprehensive B2B Wholesale-Retailer platform frontend built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Multi-step Signup Flow** - 5-step registration with form persistence
- **Authentication** - Login with phone/email and password
- **Dashboard** - Overview of orders, expenses, and wholesaler information
- **Product Browsing** - Search and filter products from connected wholesaler
- **Shopping Cart** - Add, update, and manage cart items
- **Order Management** - View orders, track status, and view order details
- **Invoice Management** - View invoices and track due amounts
- **Profile Management** - View and edit retailer profile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
├── app/
│   ├── retailer/
│   │   ├── login/          # Login page
│   │   ├── signup/         # Multi-step signup
│   │   ├── dashboard/      # Dashboard page
│   │   ├── products/       # Products listing
│   │   ├── cart/           # Shopping cart
│   │   ├── orders/         # Orders list & detail
│   │   ├── invoices/       # Invoices list
│   │   └── profile/        # Profile management
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home (redirects to login)
├── components/
│   └── retailer/           # Retailer-specific components
├── lib/
│   ├── retailer-api.ts     # API service layer (MOCK)
│   ├── retailer-mock-data.ts # Mock data
│   └── stores/             # Zustand stores
├── types/
│   └── retailer.ts         # TypeScript types
└── README.md
```

## 🔌 API Integration Guide

### Current State: Mock APIs

All API calls are currently mocked in `lib/retailer-api.ts`. The mock functions simulate network delays and return Laravel-compatible response structures.

### Replacing Mock APIs with Real Laravel Backend

#### Step 1: Install Axios

```bash
npm install axios
```

#### Step 2: Create Axios Instance

Create a new file `lib/api-client.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cocodile-auth-storage');
  if (token) {
    try {
      const authData = JSON.parse(token);
      if (authData.state?.token) {
        config.headers.Authorization = `Bearer ${authData.state.token}`;
      }
    } catch (e) {
      // Handle parse error
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/retailer/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Step 3: Replace Mock Functions

In `lib/retailer-api.ts`, replace each mock function with actual API calls:

**Example: Login Function**

```typescript
// BEFORE (Mock)
export async function retailerLogin(
  phoneOrEmail: string,
  password: string
): Promise<AuthResponse> {
  await delay(800);
  // ... mock logic
}

// AFTER (Real API)
import api from './api-client';

export async function retailerLogin(
  phoneOrEmail: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post('/retailer/login', {
    phone_or_email: phoneOrEmail,
    password,
  });
  return response.data; // Laravel returns { success, message, data }
}
```

### API Endpoint Mapping

| Mock Function | Laravel Endpoint | Method | Description |
|--------------|------------------|--------|-------------|
| `retailerLogin()` | `/api/retailer/login` | POST | Authenticate retailer |
| `retailerRegister()` | `/api/retailer/register` | POST | Register new retailer |
| `validateWholesalerCode()` | `/api/retailer/validate-wholesaler-code` | POST | Validate wholesaler code |
| `getRetailerProfile()` | `/api/retailer/profile` | GET | Get retailer profile |
| `updateRetailerProfile()` | `/api/retailer/profile` | PUT | Update retailer profile |
| `getRetailerDashboard()` | `/api/retailer/dashboard` | GET | Get dashboard data |
| `getRetailerProducts()` | `/api/retailer/products` | GET | Get products list |
| `createOrder()` | `/api/retailer/orders` | POST | Create new order |
| `getRetailerOrdersList()` | `/api/retailer/orders` | GET | Get orders list |
| `getRetailerOrder()` | `/api/retailer/orders/{id}` | GET | Get order details |
| `getRetailerInvoicesList()` | `/api/retailer/invoices` | GET | Get invoices list |

### Request/Response Format

All Laravel endpoints should return responses in this format:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    // Response data
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

### Token Handling

- **Storage**: Tokens are stored in localStorage via Zustand persist middleware
- **Storage Key**: `cocodile-auth-storage`
- **Format**: JSON string containing Zustand state
- **Header**: `Authorization: Bearer {token}`

### File Upload Handling

For profile picture upload in signup (Step 4):

1. **Current**: Image preview only (mock)
2. **Laravel Integration**:

```typescript
// In retailerRegister function
export async function retailerRegister(
  formData: SignupFormData
): Promise<AuthResponse> {
  const formDataToSend = new FormData();
  
  formDataToSend.append('full_name', formData.fullName);
  formDataToSend.append('phone', formData.phone);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('shop_name', formData.shopName);
  formDataToSend.append('address', formData.address);
  formDataToSend.append('city', formData.city);
  formDataToSend.append('wholesaler_code', formData.wholesalerCode);
  
  if (formData.profileImage instanceof File) {
    formDataToSend.append('profile_image', formData.profileImage);
  }
  
  const response = await api.post('/retailer/register', formDataToSend, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}
```

Laravel should handle the file upload and return the image URL in the response.

## 🔐 Authentication Flow

1. User logs in with phone/email and password
2. Backend returns JWT token and retailer data
3. Token stored in Zustand store (persisted to localStorage)
4. Token automatically added to all API requests via Axios interceptor
5. On 401 error, user redirected to login

## 📱 Mobile-First Design

All pages are built with mobile-first responsive design using Tailwind CSS breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🎨 State Management

### Zustand Stores

1. **Auth Store** (`lib/stores/auth-store.ts`)
   - Manages authentication state
   - Persists to localStorage
   - Stores token and retailer data

2. **Cart Store** (`lib/stores/cart-store.ts`)
   - Manages shopping cart
   - Persists to localStorage
   - Handles add/remove/update items

3. **Signup Store** (`lib/stores/signup-store.ts`)
   - Manages multi-step signup form state
   - Persists between steps
   - Resets after successful registration

## 🧪 Testing with Mock Data

The application uses mock data for development. You can test with:

- **Login**: Any phone/email and password (min 6 chars)
- **Wholesaler Codes**: 
  - `BISMILLAH2024`
  - `SQUARE2024`

## 📝 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🚨 Important Notes

1. **Data Isolation**: Retailers can only see data from their connected wholesaler
2. **No Backend Yet**: All data is mocked - replace APIs before production
3. **Image Upload**: Currently preview only - implement file upload in Laravel
4. **Token Security**: In production, consider httpOnly cookies instead of localStorage

## 📚 Next Steps

1. Replace mock APIs with real Laravel endpoints
2. Implement proper error handling
3. Add loading states and skeletons
4. Add form validation on backend
5. Implement real-time order status updates
6. Add payment integration
7. Add notifications system

## 🤝 Contributing

This is a frontend-only implementation. Backend integration is required for production use.

## 📄 License

Private - COCODILE Platform

