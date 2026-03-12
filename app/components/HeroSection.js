'use client';

import { useState } from 'react';

export default function HeroSection({ setShowDonationForm }) {
  const [campaign] = useState({
    goal: 500000,
    totalRaised: 2200,
    donorCount: 4,
    progressPercent: 0.44,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };
  const trustMarkers = [
    {
      title: 'Verified NGO',
      description: 'Registered & transparent',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: '80G Tax Benefits',
      description: 'Tax exemption available',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative bg */}
      <div className="pointer-events-none absolute inset-0" style={{ perspective: '400px' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            transform: 'rotateX(60deg)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] opacity-[0.05]"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, #db2777 0deg, #ec4899 120deg, #f9a8d4 240deg, #db2777 360deg)',
          filter: 'blur(80px)',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
        }}
      />

      {/* Main Content - 70vh */}
      <div className="relative mx-auto flex flex-col lg:flex-row max-w-[96rem] min-h-screen pt-12 sm:pt-14">
        {/* Left — Text content (50%) */}
        <div className="flex items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-0 xl:pl-16 w-full lg:w-1/2 relative">
          <div className="w-full max-w-2xl relative z-10">
            {/* Elegant Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/50 backdrop-blur-sm px-4 py-1.5 shadow-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-pink-700">Trusted by 1,000+ supporters</span>
            </div>

            {/* Premium Heading */}
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-[68px] font-normal tracking-tight text-gray-900 leading-[1.05]">
              Empowering{' '}
              <span className="font-extrabold text-pink-600">Women</span> <br className="hidden sm:block" />
              & <span className="font-extrabold text-pink-600">Children</span>{' '}
              <br className="hidden sm:block" />
              for a <span className="relative italic font-medium">
                better future
                <svg className="absolute -bottom-1 left-0 w-full text-pink-200" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                  <path d="M0,5 Q50,0 100,5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Refined Description */}
            <p className="mt-8 max-w-lg font-body text-lg leading-relaxed text-gray-600 sm:text-xl">
              Join <span className="text-gray-900 font-semibold">Janya Foundation</span> in creating lasting change through breast cancer
              awareness, education, and women&apos;s empowerment programs.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => setShowDonationForm(true)}
                className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-lg bg-gradient-to-r from-[#FF4191] to-[#E90074] px-10 py-4.5 text-base font-extrabold text-white shadow-[0_10px_25px_-5px_rgba(255,65,145,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_35px_-10px_rgba(255,65,145,0.4)] active:scale-[0.98]"
              >
                <div className="absolute inset-0 -translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]"></div>
                <span className="relative">Donate Now</span>
                <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20 shadow-inner group-hover:rotate-45 transition-transform duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>

              <a
                href="https://drive.google.com/drive/folders/1kI4mBYMXsN9sTSSWmGU50bQlGtnhWVHe?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 rounded-lg border-2 border-pink-100 bg-white px-10 py-4 text-base font-extrabold text-gray-800 transition-all duration-300 hover:border-[#FF4191] hover:bg-pink-50/50 hover:text-[#FF4191] active:scale-[0.98]"
              >
                <span>Marathon Images</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 text-[#FF4191] transition-all duration-300 group-hover:bg-[#FF4191] group-hover:text-white group-hover:rotate-45">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            </div>

            {/* Upgraded Trust Strip */}
            <div className="mt-12 flex flex-wrap items-center gap-8 pt-8 border-t border-gray-100">
              {trustMarkers.map((marker) => (
                <div key={marker.title} className="flex items-center gap-4 group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                    {marker.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">{marker.title}</p>
                    <p className="text-xs text-gray-500 font-medium">{marker.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

          </div>
        </div>

        {/* Right — Cervical Cancer Awareness Campaign (50%) */}
        <div
          className="relative hidden lg:flex flex-col justify-center items-center px-10 xl:px-16 py-12 text-white overflow-hidden w-1/2"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(190,24,93,0.9) 0%, rgba(131,24,67,0.95) 100%), url('https://images.unsplash.com/photo-1644822861254-c99d0022ab70?q=80&w=1170&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-lg">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-medium tracking-wider uppercase mb-8">
              <span className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></span>
              Cervical Cancer Awareness
            </span>

            {/* Heading */}
            <h2 className="text-3xl xl:text-4xl font-light mb-2 tracking-tight">
              Help Us Raise
            </h2>
            <h2 className="text-4xl xl:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
              ₹{formatCurrency(campaign.goal)}
            </h2>

            {/* Progress Bar */}
            <div className="mb-8 w-full">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-2xl font-semibold text-white">₹{formatCurrency(campaign.totalRaised)}</span>
                <span className="text-sm text-white/60">raised of ₹{formatCurrency(campaign.goal)}</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-pink-300 via-pink-200 to-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${campaign.progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-white/70">{campaign.progressPercent.toFixed(1)}% funded</span>
                <span className="text-sm text-white/70 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  {campaign.donorCount} donor{campaign.donorCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <p className="text-base text-white/80 mb-8 w-full font-light leading-relaxed">
              Fund <span className="text-pink-200 font-semibold">HPV vaccinations</span> for underprivileged women. Every donation helps protect lives from cervical cancer.
            </p>

            {/* Quick Facts */}
            <div className="flex flex-wrap gap-3 mb-8 w-full">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Save Lives</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium">99% Effective</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-4 h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="text-sm font-medium">200 Women</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowDonationForm(true)}
              className="w-full bg-white text-pink-600 text-lg font-semibold py-4 rounded-full hover:bg-pink-50 transition-all duration-200 shadow-lg active:scale-[0.98]"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Partners Row */}
      <div className="relative bg-gray-50 border-t border-gray-100">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-10 py-4">
          {/* Mobile: Ammdar Sponsor */}
          <div className="flex justify-center mb-2 sm:hidden">
            <div className="flex items-center gap-3 rounded-xl border-2 border-yellow-500 bg-yellow-50/50 pr-4 w-full">
              <div className="h-28 w-32 flex items-center justify-center bg-white rounded-lg p-1 flex-shrink-0">
                <img src="/ammdar.jpeg" alt="Ammdar Sponsor" className="h-full w-full object-contain" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Proudly Supported By</p>
                <p className="text-sm font-bold text-gray-800 leading-tight">Aamdar Vikrant Dada Patil</p>
              </div>
            </div>
          </div>

          {/* Mobile: 2x2 Sponsors Grid with Height Difference */}
          <div className="grid grid-cols-2 gap-1.5 sm:hidden mb-2">
            {/* Title Sponsor - Tallest */}
            <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/80 p-1.5">
              <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Title Sponsor</p>
              <div className="h-16 flex items-center justify-center">
                <img src="/JP Logo __1_page-0001.jpg" alt="Title Sponsor" className="h-full w-auto object-contain" />
              </div>
            </div>
            {/* Co Title Sponsor - Medium */}
            <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/80 p-1.5">
              <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Co Title Sponsor</p>
              <div className="h-14 flex items-center justify-center">
                <img src="/Mumbai 81083 25218 (1).png" alt="Co Title Sponsor" className="h-full w-auto object-contain" />
              </div>
            </div>
            {/* Associate Sponsor - Smaller */}
            <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/80 p-1">
              <p className="text-[12px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
              <div className="h-11 flex items-center justify-center">
                <img src="/1.png" alt="Associate Sponsor" className="h-full w-auto object-contain" />
              </div>
            </div>
            {/* Associate Sponsor - Smaller */}
            <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/80 p-1">
              <p className="text-[12px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
              <div className="h-11 flex items-center justify-center">
                <img src="/shreeji.png" alt="Associate Sponsor" className="h-full w-auto object-contain" />
              </div>
            </div>
          </div>
          {/* Mobile: Pink Partners Grid */}
          <div className="grid grid-cols-3 gap-1 sm:hidden">
            {/* Pink Partners */}
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Technology Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-reliance.jpg" alt="Technology Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/janyafarmsnew.png" alt="Associate Sponsor" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Entertainment Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/Mumbai 81083 25218.png" alt="Entertainment Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Venue Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/newbd.png" alt="Venue Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Hygiene Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-plush.jpg" alt="Hygiene Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Beverage Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-logo1.png" alt="Beverage Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Education Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/kamothe.png" alt="Education Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Zumba Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/zumba patner.jpg" alt="Zumba Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Sports Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-logo21.png" alt="Sports Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Medical Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/2.png" alt="Medical Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Dairy Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/Mumbai 81083 25218 (2).png" alt="Dairy Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Hydration Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-pocari.png" alt="Hydration Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Energy Drink Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/enerzal1.png" alt="Energy Drink Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Beverage Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/yakult1.png" alt="Beverage Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[11px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Snacks Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/cornitos.png" alt="Snacks Partner" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
          {/* Desktop: Sponsors Layout */}
          <div className="hidden sm:block">
            {/* All Sponsors in Single Row including Ammdar */}
            <div className="flex items-center justify-center gap-2 mb-3">
              {/* Ammdar Sponsor - Special Card */}
              <div className="flex items-center gap-4 rounded-xl border-2 border-yellow-500 bg-yellow-50/50 pr-6">
                <div className="h-28 w-32 flex items-center justify-center bg-white rounded-lg p-2">
                  <img src="/ammdar.jpeg" alt="Ammdar Sponsor" className="h-full w-full object-contain" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Proudly Supported By</p>
                  <p className="text-base font-bold text-gray-800 leading-tight">Aamdar Vikrant Dada Patil</p>
                </div>
              </div>
              {/* Title Sponsor */}
              <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/80 p-2 w-36 md:w-44">
                <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Title Sponsor</p>
                <div className="h-14 md:h-18 flex items-center justify-center">
                  <img src="/JP Logo __1_page-0001.jpg" alt="Title Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
              {/* Co Title Sponsor */}
              <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/80 p-2 w-36 md:w-44">
                <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Co Title Sponsor</p>
                <div className="h-14 md:h-18 flex items-center justify-center">
                  <img src="/Mumbai 81083 25218 (1).png" alt="Co Title Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
              {/* Associate Sponsor */}
              <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/80 p-2 w-36 md:w-44">
                <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
                <div className="h-14 md:h-18 flex items-center justify-center">
                  <img src="/1.png" alt="Associate Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
              {/* Associate Sponsor */}
              <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/80 p-2 w-36 md:w-44">
                <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
                <div className="h-14 md:h-18 flex items-center justify-center">
                  <img src="/shreeji.png" alt="Associate Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
            </div>

            {/* Pink Partners - Grid */}
            <div className="grid grid-cols-6 gap-2">
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Technology Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-reliance.jpg" alt="Technology Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/janyafarmsnew.png" alt="Associate Sponsor" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Entertainment Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/Mumbai 81083 25218.png" alt="Entertainment Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Venue Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/newbd.png" alt="Venue Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Hygiene Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-plush.jpg" alt="Hygiene Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Beverage Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-logo1.png" alt="Beverage Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Education Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/kamothe.png" alt="Education Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Zumba Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/zumba patner.jpg" alt="Zumba Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Sports Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-logo21.png" alt="Sports Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Medical Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/2.png" alt="Medical Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Dairy Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/Mumbai 81083 25218 (2).png" alt="Dairy Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Hydration Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-pocari.png" alt="Hydration Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Energy Drink Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/enerzal1.png" alt="Energy Drink Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Beverage Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/yakult1.png" alt="Beverage Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[12px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Snacks Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/cornitos.png" alt="Snacks Partner" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
