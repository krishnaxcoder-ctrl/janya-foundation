'use client';

import { useState } from 'react';

export default function DonationCampaign({ setShowDonationForm }) {
  const [campaign] = useState({
    goal: 500000,
    totalRaised: 2200,
    donorCount: 4,
    progressPercent: 0.44,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  return (
    <section className="w-full relative z-0">
      <div className="flex flex-col lg:flex-row lg:min-h-screen">

        {/* Left Side - Image */}
        <div
          className="w-full lg:w-1/2 px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-20 lg:px-5 flex flex-col justify-center text-white relative overflow-hidden min-h-[500px] sm:min-h-[550px] lg:min-h-0"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(190,24,93,0.85) 0%, rgba(131,24,67,0.9) 100%), url('https://images.unsplash.com/photo-1644822861254-c99d0022ab70?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Decorative Elements - Hidden on small screens */}
          <div className="hidden sm:block absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="hidden sm:block absolute bottom-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-pink-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="hidden md:block absolute top-20 right-20 w-2 h-2 bg-white/40 rounded-full"></div>
          <div className="hidden md:block absolute top-40 right-32 w-1 h-1 bg-white/30 rounded-full"></div>
          <div className="hidden md:block absolute bottom-32 right-16 w-1.5 h-1.5 bg-white/20 rounded-full"></div>

          {/* Content */}
          <div className="relative z-10 text-left sm:text-center flex flex-col items-start sm:items-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] sm:text-xs font-medium tracking-wider uppercase mb-6 sm:mb-10">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-300 rounded-full animate-pulse"></span>
              Cervical Cancer Awareness
            </span>

            {/* Heading */}
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-light mb-2 sm:mb-3 tracking-tight leading-tight">
              Help Us Raise
            </h2>
            <h2 className="text-4xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 tracking-tight bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
              ₹{formatCurrency(campaign.goal)}
            </h2>

            {/* Progress Bar */}
            <div className="mb-8 sm:mb-10 w-full max-w-md">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xl sm:text-2xl font-semibold text-white">₹{formatCurrency(campaign.totalRaised)}</span>
                <span className="text-sm text-white/60">raised of ₹{formatCurrency(campaign.goal)}</span>
              </div>
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-pink-300 via-pink-200 to-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${campaign.progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs sm:text-sm text-white/70">{campaign.progressPercent.toFixed(1)}% funded</span>
                <span className="text-xs sm:text-sm text-white/70 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                  </svg>
                  {campaign.donorCount} donor{campaign.donorCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-white/80 mb-8 sm:mb-12 max-w-xl font-light leading-relaxed">
              Fund <span className="text-pink-200 font-semibold">HPV vaccinations</span> for underprivileged women. Every donation helps protect lives from cervical cancer.
            </p>

            {/* Quick Facts */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                <span className="text-xs sm:text-sm font-medium">Save Lives</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span className="text-xs sm:text-sm font-medium">99% Effective</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
                <span className="text-xs sm:text-sm font-medium">200 Women</span>
              </div>
            </div>

            {/* Sponsors - 2x2 Grid with Height Difference */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full max-w-md">
              {/* Title Sponsor - Tallest */}
              <div className="flex flex-col border-2 border-yellow-500 rounded-xl p-2 sm:p-3 bg-white">
                <p className="text-[9px] sm:text-xs font-bold text-yellow-700 uppercase tracking-wide text-center mb-1">Title Sponsor</p>
                <div className="flex items-center justify-center h-14 sm:h-20 md:h-24">
                  <img src="/JP Logo __1_page-0001.jpg" alt="Title Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
              {/* Co Title Sponsor - Medium */}
              <div className="flex flex-col border-2 border-yellow-500 rounded-xl p-1.5 sm:p-2.5 bg-white">
                <p className="text-[8px] sm:text-[11px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-1">Co Title Sponsor</p>
                <div className="flex items-center justify-center h-11 sm:h-16 md:h-20">
                  <img src="/Mumbai 81083 25218 (1).png" alt="Co Title Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
              {/* Associate Sponsor - Smaller */}
              <div className="flex flex-col border-2 border-yellow-500 rounded-xl p-1 sm:p-2 bg-white">
                <p className="text-[7px] sm:text-[10px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
                <div className="flex items-center justify-center h-9 sm:h-12 md:h-14">
                  <img src="/1.png" alt="Associate Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
              {/* Associate Sponsor - Smaller */}
              <div className="flex flex-col border-2 border-yellow-500 rounded-xl p-1 sm:p-2 bg-white">
                <p className="text-[7px] sm:text-[10px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
                <div className="flex items-center justify-center h-9 sm:h-12 md:h-14">
                  <img src="/shreeji.png" alt="Associate Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
            </div>

            {/* Mobile CTA Button */}
            <button
              onClick={() => setShowDonationForm(true)}
              className="lg:hidden w-full mt-8 bg-white text-pink-600 text-base sm:text-lg font-semibold py-4 sm:py-5 rounded-full hover:bg-pink-50 transition-all duration-200 shadow-lg active:scale-[0.98]"
            >
              Donate Now
            </button>
          </div>
        </div>

        {/* Right Side - Partners */}
        <div className="w-full lg:w-1/2 bg-white px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-20 lg:px-20 flex flex-col justify-center">

          {/* Partners */}
          <div className="text-center">
            <p className="text-[11px] sm:text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">Sponsored & Supported by</p>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Hydration Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/partner-pocari.png" alt="Hydration Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Technology Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/partner-reliance.jpg" alt="Technology Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Associate Sponsor</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/janyafarmsnew.png" alt="Associate Sponsor" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Beverage Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/partner-logo1.png" alt="Beverage Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Sports Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/partner-logo21.png" alt="Sports Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Hygiene Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/partner-plush.jpg" alt="Hygiene Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Entertainment Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/Mumbai 81083 25218.png" alt="Entertainment Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Education Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/kamothe.png" alt="Education Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Zumba Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/zumba patner.jpg" alt="Zumba Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Venue Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/newbd.png" alt="Venue Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Medical Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/2.png" alt="Medical Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Dairy Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/Mumbai 81083 25218 (2).png" alt="Dairy Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Energy Drink Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/enerzal1.png" alt="Energy Drink Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Beverage Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/yakult1.png" alt="Beverage Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
              <div className="flex flex-col border border-gray-200 rounded-xl p-2 bg-gray-50/50">
                <p className="text-[9px] sm:text-[11px] font-bold text-gray-800 uppercase tracking-wide text-center mb-1">Snacks Partner</p>
                <div className="flex items-center justify-center h-14 sm:h-18 flex-1">
                  <img src="/cornitos.png" alt="Snacks Partner" className="h-full w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Donate Button */}
          <div className="hidden lg:block mt-8 text-center">
            <button
              onClick={() => setShowDonationForm(true)}
              className="bg-pink-600 text-white text-sm font-semibold px-10 py-3 rounded-full hover:bg-pink-700 transition-all duration-200 shadow-lg active:scale-[0.98]"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
