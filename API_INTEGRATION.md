# API Integration Guide - COCODILE Retailer Portal

This document provides detailed instructions for replacing mock APIs with real Laravel backend endpoints.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [API Endpoint Mapping](#api-endpoint-mapping)
3. [Request/Response Formats](#requestresponse-formats)
4. [Token Handling](#token-handling)
5. [File Upload Handling](#file-upload-handling)
6. [Error Handling](#error-handling)
7. [Step-by-Step Replacement](#step-by-step-replacement)

## 🚀 Quick Start

### Step 1: Install Axios

```bash
npm install axios
```

### Step 2: Create API Client

Copy `lib/api-client.example.ts` to `lib/api-client.ts` and update the base URL:

```typescript
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
```

### Step 3: Replace Mock Functions

In `lib/retailer-api.ts`, replace each mock function with real API calls.

## 📍 API Endpoint Mapping

### Authentication Endpoints

#### 1. Login
- **Mock Function**: `retailerLogin(phoneOrEmail: string, password: string)`
- **Laravel Endpoint**: `POST /api/retailer/login`
- **Request Body**:
  ```json
  {
    "phone_or_email": "+8801712345678",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "retailer": {
        "id": "ret-001",
        "fullName": "Hasan Mahady",
        "phone": "+8801712345678",
        "email": "hasan@example.com",
        ...
      }
    }
  }
  ```

#### 2. Register
- **Mock Function**: `retailerRegister(formData: SignupFormData)`
- **Laravel Endpoint**: `POST /api/retailer/register`
- **Request**: FormData (multipart/form-data) for file upload support
- **Fields**:
  - `full_name` (string)
  - `phone` (string)
  - `email` (string)
  - `shop_name` (string)
  - `address` (string)
  - `city` (string)
  - `wholesaler_code` (string)
  - `profile_image` (file, optional)

#### 3. Validate Wholesaler Code
- **Mock Function**: `validateWholesalerCode(code: string)`
- **Laravel Endpoint**: `POST /api/retailer/validate-wholesaler-code`
- **Request Body**:
  ```json
  {
    "code": "BISMILLAH2024"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Wholesaler code is valid",
    "data": {
      "valid": true,
      "wholesaler": {
        "id": "wh-001",
        "name": "Bismillah Pharma"
      }
    }
  }
  ```

### Profile Endpoints

#### 4. Get Profile
- **Mock Function**: `getRetailerProfile(token: string)`
- **Laravel Endpoint**: `GET /api/retailer/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
      "id": "ret-001",
      "fullName": "Hasan Mahady",
      ...
    }
  }
  ```

#### 5. Update Profile
- **Mock Function**: `updateRetailerProfile(token: string, updates: Partial<Retailer>)`
- **Laravel Endpoint**: `PUT /api/retailer/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "full_name": "Updated Name",
    "phone": "+8801712345678",
    ...
  }
  ```

### Dashboard Endpoint

#### 6. Get Dashboard Data
- **Mock Function**: `getRetailerDashboard(token: string)`
- **Laravel Endpoint**: `GET /api/retailer/dashboard`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Dashboard data retrieved successfully",
    "data": {
      "retailer": {...},
      "wholesaler": {...},
      "lastOrder": {...},
      "dueAmount": 2019.80,
      "totalOrders": 2,
      "totalSpent": 1514.85
    }
  }
  ```

### Products Endpoint

#### 7. Get Products
- **Mock Function**: `getRetailerProducts(token: string, options?)`
- **Laravel Endpoint**: `GET /api/retailer/products`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `search` (optional): Search term
  - `category` (optional): Filter by category
  - `page` (optional): Page number (default: 1)
  - `per_page` (optional): Items per page (default: 20)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Products retrieved successfully",
    "data": {
      "products": [...],
      "total": 50,
      "page": 1,
      "per_page": 20
    }
  }
  ```

### Order Endpoints

#### 8. Create Order
- **Mock Function**: `createOrder(token: string, items: Array<{productId, quantity}>, notes?)`
- **Laravel Endpoint**: `POST /api/retailer/orders`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "items": [
      {
        "product_id": "prod-001",
        "quantity": 10
      }
    ],
    "notes": "Please deliver before 5 PM"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Order placed successfully",
    "data": {
      "id": "ord-001",
      "retailer_id": "ret-001",
      "items": [...],
      "total": 1514.85,
      "status": "pending",
      ...
    }
  }
  ```

#### 9. Get Orders List
- **Mock Function**: `getRetailerOrdersList(token: string, options?)`
- **Laravel Endpoint**: `GET /api/retailer/orders`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `status` (optional): Filter by status
  - `page` (optional): Page number

#### 10. Get Order Details
- **Mock Function**: `getRetailerOrder(token: string, orderId: string)`
- **Laravel Endpoint**: `GET /api/retailer/orders/{id}`
- **Headers**: `Authorization: Bearer {token}`

### Invoice Endpoint

#### 11. Get Invoices List
- **Mock Function**: `getRetailerInvoicesList(token: string, options?)`
- **Laravel Endpoint**: `GET /api/retailer/invoices`
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `status` (optional): Filter by status (paid/partial/unpaid)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Invoices retrieved successfully",
    "data": {
      "invoices": [...],
      "total": 10,
      "dueAmount": 2019.80
    }
  }
  ```

## 🔑 Token Handling

### Storage
- Tokens are stored in `localStorage` via Zustand persist middleware
- Storage key: `cocodile-auth-storage`
- Format: JSON string containing Zustand state object

### Retrieval
The API client automatically retrieves the token from localStorage and adds it to request headers:

```typescript
// In api-client.ts interceptor
const authStorage = localStorage.getItem('cocodile-auth-storage');
const authData = JSON.parse(authStorage);
const token = authData?.state?.token;
config.headers.Authorization = `Bearer ${token}`;
```

### Token Expiration
- On 401 response, the interceptor clears storage and redirects to login
- Laravel should return 401 when token is expired or invalid

## 📤 File Upload Handling

### Profile Picture Upload (Signup Step 4)

**Current Implementation**: Preview only (mock)

**Laravel Integration**:

```typescript
export async function retailerRegister(
  formData: SignupFormData
): Promise<AuthResponse> {
  const formDataToSend = new FormData();
  
  // Add text fields
  formDataToSend.append('full_name', formData.fullName);
  formDataToSend.append('phone', formData.phone);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('shop_name', formData.shopName);
  formDataToSend.append('address', formData.address);
  formDataToSend.append('city', formData.city);
  formDataToSend.append('wholesaler_code', formData.wholesalerCode);
  
  // Add file if present
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

**Laravel Backend Should**:
1. Accept `multipart/form-data`
2. Validate file (type, size)
3. Store file in `storage/app/public/profiles/`
4. Return image URL in response: `data.profileImage = '/storage/profiles/filename.jpg'`

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/expired token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `422`: Unprocessable Entity (validation failed)
- `500`: Server Error

### Validation Errors (422)

Laravel should return validation errors in this format:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": {
      "email": ["The email field is required."],
      "phone": ["The phone must be a valid phone number."]
    }
  }
}
```

## 🔄 Step-by-Step Replacement

### Example: Replacing Login Function

**1. Current Mock Implementation** (`lib/retailer-api.ts`):

```typescript
export async function retailerLogin(
  phoneOrEmail: string,
  password: string
): Promise<AuthResponse> {
  await delay(800);
  const retailer = mockRetailers.find(...);
  // ... mock logic
  return { success: true, ... };
}
```

**2. Import API Client**:

```typescript
import api from './api-client';
```

**3. Replace with Real API Call**:

```typescript
export async function retailerLogin(
  phoneOrEmail: string,
  password: string
): Promise<AuthResponse> {
  const response = await api.post('/retailer/login', {
    phone_or_email: phoneOrEmail,
    password,
  });
  return response.data;
}
```

**4. Remove Mock Dependencies**:

- Remove `delay()` calls
- Remove `mockRetailers` imports
- Keep the same function signature and return type

### Complete Replacement Checklist

- [ ] Install axios
- [ ] Create `lib/api-client.ts` from example
- [ ] Replace `retailerLogin()`
- [ ] Replace `retailerRegister()` (with FormData)
- [ ] Replace `validateWholesalerCode()`
- [ ] Replace `getRetailerProfile()`
- [ ] Replace `updateRetailerProfile()`
- [ ] Replace `getRetailerDashboard()`
- [ ] Replace `getRetailerProducts()`
- [ ] Replace `createOrder()`
- [ ] Replace `getRetailerOrdersList()`
- [ ] Replace `getRetailerOrder()`
- [ ] Replace `getRetailerInvoicesList()`
- [ ] Test all endpoints
- [ ] Remove mock data files (optional)

## 🧪 Testing

After replacing APIs, test each flow:

1. **Signup Flow**: Complete all 5 steps
2. **Login**: Use registered credentials
3. **Dashboard**: Verify data loads
4. **Products**: Test search and filters
5. **Cart**: Add items and place order
6. **Orders**: View list and details
7. **Invoices**: Verify due amounts
8. **Profile**: Edit and save

## 📝 Notes

- All API functions must maintain the same TypeScript signatures
- Response format must match Laravel structure: `{ success, message, data }`
- Token is automatically handled by API client interceptor
- File uploads require `multipart/form-data` content type
- Error handling is centralized in the API client interceptor

