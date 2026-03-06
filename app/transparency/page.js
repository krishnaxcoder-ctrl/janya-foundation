'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Transparency() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <div className="pt-24 sm:pt-28 pb-4 sm:pb-5 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Financial Year: 2024</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Transparency & Accountability
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
            <a href="#overview" className="text-xs bg-pink-500 text-white px-3 py-1.5 rounded-full hover:bg-pink-600 transition-colors font-medium">1. Financial Overview</a>
            <a href="#utilization" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">2. Fund Utilization</a>
            <a href="#impact" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">3. Impact Metrics</a>
            <a href="#governance" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">4. Governance</a>
            <a href="#contact" className="text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">6. Contact</a>
          </div>
        </div>

        <p className="text-gray-600 text-center mb-10">
          We believe in complete transparency with our donors and the communities we serve.
        </p>

        <div className="space-y-8">

          {/* Financial Overview */}
          <section id="overview" className="scroll-mt-20 bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-bold">1</span>
              <h2 className="text-xl font-bold text-pink-600">Financial Overview (2024)</h2>
            </div>
            <div className="pl-11">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-green-200">
                  <h3 className="text-sm font-semibold text-green-700 mb-1">Total Donations</h3>
                  <p className="text-2xl font-bold text-green-800">₹4,30,507</p>
                  <p className="text-xs text-green-600 mt-1">From 14400+ donors</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-700 mb-1">Program Expenses</h3>
                  <p className="text-2xl font-bold text-blue-800">₹9,34,000</p>
                  <p className="text-xs text-blue-600 mt-1">75% of total funds</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-purple-200">
                  <h3 className="text-sm font-semibold text-purple-700 mb-1">Administrative</h3>
                  <p className="text-2xl font-bold text-purple-800">₹1,87,000</p>
                  <p className="text-xs text-purple-600 mt-1">15% of total funds</p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Fund Utilization */}
          <section id="utilization" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">2</span>
              <h2 className="text-xl font-bold text-gray-900">Fund Utilization Breakdown</h2>
            </div>
            <div className="pl-11 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Program-wise Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl border border-pink-200">
                    <span className="font-medium text-gray-700">Breast Cancer Awareness</span>
                    <span className="font-bold text-pink-600">₹2,80,000 (30%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <span className="font-medium text-gray-700">Children's Education</span>
                    <span className="font-bold text-purple-600">₹3,27,000 (35%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <span className="font-medium text-gray-700">Women Empowerment</span>
                    <span className="font-bold text-indigo-600">₹2,34,000 (25%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-200">
                    <span className="font-medium text-gray-700">Sanitary Support</span>
                    <span className="font-bold text-teal-600">₹93,000 (10%)</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Operational Costs</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-medium text-gray-700">Staff Salaries</span>
                    <span className="font-bold text-gray-600">₹1,12,000 (9%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-medium text-gray-700">Office & Utilities</span>
                    <span className="font-bold text-gray-600">₹37,000 (3%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-medium text-gray-700">Technology & Systems</span>
                    <span className="font-bold text-gray-600">₹23,000 (2%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-medium text-gray-700">Fundraising</span>
                    <span className="font-bold text-gray-600">₹1,24,000 (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Impact Metrics */}
          <section id="impact" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">3</span>
              <h2 className="text-xl font-bold text-gray-900">Impact Metrics (2024)</h2>
            </div>
            <div className="pl-11 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-5 bg-pink-50 rounded-xl border border-pink-200">
                <div className="text-3xl mb-2">👩‍⚕️</div>
                <div className="text-2xl font-bold text-pink-700">520</div>
                <div className="text-xs text-pink-600 mt-1">Women educated about breast cancer</div>
              </div>
              <div className="text-center p-5 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-3xl mb-2">👧</div>
                <div className="text-2xl font-bold text-purple-700">215</div>
                <div className="text-xs text-purple-600 mt-1">Children supported with education</div>
              </div>
              <div className="text-center p-5 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="text-3xl mb-2">👩‍💼</div>
                <div className="text-2xl font-bold text-indigo-700">165</div>
                <div className="text-xs text-indigo-600 mt-1">Women empowered with skills</div>
              </div>
              <div className="text-center p-5 bg-teal-50 rounded-xl border border-teal-200">
                <div className="text-3xl mb-2">🩸</div>
                <div className="text-2xl font-bold text-teal-700">320</div>
                <div className="text-xs text-teal-600 mt-1">Girls supported with sanitary products</div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Governance */}
          <section id="governance" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">4</span>
              <h2 className="text-xl font-bold text-gray-900">Governance & Compliance</h2>
            </div>
            <div className="pl-11 grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="text-lg font-semibold text-green-700 mb-3">Certifications & Registrations</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-green-500 mt-1">•</span>
                    NGO Registration: Raigad/0000004/2025
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="text-green-500 mt-1">•</span>
                    80G and 12A Certificate: Available
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-700 mb-3">Board of Directors</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Dr. Priya Sharma</strong> - Chairperson (Oncologist)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Ms. Anita Gupta</strong> - Secretary (Social Worker)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Mr. Rajesh Kumar</strong> - Treasurer (CA)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Dr. Sunita Devi</strong> - Member (Pediatrician)</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Ms. Kavita Singh</strong> - Member (Educator)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Reports & Documents */}
          <section className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">5</span>
              <h2 className="text-xl font-bold text-gray-900">Reports & Documents</h2>
            </div>
            <div className="pl-11 grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                  <span>📊</span> Annual Report 2024
                </h3>
                <p className="text-sm text-gray-600 mb-4">Comprehensive overview of our activities and impact</p>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600 transition-colors w-full">
                  Download PDF
                </button>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                  <span>💰</span> Financial Statements
                </h3>
                <p className="text-sm text-gray-600 mb-4">Audited financial statements for 2023-24</p>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-colors w-full">
                  Download PDF
                </button>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                  <span>📋</span> Registration Documents
                </h3>
                <p className="text-sm text-gray-600 mb-4">Legal registration and certification documents</p>
                <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-600 transition-colors w-full">
                  Download PDF
                </button>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Contact */}
          <section id="contact" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold">6</span>
              <h2 className="text-xl font-bold text-gray-900">Questions About Our Work?</h2>
            </div>
            <div className="pl-11">
              <p className="text-gray-600 leading-relaxed mb-4">
                We welcome questions about our operations, finances, and impact.
                Transparency is at the heart of everything we do.
              </p>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">General Inquiries</h3>
                  <p className="flex items-center gap-2 text-gray-700 text-sm">
                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    janyafoundation.04@gmail.com
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Financial Questions</h3>
                  <p className="flex items-center gap-2 text-gray-700 text-sm">
                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    janyafoundation.04@gmail.com
                  </p>
                </div>
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
