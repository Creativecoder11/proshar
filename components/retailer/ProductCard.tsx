'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product, ProductQuantityOption } from '@/types/retailer';
import { useCartStore } from '@/lib/stores/cart-store';
import { ShoppingCart, X, Tag } from 'lucide-react';
import Toast from './Toast';

interface ProductCardProps {
  product: Product;
}

// Default quantity options if not provided
const defaultQuantityOptions: ProductQuantityOption[] = [
  { boxes: 1, tablets: 30, label: '01 Box - 30 Tablets' },
  { boxes: 2, tablets: 60, label: '02 Box - 60 Tablets' },
  { boxes: 3, tablets: 90, label: '03 Box - 90 Tablets' },
  { boxes: 4, tablets: 120, label: '04 Box - 120 Tablets' },
];

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<ProductQuantityOption | null>(null);
  const [showToast, setShowToast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const quantityOptions = product.quantityOptions || defaultQuantityOptions;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowQuantitySelector(false);
      }
    };

    if (showQuantitySelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuantitySelector]);

  const handleQuantitySelect = (option: ProductQuantityOption) => {
    setSelectedQuantity(option);
    setShowQuantitySelector(false);
    
    // Add to cart with selected quantity
    addItem(product, option.boxes, option);
    
    // Show toast notification
    setShowToast(true);
  };

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    
    // If no quantity selected, use first option or default
    if (!selectedQuantity) {
      const defaultOption = quantityOptions[0];
      addItem(product, defaultOption.boxes, defaultOption);
      setShowToast(true);
    } else {
      setShowQuantitySelector(true);
    }
  };

  // Calculate price with discount (20% off)
  const discountPercent = 20;
  const originalPrice = product.price * 1.65; // Assuming 20% off means original is 65% more
  const discountedPrice = product.price;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 relative">
        {/* Discount Badge */}
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
          {discountPercent}% OFF
        </div>

        {/* Product Image - Clickable */}
        <Link href={`/retailer/products/${product.id}`}>
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden mt-8 cursor-pointer hover:opacity-90 transition-opacity">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 text-sm">No Image</div>
            )}
          </div>
        </Link>

        <div className="space-y-2">
          {/* Product Name and Type - Clickable */}
          <Link href={`/retailer/products/${product.id}`}>
            <div className="flex items-start justify-between gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <h3 className="font-bold text-gray-900 text-lg flex-1">{product.name}</h3>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                Tab
              </span>
            </div>
          </Link>

          {/* Manufacturer */}
          {product.manufacturer && (
            <p className="text-sm text-gray-600">{product.manufacturer}</p>
          )}

          {/* Pricing */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">৳ {discountedPrice.toFixed(2)}</span>
            <span className="text-sm text-gray-400 line-through">৳ {originalPrice.toFixed(2)}</span>
          </div>

          {/* Distributor */}
          <p className="text-xs text-gray-500">Distributor: Bismillah Pharma</p>

          {/* Quantity Selector or Add to Cart */}
          <div className="relative" ref={dropdownRef}>
            {showQuantitySelector ? (
              <div className="border-2 border-[#2F7F7A] rounded-lg p-3 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Select Quantity</span>
                  <button
                    onClick={() => setShowQuantitySelector(false)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {quantityOptions.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`quantity-${product.id}`}
                        value={index}
                        onChange={() => handleQuantitySelect(option)}
                        className="w-4 h-4 text-[#2F7F7A] focus:ring-[#2F7F7A]"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-[#2F7F7A] text-white py-2 px-4 rounded-lg hover:bg-[#1e5d58] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message="Add to cart successful"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
