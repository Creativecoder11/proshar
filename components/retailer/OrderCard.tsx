'use client';

import { Order } from '@/types/retailer';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderCard({ order }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href={`/retailer/orders/${order.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</p>
              <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[order.status]
            }`}
          >
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          <span className="font-semibold text-gray-900">৳{order.total.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-end gap-2 text-primary-600 text-sm font-medium mt-3">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

