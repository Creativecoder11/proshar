'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { verifyOTP } from '@/lib/retailer-api';
import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function VerifyOTPPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get phone from sessionStorage
    const storedPhone = sessionStorage.getItem('reset-phone');
    if (!storedPhone) {
      router.push('/retailer/forgot-password');
      return;
    }
    setPhone(storedPhone);

    // Focus first input
    inputRefs.current[0]?.focus();

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpValue: string) => {
    if (!phone) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await verifyOTP(phone, otpValue);
      if (response.success && response.data.verified) {
        // Store OTP in sessionStorage for next step
        sessionStorage.setItem('reset-otp', otpValue);
        router.push('/retailer/forgot-password/new-password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maskedPhone = phone?.length > 6 
    ? `${phone.slice(0, 4)}*${phone.slice(-3)}` 
    : phone;

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

      {/* Right Panel - OTP Verification */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">OTP Verification</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Icon and Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your phone</h2>
              <p className="text-sm text-gray-600 mb-1">
                Please check your phone at {maskedPhone}. We've sent a 6-digit OTP.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="flex gap-3 justify-center mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    if (el !== null) {
                      inputRefs.current[index] = el;
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isLoading}
                  className="w-12 h-12 text-center text-lg text-black font-semibold border-2 border-gray-300 rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488] focus:outline-none disabled:opacity-50"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Code expires in{' '}
                <span className="font-semibold text-orange-500">{formatTime(timeLeft)}</span>
              </p>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={() => handleVerify(otp.join(''))}
              disabled={otp.some((digit) => !digit) || isLoading}
              className="w-full bg-[#0D9488] text-white py-3 px-4 rounded-lg hover:bg-[#0b7d72] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </button>

            {/* Resend Link */}
            <div className="text-center mb-4">
              <button
                type="button"
                onClick={() => router.push('/retailer/forgot-password')}
                disabled={timeLeft > 0}
                className="text-sm text-[#0D9488] hover:text-[#0b7d72] font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Didn't receive the code?
              </button>
            </div>

            {/* Note */}
            <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Note:</span> You'll receive a 6-digit OTP on your phone. The OTP will be valid for 10 minutes.
              </p>
            </div>

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

