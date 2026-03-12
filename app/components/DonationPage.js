'use client';

import { useState } from 'react';
import Link from 'next/link';
import DonationForm from './DonationForm';
import VolunteerSection from './VolunteerSection';
import Gallery from './Gallery';
import Footer from './Footer';
import Header from './Header';
import HeroSection from './HeroSection';
import FloatingDonateButton from './FloatingDonateButton';
import DonationCampaign from './DonationCampaign';
// import DonationRaising from './Donationraising';

// Stats data - defined outside component for stability
const stats = [
  { value: '1000+', label: 'Lives Impacted' },
  { value: '19', label: 'Programs' },
  { value: '14400+', label: 'Supporters' },
  { value: '₹4L+', label: 'Funds Raised' },
  { value: '12', label: 'Health Camps' },
  { value: '500+', label: 'Volunteers' },
  { value: '50+', label: 'Villages Reached' },
  { value: '100%', label: 'Transparency' },
];

export default function DonationPage() {
  const [showDonationForm, setShowDonationForm] = useState(false);

  const programs = [
    {
      title: 'Cancer Awareness & Prevention',
      description: 'Free breast cancer screenings and HPV vaccination programs for underprivileged women. Early detection saves lives.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-pink-500 to-rose-500',
      stats: '200+ Women Screened',
    },
    {
      title: 'Education & Child Development',
      description: 'Providing school supplies, uniforms, and scholarships to underprivileged children for a brighter future.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-violet-500 to-purple-500',
      stats: '500+ Children Supported',
    },
    {
      title: 'Women Empowerment & Skills',
      description: 'Skill development and income generation programs helping rural women achieve financial independence.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500',
      stats: '150+ Women Trained',
    },
    {
      title: 'Healthcare Access & Camps',
      description: 'Organizing health camps and providing essential medical support to underserved communities.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-teal-500 to-emerald-500',
      stats: '12 Health Camps',
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* Header */}
      <Header setShowDonationForm={setShowDonationForm} />

      {/* Hero Section */}
      <HeroSection setShowDonationForm={setShowDonationForm} />

      

      {/* Mission & Vision */}
      <section className="py-12 md:py-24 px-4 relative overflow-hidden bg-white">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />

        <div className="w-full px-2 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-10 md:mb-16 items-center">
            <div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-medium text-gray-900 leading-tight">
                <span className="sm:hidden">Our Values Drive<br />Meaningful Impact</span>
                <span className="hidden sm:inline">Built on Strong Values & Purpose, Driven by Meaningful Impact</span>
              </h2>
            </div>
            <div className="md:text-right">
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                Every action we take is guided by our core principles. We believe in transparency, compassion, and creating sustainable change.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: 'Our Mission',
                desc: 'Creating lasting change through women empowerment, education, cancer awareness, and accessible healthcare.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                showOnMobile: true,
              },
              {
                title: 'Our Vision',
                desc: 'A society where every woman is empowered, every child educated, and healthcare accessible to all.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
                showOnMobile: true,
              },
              {
                title: 'Our Approach',
                desc: 'Working directly with communities to understand needs and create sustainable, impactful programs.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                showOnMobile: true,
              },
              {
                title: 'Our Promise',
                desc: 'Every rupee goes directly to those in need with 100% transparency and detailed fund reporting.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                showOnMobile: true,
              },
              {
                title: 'Our Impact',
                desc: '1000+ lives transformed, 200+ women screened, and 500+ children supported across rural India.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
                showOnMobile: false,
              },
              {
                title: 'Our Team',
                desc: 'Passionate volunteers and professionals united by the goal of creating positive social change.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                showOnMobile: false,
              },
              {
                title: 'Our Community',
                desc: 'Building strong bonds with 50+ villages, creating networks of support and development.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                showOnMobile: false,
              },
              {
                title: 'Our Future',
                desc: 'Expanding to 100+ villages by 2026 with a goal to impact 10,000+ lives through our programs.',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
                showOnMobile: false,
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`group relative bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:border-transparent overflow-hidden cursor-pointer ${!item.showOnMobile ? 'hidden md:block' : ''}`}
              >
                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="absolute inset-[2px] bg-white rounded-[10px] group-hover:bg-gray-50/95 transition-colors duration-300" />

                {/* Glowing orb effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700 group-hover:scale-150" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-pink-500/30" style={{ backgroundColor: '#FF4191' }}>
                      {item.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-gray-800 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors mb-2 sm:mb-3">
                    {item.desc}
                  </p>
                  <span className="text-xs sm:text-sm font-medium text-pink-500 group-hover:text-pink-600 transition-colors inline-flex items-center gap-1">
                    Read more
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Donation Raising - Hidden for now */}
            {/* <DonationRaising setShowDonationForm={setShowDonationForm} /> */}

      {/* About Section - Hero */}
      <section id="about" className="relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/aboutbg.png')",
            filter: 'hue-rotate(320deg) saturate(1.2)'
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 lg:py-16">
          {/* Badge */}
          <div className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 mb-6 md:mb-8 bg-white rounded-full border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-500">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Empowering communities since 2023</span>
            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-gray-200">
              <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">80G Certified</span>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-5 md:mb-6 max-w-4xl leading-[1.15]">
            <span className="text-black">We believe in</span>{' '}
            <span className="text-black">creating lasting change</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mb-8 md:mb-10 leading-relaxed">
            Janya Foundation is a registered NGO dedicated to transforming lives through healthcare, education, and women empowerment programs. We work tirelessly to create sustainable change in underserved communities across India.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10 md:mb-16">
            <button
              onClick={() => setShowDonationForm(true)}
              className="group inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all shadow-lg w-full sm:w-auto"
              style={{ backgroundColor: "#FF4191" }}
            >
              Donate Now
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: 'Cancer Awareness',
                desc: 'Free breast cancer screenings and HPV vaccination programs for underprivileged women',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                color: 'bg-pink-500',
                gradient: 'from-pink-500 via-rose-500 to-pink-600',
                glow: 'shadow-pink-500/50',
                href: '#programs',
              },
              {
                title: 'Education',
                desc: 'Supporting underprivileged children with school supplies, uniforms & scholarships',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                color: 'bg-blue-500',
                gradient: 'from-blue-500 via-indigo-500 to-blue-600',
                glow: 'shadow-blue-500/50',
                href: '#programs',
              },
              {
                title: 'Women Empowerment',
                desc: 'Skill development and income generation programs for women in rural areas',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                color: 'bg-violet-500',
                gradient: 'from-violet-500 via-purple-500 to-violet-600',
                glow: 'shadow-violet-500/50',
                href: '#programs',
              },
              {
                title: 'Healthcare',
                desc: 'Organizing health camps and providing medical support to underserved communities',
                icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
                color: 'bg-emerald-500',
                gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
                glow: 'shadow-emerald-500/50',
                href: '#programs',
              },
            ].map((item, index) => (
              <a
                key={item.title}
                href={item.href}
                className="group relative bg-white rounded-xl px-4 py-4 border border-gray-100 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:border-transparent overflow-hidden cursor-pointer"
              >
                {/* Animated gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`} />
                <div className="absolute inset-[2px] bg-white rounded-[10px] group-hover:bg-gray-50/95 transition-colors duration-300" />

                {/* Glowing orb effect */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700 group-hover:scale-150`} />

                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${item.glow}`}>
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5 group-hover:text-gray-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                    {item.desc}
                  </p>
                </div>

                {/* Particle dots on hover */}
                <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-current opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:animate-ping" style={{ color: item.color.replace('bg-', '').includes('pink') ? '#ec4899' : item.color.replace('bg-', '').includes('blue') ? '#3b82f6' : item.color.replace('bg-', '').includes('violet') ? '#8b5cf6' : '#10b981' }} />
                <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-current opacity-0 group-hover:opacity-30 transition-all duration-700 delay-100 group-hover:animate-pulse" style={{ color: item.color.replace('bg-', '').includes('pink') ? '#ec4899' : item.color.replace('bg-', '').includes('blue') ? '#3b82f6' : item.color.replace('bg-', '').includes('violet') ? '#8b5cf6' : '#10b981' }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="w-full">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-0">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-white rounded-none p-4 sm:p-6 text-center border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300 ${index >= 6 ? 'hidden md:block' : ''}`}
              >
                <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-500 font-normal uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration & Certifications - Voiceflow Style */}
      <section
        className="py-12 md:py-24 px-4 bg-white relative"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 65, 145, 0.3) 2px, transparent 2px)',
          backgroundSize: '24px 24px'
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Light Hero Card with Image */}
          <div className="bg-white mb-8 sm:mb-12 relative overflow-hidden border border-gray-100 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-0 items-center">
              {/* Left Column - Content */}
              <div className="relative z-10 p-5 sm:p-8 md:p-12 lg:p-16 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-50 rounded-full mb-4 sm:mb-6 border border-pink-100">
                  <div className="w-4 h-4 rounded bg-pink-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-pink-600 text-xs sm:text-sm font-medium">Trust & Credibility</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-3 sm:mb-4" style={{ fontFamily: 'sohne-var, sans-serif' }}>
                  Registered & Certified NGO
                </h2>

                <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
                  Janya Foundation operates with complete transparency and is recognized by government bodies. Your donations are secure and tax-deductible.
                </p>

                <Link
                  href="/transparency"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-pink-500 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-pink-600 transition-all w-full sm:w-auto"
                >
                  View Transparency Report
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Right Column - Image */}
              <div className="relative h-full order-1 lg:order-2 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Books and education"
                  className="w-full h-full object-cover min-h-[250px] lg:min-h-full"
                />
              </div>
            </div>
          </div>

          {/* Features Grid with Dividers */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-0 bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100">
            {[
              {
                title: 'Registered NGO',
                desc: 'Under the Societies Registration Act with full legal compliance.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                title: '80G Certified',
                desc: '50% tax deduction on all donations under Income Tax Act.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                )
              },
              {
                title: 'NGO DARPAN',
                desc: 'Officially registered with NITI Aayog, Government of India.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: 'Full Transparency',
                desc: 'Annual reports and fund utilization publicly available.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-4 sm:p-6 md:p-8 ${index !== 3 ? 'lg:border-r border-gray-100' : ''} ${index % 2 === 0 ? 'border-r border-gray-100 lg:border-r' : ''} ${index < 2 ? 'border-b border-gray-100 lg:border-b-0' : ''} transition-all duration-300 hover:scale-105 hover:bg-pink-50 hover:z-10 cursor-pointer`}
              >
                {/* Icon */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 mb-3 sm:mb-5">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 sm:mb-2" style={{ fontFamily: 'sohne-var, sans-serif' }}>
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section - Sandbar Style */}
      <section
        id="programs"
        className="pt-8 pb-12 sm:pt-10 sm:pb-20 md:pt-16 md:pb-32 px-4 relative"
        style={{
          backgroundImage: 'url(/aboutbg2.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Top border with glow effect */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] animate-pulse"
          style={{
            background: 'linear-gradient(90deg, #FF4191, #ec4899, #FF4191)',
            boxShadow: '0 0 8px rgba(255, 65, 145, 0.4)'
          }}
        />
        {/* Bottom border with glow effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] animate-pulse"
          style={{
            background: 'linear-gradient(90deg, #FF4191, #ec4899, #FF4191)',
            boxShadow: '0 0 8px rgba(255, 65, 145, 0.4)'
          }}
        />
        <div className="max-w-[1400px] mx-auto backdrop-blur-md bg-white/70 p-5 sm:p-8 md:p-12 lg:p-10 border border-white/50 shadow-xl">
          {/* Header */}
          <div className="mb-10 sm:mb-16 md:mb-24">
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 mb-4 sm:mb-6 md:mb-8 bg-white rounded-full border border-gray-200 shadow-sm">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-500">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Our Programs & Initiatives</span>
              <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-gray-200">
                <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">4 Programs</span>
              </div>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 max-w-4xl leading-snug" style={{ fontFamily: 'sohne-var, sans-serif' }}>
              <span className="sm:hidden">Empowering communities through healthcare & education</span>
              <span className="hidden sm:inline">Empowering communities through healthcare, education, and sustainable development programs</span>
            </h2>
          </div>

          {/* 4 Column Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-10 sm:mb-16 md:mb-24">
            {programs.map((program) => (
              <div key={program.title} className="group">
                {/* Top accent line */}
                <div className="h-[2px] bg-gradient-to-r from-pink-500 to-rose-400 mb-4 sm:mb-8 group-hover:from-pink-600 group-hover:to-rose-500 transition-all duration-300" />

                {/* Title */}
                <h3 className="text-pink-600 font-medium text-xs sm:text-sm mb-2 sm:mb-4" style={{ fontFamily: 'sohne-var, sans-serif' }}>
                  <span className="block">{program.title}</span>
                  <span className="block">{program.stats}</span>
                </h3>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {program.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom divider */}
          <div className="h-[1px] bg-gray-300/50 mb-6 sm:mb-8" />

          {/* Bottom checkmarks row */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-x-8 sm:gap-y-4 md:gap-x-12 lg:gap-x-16">
            {[
              'Free Health Camps',
              'Education Support',
              'Women Empowerment',
              'Cancer Screenings',
              'Skill Training',
              'Community Outreach'
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-800 text-xs sm:text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Campaign */}
      <DonationCampaign setShowDonationForm={setShowDonationForm} />



      {/* Gallery Section */}
      <section id="gallery">
        <Gallery />
      </section>

      {/* Volunteer Section - Removed from homepage per user request */}
      {/* <section id="volunteer">
        <VolunteerSection />
      </section> */}

      {/* Floating donation button */}
      <FloatingDonateButton onClick={() => setShowDonationForm(true)} />

      {/* Footer */}
      <Footer />

      {/* Donation Form Modal */}
      {showDonationForm && <DonationForm onClose={() => setShowDonationForm(false)} />}
    </div>
  );
}
