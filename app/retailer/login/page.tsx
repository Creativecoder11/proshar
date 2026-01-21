'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { retailerLogin } from '@/lib/retailer-api';
import { Loader2, Phone, Lock, CheckCircle2, Shield, Tag } from 'lucide-react';
import Image from 'next/image';
import prosharlogo from '@/assets/proshar-white.svg';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await retailerLogin(phone, password);
      
      if (response.success) {
        login(response.data.token, response.data.retailer);
        router.push('/retailer/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#3A21C0] flex-col items-center justify-center px-12 text-White">
        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Image src={prosharlogo} alt="Medigo Logo" width={200} height={50} />
          </div>
          <p className="text-center text-white/90 mb-12">Bangladesh's First Wholesaler Marketplace</p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <CheckCircle2 className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Quick Registration</h3>
                <p className="text-white/80 text-sm">Get started in minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Verified Pharmacies</h3>
                <p className="text-white/80 text-sm">Licensed and trusted</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <Tag className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Best Deals</h3>
                <p className="text-white/80 text-sm">Exclusive offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome to Medigo <span className="inline-block">👋</span>
              </h2>
              <p className="text-gray-600 text-sm">Sign in to access all wholesaler products and prices.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent"
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 text-[#3A21C0] text-black border-gray-300 rounded focus:ring-[#3A21C0]"
                  />
                  <span className="text-sm text-gray-700">Keep me signed in</span>
                </label>
                <Link
                  href="/retailer/forgot-password"
                  className="text-sm text-[#3A21C0] hover:text-[#7B6AD5] font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3A21C0] text-white py-3 px-4 rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/retailer/signup" className="text-[#3A21C0] hover:text-[#7B6AD5] font-medium">
                  Create new →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

