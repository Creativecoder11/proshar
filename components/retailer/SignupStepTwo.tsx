'use client';

import { useState } from 'react';
import { useSignupStore } from '@/lib/stores/signup-store';

interface SignupStepTwoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function SignupStepTwo({ onNext, onBack }: SignupStepTwoProps) {
  const { formData, setFormData } = useSignupStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.shopName?.trim()) {
      newErrors.shopName = 'Shop/Business name is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
          Shop / Business Name *
        </label>
        <input
          type="text"
          id="shopName"
          value={formData.shopName || ''}
          onChange={(e) => setFormData({ shopName: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.shopName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your shop name"
        />
        {errors.shopName && (
          <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <textarea
          id="address"
          value={formData.address || ''}
          onChange={(e) => setFormData({ address: e.target.value })}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your business address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City *
        </label>
        <input
          type="text"
          id="city"
          value={formData.city || ''}
          onChange={(e) => setFormData({ city: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your city"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}

