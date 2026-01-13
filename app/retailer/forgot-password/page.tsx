'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/lib/retailer-api';
import { Phone, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!phone.trim()) {
        setError('Phone number is required');
        setIsLoading(false);
        return;
      }

      const response = await forgotPassword(phone);
      
      if (response.success) {
        // Store phone in sessionStorage for next step
        sessionStorage.setItem('reset-phone', phone);
        router.push('/retailer/forgot-password/verify-otp');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0D9488] flex-col items-center justify-center px-12 text-white">
        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white"></div>
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white"></div>
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-2">MediGo</h1>
          <p className="text-center text-white/90 mb-12">Bangladesh's First Medicine Marketplace</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
              <p className="text-gray-600 text-sm">
                Enter your phone number and we'll send you an OTP to reset your password.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Form */}
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
                    className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0D9488] text-white py-3 px-4 rounded-lg hover:bg-[#0b7d72] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/retailer/login" className="text-[#0D9488] hover:text-[#0b7d72] font-medium">
                  Sign In →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

