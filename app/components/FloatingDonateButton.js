'use client';

import { useState, useEffect } from 'react';

export default function FloatingDonateButton({ onClick }) {
  const [mounted, setMounted] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setShowButton(window.scrollY > 800);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {showButton && (
        <button
          onClick={onClick}
          className="hidden md:block fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}
    </>
  );
}
