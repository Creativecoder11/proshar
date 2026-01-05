'use client';

import { CartItem as CartItemType } from '@/types/retailer';
import { useCartStore } from '@/lib/stores/cart-store';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleIncrease = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeItem(item.product.id);
    }
  };

  const handleRemove = () => {
    removeItem(item.product.id);
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          {item.product.image ? (
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-gray-400 text-xs">No Image</div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
          {item.product.manufacturer && (
            <p className="text-sm text-gray-500 mb-2">{item.product.manufacturer}</p>
          )}
          <p className="text-lg font-bold text-primary-600">৳{item.product.price.toFixed(2)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-end justify-between">
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mt-auto">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.product.stock}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-semibold text-gray-900 mt-2">
            ৳{subtotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

