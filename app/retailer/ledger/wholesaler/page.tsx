'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Eye, Plus, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/retailer/Layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getWholesalerLedgers } from '@/lib/ledger-api';
import { WholesalerLedger } from '@/types/ledger';
import { Loader2 } from 'lucide-react';

export default function WholesalerLedgerPage() {
    const { token } = useAuthStore();
    const [wholesalers, setWholesalers] = useState<WholesalerLedger[]>([]);
    const [stats, setStats] = useState({
        totalPurchase: 0,
        totalPaid: 0,
        totalDue: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const perPage = 10;

    const loadWholesalers = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await getWholesalerLedgers(token);
            if (response.success) {
                setWholesalers(response.data.wholesalers);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error loading wholesalers:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadWholesalers();
        }
    }, [token, loadWholesalers]);

    const filteredWholesalers = wholesalers.filter((w) =>
        w.wholesalerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
    };

    const totalPages = Math.ceil(filteredWholesalers.length / perPage);
    const paginatedWholesalers = filteredWholesalers.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    return (
        <Layout>
            <div className="space-y-6">
                {/* Purple Header */}
                <div className="bg-gradient-to-r from-[#3A21C0] to-[#6B4CE6] rounded-2xl p-6 text-white">
                    <h1 className="text-xl font-bold mb-4">
                        Wholesaler Ledger (পাইকারী বিক্রেতার হিসাব)
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm">Total Purchase</p>
                                    <p className="text-2xl font-bold">
                                        ৳ {stats.totalPurchase.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm">Total Paid</p>
                                    <p className="text-2xl font-bold">
                                        ৳ {stats.totalPaid.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm">Total Due</p>
                                    <p className="text-2xl font-bold">
                                        ৳ {stats.totalDue.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Purchase</p>
                            <p className="text-xl font-bold text-gray-900">
                                ৳ {stats.totalPurchase.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Purchase</p>
                            <p className="text-xl font-bold text-gray-900">
                                ৳ {stats.totalPurchase.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wholesalers Table */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">All Wholesalers</h2>
                                <p className="text-sm text-gray-500">Track and manage your orders</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search wholesalers..."
                                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3A21C0] focus:border-transparent w-full md:w-64"
                                    />
                                </div>

                                {/* Sort Dropdown */}
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                                    <span>By Status</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Wholesaler
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Purchase
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Paid
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Due
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Transaction
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-8 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#3A21C0] mx-auto" />
                                        </td>
                                    </tr>
                                ) : paginatedWholesalers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                                            No wholesalers found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedWholesalers.map((wholesaler) => (
                                        <tr key={wholesaler.wholesalerId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {wholesaler.wholesalerName}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {wholesaler.wholesalerDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-sm">
                                                    <p className="text-red-500">{wholesaler.phone}</p>
                                                    <p className="text-gray-500">{wholesaler.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                ৳ {wholesaler.totalPurchase.toLocaleString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-green-600 font-medium">
                                                    ৳ {wholesaler.totalPaid.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-red-600 font-medium">
                                                    ৳ {wholesaler.totalDue.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                {formatDate(wholesaler.lastTransactionDate)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                                                    Payment Due
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <Link
                                                    href={`/retailer/ledger/wholesaler/${wholesaler.wholesalerId}`}
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {paginatedWholesalers.length.toString().padStart(2, '0')} of{' '}
                            {filteredWholesalers.length.toString().padStart(2, '0')} Wholesalers
                        </p>

                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#3A21C0] text-white text-sm font-medium rounded-xl hover:bg-[#2d1a99] transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Wholesaler
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
