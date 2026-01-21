'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/retailer/Layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import { 
  getRetailerDashboard, 
  getRetailerWholesalers, 
  addWholesaler, 
  validateWholesalerCode 
} from '@/lib/retailer-api';
import { DashboardData, RetailerWholesaler } from '@/types/retailer';
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
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { mockManufacturers, mockOffers } from '@/lib/retailer-mock-data';

export default function DashboardPage() {
  const { token, retailer } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [wholesalers, setWholesalers] = useState<RetailerWholesaler[]>([]);
  const [isLoadingWholesalers, setIsLoadingWholesalers] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [wholesalerCode, setWholesalerCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [validatedWholesaler, setValidatedWholesaler] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (token) {
      loadDashboard();
      loadWholesalers();
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

  const loadWholesalers = async () => {
    if (!token) return;

    setIsLoadingWholesalers(true);
    try {
      const response = await getRetailerWholesalers(token);
      if (response.success) {
        setWholesalers(response.data.wholesalers);
      }
    } catch (err) {
      console.error('Failed to load wholesalers:', err);
    } finally {
      setIsLoadingWholesalers(false);
    }
  };

  const handleValidateCode = async () => {
    if (!wholesalerCode.trim()) {
      setAddError('Please enter a wholesaler code');
      return;
    }

    setIsValidating(true);
    setAddError('');
    setValidatedWholesaler(null);

    try {
      const response = await validateWholesalerCode(wholesalerCode.trim());
      if (response.success && response.data.valid && response.data.wholesaler) {
        setValidatedWholesaler(response.data.wholesaler);
        setAddError('');
      } else {
        setAddError('Invalid wholesaler code. Please check and try again.');
        setValidatedWholesaler(null);
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to validate code');
      setValidatedWholesaler(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleAddWholesaler = async () => {
    if (!wholesalerCode.trim()) {
      setAddError('Please enter a wholesaler code');
      return;
    }

    if (!token) {
      setAddError('Please login to add wholesalers');
      return;
    }

    setIsAdding(true);
    setAddError('');
    setAddSuccess(false);

    try {
      const response = await addWholesaler(token, wholesalerCode.trim());
      if (response.success) {
        setWholesalerCode('');
        setValidatedWholesaler(null);
        setAddSuccess(true);
        setShowAddForm(false);
        // Reload wholesalers and dashboard
        await loadWholesalers();
        await loadDashboard();
        // Reset success message after 3 seconds
        setTimeout(() => setAddSuccess(false), 3000);
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add wholesaler');
    } finally {
      setIsAdding(false);
    }
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
          <Loader2 className="w-8 h-8 animate-spin text-[#3A21C0]" />
        </div>
      </Layout>
    );
  }

  const { wholesaler, dueAmount, totalOrders, totalSpent } = dashboardData;
  const totalRevenue = totalSpent; // Mock: using totalSpent as revenue
  const totalExpense = 0; // Mock: will be calculated from ledger later
  // Only count wholesalers that actually exist
  const totalWholesalers = wholesalers.length;

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
                <Users className="w-5 h-5 text-[#3A21C0]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Wholesaler</h3>
                <p className="text-sm text-gray-600">Connect with wholesalers to access products</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!showAddForm && (
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setWholesalerCode('');
                    setAddError('');
                    setValidatedWholesaler(null);
                  }}
                  className="inline-flex items-center gap-2 bg-[#3A21C0] text-white px-4 py-2 rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Wholesaler
                </button>
              )}
              <Link
                href="/retailer/wholesaler"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Manage All
              </Link>
            </div>
          </div>

          {/* Success Message */}
          {addSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800 font-medium">
                  Wholesaler added successfully!
                </p>
              </div>
            </div>
          )}

          {/* Add Wholesaler Form */}
          {showAddForm && (
            <div className="mb-4 bg-[#ECF9F9] rounded-lg p-4 border border-[#3A21C0]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Add New Wholesaler</h4>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setWholesalerCode('');
                    setAddError('');
                    setValidatedWholesaler(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wholesaler Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={wholesalerCode}
                      onChange={(e) => {
                        setWholesalerCode(e.target.value);
                        setAddError('');
                        setValidatedWholesaler(null);
                      }}
                      placeholder="Enter wholesaler code"
                      className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isValidating && !isAdding) {
                          handleValidateCode();
                        }
                      }}
                    />
                    <button
                      onClick={handleValidateCode}
                      disabled={isValidating || !wholesalerCode.trim()}
                      className="px-4 py-2 bg-[#3A21C0] text-white rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isValidating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Validate'
                      )}
                    </button>
                  </div>
                </div>

                {validatedWholesaler && (
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-medium text-gray-900">
                        Valid Code: {validatedWholesaler.name}
                      </p>
                    </div>
                    <button
                      onClick={handleAddWholesaler}
                      disabled={isAdding}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Wholesaler
                        </>
                      )}
                    </button>
                  </div>
                )}

                {addError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">{addError}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connected Wholesalers List */}
          {isLoadingWholesalers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#3A21C0]" />
            </div>
          ) : wholesalers.length > 0 ? (
            <div className="space-y-3">
              {wholesalers.map((rw) => (
                <div
                  key={rw.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#3A21C0] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ECF9F9] rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#3A21C0]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {rw.wholesaler.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {rw.totalOrders} orders • ৳{rw.totalSpent.toFixed(2)} spent
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {rw.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <Link
                        href={`/retailer/products?wholesaler=${rw.wholesalerId}`}
                        className="text-[#3A21C0] hover:text-[#7B6AD5] text-sm font-medium"
                      >
                        View Products
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : wholesaler ? (
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
                className="bg-gradient-to-br from-[#3A21C0] to-[#7B6AD5] rounded-lg p-6 text-white"
              >
                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    LIMITED-TIME OFFER
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                <p className="text-sm opacity-90 mb-4">{offer.description}</p>
                <button className="flex items-center gap-2 bg-white text-[#3A21C0] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm">
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
              className="text-sm text-[#3A21C0] hover:text-[#7B6AD5] font-medium"
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
