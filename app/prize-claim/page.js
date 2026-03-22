'use client';

import { useState } from 'react';
import HeaderPolicy from '../components/HeaderPolicy';
import Footer from '../components/Footer';
import PrizeClaimForm from '../components/PrizeClaimForm';

export default function PrizeClaimPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeaderPolicy />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full border border-pink-100 mb-6">
            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-sm font-medium text-pink-600">Janya Foundation Marathon 2025</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Claim Your <span className="text-pink-500">Prize Money</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Congratulations on your achievement! Submit your documents to claim your well-deserved prize money.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submit Your Documents
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            How to Claim Your Prize
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Fill Your Details',
                description: 'Enter your personal information including name, contact details, and the race category you participated in.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Upload Documents',
                description: 'Upload clear images of your Age Proof, Aadhar Card, and PAN Card for verification purposes.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Receive Prize Money',
                description: 'After verification, your prize money will be credited within 60-70 working days.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 h-full border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all">
                  <div className="text-pink-500 mb-4">{item.icon}</div>
                  <div className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
            Documents Required
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Please keep these documents ready before starting the submission
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Age Proof',
                description: 'Birth Certificate, School ID Card, or any government-issued age proof document',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                title: 'Aadhar Card',
                description: 'Clear front and back image of your Aadhar Card for identity verification',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                ),
              },
              {
                title: 'PAN Card',
                description: 'Required for tax purposes and prize money transfer to your bank account',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
              },
            ].map((doc, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 mb-4">
                  {doc.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                <p className="text-sm text-gray-600">{doc.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Important Note</h4>
                <p className="text-sm text-blue-700">
                  Ensure all documents are clearly visible and not blurry. Files should be in JPG, PNG, or PDF format with a maximum size of 5MB each.
                  Your documents will be used solely for verification purposes and handled with strict confidentiality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                question: 'How long does the verification process take?',
                answer: 'The verification process typically takes 7-14 working days. You will be notified via email once your documents are verified.',
              },
              {
                question: 'When will I receive my prize money?',
                answer: 'After successful verification, your prize money will be credited to your bank account within 60-70 working days.',
              },
              {
                question: 'What if my documents are rejected?',
                answer: 'If there are any issues with your documents, we will contact you via email or phone to request corrected documents.',
              },
              {
                question: 'Can I update my submitted documents?',
                answer: 'Yes, you can submit a new claim with corrected documents. Contact us at janyafoundation.04@gmail.com for assistance.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Claim Your Prize?
          </h2>
          <p className="text-pink-100 mb-8">
            Submit your documents now and get your prize money within 60-70 working days.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-all shadow-lg"
          >
            Submit Documents Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      <Footer />

      {/* Prize Claim Form Modal */}
      {showForm && <PrizeClaimForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
