'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <div className="pt-24 sm:pt-28 pb-4 sm:pb-5 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Last updated: {new Date().toLocaleDateString()}</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Privacy Policy
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
            <a href="#collection" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">1. Information Collection</a>
            <a href="#usage" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">2. How We Use</a>
            <a href="#sharing" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">3. Sharing</a>
            <a href="#security" className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-full hover:bg-pink-600 transition-colors font-medium">4. Security</a>
            <a href="#contact" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">7. Contact</a>
          </div>
        </div>

        <div className="space-y-8">

          <section id="collection" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">1</span>
              <h2 className="text-xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                At Janya Foundation, we collect information that you provide directly to us when you:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Make a donation through our website
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Subscribe to our newsletter
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Contact us for support or inquiries
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Participate in our programs or events
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                This information may include your name, email address, phone number, postal address,
                payment information, and any other information you choose to provide.
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="usage" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">2</span>
              <h2 className="text-xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Process your donations and send receipts
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Communicate with you about our programs and impact
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Send newsletters and updates (with your consent)
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Respond to your inquiries and provide support
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Comply with legal and regulatory requirements
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Improve our website and services
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="sharing" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">3</span>
              <h2 className="text-xl font-bold text-gray-900">Information Sharing</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties,
                except in the following circumstances:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  With payment processors to process donations
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  With service providers who assist us in operating our website
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  When required by law or to protect our rights
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  With your explicit consent
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section id="security" className="scroll-mt-20 bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-bold">4</span>
              <h2 className="text-xl font-bold text-pink-600">Data Security</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption,
              secure servers, and regular security audits. However, no method of transmission over the
              internet is 100% secure.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">5</span>
              <h2 className="text-xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Access the personal information we hold about you
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Request correction of inaccurate information
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Request deletion of your personal information
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Opt-out of marketing communications
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <span className="text-pink-500 mt-1">•</span>
                  Withdraw consent for data processing
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-gray-100" />

          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">6</span>
              <h2 className="text-xl font-bold text-gray-900">Cookies and Tracking</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              Our website uses cookies to enhance your browsing experience and analyze website traffic.
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section id="contact" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">7</span>
              <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
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
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">8</span>
              <h2 className="text-xl font-bold text-gray-900">Changes to This Policy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
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
