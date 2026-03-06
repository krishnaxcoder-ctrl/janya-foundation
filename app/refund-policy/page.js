'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <div className="pt-24 sm:pt-28 pb-4 sm:pb-5 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Last updated: {new Date().toLocaleDateString()}</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Refund Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="border border-gray-200 rounded-2xl p-6 md:p-10 bg-white shadow-sm">

        {/* Quick Navigation */}
        <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Quick Navigation</h3>
          <div className="flex flex-wrap gap-2">
            <a href="#general" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">1. General Policy</a>
            <a href="#eligible" className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-full hover:bg-pink-600 transition-colors font-medium">2. Eligible Scenarios</a>
            <a href="#non-eligible" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">3. Non-Eligible</a>
            <a href="#process" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">4. Process</a>
            <a href="#contact" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">7. Contact</a>
          </div>
        </div>

        <div className="space-y-8">

          <section id="general" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">1</span>
              <h2 className="text-xl font-bold text-gray-900">General Policy</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                At Janya Foundation, we understand that sometimes circumstances may require a refund.
                While donations are generally considered final and non-refundable due to their charitable
                nature, we have established this policy to address specific situations where refunds may be appropriate.
              </p>
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-yellow-800 text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <strong>Important:</strong> All refund requests must be made within 7 days of the original donation.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="eligible" className="scroll-mt-20 bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-bold">2</span>
              <h2 className="text-xl font-bold text-pink-600">Eligible Refund Scenarios</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">Refunds may be considered in the following circumstances:</p>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <h3 className="text-base font-semibold text-green-700 mb-1 flex items-center gap-2">
                    <span className="text-green-500">✅</span> Duplicate Transactions
                  </h3>
                  <p className="text-sm text-gray-600 pl-6">
                    If you accidentally made the same donation multiple times due to technical issues.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <h3 className="text-base font-semibold text-green-700 mb-1 flex items-center gap-2">
                    <span className="text-green-500">✅</span> Technical Errors
                  </h3>
                  <p className="text-sm text-gray-600 pl-6">
                    If a technical malfunction resulted in an incorrect donation amount being charged.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <h3 className="text-base font-semibold text-green-700 mb-1 flex items-center gap-2">
                    <span className="text-green-500">✅</span> Unauthorized Transactions
                  </h3>
                  <p className="text-sm text-gray-600 pl-6">
                    If someone made a donation using your payment method without your authorization
                    (requires proper documentation and police report if applicable).
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <h3 className="text-base font-semibold text-green-700 mb-1 flex items-center gap-2">
                    <span className="text-green-500">✅</span> Payment Gateway Errors
                  </h3>
                  <p className="text-sm text-gray-600 pl-6">
                    If there was an error on the payment gateway side that resulted in incorrect processing.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="non-eligible" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">3</span>
              <h2 className="text-xl font-bold text-gray-900">Non-Eligible Scenarios</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">Refunds will NOT be provided in the following cases:</p>
              <div className="space-y-3">
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h3 className="text-base font-semibold text-red-700 mb-1 flex items-center gap-2">
                    <span className="text-red-500">❌</span> Change of Mind
                  </h3>
                  <p className="text-sm text-gray-600 pl-6">
                    Simply changing your mind about making a donation after it has been processed.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h3 className="text-base font-semibold text-red-700 mb-1 flex items-center gap-2">
                    <span className="text-red-500">❌</span> Financial Hardship
                  </h3>
                  <p className="text-sm text-gray-600 pl-6">
                    Personal financial difficulties that arise after making a voluntary donation.
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h3 className="text-base font-semibold text-red-700 mb-1 flex items-center gap-2">
                    <span className="text-red-500">❌</span> Disagreement with Programs
                  </h3>
                  <p className="text-sm text-gray-600 pl-6">
                    Disagreement with how the foundation operates or uses funds (all our activities are transparent).
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="process" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">4</span>
              <h2 className="text-xl font-bold text-gray-900">Refund Process</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">To request a refund, please follow these steps:</p>
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <ol className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0">1</span>
                    <span><strong>Contact Us:</strong> Send an email to janyafoundation.04@gmail.com within 7 days of your donation with the subject line "Refund Request"</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0">2</span>
                    <span><strong>Provide Details:</strong> Include your transaction ID, donation amount, date of donation, and reason for refund request</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0">3</span>
                    <span><strong>Submit Documentation:</strong> Provide any supporting documents (screenshots, bank statements, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0">4</span>
                    <span><strong>Wait for Review:</strong> Our team will review your request within 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0">5</span>
                    <span><strong>Receive Decision:</strong> You will be notified of our decision via email</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">5</span>
              <h2 className="text-xl font-bold text-gray-900">Refund Timeline</h2>
            </div>
            <div className="pl-11 grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-700 mb-3">Review Process</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-purple-500 mt-1">•</span>
                    Initial review: 1-2 business days
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-purple-500 mt-1">•</span>
                    Detailed investigation: 3-5 business days
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-purple-500 mt-1">•</span>
                    Decision notification: Within 5 business days
                  </li>
                </ul>
              </div>
              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">Refund Processing</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-indigo-500 mt-1">•</span>
                    Credit/Debit Cards: 5-7 business days
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-indigo-500 mt-1">•</span>
                    Net Banking: 3-5 business days
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-indigo-500 mt-1">•</span>
                    UPI/Wallets: 1-3 business days
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">6</span>
              <h2 className="text-xl font-bold text-gray-900">Subscription Cancellations</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">For monthly subscription donations:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  You can cancel your subscription at any time
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Cancellation takes effect from the next billing cycle
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  No refunds for the current month's donation
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  You can manage subscriptions through your Janya Foundation dashboard
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="contact" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">7</span>
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                For refund requests or questions about this policy:
              </p>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-2">
                <p className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  janyafoundation.04@gmail.com
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  9867275101 / 9321496142
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Office Hours: Monday to Friday, 9:00 AM to 6:00 PM IST
                </p>
                <p className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ulwe Navi Mumbai, Maharashtra
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">8</span>
              <h2 className="text-xl font-bold text-gray-900">Policy Updates</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              This refund policy may be updated from time to time. Any changes will be posted on
              this page with an updated "Last updated" date. We encourage donors to review this
              policy periodically.
            </p>
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
