'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield } from 'lucide-react';

interface OTPVerificationProps {
  phone: string;
  onVerify: (otp: string) => void;
  onBack?: () => void;
  onResend?: () => void;
}

export default function OTPVerification({ phone, onVerify, onBack, onResend }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
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
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (newOtp.every((digit) => digit !== '') && newOtp.join('').length === 6) {
      onVerify(newOtp.join(''));
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
      onVerify(pastedData);
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
    <div className="space-y-6">
      {/* Icon and Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your phone</h2>
        <p className="text-sm text-gray-600 mb-1">Please check your phone at {maskedPhone}. We've sent a 6-digit OTP.</p>
      </div>

      {/* OTP Input Fields */}
      <div className="flex gap-3 justify-center">
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
            className="w-12 h-12 text-center text-lg font-semibold text-black border-2 border-gray-300 rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488] focus:outline-none"
          />
        ))}
      </div>

      {/* Timer */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Code expires in{' '}
          <span className="font-semibold text-orange-500">{formatTime(timeLeft)}</span>
        </p>
      </div>

      {/* Resend Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={onResend}
          disabled={timeLeft > 0}
          className="text-sm text-[#0D9488] hover:text-[#0b7d72] font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Didn't receive the code?
        </button>
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={() => onVerify(otp.join(''))}
        disabled={otp.some((digit) => !digit)}
        className="w-full bg-[#0D9488] text-white py-3 px-4 rounded-lg hover:bg-[#0b7d72] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>

      {/* Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Back
        </button>
      )}

      {/* Note */}
      <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Note:</span> You'll receive a 6-digit OTP on your phone. The OTP will be valid for 10 minutes.
        </p>
      </div>
    </div>
  );
}

