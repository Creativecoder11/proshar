'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore, useIsAuthenticated } from '@/lib/stores/auth-store';
import GlobalNavigation from './GlobalNavigation';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasHydrated, setHasHydrated } = useAuthStore();
  const isAuthenticated = useIsAuthenticated();
  const [isMounted, setIsMounted] = useState(false);

  // Mark as mounted on client side
  useEffect(() => {
    setIsMounted(true);
    // Mark as hydrated after mount
    if (!hasHydrated) {
      setHasHydrated(true);
    }
  }, [hasHydrated, setHasHydrated]);

  // Wait for hydration before checking authentication
  useEffect(() => {
    if (!isMounted) return;
    
    const isAuthPage = pathname?.includes('/login') || pathname?.includes('/signup') || pathname?.includes('/forgot-password');
    
    if (!isAuthenticated && !isAuthPage) {
      router.push('/retailer/login');
    }
  }, [isMounted, isAuthenticated, router, pathname]);

  // Show loading while mounting/hydrating
  if (!isMounted || !hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  // Don't show layout on auth pages
  if (pathname?.includes('/login') || pathname?.includes('/signup') || pathname?.includes('/forgot-password')) {
    return <>{children}</>;
  }

  // If not authenticated, show nothing (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return <GlobalNavigation>{children}</GlobalNavigation>;
}
