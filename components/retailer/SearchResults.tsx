'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Product } from '@/types/retailer';
import { mockProducts } from '@/lib/retailer-mock-data';

interface SearchResultsProps {
  searchQuery: string;
  onSelect: (query: string) => void;
  onClose: () => void;
}

export default function SearchResults({ searchQuery, onSelect, onClose }: SearchResultsProps) {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  const loadRecentSearches = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recent-searches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {
          // Ignore parse errors
        }
      } else {
        setRecentSearches([]);
      }
    }
  };

  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Refresh recent searches when searchQuery changes (user types or selects)
  useEffect(() => {
    loadRecentSearches();
  }, [searchQuery]);

  // Get trending medicines (filter products that contain "Napa" or are popular)
  const trendingMedicines = mockProducts
    .filter((p) => p.name.toLowerCase().includes('napa') || p.name.toLowerCase().includes('ace'))
    .slice(0, 10);

  const handleRecentSearchClick = (query: string) => {
    onSelect(query);
    // Small delay to ensure localStorage is updated before navigation
    setTimeout(() => {
      router.push(`/retailer/products?search=${encodeURIComponent(query)}`);
    }, 100);
  };

  const handleTrendingClick = (product: Product) => {
    router.push(`/retailer/products?search=${encodeURIComponent(product.name)}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recent-searches');
    }
  };

  return (
    <div className="absolute top-full left-0 mt-4 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto">
      {/* Recent Searches Section */}
      {recentSearches.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Recent Searches</h3>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-[#3A21C0] hover:text-[#7B6AD5] font-medium"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((query, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearchClick(query)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Medicines Section */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Trending Medicines</h3>
        <div className="space-y-1">
          {trendingMedicines.map((product) => (
            <button
              key={product.id}
              onClick={() => handleTrendingClick(product)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-sm text-gray-900 font-medium">{product.name}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

