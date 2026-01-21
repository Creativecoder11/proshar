'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/retailer/Layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import {
  addWholesaler,
  getRetailerWholesalers,
  removeWholesaler,
  validateWholesalerCode,
} from '@/lib/retailer-api';
import { RetailerWholesaler } from '@/types/retailer';
import {
  Plus,
  Users,
  ArrowRight,
  User,
  CheckCircle2,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Search,
  Filter,
  ChevronDown,
  ShoppingCart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import WholesalerSuccessModal from '@/components/retailer/WholesalerSuccessModal';

type ViewMode = 'add' | 'manage';

export default function WholesalerPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>('add');
  const [wholesalerCode, setWholesalerCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [wholesalers, setWholesalers] = useState<RetailerWholesaler[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (token) {
      loadWholesalers();
    }
  }, [token]);

  const loadWholesalers = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await getRetailerWholesalers(token);
      if (response.success) {
        setWholesalers(response.data.wholesalers);
        // If wholesalers exist, show manage view
        if (response.data.wholesalers.length > 0) {
          setViewMode('manage');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wholesalers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateCode = async () => {
    if (!wholesalerCode.trim()) {
      setError('Please enter a wholesaler code');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response = await validateWholesalerCode(wholesalerCode.trim());
      if (!response.success || !response.data.valid) {
        setError('Invalid wholesaler code. Please check and try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate code');
    } finally {
      setIsValidating(false);
    }
  };

  const handleAddWholesaler = async () => {
    if (!wholesalerCode.trim()) {
      setError('Please enter a wholesaler code');
      return;
    }

    if (!token) {
      setError('Please login to add wholesalers');
      return;
    }

    setIsAdding(true);
    setError('');

    try {
      const response = await addWholesaler(token, wholesalerCode.trim());
      if (response.success) {
        setWholesalerCode('');
        setShowSuccessModal(true);
        // Reload wholesalers
        await loadWholesalers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add wholesaler');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveWholesaler = async (wholesalerId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to remove this wholesaler?')) return;

    try {
      const response = await removeWholesaler(token, wholesalerId);
      if (response.success) {
        await loadWholesalers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove wholesaler');
    }
  };

  const handleViewProducts = (wholesalerId: string) => {
    router.push(`/retailer/products?wholesaler=${wholesalerId}`);
  };

  // Calculate summary stats
  const totalWholesalers = wholesalers.length;
  const activeConnections = wholesalers.filter(w => w.status === 'active').length;
  const totalOrders = wholesalers.reduce((sum, w) => sum + w.totalOrders, 0);
  const totalSpent = wholesalers.reduce((sum, w) => sum + w.totalSpent, 0);

  // Filter wholesalers
  const filteredWholesalers = wholesalers.filter((w) => {
    const matchesSearch =
      w.wholesaler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.wholesaler.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.wholesaler.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A21C0]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Wholesalers</h1>
            <p className="text-gray-600 mt-1">View and manage all your wholesaler connections.</p>
          </div>
          {viewMode === 'manage' && (
            <button
              onClick={() => setViewMode('add')}
              className="flex items-center gap-2 bg-[#3A21C0] text-white px-4 py-2 rounded-lg hover:bg-[#7B6AD5] transition-colors"
            >
              <Users className="w-5 h-5" />
              Add Wholesaler
            </button>
          )}
        </div>

        {/* Summary Cards */}
        {viewMode === 'manage' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Wholesalers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalWholesalers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Connections</p>
                  <p className="text-2xl font-bold text-gray-900">{activeConnections}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">৳ {totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">৳</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add New Wholesaler Section */}
        {viewMode === 'add' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#ECF9F9] rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#3A21C0]" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Add New Wholesaler</h2>
            </div>
            <p className="text-gray-600 mb-6">Enter the unique code provided by your wholesaler.</p>

            <div className="flex gap-3">  
              <div className="flex-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={wholesalerCode}
                  onChange={(e) => {
                    setWholesalerCode(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddWholesaler();
                    }
                  }}
                  placeholder="Enter Wholesaler Code"
                  className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent text-black"
                />
              </div>
              <button
                onClick={handleAddWholesaler}
                disabled={isAdding || !wholesalerCode.trim()}
                className="flex items-center gap-2 bg-[#3A21C0] text-white px-6 py-3 rounded-lg hover:bg-[#7B6AD5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Add Wholesaler
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* How to get a wholesaler code? */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-[#3A21C0] mb-3">
                How to get a wholesaler code?
              </h3>
              <ul className="space-y-2">
                {[
                  'Contact your wholesaler directly',
                  'Request their unique MediGo wholesaler code',
                  'Enter the code above to establish connection',
                  'Once verified, you can start ordering products',
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <ArrowRight className="w-4 h-4 text-[#3A21C0] mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Manage Wholesalers Section */}
        {viewMode === 'manage' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Wholesalers List</h2>
              <p className="text-sm text-gray-600">Track and manage your orders.</p>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wholesalers..."
                  className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent text-black"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setFilterStatus(filterStatus === 'all' ? 'active' : 'all')}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">By Status</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Wholesalers Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Wholesaler
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Orders
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total Spent
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Last Order
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWholesalers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        {searchQuery || filterStatus !== 'all'
                          ? 'No wholesalers found matching your criteria'
                          : 'No wholesalers added yet. Add your first wholesaler to get started.'}
                      </td>
                    </tr>
                  ) : (
                    filteredWholesalers.map((rw) => (
                      <tr key={rw.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{rw.wholesaler.name}</p>
                              {rw.wholesaler.description && (
                                <p className="text-sm text-gray-500">{rw.wholesaler.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {rw.wholesaler.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{rw.wholesaler.phone}</span>
                              </div>
                            )}
                            {rw.wholesaler.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{rw.wholesaler.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{rw.totalOrders}</p>
                            <p className="text-xs text-gray-500">orders</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">
                            ৳ {rw.totalSpent.toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          {rw.lastOrderDate ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(rw.lastOrderDate).toLocaleDateString('en-US', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No orders yet</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewProducts(rw.wholesalerId)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Products"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewProducts(rw.wholesalerId)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Add to Cart"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveWholesaler(rw.wholesalerId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <WholesalerSuccessModal
          onClose={() => setShowSuccessModal(false)}
          onManageWholesalers={() => {
            setShowSuccessModal(false);
            setViewMode('manage');
          }}
          onBackToHome={() => {
            setShowSuccessModal(false);
            router.push('/retailer/dashboard');
          }}
        />
      )}
    </Layout>
  );
}

