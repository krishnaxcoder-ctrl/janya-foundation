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

  const getProgressPercent = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-80 h-52 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-7 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-11 bg-gray-200 rounded-lg w-32"></div>
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
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-pink-50 text-pink-600 text-sm font-medium rounded-full mb-4">
            Active Campaigns
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Help Us Save Lives
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Your contribution can transform lives. Support our urgent campaigns.
          </p>
        </div>

        {/* Campaigns List */}
        <div className="space-y-6">
          {campaigns.map((campaign) => {
            const progress = getProgressPercent(campaign.raised_amount, campaign.goal_amount);
            const remaining = campaign.goal_amount - campaign.raised_amount;

            return (
              <div
                key={campaign.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-80 h-56 md:h-auto md:min-h-[280px] flex-shrink-0">
                    <img
                      src={campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                        {campaign.category}
                      </span>
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Urgent
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 md:p-8">
                    {/* Organizer */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="/sitelogo.jpg"
                        alt="Janya Foundation"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{campaign.organizer_name}</p>
                        <p className="text-xs text-gray-400">Verified Organizer</p>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-5 line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-5">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <div>
                          <span className="text-lg font-bold text-gray-900">₹{formatCurrency(campaign.raised_amount)}</span>
                          <span className="text-gray-400 text-sm ml-1">raised</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-500 text-sm">₹{formatCurrency(remaining)} needed</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {campaign.donors_count} supporters
                      </span>
                      <button
                        onClick={() => setShowDonationForm(true)}
                        className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Donate Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            View All Campaigns
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
