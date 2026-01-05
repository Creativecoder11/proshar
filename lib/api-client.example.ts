/**
 * EXAMPLE: API Client for Laravel Backend
 * 
 * This is an example file showing how to replace mock APIs with real Laravel endpoints.
 * 
 * TO USE:
 * 1. Copy this file to lib/api-client.ts
 * 2. Update baseURL with your Laravel API URL
 * 3. Replace mock functions in lib/retailer-api.ts with actual API calls using this client
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand persisted storage
    try {
      const authStorage = localStorage.getItem('cocodile-auth-storage');
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        const token = authData?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error reading auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    // Laravel returns data in response.data
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear auth storage
      localStorage.removeItem('cocodile-auth-storage');
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/retailer/login';
      }
    }

    // Handle other errors
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      'An error occurred';
    
    return Promise.reject(new Error(message));
  }
);

export default api;

/**
 * EXAMPLE USAGE:
 * 
 * import api from './api-client';
 * 
 * // GET request
 * const response = await api.get('/retailer/profile');
 * return response.data; // { success, message, data }
 * 
 * // POST request
 * const response = await api.post('/retailer/login', {
 *   phone_or_email: phoneOrEmail,
 *   password: password,
 * });
 * return response.data;
 * 
 * // POST with FormData (file upload)
 * const formData = new FormData();
 * formData.append('profile_image', file);
 * const response = await api.post('/retailer/profile/upload', formData, {
 *   headers: { 'Content-Type': 'multipart/form-data' },
 * });
 * return response.data;
 */

