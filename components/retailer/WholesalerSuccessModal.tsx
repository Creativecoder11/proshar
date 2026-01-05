'use client';

import { Users, Home } from 'lucide-react';

interface WholesalerSuccessModalProps {
  onClose: () => void;
  onManageWholesalers: () => void;
  onBackToHome: () => void;
}

export default function WholesalerSuccessModal({
  onClose,
  onManageWholesalers,
  onBackToHome,
}: WholesalerSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#ECF9F9] rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-[#2F7F7A]" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Wholesaler Added Successfully!
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 text-center mb-6">
          Your wholesaler has been successfully connected. You can now start ordering products from them.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={onManageWholesalers}
            className="flex-1 flex items-center justify-center gap-2 bg-[#ECF9F9] text-[#2F7F7A] px-4 py-3 rounded-lg hover:bg-[#d4f4f4] transition-colors font-medium"
          >
            <Users className="w-4 h-4" />
            Manage Wholesalers
          </button>
          <button
            onClick={onBackToHome}
            className="flex-1 flex items-center justify-center gap-2 bg-[#2F7F7A] text-white px-4 py-3 rounded-lg hover:bg-[#1e5d58] transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        {/* Reminder Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-xs text-gray-700 text-center">
            Remember: Keep your wholesaler code secure and don't share it with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}

