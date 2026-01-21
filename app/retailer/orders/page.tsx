'use client';

import { useEffect, useState, useMemo } from 'react';
import Layout from '@/components/retailer/Layout';
import OrderCard from '@/components/retailer/OrderCard';
import OrderStatsCard from '@/components/retailer/OrderStatsCard';
import OrderFilterTabs from '@/components/retailer/OrderFilterTabs';
import DeliverySubFilters from '@/components/retailer/DeliverySubFilters';
import OrderSummaryStats from '@/components/retailer/OrderSummaryStats';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getRetailerOrdersList } from '@/lib/retailer-api';
import { Order } from '@/types/retailer';
import { Loader2, Package, Check, Truck, Clock, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Filter tabs configuration
const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'pending', label: 'Pending' },
  { id: 'returned', label: 'Return' },
];

export default function OrdersPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [deliveryType, setDeliveryType] = useState<'all' | 'full' | 'partial'>('full');
  const [selectedMonth, setSelectedMonth] = useState('JAN');

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  const loadOrders = async () => {
    if (!token) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await getRetailerOrdersList(token, {});
      if (response.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate order statistics
  const orderStats = useMemo(() => {
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'confirmed').length;
    const returned = orders.filter(o => o.status === 'cancelled').length;

    return { delivered, shipped, pending, returned };
  }, [orders]);

  // Calculate summary stats for delivered orders
  const summaryStats = useMemo(() => {
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalOrders = deliveredOrders.length;
    const orderAmount = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
    const totalSaved = Math.round(orderAmount * 0.12); // Mock 12% savings
    const earnPoints = Math.round(orderAmount / 100); // Mock points calculation

    return { totalOrders, totalSaved, earnPoints, orderAmount };
  }, [orders]);

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'returned') return orders.filter(o => o.status === 'cancelled');
    if (activeTab === 'pending') return orders.filter(o =>
      o.status === 'pending' || o.status === 'processing' || o.status === 'confirmed'
    );
    return orders.filter(o => o.status === activeTab);
  }, [orders, activeTab]);

  const handleOrderAgain = (order: Order) => {
    // Navigate to cart with order items (would need cart context implementation)
    console.log('Order again:', order);
    router.push('/retailer/cart');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <OrderStatsCard
            icon={Check}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
            label="Delivered Orders"
            value={orderStats.delivered.toString().padStart(2, '0')}
          />
          <OrderStatsCard
            icon={Truck}
            iconBgColor="bg-orange-50"
            iconColor="text-orange-600"
            label="Shipped Orders"
            value={orderStats.shipped.toString().padStart(2, '0')}
          />
          <OrderStatsCard
            icon={Clock}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
            label="Pending Orders"
            value={orderStats.pending.toString().padStart(2, '0')}
          />
          <OrderStatsCard
            icon={RotateCcw}
            iconBgColor="bg-red-50"
            iconColor="text-red-600"
            label="Returned Orders"
            value={orderStats.returned.toString().padStart(2, '0')}
          />
        </div>

        {/* Filter Tabs */}
        <div className="space-y-3">
          <OrderFilterTabs
            tabs={filterTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Sub-filters for Delivered tab */}
          {activeTab === 'delivered' && (
            <>
              <DeliverySubFilters
                deliveryType={deliveryType}
                selectedMonth={selectedMonth}
                onDeliveryTypeChange={setDeliveryType}
                onMonthChange={setSelectedMonth}
              />
              <OrderSummaryStats
                totalOrders={summaryStats.totalOrders}
                totalSaved={summaryStats.totalSaved}
                earnPoints={summaryStats.earnPoints}
                orderAmount={summaryStats.orderAmount}
              />
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#3A21C0]" />
          </div>
        ) : (
          <>
            {/* Orders List */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onOrderAgain={handleOrderAgain}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {activeTab !== 'all'
                    ? `You don't have any ${activeTab} orders yet`
                    : "You haven't placed any orders yet"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
