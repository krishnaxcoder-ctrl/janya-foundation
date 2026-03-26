'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Prize claim page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Something went wrong
        </h2>

        <p className="text-gray-600 mb-6">
          We encountered an error while processing your request. Please try again or contact support if the problem persists.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            Try Again
          </button>

          <a
            href="/prize-claim"
            className="block w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Reload Page
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Need help? Contact us at{' '}
          <a href="mailto:janyafoundation.04@gmail.com" className="text-amber-600 hover:underline">
            janyafoundation.04@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
