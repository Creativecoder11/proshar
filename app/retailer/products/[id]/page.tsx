'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/retailer/Layout';
import { useAuthStore } from '@/lib/stores/auth-store';
import { getRetailerProduct, getRetailerProducts } from '@/lib/retailer-api';
import { Product, ProductQuantityOption } from '@/types/retailer';
import { useCartStore } from '@/lib/stores/cart-store';
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  Package,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Toast from '@/components/retailer/Toast';

// Default quantity options if not provided
const defaultQuantityOptions: ProductQuantityOption[] = [
  { boxes: 1, tablets: 30, label: '01 Box - 30 Tablets' },
  { boxes: 2, tablets: 60, label: '02 Box - 60 Tablets' },
  { boxes: 3, tablets: 90, label: '03 Box - 90 Tablets' },
  { boxes: 4, tablets: 120, label: '04 Box - 120 Tablets' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [alternativeProducts, setAlternativeProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<ProductQuantityOption | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    description: boolean;
    dosage: boolean;
    sideEffects: boolean;
    storage: boolean;
  }>({
    description: true,
    dosage: false,
    sideEffects: false,
    storage: false,
  });

  useEffect(() => {
    if (token && productId) {
      loadProduct();
    }
  }, [token, productId]);

  const loadProduct = async () => {
    if (!token || !productId) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await getRetailerProduct(token, productId);
      if (response.success) {
        setProduct(response.data);
        // Load alternative products (same category)
        loadAlternativeProducts(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlternativeProducts = async (currentProduct: Product) => {
    if (!token) return;

    try {
      const response = await getRetailerProducts(token, {
        category: currentProduct.category,
      });
      if (response.success) {
        // Filter out current product and limit to 4
        const alternatives = response.data.products
          .filter((p) => p.id !== currentProduct.id)
          .slice(0, 4);
        setAlternativeProducts(alternatives);
      }
    } catch (err) {
      console.error('Failed to load alternative products:', err);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;

    if (selectedQuantity) {
      addItem(product, selectedQuantity.boxes, selectedQuantity);
      setShowQuantityModal(false);
      setShowToast(true);
      setSelectedQuantity(null);
    } else {
      setShowQuantityModal(true);
    }
  };

  const handleQuantitySelect = (option: ProductQuantityOption) => {
    setSelectedQuantity(option);
    addItem(product!, option.boxes, option);
    setShowQuantityModal(false);
    setShowToast(true);
  };

  // Calculate price with discount (20% off)
  const discountPercent = 20;
  const originalPrice = product?.originalPrice || product?.price ? product.price * 1.25 : 0;
  const discountedPrice = product?.price || 0;

  // Calculate delivery date (example: Saturday, 10 Oct 2025)
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // 3 days from now
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const quantityOptions = product?.quantityOptions || defaultQuantityOptions;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#3A21C0]" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="space-y-4">
          <Link
            href="/retailer/products"
            className="inline-flex items-center gap-2 text-[#3A21C0] hover:text-[#7B6AD5]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || 'Product not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/retailer/products"
          className="inline-flex items-center gap-2 text-[#3A21C0] hover:text-[#7B6AD5] font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        {/* Featured Product Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-32 h-32 text-gray-400" />
                )}
              </div>
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded">
                {discountPercent}% OFF
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {!product.tags && (
                    <>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                        {product.category || 'Tab'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Manufacturer */}
              {product.manufacturer && (
                <div>
                  <p className="text-sm text-gray-600">Manufacturer</p>
                  <p className="text-base font-medium text-gray-900">{product.manufacturer}</p>
                </div>
              )}

              {/* Distributor */}
              <div>
                <p className="text-sm text-gray-600">Distributor</p>
                <p className="text-base font-medium text-gray-900">
                  {product.distributor || 'Cameron Williamson'}
                </p>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">BDT {discountedPrice.toFixed(2)}</span>
                <span className="text-lg text-gray-400 line-through">BDT {originalPrice.toFixed(2)}</span>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-600 font-medium">
                      In Stock ({product.stock} available)
                    </p>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-600 font-medium">Out of Stock</p>
                  </>
                )}
              </div>

              {/* Delivery Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Delivery by {getDeliveryDate()}</span>
                </div>
                <p className="text-sm text-gray-600">Express delivery available</p>
              </div>

              {/* Add to Cart Button */}
              <div className="relative">
                {showQuantityModal ? (
                  <div className="border-2 border-[#3A21C0] rounded-lg p-4 bg-white shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Select Quantity</h3>
                      <button
                        onClick={() => {
                          setShowQuantityModal(false);
                          setSelectedQuantity(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {quantityOptions.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                            selectedQuantity?.boxes === option.boxes
                              ? 'border-[#3A21C0] bg-[#ECF9F9]'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="quantity"
                            checked={selectedQuantity?.boxes === option.boxes}
                            onChange={() => handleQuantitySelect(option)}
                            className="w-4 h-4 text-[#3A21C0] focus:ring-[#3A21C0]"
                          />
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">
                              {String(option.boxes).padStart(2, '0')} Box
                            </span>
                            <span className="text-sm text-gray-600 ml-2">
                              {option.tablets} Tablets
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-[#3A21C0] text-white py-3 px-6 rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add To Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Brands Section */}
        {alternativeProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Alternative Brands</h2>
              <Link
                href="/retailer/products"
                className="text-sm text-[#3A21C0] hover:text-[#7B6AD5] font-medium"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {alternativeProducts.map((altProduct) => {
                const altOriginalPrice = altProduct.originalPrice || altProduct.price * 1.25;
                return (
                  <Link
                    key={altProduct.id}
                    href={`/retailer/products/${altProduct.id}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative"
                  >
                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                      {discountPercent}% OFF
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {altProduct.image ? (
                        <img
                          src={altProduct.image}
                          alt={altProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                      {altProduct.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{altProduct.manufacturer}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-900">
                        BDT {altProduct.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        BDT {altOriginalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Distributor: {altProduct.distributor || 'Bismillah Pharma'}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart with default quantity
                        const defaultOption = altProduct.quantityOptions?.[0] || defaultQuantityOptions[0];
                        addItem(altProduct, defaultOption.boxes, defaultOption);
                        setShowToast(true);
                      }}
                      className="w-full bg-[#3A21C0] text-white py-2 px-4 rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium text-sm flex items-center justify-center gap-2 mt-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Product Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h2>
          <div className="space-y-4">
            {/* Description */}
            <div>
              <button
                onClick={() => toggleSection('description')}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="font-medium text-gray-900">Description</span>
                {expandedSections.description ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSections.description && (
                <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                  {product.description ||
                    'This is a high-quality pharmaceutical product manufactured under strict quality control standards. It is used for the treatment and management of various conditions as prescribed by healthcare professionals.'}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Dosage & Administration */}
            <div>
              <button
                onClick={() => toggleSection('dosage')}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="font-medium text-gray-900">Dosage & Administration</span>
                {expandedSections.dosage ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSections.dosage && (
                <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                  {product.dosage ||
                    'Please consult with your healthcare provider for proper dosage instructions. Follow the prescribed dosage as directed by your physician.'}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Side Effects & Warnings */}
            <div>
              <button
                onClick={() => toggleSection('sideEffects')}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="font-medium text-gray-900">Side Effects & Warnings</span>
                {expandedSections.sideEffects ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSections.sideEffects && (
                <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                  {product.sideEffects ||
                    'Some individuals may experience side effects. If you experience any unusual symptoms, discontinue use and consult your healthcare provider immediately.'}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Storage Instructions */}
            <div>
              <button
                onClick={() => toggleSection('storage')}
                className="w-full flex items-center justify-between py-3 text-left"
              >
                <span className="font-medium text-gray-900">Storage Instructions</span>
                {expandedSections.storage ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSections.storage && (
                <div className="pb-4 text-gray-600 text-sm leading-relaxed">
                  {product.storageInstructions ||
                    'Store in a cool, dry place away from direct sunlight. Keep out of reach of children. Store at room temperature (15-30°C).'}
                </div>
              )}
            </div>
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
    </Layout>
  );
}
