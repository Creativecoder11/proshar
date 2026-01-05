'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/retailer/Layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getRetailerInvoicesList } from '@/lib/retailer-api';
import { Invoice } from '@/types/retailer';
import { Loader2, Receipt, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';

const statusColors = {
  paid: 'bg-green-100 text-green-800',
  partial: 'bg-yellow-100 text-yellow-800',
  unpaid: 'bg-red-100 text-red-800',
};

const statusLabels = {
  paid: 'Paid',
  partial: 'Partially Paid',
  unpaid: 'Unpaid',
};

export default function InvoicesPage() {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dueAmount, setDueAmount] = useState(0);

  useEffect(() => {
    if (token) {
      loadInvoices();
    }
  }, [token, statusFilter]);

  const loadInvoices = async () => {
    if (!token) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await getRetailerInvoicesList(token, {
        status: statusFilter || undefined,
      });
      if (response.success) {
        setInvoices(response.data.invoices);
        setDueAmount(response.data.dueAmount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoices</h1>
          <p className="text-gray-600">View and manage your invoices</p>
        </div>

        {/* Due Amount Summary */}
        {dueAmount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Due Amount</p>
                <p className="text-2xl font-bold text-red-600">৳{dueAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-red-400" />
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            {/* Invoices List */}
            {invoices.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/retailer/orders/${invoice.orderId}`}
                    className="block"
                  >
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Invoice #{invoice.id.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Order #{invoice.orderId.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[invoice.status]
                          }`}
                        >
                          {statusLabels[invoice.status]}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Total Amount</p>
                          <p className="font-semibold text-gray-900">৳{invoice.amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Due Amount</p>
                          <p className="font-semibold text-red-600">৳{invoice.dueAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Issue Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Due Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {invoice.paidDate && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Paid on:{' '}
                            <span className="font-medium">
                              {new Date(invoice.paidDate).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No invoices found</p>
                {statusFilter && (
                  <p className="text-sm text-gray-500 mt-2">Try changing the status filter</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

