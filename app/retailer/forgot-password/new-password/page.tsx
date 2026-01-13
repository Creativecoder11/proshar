'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/retailer-api';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get phone and OTP from sessionStorage
    const storedPhone = sessionStorage.getItem('reset-phone');
    const storedOTP = sessionStorage.getItem('reset-otp');
    
    if (!storedPhone || !storedOTP) {
      router.push('/retailer/forgot-password');
      return;
    }
    
    setPhone(storedPhone);
    setOtp(storedOTP);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(phone, otp, password);
      
      if (response.success) {
        // Clear session storage
        sessionStorage.removeItem('reset-phone');
        sessionStorage.removeItem('reset-otp');
        
        // Redirect to login
        router.push('/retailer/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0D9488] flex-col items-center justify-center px-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center justify-center mb-8">
            <div className="flex gap-2">
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white"></div>
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white"></div>
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center mb-2">MediGo</h1>
          <p className="text-center text-white/90">Bangladesh's First Medicine Marketplace</p>
        </div>
      </div>

      {/* Right Panel - New Password */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Create New Password</h2>
              <p className="text-gray-600 text-sm">
                Please enter your new password below.
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center pt-4 border-t border-gray-200">
              <Link
                href="/retailer/login"
                className="text-sm text-[#0D9488] hover:text-[#0b7d72] font-medium"
              >
                Back to Sign In →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

