"use client";

import Image from "next/image";
import Link from "next/link";
import prosharlogo from "@/assets/prosharlogo.svg";


export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      {/* Logo */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2">
          <Image src={prosharlogo} alt="Proshar Logo" width={150} height={40} />
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
        className="inline-flex items-center justify-center rounded-lg bg-[#3A21C0] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
      >
        Go back home
      </Link>
    </div>
  );
}
