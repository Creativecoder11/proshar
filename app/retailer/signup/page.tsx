'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignupStore } from '@/lib/stores/signup-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { retailerRegister, sendOTP, verifyOTP } from '@/lib/retailer-api';
import SignupStepOne from '@/components/retailer/signup/SignupStepOne';
import OTPVerification from '@/components/retailer/signup/OTPVerification';
import SignupStepThree from '@/components/retailer/signup/SignupStepThree';
import SignupStepFour from '@/components/retailer/signup/SignupStepFour';


import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';

const TOTAL_STEPS = 4;

export default function SignupPage() {
  const router = useRouter();
  const { formData, currentStep, setCurrentStep, reset } = useSignupStore();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'OTP Verify' },
    { number: 3, title: 'Shop Details' },
    { number: 4, title: 'Password' },
  ];

  useEffect(() => {
    // Send OTP when moving to step 2
    if (currentStep === 2 && formData.phone && !formData.otp) {
      handleSendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formData.phone]);

  const handleSendOTP = async () => {
    if (!formData.phone) return;
    
    setIsSendingOTP(true);
    setError('');
    
    try {
      await sendOTP(formData.phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (!formData.phone) return;
    
    setIsVerifyingOTP(true);
    setError('');
    
    try {
      const response = await verifyOTP(formData.phone, otp);
      if (response.success && response.data.verified) {
        setCurrentStep(3);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Validate all required fields
      if (
        !formData.fullName ||
        !formData.phone ||
        !formData.email ||
        !formData.shopName ||
        !formData.address ||
        !formData.city ||
        !formData.policeStation ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError('Please complete all required fields');
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      const response = await retailerRegister(formData as any);
      
      if (response.success) {
        // Save auth data
        login(response.data.token, response.data.retailer);
        
        // Clear signup form
        reset();
        
        // Redirect to dashboard
        router.push('/retailer/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SignupStepOne onNext={handleNext} />;
      case 2:
        return (
          <OTPVerification
            phone={formData.phone || ''}
            onVerify={handleVerifyOTP}
            onBack={handleBack}
            onResend={handleSendOTP}
          />
        );
      case 3:
        return <SignupStepThree onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <SignupStepFour onNext={handleSubmit} onBack={handleBack} />;
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

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
              <CheckCircle2 className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Verified Pharmacies</h3>
                <p className="text-white/80 text-sm">Licensed and trusted</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <CheckCircle2 className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Best Deals</h3>
                <p className="text-white/80 text-sm">Exclusive offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign Up</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Welcome Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome to Medigo <span className="inline-block">👋</span>
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Create your retailer account - Step {currentStep} of {TOTAL_STEPS}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#0D9488] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Step Content */}
            <div className="mb-6">{renderStep()}</div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
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
