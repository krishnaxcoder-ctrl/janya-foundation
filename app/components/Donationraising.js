'use client';

import { useState } from 'react';
import Link from 'next/link';
import DonationForm from './DonationForm';

export default function DonationRaising() {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [campaign] = useState({
    patientName: 'Mrs. Thilagam R',
    age: 60,
    condition: 'Blood Cancer (Leukemia)',
    goal: 1200000,
    totalRaised: 5000,
    donorCount: 3,
    progressPercent: 0.42,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const medicalExpenses = [
    {
      title: 'Lab Tests & Blood Work',
      amount: '₹14,260',
      desc: 'B12-Folate, Thyroid, Liver Function, Tumor Lysis Profile & more',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
      color: 'bg-pink-500',
      gradient: 'from-pink-500 via-rose-500 to-pink-600',
      glow: 'shadow-pink-500/50',
      pdfUrl: '/pdfs/Document 191.pdf',
    },
    {
      title: 'Cancer Screening',
      amount: '₹28,930',
      desc: 'Bone Marrow Biopsy, Leukemia Panel, Cytogenetics & DNA Tests',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      color: 'bg-red-500',
      gradient: 'from-red-500 via-rose-500 to-red-600',
      glow: 'shadow-red-500/50',
      pdfUrl: '/pdfs/R THILAGAM REPORTS .pdf',
    },
    {
      title: 'Cardiology Tests',
      amount: '₹4,500',
      desc: 'Echo Cardiography, Doppler, X-Ray for pre-treatment assessment',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 via-violet-500 to-purple-600',
      glow: 'shadow-purple-500/50',
      pdfUrl: '/pdfs/feb 2026 bills.pdf',
    },
    {
      title: 'Emergency Care',
      amount: '₹4,720',
      desc: 'Emergency Package, Blood Transfusion & Critical Care Support',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 via-amber-500 to-orange-600',
      glow: 'shadow-orange-500/50',
      pdfUrl: '/pdfs/feb 2026 bills.pdf',
    },
  ];

  const handleDownloadPdf = (pdfUrl, title) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '_')}_Bill.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full relative z-10">
      {/* Section Header - Enhanced UI */}
      <div
        className="relative overflow-hidden"
        style={{ borderTop: '3px solid #ec4899' }}
      >
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ec4899 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-red-200/20 to-pink-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 py-10 sm:py-14 px-6 sm:px-10 md:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Top row with badge and stats */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Active badge with pulse */}
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-pink-200 rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                <span className="text-xs font-semibold text-pink-600 uppercase tracking-wider">Active Fundraiser</span>
              </span>

              {/* Verified badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 rounded-full">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-xs font-medium text-green-700">Verified Medical Case</span>
              </span>

              {/* 80G badge */}
              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-medium text-blue-700">80G Tax Benefit</span>
              </span>
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Left - Heading and description */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Help Save a Life Today
                  <span className="inline-block ml-2">
                    <svg className="w-8 h-8 text-pink-500 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                    </svg>
                  </span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  Your contribution can make a life-changing difference in someone's fight against cancer. Mrs. Thilagam, a 60-year-old mother, is battling blood cancer (Leukemia) and needs urgent financial support for her treatment at Meenakshi Mission Hospital, Madurai.
                </p>

                {/* Quick stats row */}
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">₹{formatCurrency(campaign.goal)}</p>
                      <p className="text-xs text-gray-500">Goal Amount</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{campaign.donorCount}</p>
                      <p className="text-xs text-gray-500">Donors</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">Urgent</p>
                      <p className="text-xs text-gray-500">Priority</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - CTA Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 relative overflow-hidden">
                  {/* Decorative corner */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full opacity-10"></div>

                  <div className="relative z-10">
                    <p className="text-sm text-gray-600 mb-2">Amount Raised</p>
                    <p className="text-3xl font-bold text-pink-600 mb-1">₹{formatCurrency(campaign.totalRaised)}</p>
                    <p className="text-xs text-gray-500 mb-4">of ₹{formatCurrency(campaign.goal)} goal</p>

                    {/* Mini progress bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${campaign.progressPercent}%` }}
                      ></div>
                    </div>

                    <button
                      onClick={() => setShowDonationForm(true)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                      </svg>
                      Donate Now
                    </button>

                    {/* View Campaign Button */}
                    <Link
                      href="/donate"
                      className="w-full mt-3 py-3 px-4 bg-white text-pink-600 font-semibold rounded-xl border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Full Campaign
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:min-h-screen">

        {/* Left Side - Campaign Info */}
        <div
          className="w-full lg:w-1/2 px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-20 lg:px-12 flex flex-col justify-center text-white relative overflow-hidden min-h-[600px] sm:min-h-[650px] lg:min-h-0"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(127,29,29,0.95) 0%, rgba(185,28,28,0.9) 50%, rgba(220,38,38,0.85) 100%), url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1180&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-500/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-r from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            {/* Floating particles */}
            <div className="absolute top-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
            <div className="absolute top-40 right-40 w-1.5 h-1.5 bg-yellow-300/40 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.5s'}}></div>
            <div className="absolute bottom-40 left-20 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '3.5s'}}></div>
            <div className="absolute bottom-60 right-32 w-1 h-1 bg-yellow-200/30 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '2s'}}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-left sm:text-center flex flex-col items-start sm:items-center">

            {/* Urgent Badge with glow */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl animate-pulse"></div>
              <span className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-400/30 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
                </span>
                Urgent Medical Fund
              </span>
            </div>

            {/* Patient Card - Glass morphism */}
            <div className="relative w-full max-w-md mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/20 shadow-2xl overflow-hidden">
                {/* Decorative line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>

                <div className="flex items-center gap-4 mb-4">
                  {/* Patient Avatar with ring */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-md opacity-50"></div>
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-1 shadow-xl">
                      <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl sm:text-3xl font-bold">
                        {campaign.patientName.charAt(0)}
                      </div>
                    </div>
                    {/* Status dot */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>

                  <div className="text-left flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1">{campaign.patientName}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/70 text-sm">{campaign.age} years old</span>
                      <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                      <span className="text-white/70 text-sm">Female</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full text-xs font-semibold text-yellow-200 border border-yellow-400/30">
                      <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></span>
                      {campaign.condition}
                    </span>
                  </div>
                </div>

                <p className="text-white/80 text-sm leading-relaxed pl-1 border-l-2 border-yellow-400/50">
                  Mrs. Thilagam is fighting blood cancer and needs urgent financial support for her treatment at <span className="text-yellow-200 font-medium">Meenakshi Mission Hospital, Madurai</span>.
                </p>
              </div>
            </div>

            {/* Goal Section */}
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Campaign Goal</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-white via-yellow-100 to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
                  ₹{formatCurrency(campaign.goal)}
                </span>
              </h2>
            </div>

            {/* Progress Section */}
            <div className="w-full max-w-md mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-white">₹{formatCurrency(campaign.totalRaised)}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wide">Raised</p>
                  </div>
                  <div className="text-center border-x border-white/20">
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-300">{campaign.progressPercent.toFixed(0)}%</p>
                    <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wide">Funded</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-white">{campaign.donorCount}</p>
                    <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wide">Donors</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 rounded-full transition-all duration-1000 ease-out relative"
                      style={{ width: `${campaign.progressPercent}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-sm animate-pulse"></div>
                    </div>
                  </div>
                  {/* Progress marker */}
                  <div
                    className="absolute -top-1 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-yellow-400 flex items-center justify-center transition-all duration-1000"
                    style={{ left: `calc(${campaign.progressPercent}% - 12px)` }}
                  >
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Still Needed - Highlighted */}
            <div className="w-full max-w-md mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                <div className="relative bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-white/90 font-medium">Still Needed</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-yellow-300">₹{formatCurrency(campaign.goal - campaign.totalRaised)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button - Premium */}
            <Link
              href="/donate"
              className="group relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-[length:200%_100%] animate-shimmer"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center gap-3 px-8 py-5 text-white font-bold text-lg">
                <svg className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                Donate Now & Save a Life
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            {/* Trust Badges - Premium */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-white/40 transition-all hover:scale-105 cursor-default">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-xs font-semibold text-white/90">Verified Bills</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-white/40 transition-all hover:scale-105 cursor-default">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
                <span className="text-xs font-semibold text-white/90">80G Tax Benefit</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-full border border-white/20 hover:border-white/40 transition-all hover:scale-105 cursor-default">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-xs font-semibold text-white/90">100% Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Medical Expenses Breakdown */}
        <div className="w-full lg:w-1/2 bg-gray-50 px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-20 lg:px-12 flex flex-col justify-center">

          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Medical Expenses Breakdown</h3>
            <p className="text-gray-600 text-sm">Verified bills from Meenakshi Mission Hospital, Madurai</p>
          </div>

          {/* Expense Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {medicalExpenses.map((expense, index) => (
              <div
                key={index}
                onClick={() => handleDownloadPdf(expense.pdfUrl, expense.title)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${expense.gradient} opacity-[0.08] group-hover:opacity-[0.15] transition-opacity duration-500`}></div>

                {/* Card content */}
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 group-hover:border-gray-200 rounded-2xl p-5 h-full shadow-sm group-hover:shadow-xl transition-all duration-500">

                  {/* Top row - Icon and Amount */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${expense.gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      {expense.icon}
                    </div>
                    <div className="text-right">
                      <span className={`text-xl font-bold bg-gradient-to-r ${expense.gradient} bg-clip-text text-transparent`}>{expense.amount}</span>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Bill Amount</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold text-gray-900 mb-2 group-hover:text-gray-800">{expense.title}</h4>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed h-10 line-clamp-2 mb-4">{expense.desc}</p>

                  {/* Download button */}
                  <div className={`flex items-center justify-between pt-3 border-t border-gray-100`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${expense.gradient} flex items-center justify-center group-hover:animate-bounce`}>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Download Bill</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${expense.gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`}></div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-white rounded-xl p-4 border-2 border-red-200 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Medical Bills</span>
              <span className="text-2xl font-bold text-red-600">₹{formatCurrency(campaign.totalRaised)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">* Additional treatment costs expected. Goal set at ₹1,00,000 for complete treatment.</p>
          </div>

          {/* View Bills Link */}
          <div className="text-center mb-6">
            <a
              href="/pdfs/Document 191.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Original Medical Bills (PDF)
            </a>
          </div>

          {/* Donate Button (Desktop) */}
          <div className="hidden lg:block text-center">
            <button
              onClick={() => setShowDonationForm(true)}
              className="bg-red-600 text-white text-sm font-semibold px-10 py-3 rounded-full hover:bg-red-700 transition-all duration-200 shadow-lg active:scale-[0.98]"
            >
              Contribute Now
            </button>
          </div>

        </div>
      </div>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm onClose={() => setShowDonationForm(false)} />
      )}
    </section>
  );
}
