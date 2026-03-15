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
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const getProgressPercent = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) return null;

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full border border-pink-100 mb-4">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            <span className="text-pink-600 text-sm font-medium">Active Campaigns</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Help Us Make a Difference
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Support our ongoing campaigns and help transform lives. Every contribution counts.
          </p>
        </div>

        {/* Campaigns Grid - All Large Cards */}
        <div className="grid grid-cols-1 gap-8">
          {campaigns.map((campaign) => {
            const progress = getProgressPercent(campaign.raised_amount, campaign.goal_amount);

            return (
              <div
                key={campaign.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-pink-200 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="relative w-full lg:w-1/2 h-64 md:h-80 lg:h-96 overflow-hidden">
                    <img
                      src={campaign.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'}
                      alt={campaign.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-semibold rounded-full">
                        {campaign.category}
                      </span>
                    </div>

                    {/* Urgency Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        Urgent
                      </span>
                    </div>

                    {/* Title Overlay - Mobile Only */}
                    <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                      <h3 className="text-white font-semibold leading-tight text-xl md:text-2xl">
                        {campaign.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    {/* Title - Desktop */}
                    <h3 className="hidden lg:block text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {campaign.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
                      {campaign.description}
                    </p>

                    {/* Progress Section */}
                    <div className="mb-6">
                      <div className="flex justify-between items-baseline mb-3">
                        <span className="text-2xl md:text-3xl font-bold text-gray-900">
                          ₹{formatCurrency(campaign.raised_amount)}
                        </span>
                        <span className="text-sm md:text-base text-gray-500">
                          of ₹{formatCurrency(campaign.goal_amount)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">{progress.toFixed(1)}% raised</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                          </svg>
                          {campaign.donors_count} donor{campaign.donors_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="block w-full text-center py-4 bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      Donate Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-pink-500 text-pink-600 font-semibold rounded-full hover:bg-pink-500 hover:text-white transition-all duration-200"
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
