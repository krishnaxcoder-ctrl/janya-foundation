'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DonationForm({ onClose }) {
  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    citizenship: 'indian',
    donationType: 'once',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'INDIA',
    panNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const predefinedAmounts = [
    { amount: 100, description: 'Small Gift' },
    { amount: 500, description: 'Starter Gift' },
    { amount: 1000, description: 'Basic Support' },
    { amount: 2000, description: 'Regular Support' },
    { amount: 4000, description: 'Extended Care' },
    { amount: 8000, description: 'Premium Support' },
  ];

  const handleAmountSelect = (amount) => {
    if (formData.amount === amount) {
      setFormData({ ...formData, amount: '', customAmount: '' });
    } else {
      setFormData({ ...formData, amount: amount, customAmount: '' });
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    // Allow any value to be typed, but validate after typing
    setFormData({ ...formData, customAmount: value, amount: value !== '' ? value : '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      pincode: value
    });

    // Implement logic to autofill city and state based on pincode if needed
    // This would require an API call to a pincode service
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const amount = formData.customAmount || formData.amount;

      const response = await axios.post('/api/phonepe', {
        amount: Number(amount),
        notes: {
          donor_name: formData.fullName,
          donor_email: formData.email,
          donor_phone: formData.phone,
          donation_type: formData.donationType,
          citizenship: formData.citizenship,
          address: formData.address,
          pincode: formData.pincode,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pan_number: formData.panNumber
        }
      });

      if (response.data.success && response.data.redirectUrl) {
        // Redirect to PhonePe payment page
        window.location.href = response.data.redirectUrl;
      } else {
        alert(response.data.error || 'Failed to initiate payment. Please try again.');
        setLoading(false);
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Payment failed. Please try again.';
      const errorCode = error.response?.data?.code || '';
      alert(`${errorMsg}${errorCode ? ` (Code: ${errorCode})` : ''}`);
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[2147483647] overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg overflow-hidden w-full mx-auto my-8 max-w-[500px] max-h-[85vh] overflow-y-auto"
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-blue-600">Donate & save tax</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {currentStep === 1 && (
            <>
              {/* Citizenship Selection */}
              <div className="mb-3">
                <label className="text-sm mb-2 flex items-center gap-1 text-gray-700">
                  Citizenship
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setFormData({ ...formData, citizenship: 'indian' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium ${formData.citizenship === 'indian'
                      ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${formData.citizenship === 'indian'
                      ? 'bg-white'
                      : 'border-2 border-gray-400'}`} />
                    Indian Citizen
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, citizenship: 'foreign' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium ${formData.citizenship === 'foreign'
                      ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${formData.citizenship === 'foreign'
                      ? 'bg-white'
                      : 'border-2 border-gray-400'}`} />
                    Foreign Citizen/NRI
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Indian citizen option is for transacting through Indian bank accounts or cards issued by Indian banks.
                </p>
              </div>

              {/* Donation Type */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, donationType: 'once' })}
                  className={`flex-1 py-2 px-4 rounded-md text-sm ${formData.donationType === 'once' ? 'bg-yellow-400 text-black font-medium' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                  Give Once
                </button>
                <button
                  onClick={() => setFormData({ ...formData, donationType: 'monthly' })}
                  className={`flex-1 py-2 px-4 rounded-md text-sm ${formData.donationType === 'monthly' ? 'bg-yellow-400 text-black font-medium' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                  Give Monthly
                </button>
              </div>

              {/* Amount Selection */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm text-gray-700">Choose an amount to donate</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mx-auto max-w-lg">
                  {predefinedAmounts.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleAmountSelect(item.amount)}
                      className={`p-3 rounded-md text-center h-[64px] ${formData.amount === item.amount ? 'bg-yellow-400 shadow-sm' : 'bg-white border border-gray-200 hover:border-yellow-400'}`}
                    >
                      <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-lg font-medium text-gray-800">₹{item.amount.toLocaleString()}</span>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                        {formData.amount === item.amount && (
                          <span className="text-yellow-600 flex-shrink-0 ml-2" title="Click again to unselect">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-3">
                  <label htmlFor="customAmount" className="text-sm text-gray-700 mb-1 block font-medium">Or enter custom amount (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="customAmount"
                    name="customAmount"
                    value={formData.customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount (min ₹10)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  />
                </div>

                {formData.customAmount && (!/^\d+$/.test(formData.customAmount) || Number(formData.customAmount) < 10) && (
                  <p className="text-red-500 text-sm mt-2">
                    Please enter a valid amount of at least ₹10.
                  </p>
                )}
              </div>

              <button
                onClick={handleNextStep}
                disabled={(!formData.amount && !formData.customAmount) ||
                  (formData.customAmount && (!/^\d+$/.test(formData.customAmount) || Number(formData.customAmount) < 10))}
                className={`w-full py-2.5 rounded-md text-white text-sm font-medium ${
                  (formData.amount && formData.amount !== '') ||
                  (formData.customAmount && /^\d+$/.test(formData.customAmount) && Number(formData.customAmount) >= 10)
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 cursor-not-allowed'}`}
              >
                Next to Step 2
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Payment Summary */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Payment Summary
                </h3>

                <div className="flex justify-between items-center py-1 border-b border-blue-100">
                  <span className="text-sm text-gray-700">Amount</span>
                  <span className="text-base font-medium text-gray-800">
                    ₹{(formData.amount && !isNaN(Number(formData.amount))) ? Number(formData.amount).toLocaleString() : '0'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-700">Donation Type</span>
                  <span className="text-sm font-medium text-gray-800 bg-yellow-100 px-2 py-0.5 rounded">
                    {formData.donationType === 'monthly' ? 'Monthly donation' : 'One-time donation'}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 mt-2 border-t border-blue-100">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    ₹{(formData.amount && !isNaN(Number(formData.amount))) ? Number(formData.amount).toLocaleString() : '0'}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Details
              </h3>

              <div className="space-y-3 mb-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="text-xs text-gray-700 mb-1 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                    required
                  />
                </div>

                {/* Two-column layout for Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="text-xs text-gray-700 mb-0.5 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label htmlFor="phone" className="text-xs text-gray-700 mb-0.5 block">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your mobile number"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="text-xs text-gray-700 mb-0.5 block">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                    required
                  />
                </div>

                {/* Two-column layout for Pincode and Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Pincode with autofill message */}
                  <div>
                    <label htmlFor="pincode" className="text-xs text-gray-700 mb-0.5 block">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handlePincodeChange}
                      placeholder="Enter pincode"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-0.5 text-[10px]">
                      Entering Pincode will autofill City and State
                    </p>
                  </div>

                  {/* Country (Fixed as INDIA) */}
                  <div>
                    <label htmlFor="country" className="text-xs text-gray-700 mb-0.5 block">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                    />
                  </div>
                </div>

                {/* Two-column layout for City, State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="text-xs text-gray-700 mb-0.5 block">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="text-xs text-gray-700 mb-0.5 block">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                    />
                  </div>
                </div>

                {/* PAN Number */}
                <div>
                  <label htmlFor="panNumber" className="text-xs text-gray-700 mb-0.5 block">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    id="panNumber"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    placeholder="Enter PAN number"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                  />
                  <p className="text-[10px] text-pink-500 mt-0.5">
                    Please note that if you do not provide your PAN Number, you will not be able to claim 50% tax exemption u/s 80G in India
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={handlePreviousStep}
                  className="w-1/3 py-2 rounded-md text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading || !formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.pincode}
                  className={`w-2/3 py-2 rounded-md text-white text-sm font-medium ${loading || !formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.pincode ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? 'Processing...' : 'Proceed to Pay'}
                </button>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Your donation is secure and encrypted. By continuing, you agree to our terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
