"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ShoppingCart,
  Bell,
  ChevronDown,
  MoreVertical,
  X,
  Package,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import SearchResults from "./SearchResults";
import prosharlogo from '@/assets/prosharlogo.svg';

export default function NavbarHeader() {
  const router = useRouter();
  const { items, getTotal, removeItem, updateQuantity } = useCartStore();
  const { retailer } = useAuthStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Medicine");
  const [showCategory, setShowCategory] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [subCategoriesSelected, setSubCategoriesSelected] = useState<string[]>(
    []
  );
  const [showCart, setShowCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const cartRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = items.reduce((a, b) => a + b.quantity, 0);
  const cartTotal = getTotal();
  const notificationCount = 5; // TODO: replace with real API data

  // Mock notifications data
  const notifications = [
    {
      id: '1',
      title: 'New Order Confirmed',
      message: 'Your order #ORD-001 has been confirmed',
      time: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      title: 'Product Restocked',
      message: 'Napa Extend 500mg is now back in stock',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      title: 'Special Offer',
      message: 'Get 20% off on all pain relief products',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '4',
      title: 'Delivery Update',
      message: 'Your order will be delivered tomorrow',
      time: '5 hours ago',
      read: true,
    },
    {
      id: '5',
      title: 'Payment Reminder',
      message: 'Please complete payment for invoice #INV-002',
      time: '1 day ago',
      read: false,
    },
  ];

  const categories = [
    "Medicine",
    "Vitamins",
    "Pain Relief",
    "Gastrointestinal",
    "Respiratory",
  ];

  const subCategories: Record<string, string[]> = {
    Medicine: ["Antibiotic", "Antipyretic", "Antihistamine"],
    Vitamins: ["Vitamin A", "Vitamin B", "Vitamin C"],
    "Pain Relief": ["NSAID", "Topical", "Opioid"],
    Gastrointestinal: ["Antacid", "Laxative", "Anti-diarrheal"],
    Respiratory: ["Inhaler", "Cough Syrup", "Bronchodilator"],
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setShowCart(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotification(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recent-searches");
      let recent: string[] = [];

      if (stored) {
        try {
          recent = JSON.parse(stored);
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Remove if already exists and add to beginning
      recent = recent.filter((q) => q.toLowerCase() !== query.toLowerCase());
      recent.unshift(query);

      // Keep only last 10
      recent = recent.slice(0, 10);

      localStorage.setItem("recent-searches", JSON.stringify(recent));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (search.trim()) {
      saveRecentSearch(search);
    }

    const params = new URLSearchParams({
      search,
      category,
    });

    if (subCategoriesSelected.length > 0) {
      params.append("subCategories", subCategoriesSelected.join(","));
    }

    setShowSearchResults(false);
    router.push(`/retailer/products?${params.toString()}`);
  };

  const handleSearchSelect = (query: string) => {
    setSearch(query);
    saveRecentSearch(query);
    setShowSearchResults(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="py-4 px-6">
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/retailer/dashboard" className="text-4xl font-bold">
            <Image src={prosharlogo} alt="Medigo Logo" width={160} height={50} />
          </Link>

          <div className="flex items-center gap-4">
            {/* SEARCH + FILTER */}
            <div className="relative w-[1060px]" ref={searchRef}>
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-gray-50 border rounded-lg px-2 h-[50px] gap-3"
              >
                <Search className="w-5 h-5 text-gray-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Search medicines..."
                  className="flex-1 bg-transparent outline-none text-sm text-black"
                />

                {/* SUB CATEGORY FILTER */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSubCategory(!showSubCategory)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Filter className="w-5 h-5" />
                  </button>

                  {showSubCategory && (
                    <div className="absolute left-0 top-10 w-64 bg-white text-black border rounded-lg shadow z-50 p-3">
                      <p className="text-sm font-semibold mb-2">
                        {category} Sub Categories
                      </p>

                      <div className="space-y-2 max-h-56 overflow-y-auto">
                        {subCategories[category]?.map((sub) => (
                          <label
                            key={sub}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={subCategoriesSelected.includes(sub)}
                              onChange={() => {
                                setSubCategoriesSelected((prev) =>
                                  prev.includes(sub)
                                    ? prev.filter((s) => s !== sub)
                                    : [...prev, sub]
                                );
                              }}
                              className="accent-[#3A21C0] text-black"
                            />
                            {sub}
                          </label>
                        ))}
                      </div>

                      <div className="flex justify-between mt-3 pt-2 border-t">
                        <button
                          type="button"
                          onClick={() => setSubCategoriesSelected([])}
                          className="text-xs text-gray-500 hover:underline"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSubCategory(false)}
                          className="text-xs bg-[#3A21C0] text-white px-3 py-1 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-6 w-px bg-gray-300" />

                {/* CATEGORY */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCategory(!showCategory)}
                    className="flex items-center gap-2 bg-[#3A21C0] text-white text-sm px-4 h-[34px] rounded-lg"
                  >
                    {category}
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showCategory && (
                    <div className="absolute right-0 mt-2 bg-white text-black border rounded-lg shadow w-48 z-50">
                      {categories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCategory(c);
                            setSubCategoriesSelected([]);
                            setShowCategory(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <SearchResults
                  searchQuery={search}
                  onSelect={handleSearchSelect}
                  onClose={() => setShowSearchResults(false)}
                />
              )}
            </div>

            {/* CART */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-black" />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[11px] rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {showCart && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-slide-down">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
                      <button
                        onClick={() => setShowCart(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="p-8 text-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {item.product.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                {item.product.name}
                              </h4>
                              {item.product.manufacturer && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {item.product.manufacturer}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        updateQuantity(item.product.id, item.quantity - 1, item.selectedQuantityOption);
                                      } else {
                                        removeItem(item.product.id);
                                      }
                                    }}
                                    className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                  >
                                    <Minus className="w-3 h-3 text-gray-600" />
                                  </button>
                                  <span className="text-sm font-medium text-gray-900 w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => {
                                      updateQuantity(item.product.id, item.quantity + 1, item.selectedQuantityOption);
                                    }}
                                    className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                  >
                                    <Plus className="w-3 h-3 text-gray-600" />
                                  </button>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-gray-900">
                                    ৳{(item.product.price * item.quantity).toFixed(2)}
                                  </p>
                                  <button
                                    onClick={() => removeItem(item.product.id)}
                                    className="text-red-500 hover:text-red-700 mt-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {items.length > 0 && (
                    <>
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-base font-semibold text-gray-900">Total:</span>
                          <span className="text-lg font-bold text-[#3A21C0]">
                            ৳{cartTotal.toFixed(2)}
                          </span>
                        </div>
                        <Link
                          href="/retailer/cart"
                          onClick={() => setShowCart(false)}
                          className="w-full bg-[#3A21C0] text-white py-2.5 px-4 rounded-lg hover:bg-[#7B6AD5] transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          View Cart
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* NOTIFICATION */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotification(!showNotification)}
                className="relative w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Bell className="w-5 h-5 text-black" />

                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[11px] rounded-full flex items-center justify-center font-medium">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotification && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-slide-down">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={() => setShowNotification(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                  !notification.read ? 'bg-[#3A21C0]' : 'bg-transparent'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <button className="w-full text-sm text-[#3A21C0] hover:text-[#7B6AD5] font-medium text-center">
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PROFILE */}
            <button
              onClick={() => router.push("/retailer/settings")}
              className="flex items-center text-black  gap-3 border rounded-lg px-3 py-1.5 hover:bg-gray-50"
            >
              <Image
                src="/man.png"
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="text-left">
                <p className="text-sm font-semibold">{retailer?.fullName}</p>
                <p className="text-xs text-gray-500">{retailer?.shopName}</p>
              </div>
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
