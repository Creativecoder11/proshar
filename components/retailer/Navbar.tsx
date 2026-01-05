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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import SearchResults from "./SearchResults";

export default function NavbarHeader() {
  const router = useRouter();
  const { items } = useCartStore();
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
  const notificationCount = 5; // TODO: replace with real API data

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
            <span className="text-[#2F7F7A]">Medi</span>
            <span className="text-[#F97316]">Go</span>
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
                              className="accent-[#2F7F7A]"
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
                          className="text-xs bg-[#2F7F7A] text-white px-3 py-1 rounded"
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
                    className="flex items-center gap-2 bg-[#2F7F7A] text-white text-sm px-4 h-[34px] rounded-lg"
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
                className="relative w-10 h-10 rounded-full border flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 text-black" />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[11px] rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* NOTIFICATION */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotification(!showNotification)}
                className="relative w-10 h-10 rounded-full border flex items-center justify-center"
              >
                <Bell className="w-5 h-5 text-black" />

                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[11px] rounded-full flex items-center justify-center font-medium">
                    {notificationCount}
                  </span>
                )}
              </button>
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
