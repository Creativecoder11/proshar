'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/retailer/Layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getRetailerDashboard } from '@/lib/retailer-api';
import { DashboardData } from '@/types/retailer';
import {
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Package,
  ArrowRight,
  Tag,
  PlusCircle,
  MinusCircle,
  BarChart3,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { mockManufacturers, mockOffers } from '@/lib/retailer-mock-data';

export default function DashboardPage() {
  const { token, retailer } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token]);

  const loadDashboard = async () => {
    if (!token) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await getRetailerDashboard(token);
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
        </div>
      </Layout>
    );
  }

  if (error && !dashboardData) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
        </div>
      </Layout>
    );
  }

  const { wholesaler, dueAmount, totalOrders, totalSpent } = dashboardData;
  const totalRevenue = totalSpent; // Mock: using totalSpent as revenue
  const totalExpense = 0; // Mock: will be calculated from ledger later
  const totalWholesalers = 1; // Mock: currently connected to one wholesaler

  // Get first name from full name
  const firstName = retailer?.fullName?.split(' ')[0] || 'User';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-gray-600">
            Here's what's been happening with your pharmacy today, {firstName}.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">৳{totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% From last month
            </p>
          </div>

          {/* Total Expense */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Expense</p>
            <p className="text-2xl font-bold text-gray-900">৳{totalExpense.toFixed(2)}</p>
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 rotate-180" />
              +12.5% From last month
            </p>
          </div>

          {/* Outstanding Balance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Outstanding Balance</p>
            <p className="text-2xl font-bold text-gray-900">৳{dueAmount.toFixed(2)}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% From last month
            </p>
          </div>

          {/* Total Wholesaler */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Wholesaler</p>
            <p className="text-2xl font-bold text-gray-900">{totalWholesalers}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% From last month
            </p>
          </div>
        </div>

        {/* My Ledger Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            My Ledger (হিসেব খাতা)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
              <Tag className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900 text-center">
                নতুন বিক্রি
              </span>
              <span className="text-xs text-gray-600 text-center">New Sale</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
              <PlusCircle className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900 text-center">আয় লিখুন</span>
              <span className="text-xs text-gray-600 text-center">Add Income</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
              <MinusCircle className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-900 text-center">ব্যয় লিখুন</span>
              <span className="text-xs text-gray-600 text-center">Add Expense</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
              <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900 text-center">হিসাব দেখুন</span>
              <span className="text-xs text-gray-600 text-center">View Report</span>
            </button>
          </div>
        </div>

        {/* Wholesaler Add Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ECF9F9] rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-[#2F7F7A]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Wholesaler</h3>
                <p className="text-sm text-gray-600">Connect with wholesalers to access products</p>
              </div>
            </div>
            <Link
              href="/retailer/wholesaler"
              className="inline-flex items-center gap-2 bg-[#2F7F7A] text-white px-4 py-2 rounded-lg hover:bg-[#1e5d58] transition-colors font-medium"
            >
              <Users className="w-5 h-5" />
              Add Wholesaler
            </Link>
          </div>
          {wholesaler ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                Connected to <span className="font-semibold text-gray-900">{wholesaler.name}</span>
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-800">
                No wholesaler connected yet. Add a wholesaler to start ordering products.
              </p>
            </div>
          )}
        </div>

        {/* Limited-Time Offers */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Limited-Time Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-gradient-to-br from-[#0D9488] to-[#0b7d72] rounded-lg p-6 text-white"
              >
                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    LIMITED-TIME OFFER
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                <p className="text-sm opacity-90 mb-4">{offer.description}</p>
                <button className="flex items-center gap-2 bg-white text-[#0D9488] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Manufacturers Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Manufacturers</h2>
            <Link
              href="/retailer/manufacturers"
              className="text-sm text-[#0D9488] hover:text-[#0b7d72] font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {mockManufacturers.map((manufacturer) => (
              <div
                key={manufacturer.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Logo</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                  {manufacturer.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {manufacturer.productCount} products
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
