'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/retailer/Layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getRetailerOrder } from '@/lib/retailer-api';
import { Order } from '@/types/retailer';
import {
  Loader2,
  ArrowLeft,
  Package,
  Clock,
  Check,
  Truck,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const orderId = params.id as string;

  useEffect(() => {
    if (token && orderId) {
      loadOrder();
    }
  }, [token, orderId]);

  const loadOrder = async () => {
    if (!token || !orderId) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await getRetailerOrder(token, orderId);
      if (response.success) {
        setOrder(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A21C0]" />
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="space-y-4">
          <Link
            href="/retailer/orders"
            className="inline-flex items-center gap-2 text-[#3A21C0] hover:text-[#2d1a99] font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">{error || 'Order not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const originalPrice = order.total * 1.28;

  // Calculate price breakdown
  const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
  const vat = subtotal * 0.05; // 5% VAT
  const shipping = 50; // Fixed shipping
  const grandTotal = subtotal + vat + shipping;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/retailer/orders"
          className="inline-flex items-center gap-2 text-[#3A21C0] hover:text-[#2d1a99] font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>

        {/* Order Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            {/* Left Section */}
            <div className="flex items-start gap-4">
              {/* Package Icon */}
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-purple-600" />
              </div>

              {/* Order Info */}
              <div>
                <h1 className="font-bold text-xl text-[#3A21C0]">
                  #{order.id.slice(-15).toUpperCase()}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-900 font-bold text-lg">
                    ৳ {order.total.toFixed(2)}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ৳ {originalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{config.label}</span>
            </div>
          </div>

          {/* Delivery Date */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              Delivery Date: {order.deliveryDate ? formatDate(order.deliveryDate) : formatDate(order.orderDate)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Title Here</h2>

          <div className="space-y-6">
            {order.items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
              >
                {/* Item Number */}
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-500">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {item.product.name}
                  </h3>

                  {/* Generic Name & Type */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-[#3A21C0]">
                      {item.product.tags?.[0] || 'Paracetamol'}
                    </span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-md">
                      {item.product.tags?.[1] || 'Tab'}
                    </span>
                  </div>

                  {/* Manufacturer */}
                  <p className="text-sm text-gray-500 mt-1">
                    {item.product.manufacturer || 'Beximco Pharmaceuticals PLC'}
                  </p>

                  {/* Distributor */}
                  <p className="text-sm mt-0.5">
                    <span className="text-gray-500">Distributor: </span>
                    <span className="text-[#3A21C0]">
                      {item.product.distributor || 'Bismillah Pharma'}
                    </span>
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-gray-900">
                      ৳ {item.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({item.price.toFixed(2)}x{item.quantity})
                    </span>
                  </div>
                </div>

                {/* Quantity Badge */}
                <div className="flex-shrink-0">
                  <div className="px-4 py-2 bg-[#3A21C0] text-white text-sm font-medium rounded-lg">
                    {item.quantity} Box
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Price Breakdown</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="font-medium text-gray-900">
                ৳ {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">VAT</span>
              <span className="font-medium text-gray-900">৳ {vat.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">
                ৳ {shipping.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Grand Total</span>
              <span className="font-bold text-lg text-gray-900">
                ৳ {grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Notes</h2>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
