"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      {/* Logo */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-bold text-[#2F7F7A]">Medi</span>
          <span className="text-4xl font-bold text-[#F97316]">Go</span>
        </div>
      </div>

      {/* Error Code */}
      <h1 className="text-6xl font-semibold text-gray-800 mb-2">404</h1>

      {/* Message */}
      <p className="text-gray-500 text-sm mb-6 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Action */}
      <Link
        href="/retailer/dashboard"
        className="inline-flex items-center justify-center rounded-lg bg-[#2F7F7A] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
      >
        Go back home
      </Link>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-gray-400">
        Version 2.1.4
      </p>
    </div>
  );
}
