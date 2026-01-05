'use client';

import { useSignupStore } from '@/lib/stores/signup-store';
import { CheckCircle2 } from 'lucide-react';

interface SignupReviewProps {
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function SignupReview({ onSubmit, onBack, isSubmitting }: SignupReviewProps) {
  const { formData } = useSignupStore();

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Information</h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-base text-gray-900">{formData.fullName}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="text-base text-gray-900">{formData.phone}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p className="text-base text-gray-900">{formData.email}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Shop/Business Name</p>
            <p className="text-base text-gray-900">{formData.shopName}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="text-base text-gray-900">{formData.address}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">City</p>
            <p className="text-base text-gray-900">{formData.city}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Wholesaler Access Code</p>
            <p className="text-base text-gray-900">{formData.wholesalerCode}</p>
          </div>
          
          {formData.profileImage && (
            <div>
              <p className="text-sm font-medium text-gray-500">Profile Picture</p>
              <p className="text-base text-gray-900">
                {typeof formData.profileImage === 'string' ? 'Uploaded' : 'Selected'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-900 font-medium">Ready to submit</p>
          <p className="text-sm text-blue-700 mt-1">
            Please review all information carefully. You can go back to edit any step if needed.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </div>
    </div>
  );
}

