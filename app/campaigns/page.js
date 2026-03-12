'use client';

import { useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Footer from '../components/Footer';

// bundle-dynamic-imports: Load DonotionForm and SubmissionForm only when needed
const DonationForm = dynamic(() => import('../components/DonationForm'), { ssr: false });
const CampaignSubmissionForm = dynamic(() => import('../components/CampaignSubmissionForm'), { ssr: false });

const CAMPAIGNS = [
  {
    id: 1,
    title: "Urgent: N8 Cochlear Processor Upgrade for 7-year-old Suyash",
    description: "Suyash Bedekar needs an urgent upgrade to the N8 Cochlear Processor to continue his education. Production for his current device has stopped, making this upgrade critical for his hearing and future.",
    image: "/child.png",
    raised: 154200,
    goal: 1396500,
    percentage: 11,
    category: "Medical Help",
    donors: 86
  },
  {
    id: 2,
    title: "Protect a Life: HPV Vaccinations for Underprivileged Women",
    description: "Every donation helps fund critical HPV vaccinations for underprivileged women, protecting them from the risk of cervical cancer and ensuring a healthier future.",
    image: "https://images.unsplash.com/photo-1644822861254-c99d0022ab70?q=80&w=1170&auto=format&fit=crop&q=80",
    raised: 2200,
    goal: 500000,
    percentage: 0.44,
    category: "Cervical Cancer Awareness",
    donors: 4
  },
  {
    id: 3,
    title: "Fight Against Leukemia: Support Darshana's Life-Saving Treatment",
    description: "Mrs. Darshana Padwal, 53, is fighting Acute Myeloid Leukemia (AML). She needs urgent medical intervention and supportive care to overcome this critical battle for her life.",
    image: "/800000/WhatsApp Image 2026-03-03 at 8.17.19 PM (1).jpeg",
    raised: 45000,
    goal: 800000,
    percentage: 5,
    category: "Medical Relief",
    donors: 12
  },
  {
    id: 4,
    title: "Critical Care: Urgent Medical Support for an Elderly Mother",
    description: "This elderly patient is currently in intensive care, requiring specialized medical procedures and round-the-clock monitoring to recover from a severe health crisis.",
    image: "/1200000/WhatsApp Image 2026-03-03 at 8.16.40 PM.jpeg",
    raised: 120000,
    goal: 1200000,
    percentage: 10,
    category: "Intensive Care",
    donors: 28
  }
];

const STATS = [
  { value: '1000+', label: 'Lives Impacted' },
  { value: '500+', label: 'Monthly Meals' },
  { value: '25+', label: 'Scholarships' },
  { value: '100%', label: 'Transparency' },
];

const BackgroundDecoration = memo(() => (
  <>
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuchsia-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
    <div 
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}
    />
  </>
));
BackgroundDecoration.displayName = 'BackgroundDecoration';

const CampaignCard = memo(({ campaign, onDonate }) => (
  <div className="group bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1 cursor-pointer outline-none focus-within:ring-2 focus-within:ring-[#e90074] rounded-none">
    <div className="relative">
      <div className="relative h-72 w-full overflow-hidden rounded-none">
        <img src={campaign.image} alt={campaign.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4">
          <div className="backdrop-blur-md bg-white/20 border border-white/30 text-white text-[10px] font-semibold px-4 py-2 rounded-none uppercase tracking-wide shadow-sm">
            {campaign.category}
          </div>
        </div>
      </div>
    </div>
    <div className="px-8 pt-6 pb-8 flex flex-col flex-grow">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#e90074] transition-colors duration-300">
          {campaign.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {campaign.description}
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Raised</span>
              <div className="text-lg font-bold text-gray-900">₹{campaign.raised.toLocaleString()}</div>
            </div>
            <div className="text-xl font-bold text-[#e90074]">{campaign.percentage}%</div>
          </div>
          <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="absolute h-full left-0 top-0 bg-gradient-to-r from-[#e90074] to-pink-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${campaign.percentage}%` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            <span>{campaign.donors} Donors</span>
            <span>Goal: ₹{campaign.goal.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onDonate(); }}
        className="w-full bg-gray-900 text-white font-semibold py-4 rounded-none transition-all hover:bg-[#e90074] shadow-xl hover:shadow-[#e90074]/30 active:scale-[0.98] text-xs uppercase tracking-wide mt-auto"
      >
        Join Campaign
      </button>
    </div>
  </div>
));
CampaignCard.displayName = 'CampaignCard';

export default function CampaignsPage() {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-pink-100 selection:text-[#e90074]">
      <Header setShowDonationForm={setShowDonationForm} />
      
      <main className="flex-grow pt-14 sm:pt-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 border-b border-gray-100">
          <BackgroundDecoration />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16 text-left">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="mb-10">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-pink-100/50 backdrop-blur-sm rounded-full border border-pink-200/50">
                    <div className="flex h-2 w-2 relative">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
                    </div>
                    <span className="text-sm font-medium text-pink-700">Ongoing Initiatives</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'sohne-var, sans-serif' }}>
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500">Campaigns</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">Empower change one gift at a time. Help us create a lasting impact across education, health, and empowerment.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 sm:gap-12 justify-start">
                {STATS.map((stat) => (
                  <div key={stat.label} className="group">
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 group-hover:text-pink-500 transition-colors duration-300">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Current Initiatives</h2>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Join 50+ Organizers</p>
                <p className="text-xs font-semibold text-gray-600">Start your own impact</p>
              </div>
              <button 
                onClick={() => setShowSubmissionForm(true)}
                className="group relative inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white font-bold overflow-hidden transition-all rounded-none"
              >
                <span className="absolute inset-0 bg-[#e90074] transition-all translate-y-full group-hover:translate-y-0 -z-10" />
                <span className="relative flex items-center gap-2 uppercase tracking-widest text-[10px]">
                  Start a Fundraiser
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-gray-100">
            {CAMPAIGNS.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onDonate={() => setShowDonationForm(true)} />
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-12 p-10 bg-gray-50 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Have a cause that needs support?</h3>
              <p className="text-sm text-gray-500 font-medium tracking-tight">Join our growing community of 50+ organizers making an impact.</p>
            </div>
            <button 
              onClick={() => setShowSubmissionForm(true)}
              className="group relative inline-flex items-center justify-center px-10 py-4 bg-gray-900 text-white font-bold overflow-hidden transition-all rounded-none w-full md:w-auto"
            >
              <span className="absolute inset-0 bg-[#e90074] transition-all translate-y-full group-hover:translate-y-0 -z-10" />
              <span className="relative flex items-center gap-2 uppercase tracking-widest text-xs">
                Start a Fundraiser
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              </span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
      {showDonationForm && <DonationForm onClose={() => setShowDonationForm(false)} />}
      {showSubmissionForm && <CampaignSubmissionForm onClose={() => setShowSubmissionForm(false)} />}

      <style jsx global>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(500%); } }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
        @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
