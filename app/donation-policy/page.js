'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DonationPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <div className="pt-24 sm:pt-28 pb-4 sm:pb-5 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Last updated: {new Date().toLocaleDateString()}</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Donation Policy
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
            <a href="#commitment" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">1. Commitment</a>
            <a href="#usage" className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-full hover:bg-pink-600 transition-colors font-medium">2. Fund Usage</a>
            <a href="#types" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">3. Types</a>
            <a href="#tax" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">4. Tax Benefits</a>
            <a href="#contact" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">8. Contact</a>
          </div>
        </div>

        <div className="space-y-8">

          <section id="commitment" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">1</span>
              <h2 className="text-xl font-bold text-gray-900">Our Commitment</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              Janya Foundation is committed to using your donations responsibly and transparently.
              Every rupee donated goes directly toward our mission of empowering women and children
              through our various programs and initiatives.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section id="usage" className="scroll-mt-20 bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-bold">2</span>
              <h2 className="text-xl font-bold text-pink-600">How Donations Are Used</h2>
            </div>
            <div className="pl-11">
              <div className="bg-white rounded-xl p-5 border border-pink-100 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fund Allocation:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">75%</strong> - Direct program expenses (education, healthcare, empowerment)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">15%</strong> - Administrative costs (staff, office, utilities)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-pink-500 mt-1">•</span>
                    <span><strong className="text-gray-700">10%</strong> - Fundraising and awareness campaigns</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We maintain detailed records of all expenditures and publish annual reports
                showing exactly how donations are utilized.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="types" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">3</span>
              <h2 className="text-xl font-bold text-gray-900">Types of Donations</h2>
            </div>
            <div className="pl-11 grid md:grid-cols-2 gap-4">
              <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
                <h3 className="text-lg font-semibold mb-3 text-pink-700">One-Time Donations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-pink-500 mt-1">•</span>
                    Minimum amount: ₹100
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-pink-500 mt-1">•</span>
                    Instant tax receipt
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-pink-500 mt-1">•</span>
                    Secure payment processing
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-pink-500 mt-1">•</span>
                    Multiple payment options
                  </li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">Monthly Subscriptions</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-purple-500 mt-1">•</span>
                    Minimum amount: ₹100/month
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-purple-500 mt-1">•</span>
                    Cancel anytime
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-purple-500 mt-1">•</span>
                    Monthly impact updates
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-purple-500 mt-1">•</span>
                    Automatic receipts
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="tax" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">4</span>
              <h2 className="text-xl font-bold text-gray-900">Tax Benefits</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                Janya Foundation is registered under Section 80G of the Income Tax Act, 1961.
                Donors can claim tax deductions on their donations as per Indian tax laws.
              </p>
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="text-lg font-semibold mb-3 text-green-700">Tax Receipt Details:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-500 mt-1">•</span>
                    Instant digital receipts for all donations
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-500 mt-1">•</span>
                    Annual consolidated receipt available
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-500 mt-1">•</span>
                    Valid PAN and 80G certificate number included
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-500 mt-1">•</span>
                    Receipts sent to registered email address
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">5</span>
              <h2 className="text-xl font-bold text-gray-900">Donation Security</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                We use industry-standard security measures to protect your donation:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  SSL encryption for all transactions
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  PCI DSS compliant payment processing
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Secure storage of donor information
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Regular security audits and updates
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">6</span>
              <h2 className="text-xl font-bold text-gray-900">Refund Policy</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                While donations are generally non-refundable, we understand that mistakes can happen:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Refunds may be considered for duplicate transactions
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Technical errors resulting in incorrect amounts
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Unauthorized transactions (with proper documentation)
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Refund requests must be made within 7 days
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">7</span>
              <h2 className="text-xl font-bold text-gray-900">Transparency & Reporting</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe in complete transparency with our donors:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Annual financial reports published on our website
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Quarterly impact updates sent to donors
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Real-time project updates and success stories
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Open to donor visits and program inspections
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="contact" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">8</span>
              <h2 className="text-xl font-bold text-gray-900">Contact for Donations</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                For any questions about donations or our policies:
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
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">9</span>
              <h2 className="text-xl font-bold text-gray-900">Recognition</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                We deeply appreciate every donation, regardless of size. Donors may choose to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Remain anonymous
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Be recognized in our annual report
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Receive personalized thank you messages
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Get updates on specific programs they support
                </li>
              </ul>
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
