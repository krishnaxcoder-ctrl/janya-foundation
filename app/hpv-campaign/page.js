'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HPVCampaignContent() {
  const searchParams = useSearchParams();
  const [campaign, setCampaign] = useState({
    goal: 500000,
    totalRaised: 0,
    donorCount: 0,
    progressPercent: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'INDIA',
    pan_number: '',
    is_anonymous: false,
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Verify payment if redirected from PhonePe
  useEffect(() => {
    const transactionId = searchParams.get('transactionId');
    const verify = searchParams.get('verify');

    if (transactionId && verify) {
      verifyPayment(transactionId);
    }
  }, [searchParams]);

  const verifyPayment = async (transactionId) => {
    try {
      const donorInfo = JSON.parse(sessionStorage.getItem('campaignDonorInfo') || '{}');

      const response = await fetch('/api/campaign/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          ...donorInfo,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus({
          type: 'success',
          message: `Thank you for your donation of ₹${data.amount?.toLocaleString('en-IN')}!`,
          transactionId,
        });
        sessionStorage.removeItem('campaignDonorInfo');
        fetchCampaignStats();
      } else {
        setPaymentStatus({
          type: 'pending',
          message: 'Payment is being processed. Please check back later.',
          transactionId,
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus({
        type: 'error',
        message: 'Could not verify payment. Please contact support.',
      });
    }
  };

  const fetchCampaignStats = async () => {
    try {
      const response = await fetch('/api/campaign/stats');
      const data = await response.json();

      if (data.success) {
        setCampaign(data.campaign);
        setRecentDonations(data.recentDonations);
      }
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignStats();
  }, []);

  // Auto-fill city and state from pincode
  const handlePincodeChange = async (pincode) => {
    setFormData(prev => ({ ...prev, pincode }));

    if (pincode.length === 6) {
      setPincodeLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setFormData(prev => ({
            ...prev,
            city: postOffice.District || '',
            state: postOffice.State || '',
          }));
        }
      } catch (error) {
        console.error('Pincode lookup error:', error);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const amount = formData.amount === 'custom' ? Number(formData.customAmount) : Number(formData.amount);

    if (!amount || amount < 10) {
      alert('Please enter a valid amount (minimum ₹10)');
      setSubmitting(false);
      return;
    }

    try {
      // Save donor info for after payment
      sessionStorage.setItem('campaignDonorInfo', JSON.stringify({
        donor_name: formData.donor_name,
        donor_email: formData.donor_email,
        donor_phone: formData.donor_phone,
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pan_number: formData.pan_number,
        is_anonymous: formData.is_anonymous,
        message: formData.message,
      }));

      const response = await fetch('/api/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          donor_name: formData.donor_name,
          donor_email: formData.donor_email,
          donor_phone: formData.donor_phone,
          address: formData.address,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pan_number: formData.pan_number,
          is_anonymous: formData.is_anonymous,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert(data.error || 'Failed to initiate payment');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Payment Status Banner */}
      {paymentStatus && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg ${
          paymentStatus.type === 'success' ? 'bg-green-500 text-white' :
          paymentStatus.type === 'error' ? 'bg-red-500 text-white' :
          'bg-yellow-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {paymentStatus.type === 'success' && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <div>
              <p className="font-medium">{paymentStatus.message}</p>
              {paymentStatus.transactionId && (
                <p className="text-sm opacity-90">Transaction ID: {paymentStatus.transactionId}</p>
              )}
            </div>
            <button onClick={() => setPaymentStatus(null)} className="ml-4 hover:opacity-80">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 px-6 text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(190,24,93,0.9) 0%, rgba(131,24,67,0.95) 100%), url('https://images.unsplash.com/photo-1644822861254-c99d0022ab70?q=80&w=1170&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-medium tracking-wider uppercase mb-6">
            <span className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"></span>
            HPV Vaccination Campaign
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Help Us Protect <span className="text-pink-200">200 Women</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Fund HPV vaccinations for underprivileged women. Every donation helps prevent cervical cancer and save lives.
          </p>

          {/* Progress Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto">
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-3xl sm:text-4xl font-bold">{formatCurrency(campaign.totalRaised)}</span>
              <span className="text-white/70">raised of {formatCurrency(campaign.goal)}</span>
            </div>

            <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-pink-300 via-pink-200 to-white rounded-full transition-all duration-1000"
                style={{ width: `${campaign.progressPercent}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-white/70">
              <span>{campaign.progressPercent.toFixed(1)}% funded</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                {campaign.donorCount} donors
              </span>
            </div>

            <button
              onClick={() => setShowDonationForm(true)}
              className="w-full mt-6 bg-white text-pink-600 font-semibold py-4 rounded-full hover:bg-pink-50 transition-colors"
            >
              Donate Now
            </button>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-pink-50 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">99% Effective</h3>
              <p className="text-gray-600 text-sm">HPV vaccine prevents 99% of cervical cancer cases when given before exposure</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">200 Women</h3>
              <p className="text-gray-600 text-sm">Our goal is to vaccinate 200 underprivileged women in rural areas</p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">₹2,000 per vaccine</h3>
              <p className="text-gray-600 text-sm">Each donation of ₹2,000 provides complete HPV vaccination for one woman</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donations */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">Recent Donations</h2>

          {loading ? (
            <div className="text-center py-10">
              <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : recentDonations.length > 0 ? (
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {donation.is_anonymous ? '?' : donation.display_name?.charAt(0)?.toUpperCase() || 'D'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {donation.is_anonymous ? 'Anonymous' : donation.display_name}
                      </span>
                      <span className="text-pink-600 font-semibold whitespace-nowrap">
                        {formatCurrency(donation.amount)}
                      </span>
                    </div>
                    {donation.message && (
                      <p className="text-gray-500 text-sm mt-1 truncate">{donation.message}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">{formatTimeAgo(donation.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Be the first to donate to this campaign!</p>
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => setShowDonationForm(true)}
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium px-10 py-4 rounded-full hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg shadow-pink-200"
            >
              Make a Donation
            </button>
          </div>
        </div>
      </section>

      {/* Donation Form Modal */}
      {showDonationForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Make a Donation</h3>
                <button
                  onClick={() => setShowDonationForm(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleDonate} className="space-y-4">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Amount</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData({ ...formData, amount: amt.toString(), customAmount: '' })}
                        className={`py-3 rounded-lg font-medium transition-all ${
                          formData.amount === amt.toString()
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: 'custom' })}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        formData.amount === 'custom'
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                  {formData.amount === 'custom' && (
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={formData.customAmount}
                      onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      min="10"
                      required
                    />
                  )}
                </div>

                {/* Personal Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.donor_name}
                    onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.donor_email}
                    onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.donor_phone}
                    onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      pattern="[0-9]{6}"
                      required
                    />
                    {pincodeLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Entering Pincode will autofill City and State</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                  <input
                    type="text"
                    placeholder="Enter PAN number"
                    value={formData.pan_number}
                    onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase().slice(0, 10) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    Please note that if you do not provide your PAN Number, you will not be able to claim 50% tax exemption u/s 80G in India
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows="2"
                    placeholder="Leave a message of support..."
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous}
                    onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-600">Donate anonymously</span>
                </label>

                <button
                  type="submit"
                  disabled={submitting || (!formData.amount || (formData.amount === 'custom' && !formData.customAmount))}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium py-4 rounded-full hover:from-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Donate ${formData.amount && formData.amount !== 'custom' ? `₹${Number(formData.amount).toLocaleString()}` : formData.customAmount ? `₹${Number(formData.customAmount).toLocaleString()}` : ''}`
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Secure payment powered by PhonePe. You will receive an 80G tax exemption certificate.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function HPVCampaignPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    }>
      <HPVCampaignContent />
    </Suspense>
  );
}
