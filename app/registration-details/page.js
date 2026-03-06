'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RegistrationDetailsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <div className="pt-24 sm:pt-28 pb-4 sm:pb-5 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Official Registration</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            NGO Registration Details
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border border-gray-200 rounded-2xl p-6 md:p-10 bg-white shadow-sm">

        {/* Organization Name */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-pink-600">JANYA FOUNDATION PANVEL</h2>
          <p className="text-gray-500 mt-2">Registered Non-Profit Organization</p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Quick Navigation</h3>
          <div className="flex flex-wrap gap-2">
            <a href="#darpan" className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-full hover:bg-pink-600 transition-colors font-medium">1. DARPAN Details</a>
            <a href="#registration" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">2. Registration</a>
            <a href="#bearers" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">3. Office Bearers</a>
          </div>
        </div>

        <div className="space-y-8">

          {/* DARPAN Details */}
          <section id="darpan" className="scroll-mt-20 bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-bold">1</span>
              <h2 className="text-xl font-bold text-pink-600">DARPAN Registration</h2>
            </div>
            <div className="pl-11">
              <div className="bg-white rounded-xl border border-pink-100 overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-pink-100">
                      <td className="px-5 py-4 text-gray-600 font-medium bg-pink-50/50 w-1/2">Unique Id of VO/NGO</td>
                      <td className="px-5 py-4 text-gray-900 font-semibold">MH/2025/0529327</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 text-gray-600 font-medium bg-pink-50/50">DARPAN Reg. Date</td>
                      <td className="px-5 py-4 text-gray-900 font-semibold">02-03-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Registration Details */}
          <section id="registration" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">2</span>
              <h2 className="text-xl font-bold text-gray-900">Registration Details</h2>
            </div>
            <div className="pl-11">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-4 text-gray-600 font-medium bg-gray-50 w-1/2">Registered With</td>
                      <td className="px-5 py-4 text-gray-900">Charity Commissioner</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-4 text-gray-600 font-medium bg-gray-50">Type of NGO</td>
                      <td className="px-5 py-4 text-gray-900">Trust (Non-Government)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-4 text-gray-600 font-medium bg-gray-50">Registration No</td>
                      <td className="px-5 py-4 text-gray-900 font-semibold">Raigad/0000004/2025</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-4 text-gray-600 font-medium bg-gray-50">Act Name</td>
                      <td className="px-5 py-4 text-gray-900">1860</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-4 text-gray-600 font-medium bg-gray-50">City of Registration</td>
                      <td className="px-5 py-4 text-gray-900">Ulwe</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-4 text-gray-600 font-medium bg-gray-50">State of Registration</td>
                      <td className="px-5 py-4 text-gray-900">MAHARASHTRA</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4 text-gray-600 font-medium bg-gray-50">Date of Registration</td>
                      <td className="px-5 py-4 text-gray-900 font-semibold">03-01-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Office Bearers */}
          <section id="bearers" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">3</span>
              <h2 className="text-xl font-bold text-gray-900">Office Bearers</h2>
            </div>
            <div className="pl-11">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-gray-700 font-semibold">Name</th>
                      <th className="px-5 py-3 text-right text-gray-700 font-semibold">Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-100">
                      <td className="px-5 py-4 text-gray-900 font-medium">Milind Kambli</td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                          President
                        </span>
                      </td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td className="px-5 py-4 text-gray-900 font-medium">Pooja Milind Kambli</td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          Treasurer
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Verification Note */}
          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">4</span>
              <h2 className="text-xl font-bold text-gray-900">Verification</h2>
            </div>
            <div className="pl-11">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <p className="text-blue-800 text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  This registration information is officially verified and can be cross-checked with the Charity Commissioner's office in Maharashtra.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Back to Top */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to top
          </button>
        </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
