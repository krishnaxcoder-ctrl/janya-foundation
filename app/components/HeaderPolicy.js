'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DonationForm from './DonationForm';

export default function HeaderPolicy() {
  const [showDonationForm, setShowDonationForm] = useState(false);

  return (
    <>
      <header className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 sm:h-12 sm:w-12 relative">
                <Image
                  src="/sitelogo.jpg"
                  alt="Janya Foundation Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-full"
                />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight font-sans block">
                  JANYA FOUNDATION
                </span>
                <p className="text-[10px] sm:text-xs text-pink-500 font-medium font-sans">Empowering Women & Children</p>
              </div>
            </Link>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                href="/"
                className="text-gray-700 hover:text-pink-500 px-3 py-2 font-semibold text-sm transition-colors"
              >
                Home
              </Link>
              <Link
                href="/marathon"
                className="bg-gradient-to-r from-[#374342] to-[#2D3B3A] text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm whitespace-nowrap flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Marathon</span>
              </Link>
              <button
                onClick={() => setShowDonationForm(true)}
                className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm whitespace-nowrap flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Donate</span>
              </button>
            </div>

            {/* Mobile Home Link */}
            <Link
              href="/"
              className="sm:hidden text-gray-700 hover:text-pink-500 px-3 py-2 font-semibold text-sm transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Buttons */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 grid grid-cols-2 gap-3">
        <Link
          href="/marathon"
          className="w-full bg-gradient-to-r from-[#374342] to-[#2D3B3A] text-white px-4 py-3 rounded-lg font-semibold shadow-sm active:scale-95 transition-all duration-300 text-sm flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Marathon</span>
        </Link>
        <button
          onClick={() => setShowDonationForm(true)}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white px-4 py-3 rounded-lg font-semibold shadow-sm active:scale-95 transition-all duration-300 text-sm flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Donate</span>
        </button>
      </div>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm onClose={() => setShowDonationForm(false)} />
      )}
    </>
  );
} 