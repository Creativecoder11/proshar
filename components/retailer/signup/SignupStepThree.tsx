'use client';

import { useState } from 'react';
import { useSignupStore } from '@/lib/stores/signup-store';
import { Store, MapPin, Building2 } from 'lucide-react';

interface SignupStepThreeProps {
  onNext: () => void;
  onBack: () => void;
}

export default function SignupStepThree({ onNext, onBack }: SignupStepThreeProps) {
  const { formData, setFormData } = useSignupStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.shopName?.trim()) {
      newErrors.shopName = 'Shop name is required';
    }
    
    if (!formData.city?.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.policeStation?.trim()) {
      newErrors.policeStation = 'Police station is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
          Shop Name<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            id="shopName"
            value={formData.shopName || ''}
            onChange={(e) => setFormData({ shopName: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 border text-black rounded-lg focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent ${
              errors.shopName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter shop name"
          />
        </div>
        {errors.shopName && (
          <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>
        )}
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          City<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            id="city"
            value={formData.city || ''}
            onChange={(e) => setFormData({ city: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 border text-black rounded-lg focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter city"
          />
        </div>
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      <div>
        <label htmlFor="policeStation" className="block text-sm font-medium text-gray-700 mb-2">
          Police Station<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            id="policeStation"
            value={formData.policeStation || ''}
            onChange={(e) => setFormData({ policeStation: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 border text-black rounded-lg focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent ${
              errors.policeStation ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter police station"
          />
        </div>
        {errors.policeStation && (
          <p className="mt-1 text-sm text-red-600">{errors.policeStation}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Address<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <textarea
            id="address"
            value={formData.address || ''}
            onChange={(e) => setFormData({ address: e.target.value })}
            rows={3}
            className={`w-full pl-10 pr-4 py-3 border text-black rounded-lg focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter address"
          />
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-[#3A21C0] text-white py-3 px-4 rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium"
        >
          Next
        </button>
      </div>
    </form>
  );
}

