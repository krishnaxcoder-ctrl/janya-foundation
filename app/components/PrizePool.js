'use client';

import { useState } from 'react';
import PrizeClaimForm from './PrizeClaimForm';

export default function PrizePool() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>

      {/* Floating Trophy Icons */}
      <div
        className="absolute top-32 left-[15%] animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg flex items-center justify-center transform rotate-12">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3h14v2H5V3zm14 4v5c0 2.76-2.24 5-5 5h-1v2h3v2H8v-2h3v-2h-1c-2.76 0-5-2.24-5-5V7H2V3h4v4h12V3h4v4h-3zm-2 0H7v5c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V7z" />
          </svg>
        </div>
      </div>

      <div
        className="absolute top-48 right-[20%] animate-bounce"
        style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </div>

      <div
        className="absolute bottom-32 left-[25%] animate-bounce"
        style={{ animationDuration: '2.8s', animationDelay: '0.8s' }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg shadow-lg flex items-center justify-center transform -rotate-12">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-sm mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-sm font-semibold text-amber-700">Janya Foundation Marathon 2026</span>
          </div>

          {/* Main Title with Trophy */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="hidden sm:flex w-16 h-16 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 rounded-2xl shadow-xl items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3h14v2H5V3zm14 4v5c0 2.76-2.24 5-5 5h-1v2h3v2H8v-2h3v-2h-1c-2.76 0-5-2.24-5-5V7H2V3h4v4h12V3h4v4h-3zm-2 0H7v5c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V7z" />
              </svg>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
              Claim Your{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Prize Money
              </span>
            </h2>
            <div className="hidden sm:flex w-16 h-16 bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 rounded-2xl shadow-xl items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Congratulations, Champion! You&apos;ve earned it. Submit your documents and receive your well-deserved prize money.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowForm(true)}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <svg className="relative w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="relative">Submit Your Documents</span>
            <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>60-70 Days Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Claim Form Modal */}
      {showForm && <PrizeClaimForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
