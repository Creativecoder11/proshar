import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductQuantityOption } from '@/types/retailer';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, quantityOption?: ProductQuantityOption) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, quantityOption?: ProductQuantityOption) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  checkStockAvailability: (product: Product, requestedQuantity: number) => {
    isInStock: boolean;
    availableStock?: number;
    restockDate?: string;
    shipmentDate?: string;
  };
}

// Helper function to check stock and calculate shipment dates
function checkStockAndCalculateShipment(
  product: Product,
  requestedQuantity: number
): {
  isInStock: boolean;
  availableStock?: number;
  restockDate?: string;
  shipmentDate?: string;
} {
  // Check if product is in stock
  if (product.stock >= requestedQuantity) {
    return {
      isInStock: true,
      availableStock: product.stock,
    };
  }

  // If out of stock, calculate restock and shipment dates
  // In real app, this would come from wholesaler's restock schedule
  const today = new Date();
  const restockDate = new Date(today);
  restockDate.setDate(today.getDate() + 7); // Assume restock in 7 days

  const shipmentDate = new Date(restockDate);
  shipmentDate.setDate(restockDate.getDate() + 2); // Ship 2 days after restock

  return {
    isInStock: false,
    availableStock: product.stock,
    restockDate: restockDate.toISOString(),
    shipmentDate: shipmentDate.toISOString(),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, quantityOption) => {
        const items = get().items;
        const existingItem = items.find(item => item.product.id === product.id);
        
        // Check stock availability
        const stockCheck = get().checkStockAvailability(product, quantity);
        
        const cartItem: CartItem = {
          product,
          quantity,
          selectedQuantityOption: quantityOption,
          isInStock: stockCheck.isInStock,
          availableStock: stockCheck.availableStock,
          restockDate: stockCheck.restockDate,
          shipmentDate: stockCheck.shipmentDate,
        };
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...cartItem, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, cartItem] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.product.id !== productId) });
      },
      updateQuantity: (productId, quantity, quantityOption?) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const items = get().items;
        const item = items.find(i => i.product.id === productId);
        if (!item) return;
        
        // Recheck stock when quantity changes
        const stockCheck = get().checkStockAvailability(item.product, quantity);
        
        set({
          items: items.map(item =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity,
                  selectedQuantityOption: quantityOption || item.selectedQuantityOption,
                  isInStock: stockCheck.isInStock,
                  availableStock: stockCheck.availableStock,
                  restockDate: stockCheck.restockDate,
                  shipmentDate: stockCheck.shipmentDate,
                }
              : item
          ),
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      checkStockAvailability: (product, requestedQuantity) => {
        return checkStockAndCalculateShipment(product, requestedQuantity);
      },
    }),
    {
      name: 'cocodile-cart-storage',
    }
  )
);
