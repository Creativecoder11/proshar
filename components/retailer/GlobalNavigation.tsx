"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import Link from "next/link";
import {
  Home,
  Package,
  ShoppingCart,
  FileText,
  Users,
  Heart,
  TrendingUp,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";
import NavbarHeader from "./Navbar";

interface GlobalNavigationProps {
  children: React.ReactNode;
}

export default function GlobalNavigation({ children }: GlobalNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/retailer/login");
  };

  const navItems = [
    { href: "/retailer/dashboard", label: "Home", icon: Home },
    { href: "/retailer/products", label: "Products", icon: Package },
    { href: "/retailer/orders", label: "Orders", icon: ShoppingCart },
    { href: "/retailer/short-khata", label: "Short Khata", icon: BookOpen },
    { href: "/retailer/wholesaler", label: "Wholesaler", icon: Users },
    { href: "/retailer/ledger", label: "My Ledger", icon: FileText },
    { href: "/retailer/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global Top Navbar */}
      <NavbarHeader />
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col px-6 w-68 bg-white text-white">
          <div className="border-b border-gray-200 w-full mx-auto px-8"></div>
          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            <div className=" text-black py-6 ">MAIN MENU</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                      ? "bg-[#F5F3FF] text-black border-l-4 rounded-none border-[#3A21C0] font-medium"
                      : "text-black hover:bg-[#F5F3FF] hover:text-black"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="py-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#FEE5E5] hover:bg-red-200 text-red-500 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
