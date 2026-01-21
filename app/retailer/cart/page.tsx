'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/retailer/Layout';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { createOrder } from '@/lib/retailer-api';
import {
  ShoppingCart,
  Loader2,
  ArrowRight,
  Bell,
  Calendar,
  X,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { items, getTotal, clearCart, updateQuantity, removeItem } = useCartStore();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>('2025-10-15');
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Calculate delivery dates (next 2 days)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const deliveryDates = [
    { date: tomorrow, label: `${tomorrow.getDate()} ${tomorrow.toLocaleDateString('en-US', { month: 'short' })} ${tomorrow.getFullYear()}` },
    { date: dayAfter, label: `${dayAfter.getDate()} ${dayAfter.toLocaleDateString('en-US', { month: 'short' })} ${dayAfter.getFullYear()}` },
  ];

  // Group items by shipment (group by wholesaler and stock availability)
  const shipments = items.reduce((acc, item) => {
    const key = `${item.product.wholesalerId}-${item.isInStock ? 'in-stock' : 'out-of-stock'}`;
    if (!acc[key]) {
      acc[key] = {
        id: key,
        items: [],
        isInStock: item.isInStock,
        shipmentDate: item.shipmentDate || selectedDeliveryDate,
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { id: string; items: typeof items; isInStock: boolean; shipmentDate?: string }>);

  const shipmentArray = Object.values(shipments);

  // Calculate totals
  const calculateShipmentTotal = (shipmentItems: typeof items) => {
    const amount = shipmentItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const vat = amount * 0.15; // 15% VAT
    const shipping = amount > 780 ? 0 : 70; // Free shipping over 780
    const grandTotal = amount + vat + shipping;
    return { amount, vat, shipping, grandTotal };
  };

  const allTotals = shipmentArray.map(shipment => calculateShipmentTotal(shipment.items));
  const grandTotal = allTotals.reduce((sum, totals) => sum + totals.grandTotal, 0);

  // Check for out of stock items
  const outOfStockItems = items.filter(item => !item.isInStock);
  const hasOutOfStock = outOfStockItems.length > 0;

  const handlePlaceOrder = async () => {
    if (!token) {
      setError('Please login to place an order');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Don't allow ordering if there are out of stock items
    if (hasOutOfStock) {
      setError('Cannot place order with out of stock items. Please remove them first.');
      return;
    }

    setIsPlacingOrder(true);
    setError('');

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const response = await createOrder(token, orderItems);

      if (response.success) {
        setOrderPlaced(true);
        setTimeout(() => {
          clearCart();
          router.push('/retailer/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">Your order has been successfully placed</p>
          </div>
          <div className="text-center">
            <button
              onClick={() => router.push('/retailer/dashboard')}
              className="inline-flex items-center gap-2 bg-[#3A21C0] text-white px-6 py-3 rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium"
            >
              Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart</h1>
            <p className="text-gray-600">Your cart is empty</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/retailer/products"
              className="inline-flex items-center gap-2 bg-[#3A21C0] text-white px-6 py-3 rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium"
            >
              Browse Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart</h1>
        </div>

        {/* Order Now Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <Bell className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            এখনই অর্ডার করুন! পণ্যটি ব্যাগে রাখলে তার মূল্য ও পরিমাণ পরিবর্তিত হতে পারে, দামের পরিবর্তন এড়াতে এখনই অর্ডার করুন
          </p>
        </div>

        {/* Out of Stock Warning */}
        {hasOutOfStock && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 mb-1">
                সতর্কতা! দুঃখিত! আপনার ব্যাগে কিছু প্রোডাক্ট ছিল, কিন্তু এখন সেগুলো আর যুক্ত করা যাচ্ছে না কারণ সেগুলো মাত্রই স্টক আউট হয়ে গেছে!
              </p>
              <div className="mt-2 space-y-2">
                {outOfStockItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between bg-white p-2 rounded">
                    <span className="text-sm text-gray-700">{item.product.name}</span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delivery Date Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Delivery Date:</span>
            <span className="text-sm text-gray-600">
              {new Date(selectedDeliveryDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex gap-2">
            {deliveryDates.map((deliveryDate, index) => {
              const dateStr = deliveryDate.date.toISOString().split('T')[0];
              const isSelected = selectedDeliveryDate === dateStr;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDeliveryDate(dateStr)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#3A21C0] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {deliveryDate.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shipments */}
        {shipmentArray.map((shipment, shipmentIndex) => {
          const totals = calculateShipmentTotal(shipment.items);
          const needsMoreForFreeShipping = totals.amount < 780;
          const amountNeeded = 780 - totals.amount;

          return (
            <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Shipment Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold  text-gray-900 ">Shipment: {String(shipmentIndex + 1).padStart(2, '0')}</h3>
                    {shipment.shipmentDate && (
                      <p className="text-sm text-gray-600">
                        Delivery Date: {new Date(shipment.shipmentDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {shipment.items.map((item, itemIndex) => (
                  <div key={item.product.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-gray-600">
                        {String(itemIndex + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.product.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {item.product.category || 'Paracetamol'}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Tab</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{item.product.manufacturer}</p>
                      <p className="text-xs text-gray-500 mb-2">Distributor: Bismillah Pharma</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">৳ {item.product.price.toFixed(2)}</p>
                          {item.selectedQuantityOption && (
                            <p className="text-xs text-gray-500">
                              ({item.selectedQuantityOption.tablets}×{item.quantity})
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                            className="border text-black border-gray-300 rounded px-3 py-1 text-sm"
                          >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                              <option key={num} value={num}>
                                {num} Box
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium text-gray-900">৳ {totals.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT</span>
                    <span className="font-medium text-gray-900">৳ {totals.vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">৳ {totals.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-900">Grand Total</span>
                    <span className="font-bold text-lg text-gray-900">৳ {totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Savings Banner */}
              {needsMoreForFreeShipping && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    {new Date(selectedDeliveryDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })} তারিখে আর মাত্র ৳ {amountNeeded.toFixed(2)} টাকার কেনাকাটা করুন, ডেলিভারি চার্জ বাঁচান ৳ 70 টাকা
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(totals.amount / 780) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Confirm Order Button */}
        <div className="flex justify-end">
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || hasOutOfStock}
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPlacingOrder ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                Confirm Order (৳ {grandTotal.toFixed(2)})
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
}
