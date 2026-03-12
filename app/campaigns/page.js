'use client';

import { useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import Footer from '../components/Footer';

// bundle-dynamic-imports: Load DonotionForm only when needed
const DonationForm = dynamic(() => import('../components/DonationForm'), {
  ssr: false,
});

const CAMPAIGNS = [
  {
    id: 1,
    title: "Unlock a Dream — Sponsor a Scholar",
    description: "Empower talented students from low-income families by funding their higher education and professional training.",
    image: "https://images.unsplash.com/photo-1523050853063-bd42da239b2a?auto=format&fit=crop&q=80&w=800",
    raised: 312217,
    goal: 999999,
    percentage: 31,
    category: "Education",
    donors: 142
  },
  {
    id: 2,
    title: "Eat Well — Healthy Meals for Kids",
    description: "Provide nutritious daily meals to children in primary schools, ensuring no child studies on an empty stomach.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
    raised: 2045683,
    goal: 2500000,
    percentage: 82,
    category: "Nutrition",
    donors: 856
  },
  {
    id: 3,
    title: "Green Wheels for Mobile Support",
    description: "Funding logistics and distribution vans to deliver critical aid and educational tools to remote tribal areas.",
    image: "https://images.unsplash.com/photo-1533903345306-15d1c30952de?auto=format&fit=crop&q=80&w=800",
    raised: 1199979,
    goal: 2000000,
    percentage: 60,
    category: "Impact",
    donors: 324
  }
];

const STATS = [
  { value: '1000+', label: 'Lives Impacted' },
  { value: '500+', label: 'Monthly Meals' },
  { value: '25+', label: 'Scholarships' },
  { value: '100%', label: 'Transparency' },
];

// rendering-hoist-jsx: Extract background to separate component
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

// rerender-memo: Extract card to memoized component
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
    <div className="px-8 pt-4 pb-8 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#e90074] transition-colors duration-300 line-clamp-2 h-14">
        {campaign.title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 h-20">
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
      <button 
        onClick={(e) => { e.stopPropagation(); onDonate(); }}
        className="w-full bg-gray-900 text-white font-semibold py-4 rounded-none transition-all hover:bg-[#e90074] shadow-xl hover:shadow-[#e90074]/30 active:scale-[0.98] text-xs uppercase tracking-wide"
      >
        Join Campaign
      </button>
    </div>
  </div>
));
CampaignCard.displayName = 'CampaignCard';

export default function CampaignsPage() {
  const [showDonationForm, setShowDonationForm] = useState(false);
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
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed mb-10">Empower change one gift at a time. Help us create a lasting impact across education, health, and empowerment.</p>
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

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-gray-100">
            {CAMPAIGNS.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onDonate={() => setShowDonationForm(true)} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      {showDonationForm ? <DonationForm onClose={() => setShowDonationForm(false)} /> : null}

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
