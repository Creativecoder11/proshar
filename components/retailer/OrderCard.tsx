'use client';

import { Order } from '@/types/retailer';
import Link from 'next/link';
import { Package, ChevronRight, Check, Truck, Clock, RotateCcw } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onOrderAgain?: (order: Order) => void;
}

const statusConfig = {
  pending: {
    color: 'bg-orange-50 text-orange-600 border border-orange-200',
    icon: Clock,
    label: 'Pending',
  },
  confirmed: {
    color: 'bg-blue-50 text-blue-600 border border-blue-200',
    icon: Check,
    label: 'Confirmed',
  },
  processing: {
    color: 'bg-purple-50 text-purple-600 border border-purple-200',
    icon: Package,
    label: 'Processing',
  },
  shipped: {
    color: 'bg-orange-50 text-orange-600 border border-orange-200',
    icon: Truck,
    label: 'Shipped',
  },
  delivered: {
    color: 'bg-green-50 text-green-600 border border-green-200',
    icon: Check,
    label: 'Delivered',
  },
  cancelled: {
    color: 'bg-red-50 text-red-600 border border-red-200',
    icon: RotateCcw,
    label: 'Cancelled',
  },
  returned: {
    color: 'bg-red-50 text-red-600 border border-red-200',
    icon: RotateCcw,
    label: 'Returned',
  },
};

export default function OrderCard({ order, onOrderAgain }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  // Calculate original price (mock - add 28% markup for discount display)
  const originalPrice = order.total * 1.28;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        {/* Left Section - Order Info */}
        <div className="flex items-start gap-4">
          {/* Package Icon */}
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-purple-600" />
          </div>

          {/* Order Details */}
          <div>
            <h3 className="font-semibold text-gray-900 text-base">
              #{order.id.slice(-15).toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-orange-500 font-bold text-lg">
                ৳ {order.total.toFixed(2)}
              </span>
              <span className="text-gray-400 line-through text-sm">
                ৳ {originalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{config.label}</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        {/* Items & Date */}
        <div className="text-sm text-gray-500">
          {itemCount} item{itemCount !== 1 ? 's' : ''} • {formatDate(order.orderDate)}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              onOrderAgain?.(order);
            }}
            className="px-5 py-2 bg-[#3A21C0] text-white text-sm font-medium rounded-lg hover:bg-[#2d1a99] transition-colors"
          >
            Order Again
          </button>
          <Link
            href={`/retailer/orders/${order.id}`}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#3A21C0] transition-colors"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
