'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function CampaignsSection({ setShowDonationForm }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return (amount / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    }
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const formatFullCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const getProgressPercent = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-2/5 h-64 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-12 bg-gray-200 rounded-xl w-40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-full border border-pink-100/50 mb-6 shadow-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
            <span className="text-pink-700 text-sm font-semibold tracking-wide">Active Campaigns</span>
            <div className="w-px h-4 bg-pink-200"></div>
            <span className="text-pink-600 text-sm font-medium">{campaigns.length} causes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Help Us Save Lives
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Your contribution can transform lives. Support our urgent medical campaigns.
          </p>
        </div>

        {/* Campaigns List */}
        <div className="space-y-8">
          {campaigns.map((campaign, index) => {
            const progress = getProgressPercent(campaign.raised_amount, campaign.goal_amount);
            const remaining = campaign.goal_amount - campaign.raised_amount;

            return (
              <div
                key={campaign.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_40px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 border border-gray-100/80"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="relative w-full lg:w-[45%] h-72 md:h-80 lg:h-auto lg:min-h-[420px] overflow-hidden">
                    <img
                      src={campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                      <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-gray-800 text-xs font-bold rounded-full shadow-lg uppercase tracking-wider">
                        {campaign.category}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-2 uppercase tracking-wider">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Urgent
                      </span>
                    </div>

                    {/* Bottom Info - Mobile */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
                      <h3 className="text-white font-bold text-xl md:text-2xl leading-tight drop-shadow-lg">
                        {campaign.title}
                      </h3>
                    </div>

                    {/* Campaign Number Badge */}
                    <div className="absolute bottom-5 right-5 hidden lg:flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                      <span className="text-white font-bold text-lg">0{index + 1}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full lg:w-[55%] p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
                    {/* Organizer */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-full overflow-hidden shadow-lg border-2 border-pink-100">
                        <img
                          src="/sitelogo.jpg"
                          alt="Janya Foundation"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{campaign.organizer_name}</p>
                        <p className="text-gray-400 text-xs flex items-center gap-1">
                          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Verified Organizer
                        </p>
                      </div>
                    </div>

                    {/* Title - Desktop */}
                    <h3 className="hidden lg:block text-2xl xl:text-3xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
                      {campaign.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm md:text-base mb-6 leading-relaxed line-clamp-3">
                      {campaign.description}
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                      <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">₹{formatCurrency(campaign.raised_amount)}</p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Raised</p>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <p className="text-2xl md:text-3xl font-bold text-gray-900">{campaign.donors_count}</p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Donors</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold text-pink-600">₹{formatCurrency(remaining)}</p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Needed</p>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">{progress.toFixed(1)}% Complete</span>
                        <span className="text-sm text-gray-400">Goal: ₹{formatFullCurrency(campaign.goal_amount)}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer"></div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-base font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                        </svg>
                        Donate Now
                      </Link>
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="inline-flex items-center justify-center gap-2 py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 text-base font-semibold rounded-xl transition-all duration-300"
                      >
                        Learn More
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-14">
          <Link
            href="/campaigns"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            View All Campaigns
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}
