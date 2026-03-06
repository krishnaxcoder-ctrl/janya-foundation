'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DonationRaising from '../components/Donationraising';
import DonationForm from '../components/DonationForm';

export default function DonatePage() {
  const [showDonationForm, setShowDonationForm] = useState(false);

  return (
    <>
      <Header setShowDonationForm={setShowDonationForm} />
      <main className="min-h-screen pt-14 sm:pt-16">
        <DonationRaising />
      </main>
      <Footer />

      {/* Floating Donate Button */}
      <button
        onClick={() => setShowDonationForm(true)}
        className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-[1000] group"
      >
        <div className="relative">
          {/* Pulse animation ring */}
          <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping opacity-25"></div>

          {/* Button */}
          <div className="relative flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
            <span className="font-semibold text-sm">Donate Now</span>
          </div>
        </div>
      </button>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm onClose={() => setShowDonationForm(false)} />
      )}
    </>
  );
}
