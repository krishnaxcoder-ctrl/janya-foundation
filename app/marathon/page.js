'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DonationForm from '../components/DonationForm';
import PartnersAndHelp from '../components/PartnersAndHelp';

// Competitive race IDs (for coupon restriction)
const COMPETITIVE_RACE_IDS = ['5km', '10km', '21km'];

// Default race card images
const DEFAULT_RACE_IMAGES = [
  'https://demo.deverust.com/endurix/wp-content/uploads/sites/53/2025/04/IMG-H89DCQR.jpg',
  'https://demo.deverust.com/endurix/wp-content/uploads/sites/53/2025/04/IMG-KDUB3A7.jpg',
  'https://demo.deverust.com/endurix/wp-content/uploads/sites/53/2025/04/IMG-8YQ53CG.jpg'
];

// Get a consistent random image based on race ID (so it doesn't change on re-render)
const getDefaultImage = (raceId) => {
  const hash = raceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return DEFAULT_RACE_IMAGES[hash % DEFAULT_RACE_IMAGES.length];
};

export default function MarathonRegistration() {
  const currentYear = new Date().getFullYear();

  // Redirect to homepage per user request
  useEffect(() => {
    window.location.replace("/");
  }, []);

  const [showDonationForm, setShowDonationForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRace, setSelectedRace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponDiscountType, setCouponDiscountType] = useState('fixed');
  const [couponPercent, setCouponPercent] = useState(0);
  const [couponDiscountByRace, setCouponDiscountByRace] = useState(null);
  const [couponFinalPriceByRace, setCouponFinalPriceByRace] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [showPostponedPopup, setShowPostponedPopup] = useState(true);
  const [raceOptions, setRaceOptions] = useState([]);
  const [racesLoading, setRacesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    tshirtSize: '',
    address: '',
    pincode: '',
    email: '',
    phone: '',
    emergencyPhone: '',
    couponCode: '',
    termsAccepted: false
  });

  // Fetch races from database on mount
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await axios.get('/api/races');
        if (response.data.success && response.data.races) {
          // Transform database fields to component format
          const races = response.data.races.map(race => ({
            id: race.id,
            distance: race.distance,
            name: race.name,
            price: race.price,
            originalPrice: race.original_price || null,
            description: race.description || '',
            category: race.category || 'competitive',
            isRunForCause: race.is_run_for_cause || false,
            isKidsRun: race.is_kids_run || false,
            isDonation: race.is_donation || false,
            isTest: race.is_test || false,
            minAge: race.min_age || 5,
            maxAge: race.max_age || 100,
            isSoldOut: race.is_sold_out || false,
            imageUrl: race.image_url || getDefaultImage(race.id)
          }));
          setRaceOptions(races);
        }
      } catch (error) {
        console.error('Failed to fetch races:', error);
      } finally {
        setRacesLoading(false);
      }
    };
    fetchRaces();
  }, []);

  // Filter races by category
  const nonCompetitiveRaces = raceOptions.filter(r => r.category === 'non-competitive' && !r.isTest);
  const competitiveRaces = raceOptions.filter(r => r.category === 'competitive' && !r.isTest && !r.isKidsRun);
  const kidsRaces = raceOptions.filter(r => (r.category === 'kids' || r.isKidsRun) && !r.isTest);
  const donationRaces = raceOptions.filter(r => r.category === 'donation' && !r.isTest);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showPostponedPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showPostponedPopup]);

  const CONVENIENCE_FEE_PERCENT = 3.5;

  // Helper to check if a race is sold out
  const isRaceSoldOut = (raceId) => {
    const race = raceOptions.find(r => r.id === raceId);
    return race?.isSoldOut || false;
  };

  // Helper to get race price from database
  const getRacePrice = (raceId) => {
    const race = raceOptions.find(r => r.id === raceId);
    return race?.price || 0;
  };

  const selectedRaceData = raceOptions.find(r => r.id === selectedRace);
  const originalBasePrice = selectedRaceData?.price || 0;

  // For raceFinalPrice coupon, use the final price as base price
  const basePrice = (couponApplied && couponDiscountType === 'raceFinalPrice' && couponFinalPriceByRace?.[selectedRace])
    ? couponFinalPriceByRace[selectedRace]
    : originalBasePrice;

  // Convenience fee is calculated on the effective base price (3% for RAF100 type coupons)
  const effectiveConvenienceFeePercent = (couponApplied && couponDiscountType === 'raceFinalPrice') ? 3 : CONVENIENCE_FEE_PERCENT;
  const convenienceFee = Math.round(basePrice * effectiveConvenienceFeePercent / 100);

  const calculatedDiscount = couponApplied
    ? (couponDiscountType === 'percent'
        ? Math.round(originalBasePrice * couponPercent / 100)
        : couponDiscountType === 'raceFixed'
          ? (couponDiscountByRace?.[selectedRace] || 0)
          : couponDiscountType === 'raceFinalPrice'
            ? (originalBasePrice - (couponFinalPriceByRace?.[selectedRace] || originalBasePrice))  // Savings = original - final price
            : couponDiscount)
    : 0;
  const discount = calculatedDiscount;

  // For raceFinalPrice, total = finalPrice + convenienceFee (no discount subtraction needed)
  const totalAmount = (couponApplied && couponDiscountType === 'raceFinalPrice')
    ? basePrice + convenienceFee
    : Math.max(0, originalBasePrice + convenienceFee - discount);

  const applyCoupon = async () => {
    const code = formData.couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code');
      setCouponApplied(false);
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const response = await axios.post('/api/coupon/check', {
        couponCode: code
      });

      if (response.data.valid) {
        const discType = response.data.discountType || 'fixed';

        // Check valid_race_ids restriction from DB
        const validRaceIds = response.data.validRaceIds;
        if (validRaceIds && validRaceIds.length > 0 && !validRaceIds.includes(selectedRace)) {
          setCouponApplied(false);
          setCouponDiscount(0);
          setCouponDiscountType('fixed');
          setCouponPercent(0);
          setCouponDiscountByRace(null);
          setCouponFinalPriceByRace(null);
          setCouponError('This coupon is not valid for the selected race');
          return;
        }

        // Check competitive_only restriction
        if (response.data.competitiveOnly && !COMPETITIVE_RACE_IDS.includes(selectedRace)) {
          setCouponApplied(false);
          setCouponDiscount(0);
          setCouponDiscountType('fixed');
          setCouponPercent(0);
          setCouponDiscountByRace(null);
          setCouponFinalPriceByRace(null);
          setCouponError('This coupon is only valid for competitive timed races');
          return;
        }

        setCouponApplied(true);
        setCouponDiscountType(discType);
        if (discType === 'percent') {
          setCouponPercent(response.data.percent);
          setCouponDiscount(0);
          setCouponDiscountByRace(null);
          setCouponFinalPriceByRace(null);
        } else if (discType === 'raceFixed') {
          setCouponDiscountByRace(response.data.discountByRace);
          setCouponFinalPriceByRace(null);
          setCouponDiscount(0);
          setCouponPercent(0);
        } else if (discType === 'raceFinalPrice') {
          setCouponFinalPriceByRace(response.data.finalPriceByRace);
          setCouponDiscountByRace(null);
          setCouponDiscount(0);
          setCouponPercent(0);
        } else {
          const discountAmount = response.data.discount || 100;
          setCouponDiscount(discountAmount);
          setCouponPercent(0);
          setCouponDiscountByRace(null);
          setCouponFinalPriceByRace(null);
        }
        setCouponError('');
      } else {
        setCouponApplied(false);
        setCouponDiscount(0);
        setCouponDiscountType('fixed');
        setCouponPercent(0);
        setCouponDiscountByRace(null);
        setCouponFinalPriceByRace(null);
        setCouponError(response.data.error || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponDiscountType('fixed');
      setCouponPercent(0);
      setCouponDiscountByRace(null);
      setCouponFinalPriceByRace(null);
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponDiscountType('fixed');
    setCouponPercent(0);
    setCouponDiscountByRace(null);
    setCouponFinalPriceByRace(null);
    setCouponError('');
    setFormData(prev => ({ ...prev, couponCode: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'emergencyPhone' && value && formData.phone === value) {
      setErrors(prev => ({ ...prev, emergencyPhone: 'Emergency contact must be different from your phone number' }));
    } else if (name === 'phone' && value && formData.emergencyPhone === value) {
      setErrors(prev => ({ ...prev, emergencyPhone: 'Emergency contact must be different from your phone number' }));
    } else if (name === 'emergencyPhone' || name === 'phone') {
      setErrors(prev => ({ ...prev, emergencyPhone: '' }));
    }
  };

  const goToStep2 = () => {
    if (selectedRace) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBackToStep1 = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate individual field
  const validateField = (name, value, race = null, isDonation = false) => {
    switch (name) {
      case 'name':
        if (!value || value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return 'Name can only contain letters, spaces, hyphens and apostrophes';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^\d{10}$/.test(value)) return 'Please enter a valid 10-digit phone number';
        return '';
      case 'emergencyPhone':
        if (!isDonation && !value) return 'Emergency contact is required';
        if (value && !/^\d{10}$/.test(value)) return 'Please enter a valid 10-digit number';
        if (value && value === formData.phone) return 'Emergency contact must be different from your phone number';
        return '';
      case 'dateOfBirth':
        if (!isDonation && !value) return 'Date of birth is required';
        if (value && race) {
          const today = new Date();
          const dob = new Date(value);
          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
          const minAge = race.minAge || 5;
          const maxAge = race.maxAge || 100;
          if (age < minAge || age > maxAge) return `Age must be between ${minAge} and ${maxAge} years for ${race.distance}`;
        }
        return '';
      case 'gender':
        if (!isDonation && !value) return 'Please select gender';
        return '';
      case 'tshirtSize':
        if (!isDonation && !value) return 'Please select T-shirt size';
        return '';
      case 'address':
        if (!isDonation && (!value || value.trim().length < 5)) return 'Please enter your address';
        return '';
      case 'pincode':
        if (!isDonation && !value) return 'Pincode is required';
        if (!isDonation && !/^\d{6}$/.test(value)) return 'Please enter a valid 6-digit pincode';
        return '';
      case 'termsAccepted':
        if (!value) return 'You must accept the Terms and Conditions';
        return '';
      default:
        return '';
    }
  };

  // Handle field blur for validation
  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const race = raceOptions.find(r => r.id === selectedRace);
    const isDonation = race?.isDonation;
    const error = validateField(name, type === 'checkbox' ? checked : value, race, isDonation);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate entire form
  const validateForm = () => {
    const race = raceOptions.find(r => r.id === selectedRace);
    const isDonation = race?.isDonation;
    const newErrors = {};

    newErrors.name = validateField('name', formData.name);
    newErrors.email = validateField('email', formData.email);
    newErrors.phone = validateField('phone', formData.phone);
    newErrors.termsAccepted = validateField('termsAccepted', formData.termsAccepted);

    if (!isDonation) {
      newErrors.emergencyPhone = validateField('emergencyPhone', formData.emergencyPhone, race, isDonation);
      newErrors.dateOfBirth = validateField('dateOfBirth', formData.dateOfBirth, race, isDonation);
      newErrors.gender = validateField('gender', formData.gender, race, isDonation);
      newErrors.tshirtSize = validateField('tshirtSize', formData.tshirtSize, race, isDonation);
      newErrors.address = validateField('address', formData.address, race, isDonation);
      newErrors.pincode = validateField('pincode', formData.pincode, race, isDonation);
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    const race = raceOptions.find(r => r.id === selectedRace);
    const isDonation = race?.isDonation;

    if (!selectedRace) {
      alert('Please select an option');
      return;
    }

    // Run full validation
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.text-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    try {
      // For raceFinalPrice, use the final price as base and 3% fee
      const isRaceFinalPrice = couponApplied && couponDiscountType === 'raceFinalPrice' && couponFinalPriceByRace?.[race.id];
      const effectiveBasePrice = isRaceFinalPrice ? couponFinalPriceByRace[race.id] : race.price;
      const effectiveFeePercent = isRaceFinalPrice ? 3 : CONVENIENCE_FEE_PERCENT;
      const fee = Math.round(effectiveBasePrice * effectiveFeePercent / 100);

      const appliedDiscount = (couponApplied && !isDonation)
        ? (couponDiscountType === 'percent'
            ? Math.round(race.price * couponPercent / 100)
            : couponDiscountType === 'raceFixed'
              ? (couponDiscountByRace?.[race.id] || 0)
              : couponDiscountType === 'raceFinalPrice'
                ? (race.price - effectiveBasePrice)  // Discount = original price - final price
                : couponDiscount)
        : 0;

      // For raceFinalPrice, total = finalPrice + fee (no discount subtraction)
      const total = isRaceFinalPrice
        ? effectiveBasePrice + fee
        : Math.max(0, race.price + fee - appliedDiscount);

      const participantData = isDonation ? {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        isDonation: true,
        raceId: race.id,
        raceCategory: race.distance,
        donationAmount: race.price,
        convenienceFee: fee,
        couponCode: null,
        couponDiscount: 0,
        totalAmount: total
      } : {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        emergencyPhone: formData.emergencyPhone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        tshirtSize: formData.tshirtSize,
        address: formData.address,
        pincode: formData.pincode,
        raceId: race.id,
        raceCategory: race.distance,
        raceName: race.name,
        isRunForCause: race.isRunForCause || false,
        raceType: race.isRunForCause ? 'No Competition' : 'Competition',
        amount: effectiveBasePrice,  // Use effective base price (final price for raceFinalPrice coupon)
        originalAmount: race.price,  // Store original price for reference
        convenienceFee: fee,
        couponCode: couponApplied ? formData.couponCode.toUpperCase() : null,
        couponDiscount: appliedDiscount,
        totalAmount: total
      };
      sessionStorage.setItem('marathonParticipantData', JSON.stringify(participantData));

      const response = await axios.post('/api/marathon', {
        amount: total,
        participantData: participantData
      });

      if (response.data.success && response.data.redirectUrl) {
        if (couponApplied && formData.couponCode && !isDonation) {
          try {
            await axios.post('/api/coupon/record', {
              couponCode: formData.couponCode.toUpperCase(),
              phone: formData.phone,
              email: formData.email,
              name: formData.name,
              transactionId: response.data.transactionId || null,
              amountDiscounted: appliedDiscount
            });
          } catch (couponError) {
            console.error('Failed to record coupon usage:', couponError);
          }
        }
        window.location.href = response.data.redirectUrl;
      } else {
        alert(response.data.error || 'Failed to initiate payment. Please try again.');
        setLoading(false);
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Payment failed. Please try again.';
      alert(errorMsg);
      setLoading(false);
    }
  };

  // Reusable check icon
  const CheckIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  // Reusable selection indicator
  const SelectionDot = ({ selected, color = 'pink' }) => {
    const colors = {
      pink: { active: 'border-pink-500 bg-pink-500', inactive: 'border-white/60 bg-white/10' },
      green: { active: 'border-white bg-white text-green-600', inactive: 'border-white/60 bg-white/10' },
      amber: { active: 'border-amber-500 bg-amber-500', inactive: 'border-white/60 bg-white/10' },
    };
    const c = colors[color] || colors.pink;
    return (
      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selected ? c.active : c.inactive}`}>
        {selected && <CheckIcon className={`w-3.5 h-3.5 ${color === 'green' ? 'text-green-600' : 'text-white'}`} />}
      </div>
    );
  };

  // Prize row component
  const PrizeRow = ({ place, amount, color }) => {
    const bgMap = { gold: 'bg-yellow-400', silver: 'bg-gray-300', bronze: 'bg-amber-500' };
    const ringMap = { gold: 'bg-yellow-50 border-yellow-100', silver: 'bg-gray-50 border-gray-100', bronze: 'bg-orange-50 border-orange-100' };
    return (
      <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${ringMap[color]}`}>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 ${bgMap[color]} rounded-full flex items-center justify-center`}>
            <span className="text-white text-[9px] font-black">{place}</span>
          </div>
          <span className="text-gray-700 text-xs font-medium">{place} Place</span>
        </div>
        <span className="text-gray-900 font-bold text-sm">{amount}</span>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Postponed Announcement Popup */}
      {showPostponedPopup && (
        <div className="fixed inset-0 z-[9999] flex sm:items-center sm:justify-center bg-black/60 backdrop-blur-sm sm:p-4">
          <div className="bg-white sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-sm overflow-y-auto sm:max-h-[90vh]">
              {/* Top Banner */}
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 px-6 py-6 text-center relative overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={() => setShowPostponedPopup(false)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-8 -top-8 w-32 h-32 border-[16px] border-white rounded-full" />
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 border-[10px] border-white rounded-full" />
                </div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-white text-lg font-bold">Date Updated</h2>
                  <p className="text-white/70 text-xs mt-0.5">Marathon has been rescheduled</p>
                  {/* PM Visit Message (commented out)
                  <div className="mt-3 bg-white rounded-lg px-4 py-3 shadow-lg">
                    <p className="text-gray-700 text-xs font-medium leading-relaxed">Due to the visit of <span className="text-orange-600 font-bold">Honorable PM Shri Narendra Modi</span> & <span className="text-orange-600 font-bold">Shri Amit Shah</span> to Kharghar, the marathon date has been rescheduled due to security arrangements.</p>
                  </div>
                  */}
                </div>
              </div>

              {/* Content */}
              <div className="px-5 py-5">
                {/* Date Change - Old version with strikethrough (commented out)
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-center flex-1">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">Previous</p>
                    <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-3">
                      <p className="text-red-400 text-xl font-bold line-through">1 Mar</p>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-[9px] text-emerald-600 uppercase font-bold tracking-wider mb-1.5">New Date</p>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-3">
                      <p className="text-emerald-600 text-xl font-bold">8 March</p>
                    </div>
                  </div>
                </div>
                */}

                {/* Date */}
                <div className="flex items-center justify-center mb-4">
                  <div className="text-center">
                    <p className="text-[9px] text-emerald-600 uppercase font-bold tracking-wider mb-1.5">Marathon Date</p>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-6 py-3">
                      <p className="text-emerald-600 text-xl font-bold">8 March</p>
                    </div>
                  </div>
                </div>

                {/* Schedule Items */}
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Registration Deadline', value: '5th March, 2:00 PM' },
                    { label: 'BIB Collection (All Races)', value: '6 Mar (4-9 PM) & 7 Mar (1-9 PM), Decathlon Belapur' },
                    { label: 'Marathon Day', value: '8th March, 5:00 AM' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                      <p className="text-gray-600 text-xs">
                        <span className="font-semibold text-gray-800">{item.label}:</span> {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Prize Money - mobile only */}
                <div className="sm:hidden bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden mb-4">
                  <div className="w-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏆</span>
                      <span className="text-white text-sm font-bold">Prize Money</span>
                      <span className="text-white/70 text-[10px]"> Age Categories: 16-30 | 31-40 | 41-50 | 51+</span>
                    </div>
                  </div>
                  <div className="px-3 py-3 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">21.1 KM</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[{ place: '1st', amount: '₹5,000', bg: 'bg-yellow-50', border: 'border-yellow-100', badge: 'bg-yellow-400' }, { place: '2nd', amount: '₹3,000', bg: 'bg-gray-50', border: 'border-gray-100', badge: 'bg-gray-300' }, { place: '3rd', amount: '₹2,500', bg: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-amber-500' }].map((p) => (
                          <div key={p.place} className={`flex flex-col items-center py-1.5 rounded-lg border ${p.bg} ${p.border}`}>
                            <div className={`w-5 h-5 ${p.badge} rounded-full flex items-center justify-center mb-0.5`}>
                              <span className="text-white text-[8px] font-black">{p.place}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-[11px]">{p.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">10 KM</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[{ place: '1st', amount: '₹4,000', bg: 'bg-yellow-50', border: 'border-yellow-100', badge: 'bg-yellow-400' }, { place: '2nd', amount: '₹2,500', bg: 'bg-gray-50', border: 'border-gray-100', badge: 'bg-gray-300' }, { place: '3rd', amount: '₹2,000', bg: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-amber-500' }].map((p) => (
                          <div key={p.place} className={`flex flex-col items-center py-1.5 rounded-lg border ${p.bg} ${p.border}`}>
                            <div className={`w-5 h-5 ${p.badge} rounded-full flex items-center justify-center mb-0.5`}>
                              <span className="text-white text-[8px] font-black">{p.place}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-[11px]">{p.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">5 KM</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[{ place: '1st', amount: '₹4,000', bg: 'bg-yellow-50', border: 'border-yellow-100', badge: 'bg-yellow-400' }, { place: '2nd', amount: '₹2,500', bg: 'bg-gray-50', border: 'border-gray-100', badge: 'bg-gray-300' }, { place: '3rd', amount: '₹2,000', bg: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-amber-500' }].map((p) => (
                          <div key={p.place} className={`flex flex-col items-center py-1.5 rounded-lg border ${p.bg} ${p.border}`}>
                            <div className={`w-5 h-5 ${p.badge} rounded-full flex items-center justify-center mb-0.5`}>
                              <span className="text-white text-[8px] font-black">{p.place}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-[11px]">{p.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 font-bold text-sm">Registration Closed</span>
                  </div>
                  <p className="text-red-600 text-xs">
                    The registration deadline (5th March, 2:00 PM) has passed. Thank you for your interest!
                  </p>
                </div>

                <p className="text-gray-400 text-[11px] text-center mb-4">
                  Thank you for your support! See you at the marathon on 8th March.
                </p>

                <button
                  onClick={() => setShowPostponedPopup(false)}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
          </div>
        </div>
      )}

      {/* Header */}
      <Header setShowDonationForm={setShowDonationForm} />

      {/* Hero Section - Compact Light Mode */}
      <div className="relative mt-[60px] bg-gradient-to-r from-white via-pink-50/30 to-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Title & Meta */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 shadow-lg shadow-pink-200/50 shrink-0">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                    Registrations Closed
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
                  Janya Foundation Half Marathon
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs sm:text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-gray-800">8th March 2026</span>
                  </span>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Kharghar, Navi Mumbai</span>
                  </span>
                </div>
              </div>
            </div>
            {/* Right: CTA Button - Registration Closed */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Registration Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Row */}
      <div className="relative bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {/* Mobile: Ammdar above grid */}
          <div className="flex justify-center mb-4 sm:hidden">
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

          {/* Mobile: grid */}
          <div className="grid grid-cols-3 gap-1 sm:hidden">
            {/* Golden Sponsors */}
            <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/50 p-1.5">
              <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Title Sponsor</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/JP Logo __1_page-0001.jpg" alt="Title Sponsor" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/50 p-1.5">
              <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Co Title Sponsor</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/Mumbai 81083 25218 (1).png" alt="Co Title Sponsor" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/50 p-1.5">
              <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/1.png" alt="Associate Sponsor" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/50 p-1.5">
              <p className="text-[9px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/shreeji.png" alt="Associate Sponsor" className="h-full w-full object-contain" />
              </div>
            </div>
            {/* Pink Partners */}
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Technology Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-reliance.jpg" alt="Technology Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/janyafarmsnew.png" alt="Associate Sponsor" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Entertainment Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/Mumbai 81083 25218.png" alt="Entertainment Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Venue Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/newbd.png" alt="Venue Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Hygiene Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-plush.jpg" alt="Hygiene Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Beverage Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-logo1.png" alt="Beverage Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Education Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/kamothe.png" alt="Education Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Zumba Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/zumba patner.jpg" alt="Zumba Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Sports Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-logo21.png" alt="Sports Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Medical Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/2.png" alt="Medical Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Dairy Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/Mumbai 81083 25218 (2).png" alt="Dairy Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Hydration Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/partner-pocari.png" alt="Hydration Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Energy Drink Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/enerzal1.png" alt="Energy Drink Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Beverage Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/yakult1.png" alt="Beverage Partner" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
              <p className="text-[9px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Snacks Partner</p>
              <div className="h-14 flex items-center justify-center flex-1">
                <img src="/cornitos.png" alt="Snacks Partner" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
          {/* Desktop: 2-column layout (20% Ammdar | 80% other logos) */}
          <div className="hidden sm:flex gap-3">
            {/* Ammdar - 20% */}
            <div className="w-[20%] flex items-center justify-center">
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-yellow-500 bg-yellow-50/50 p-2 h-full">
                <div className="flex-1 w-full flex items-center justify-center">
                  <img src="/ammdar.jpeg" alt="Ammdar Sponsor" className="h-full w-full object-contain" />
                </div>
                <p className="text-xs font-semibold text-yellow-700 text-center mt-1.5 leading-tight">supported by<br /><span className="font-bold">Aamdar Vikrant Dada Patil</span></p>
              </div>
            </div>
            {/* Other logos - 80% */}
            <div className="w-[80%] grid grid-cols-7 gap-2">
              {/* Golden Sponsors */}
              <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/50 p-1.5">
                <p className="text-[8px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Title Sponsor</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/JP Logo __1_page-0001.jpg" alt="Title Sponsor" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/50 p-1.5">
                <p className="text-[8px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Co Title Sponsor</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/Mumbai 81083 25218 (1).png" alt="Co Title Sponsor" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/50 p-1.5">
                <p className="text-[8px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/1.png" alt="Associate Sponsor" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border-2 border-yellow-500 bg-yellow-50/50 p-1.5">
                <p className="text-[8px] font-bold text-yellow-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/shreeji.png" alt="Associate Sponsor" className="h-full w-full object-contain" />
                </div>
              </div>
              {/* Pink Partners */}
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Technology Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-reliance.jpg" alt="Technology Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Associate Sponsor</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/janyafarmsnew.png" alt="Associate Sponsor" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Entertainment Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/Mumbai 81083 25218.png" alt="Entertainment Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Venue Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/newbd.png" alt="Venue Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Hygiene Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-plush.jpg" alt="Hygiene Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Beverage Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-logo1.png" alt="Beverage Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Education Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/kamothe.png" alt="Education Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Zumba Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/zumba patner.jpg" alt="Zumba Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Sports Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-logo21.png" alt="Sports Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Medical Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/2.png" alt="Medical Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Dairy Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/Mumbai 81083 25218 (2).png" alt="Dairy Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Hydration Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/partner-pocari.png" alt="Hydration Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Energy Drink Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/enerzal1.png" alt="Energy Drink Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Beverage Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/yakult1.png" alt="Beverage Partner" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-pink-200 bg-pink-50/50 p-1.5">
                <p className="text-[8px] font-bold text-pink-700 uppercase tracking-wide text-center mb-0.5">Snacks Partner</p>
                <div className="h-12 flex items-center justify-center flex-1">
                  <img src="/cornitos.png" alt="Snacks Partner" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Deadline Banner */}
      <div className="bg-rose-50 border-b border-rose-200/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          {/* Desktop: single row */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <p className="text-sm font-medium text-red-700">
                Last date to register: <span className="font-bold">5th March, 2:00 PM</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>Age: <span className="font-bold text-gray-800">16-30 / 31-40 / 41-50 / 51+</span></span>
            </div>
          </div>
          {/* Mobile: stacked two rows */}
          <div className="flex sm:hidden items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              <p className="text-[11px] font-semibold text-red-700 leading-tight">
                Deadline: <span className="font-bold">5th March, 2 PM</span>
              </p>
            </div>
            <div className="h-3 w-px bg-red-200 flex-shrink-0" />
            <div className="flex items-center gap-1 flex-shrink-0">
              <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="text-[11px] font-semibold text-gray-600">16-30 / 31-40 / 41-50 / 51+</span>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* STEP 1: Choose Distance - REGISTRATION CLOSED */}
        {currentStep === 1 && (
          <div>
            {/* Registration Closed Message */}
            <div className="max-w-2xl mx-auto py-12">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Registration Closed</h2>
                  <p className="text-white/80 text-sm">The registration deadline has passed</p>
                </div>

                {/* Content */}
                <div className="px-6 py-8">
                  <div className="text-center mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      The registration deadline for <span className="font-semibold text-gray-800">Janya Foundation Half Marathon 2026</span> was <span className="font-semibold text-red-600">5th March, 2:00 PM</span>.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      We are no longer accepting new registrations.
                    </p>
                  </div>

                  {/* Important Dates */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Important Information for Registered Participants</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                        <p className="text-gray-600">
                          <span className="font-medium text-gray-800">BIB Collection:</span> 6 Mar (4-9 PM) & 7 Mar (1-9 PM) at Decathlon Belapur
                        </p>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                        <p className="text-gray-600">
                          <span className="font-medium text-gray-800">Marathon Day:</span> 8th March, 5:00 AM at Kharghar
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-3">Have questions? Contact us</p>
                    <a
                      href="https://wa.me/919321496142"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp Support
                    </a>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <p className="text-center text-gray-500 text-xs">
                    Thank you for your interest in Janya Foundation Half Marathon. See you on 8th March!
                  </p>
                </div>
              </div>
            </div>

            <>
            <div className="hidden flex gap-8 overflow-hidden">
              {/* Left - Race Options */}
              <div className="flex-1 space-y-4">

                {/* ── COMPETITIVE HEADER ── */}
                <div id="competitive-races" className="flex items-center gap-3 mb-1 scroll-mt-20">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Competitive</h2>
                  <span className="bg-pink-100 text-pink-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Timed & Prizes</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>

                {/* ── TIMED COMPETITIVE RACES ── */}
                <section>
                  <div className="flex items-center gap-3 mb-4">

                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* TEST CARD - Competitive (Commented out)
                  <div className="mb-4 p-3 bg-orange-50 border-2 border-dashed border-orange-400 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-400 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded">TEST ONLY</span>
                      <span className="text-orange-700 text-xs font-medium">0 KM Competitive (Timed) - ₹1</span>
                    </div>
                    <button
                      onClick={() => setSelectedRace('test-competitive')}
                      className={`w-full relative rounded-xl overflow-hidden h-[120px] group text-left transition-all duration-300 ${
                        selectedRace === 'test-competitive' ? 'ring-2 ring-orange-400 shadow-lg' : 'shadow-sm hover:shadow-md border border-orange-300'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500" />
                      <div className="relative h-full p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="bg-black/20 text-white text-[10px] font-bold px-2 py-1 rounded">FOR TESTING</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRace === 'test-competitive' ? 'bg-white border-white' : 'border-white/50'}`}>
                            {selectedRace === 'test-competitive' && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-white/80 text-[10px] font-bold uppercase">Test Competitive (Timed)</p>
                            <p className="text-white text-2xl font-bold">0 KM</p>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-1.5">
                            <span className="text-orange-600 text-lg font-bold">₹1</span>
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ${selectedRace === 'test-competitive' ? 'max-h-14 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      <button onClick={goToStep2} className="w-full py-2.5 rounded-lg text-sm font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                        Continue (Test)
                      </button>
                    </div>
                  </div>
                  */}

                  {competitiveRaces.length > 0 ? (
                  <div className="space-y-6">
                    {competitiveRaces.map((race) => (
                      <div key={race.id}>
                        {/* Prize Money Banner - Compact */}
                        {(race.distance === '5 KM' || race.distance === '10 KM' || race.distance === '21.1 KM') && (
                          <div className={`mb-2 rounded-lg overflow-hidden flex items-center ${
                            race.distance === '10 KM' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                            race.distance === '5 KM' ? 'bg-gradient-to-r from-violet-500 to-purple-500' :
                            'bg-gradient-to-r from-emerald-500 to-teal-500'
                          }`}>
                            <div className="flex items-center gap-2 px-3 py-2.5 flex-1">
                              <img src="/trophy-gold.png" alt="Trophy" className="w-7 h-7 object-contain" />
                              <span className="text-white font-semibold text-sm">Prize Money</span>
                            </div>
                            <div className="flex items-center gap-4 px-3 py-2.5 bg-white/10">
                              <div className="flex items-center gap-1.5">
                                <img src="/trophy-gold.png" alt="1st" className="w-6 h-6 object-contain" />
                                <div className="flex flex-col">
                                  <span className="text-white/60 text-[9px] font-medium leading-none">1st</span>
                                  <span className="text-white font-bold text-sm leading-tight">₹{race.distance === '10 KM' ? '4K' : race.distance === '5 KM' ? '4K' : '5K'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <img src="/trophy-gold.png" alt="2nd" className="w-6 h-6 object-contain" />
                                <div className="flex flex-col">
                                  <span className="text-white/60 text-[9px] font-medium leading-none">2nd</span>
                                  <span className="text-white font-bold text-sm leading-tight">₹{race.distance === '10 KM' ? '2.5K' : race.distance === '5 KM' ? '2.5K' : '3K'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <img src="/trophy-gold.png" alt="3rd" className="w-6 h-6 object-contain" />
                                <div className="flex flex-col">
                                  <span className="text-white/60 text-[9px] font-medium leading-none">3rd</span>
                                  <span className="text-white font-bold text-sm leading-tight">₹{race.distance === '10 KM' ? '2K' : race.distance === '5 KM' ? '2K' : '2.5K'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => !race.isSoldOut && setSelectedRace(race.id)}
                          disabled={race.isSoldOut}
                          className={`w-full relative rounded-xl overflow-hidden h-[220px] sm:h-[260px] group text-left transition-all duration-300 ${
                            race.isSoldOut ? 'opacity-60 cursor-not-allowed' :
                            selectedRace === race.id ? 'ring-2 ring-pink-400 shadow-lg shadow-pink-100' : 'shadow-sm hover:shadow-md border border-gray-200/80'
                          }`}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url('${race.imageUrl}')` }}
                          />
                          <div className={`absolute inset-0 ${race.isSoldOut ? 'bg-gray-900/70' : 'bg-gradient-to-t from-black/75 via-black/25 to-black/5'}`} />
                          {race.isSoldOut && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <span className="bg-red-600 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-lg">SOLD OUT</span>
                            </div>
                          )}
                          <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between">
                            <SelectionDot selected={selectedRace === race.id} color="pink" />
                            <div className="flex items-end justify-between gap-4">
                              <div>
                                <p className="text-pink-300 text-[10px] font-bold uppercase tracking-wider mb-0.5">{race.name}</p>
                                <p className="text-white text-2xl sm:text-5xl font-bold tracking-tight">{race.distance}</p>
                                <p className="text-white/80 text-sm mt-0.5">{race.description || 'With time chip & winning prize'}</p>
                                {race.distance === '21.1 KM' && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/30">
                                      16-30
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/30">
                                      31-40
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/30">
                                      41-50
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/30">
                                      51+
                                    </span>
                                    <span className="text-white/60 text-[9px]">Age Categories</span>
                                  </div>
                                )}
                                {(race.distance === '5 KM' || race.distance === '10 KM') && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/30">
                                      16-30
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/30">
                                      31-40
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/30">
                                      41-50
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/30">
                                      51+
                                    </span>
                                    <span className="text-white/60 text-[9px]">Age Categories</span>
                                  </div>
                                )}
                              </div>
                              <div className="relative flex-shrink-0 group">
                                {/* Animated glow effect */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>

                                {/* Main card */}
                                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                                  {/* Top ribbon */}
                                  {race.originalPrice && (
                                    <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 py-1 px-3">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <svg className="w-3 h-3 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                        <span className="text-amber-900 text-[10px] font-black uppercase tracking-wide">Save ₹{race.originalPrice - race.price}</span>
                                        <svg className="w-3 h-3 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                      </div>
                                    </div>
                                  )}

                                  {/* Price section */}
                                  <div className="px-3 py-2 text-center bg-gradient-to-b from-white to-gray-50">
                                    {race.originalPrice && (
                                      <div className="inline-flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full mb-1">
                                        <span className="text-red-400 text-xs line-through font-medium">₹{race.originalPrice}</span>
                                        <span className="text-red-500 text-[9px] font-bold">-{Math.round((1 - race.price / race.originalPrice) * 100)}%</span>
                                      </div>
                                    )}
                                    <div className="flex items-start justify-center">
                                      <span className="text-gray-400 text-sm  mt-1">₹</span>
                                      <span className="text-gray-900 text-[20px] font-semibold tracking-tighter">{race.price}</span>
                                    </div>
                                    <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                      <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                      </span>
                                      <span className="text-emerald-700 text-[10px] font-bold uppercase">Limited Offer</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-200 ease-out ${selectedRace === race.id && !race.isSoldOut ? 'max-h-14 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                          <button
                            onClick={goToStep2}
                            className="w-full py-3 rounded-lg text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                          >
                            Continue to Step 2
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No competitive races available at this time.</p>
                  )}
                </section>

                {/* ── NON-COMPETITIVE HEADER ── */}
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Non-Competitive</h2>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Fun & Cause</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs">
                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Fun Race
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Health Activities
                  </span>
                </div>

                {/* ── RUN FOR CAUSE ── */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-200/60">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      RUN FOR CAUSE
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <p className="text-xs text-gray-500 mb-4">No prize, No chip | Includes T-shirt, Medal, E-certificate & Refreshment</p>

                  {/* TEST CARD - Non-Competitive (Commented out)
                  <div className="mb-4 p-3 bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded">TEST ONLY</span>
                      <span className="text-yellow-700 text-xs font-medium">0 KM Non-Competitive - ₹1</span>
                    </div>
                    <button
                      onClick={() => setSelectedRace('test-non-competitive')}
                      className={`w-full relative rounded-xl overflow-hidden h-[120px] group text-left transition-all duration-300 ${
                        selectedRace === 'test-non-competitive' ? 'ring-2 ring-yellow-400 shadow-lg' : 'shadow-sm hover:shadow-md border border-yellow-300'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500" />
                      <div className="relative h-full p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="bg-black/20 text-white text-[10px] font-bold px-2 py-1 rounded">FOR TESTING</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRace === 'test-non-competitive' ? 'bg-white border-white' : 'border-white/50'}`}>
                            {selectedRace === 'test-non-competitive' && <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />}
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-white/80 text-[10px] font-bold uppercase">Test Non-Competitive</p>
                            <p className="text-white text-2xl font-bold">0 KM</p>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-1.5">
                            <span className="text-yellow-600 text-lg font-bold">₹1</span>
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ${selectedRace === 'test-non-competitive' ? 'max-h-14 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      <button onClick={goToStep2} className="w-full py-2.5 rounded-lg text-sm font-bold bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">
                        Continue (Test)
                      </button>
                    </div>
                  </div>
                  */}

                  {nonCompetitiveRaces.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {nonCompetitiveRaces.map((race) => (
                      <div key={race.id}>
                        <button
                          onClick={() => !race.isSoldOut && setSelectedRace(race.id)}
                          disabled={race.isSoldOut}
                          className={`w-full relative rounded-xl overflow-hidden h-[180px] group text-left transition-all duration-300 ${
                            race.isSoldOut ? 'opacity-60 cursor-not-allowed' :
                            selectedRace === race.id ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-100' : 'shadow-sm hover:shadow-md border border-gray-200/80'
                          }`}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url('${race.imageUrl}')` }}
                          />
                          <div className={`absolute inset-0 ${race.isSoldOut ? 'bg-gray-900/70' : 'bg-gradient-to-t from-emerald-900/80 via-emerald-800/30 to-black/10'}`} />
                          {race.isSoldOut && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">SOLD OUT</span>
                            </div>
                          )}
                          <div className="relative h-full p-4 flex flex-col justify-between">
                            <SelectionDot selected={selectedRace === race.id} color="green" />
                            <div>
                              <p className="text-white text-2xl font-bold">{race.distance}</p>
                              <div className="mt-1.5 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1">
                                {race.originalPrice && (
                                  <span className="text-white/60 text-sm line-through">₹{race.originalPrice}</span>
                                )}
                                <span className="text-white text-base font-bold">₹{race.price}</span>
                              </div>
                            </div>
                            <p className="absolute bottom-4 right-4 text-white text-sm font-bold uppercase tracking-wider">{race.name}</p>
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-200 ease-out ${selectedRace === race.id && !race.isSoldOut ? 'max-h-14 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                          <button
                            onClick={goToStep2}
                            className="w-full py-2.5 rounded-lg text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No non-competitive races available at this time.</p>
                  )}
                </section>

                {/* ── KIDS SPECIAL ── */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-amber-200/60">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      KIDS SPECIAL
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {kidsRaces.length > 0 ? (
                    <div className="space-y-3">
                      {kidsRaces.map((race) => (
                        <div key={race.id}>
                          <button
                            onClick={() => !race.isSoldOut && setSelectedRace(race.id)}
                            disabled={race.isSoldOut}
                            className={`w-full relative rounded-xl overflow-hidden h-[220px] group text-left transition-all duration-300 ${
                              race.isSoldOut ? 'opacity-60 cursor-not-allowed' :
                              selectedRace === race.id ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-100' : 'shadow-sm hover:shadow-md border border-gray-200/80'
                            }`}
                          >
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                              style={{ backgroundImage: `url('${race.imageUrl}')` }}
                            />
                            <div className={`absolute inset-0 ${race.isSoldOut ? 'bg-gray-900/70' : 'bg-gradient-to-t from-amber-900/80 via-amber-800/25 to-black/5'}`} />
                            {race.isSoldOut && (
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                <span className="bg-red-600 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-lg">SOLD OUT</span>
                              </div>
                            )}
                            <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between">
                              <div className="flex items-start justify-between">
                                <SelectionDot selected={selectedRace === race.id} color="amber" />
                                <div className="flex gap-1">
                                  <span className="bg-yellow-400/90 backdrop-blur-sm text-yellow-900 px-2 py-0.5 rounded-full text-[9px] font-bold">1st</span>
                                  <span className="bg-gray-300/90 backdrop-blur-sm text-gray-700 px-2 py-0.5 rounded-full text-[9px] font-bold">2nd</span>
                                  <span className="bg-amber-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[9px] font-bold">3rd</span>
                                </div>
                              </div>
                              <div className="flex items-end justify-between gap-4">
                                <div>
                                  <p className="text-amber-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">{race.name}</p>
                                  <p className="text-white text-2xl sm:text-4xl font-bold">Ages {race.minAge}-{race.maxAge}</p>
                                  <p className="text-white/80 text-sm mt-0.5">{race.description || 'Surprise gifts for top 3 winners'}</p>
                                </div>
                                <div className="bg-white rounded-xl px-4 py-2.5 shadow-lg flex-shrink-0">
                                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Price</p>
                                  <span className="text-gray-900 text-xl font-bold">₹{race.price}</span>
                                  <span className="text-gray-400 text-xs ml-0.5">/kid</span>
                                </div>
                              </div>
                            </div>
                          </button>
                          <div className={`overflow-hidden transition-all duration-200 ease-out ${selectedRace === race.id && !race.isSoldOut ? 'max-h-14 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                            <button
                              onClick={goToStep2}
                              className="w-full py-3 rounded-lg text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                            >
                              Continue to Step 2
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No kids races available at this time.</p>
                  )}

                  {/* ── Kids Test 0 KM Card (hidden) ──
                  <div className="mt-3">
                    <button
                      onClick={() => setSelectedRace('test-kids')}
                      className={`w-full relative rounded-xl overflow-hidden h-[180px] group text-left transition-all duration-300 ${
                        selectedRace === 'test-kids' ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-100' : 'shadow-sm hover:shadow-md border border-gray-200/80'
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1472162072942-cd5147eb3902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 via-amber-800/25 to-black/5" />
                      <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between">
                        <SelectionDot selected={selectedRace === 'test-kids'} color="amber" />
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-amber-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">Kids Test Run</p>
                            <p className="text-white text-2xl sm:text-4xl font-bold">0 KM</p>
                            <p className="text-white/80 text-sm mt-0.5">For testing only</p>
                          </div>
                          <div className="bg-white rounded-xl px-4 py-2.5 shadow-lg flex-shrink-0">
                            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Price</p>
                            <span className="text-gray-900 text-xl font-bold">₹1</span>
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ease-out ${selectedRace === 'test-kids' ? 'max-h-14 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                      <button
                        onClick={goToStep2}
                        className="w-full py-3 rounded-lg text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                      >
                        Continue to Step 2
                      </button>
                    </div>
                  </div>
                  ── */}
                </section>

                {/* ── DONATIONS ── */}
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-purple-200/60">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      DONATE
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Support our cause without running</p>

                  {donationRaces.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {donationRaces.map((race) => (
                      <div key={race.id}>
                        <button
                          onClick={() => !race.isSoldOut && setSelectedRace(race.id)}
                          disabled={race.isSoldOut}
                          className={`w-full relative rounded-xl overflow-hidden h-[160px] group text-left transition-all duration-300 ${
                            race.isSoldOut ? 'opacity-60 cursor-not-allowed' :
                            selectedRace === race.id ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-100' : 'shadow-sm hover:shadow-md border border-gray-200/80'
                          }`}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url('${race.imageUrl}')` }}
                          />
                          <div className={`absolute inset-0 ${race.isSoldOut ? 'bg-gray-900/70' : 'bg-gradient-to-t from-purple-900/70 via-purple-800/25 to-black/5'}`} />
                          {race.isSoldOut && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">UNAVAILABLE</span>
                            </div>
                          )}
                          <div className="relative h-full p-4 flex flex-col justify-between">
                            <SelectionDot selected={selectedRace === race.id} color="pink" />
                            <div>
                              <p className="text-purple-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">Donate</p>
                              <p className="text-white text-2xl font-bold">₹{race.price}</p>
                            </div>
                          </div>
                        </button>
                        <div className={`overflow-hidden transition-all duration-200 ease-out ${selectedRace === race.id && !race.isSoldOut ? 'max-h-14 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                          <button
                            onClick={goToStep2}
                            className="w-full py-2.5 rounded-lg text-sm font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                          >
                            Continue to Donate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No donation options available at this time.</p>
                  )}
                </section>

                {/* ── EVENT SCHEDULE ── */}
                <section className="mt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-gray-200">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      SCHEDULE
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                    {[
                      { date: '6', month: 'Mar', title: 'BIB Collection - All Races', desc: 'Collect your race BIB and event t-shirt', time: '4:00 PM - 9:00 PM', location: 'Decathlon, Belapur', color: 'bg-gray-800' },
                      { date: '7', month: 'Mar', title: 'BIB Collection - All Races', desc: 'Collect your race BIB and event t-shirt', time: '1:00 PM - 9:00 PM', location: 'Decathlon, Belapur', color: 'bg-gray-800' },
                      { date: '5', month: 'Mar', title: 'Registration Deadline', desc: 'Last date to register for the marathon', time: '2:00 PM', location: 'Closes', color: 'bg-red-500', highlight: true },
                      { date: '8', month: 'Mar', title: 'Marathon Day', desc: 'The main event! 3KM, 5KM, 10KM & 21.1KM', time: '5:00 AM', location: 'BD Somani International School, Sector 27', color: 'bg-pink-500' },
                      { date: '8', month: 'Mar', title: 'Award Ceremony & Celebration', desc: 'Winners announcement, medals & certificates', time: '10:00 AM', location: 'Main Stage', color: 'bg-gray-800' },
                    ].map((event, i) => (
                      <div key={i} className={`flex items-center gap-4 px-4 py-3.5 transition-colors ${event.highlight ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                        <div className={`${event.color} text-white rounded-lg py-2 px-2.5 text-center min-w-[54px] flex-shrink-0`}>
                          <p className="text-base font-bold leading-none">{event.date}</p>
                          <p className="text-[10px] uppercase mt-0.5 opacity-80">{event.month}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-sm truncate ${event.highlight ? 'text-red-700' : 'text-gray-800'}`}>{event.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{event.desc}</p>
                        </div>
                        <div className="text-right hidden sm:block flex-shrink-0">
                          <p className="text-xs text-gray-500">{event.time}</p>
                          <p className={`text-xs font-medium ${event.highlight ? 'text-red-500' : 'text-pink-500'}`}>{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Sticky Sidebar - Prize Money */}
              <div className="hidden lg:block w-[260px] flex-shrink-0 self-start sticky top-[70px]">
                <div className="max-h-[calc(100vh)] overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                  {[
                    { title: '21.1 KM', subtitle: 'Per Age Category (16-30 / 31-40 / 41-50 / 51+)', color: 'from-emerald-500 to-teal-600', prizes: ['₹5,000', '₹3,000', '₹2,500'] },
                    { title: '10 KM', subtitle: 'Per Age Category (16-30 / 31-40 / 41-50 / 51+)', color: 'from-pink-500 to-rose-600', prizes: ['₹4,000', '₹2,500', '₹2,000'] },
                    { title: '5 KM', subtitle: 'Per Age Category (16-30 / 31-40 / 41-50 / 51+)', color: 'from-violet-500 to-purple-600', prizes: ['₹4,000', '₹2,500', '₹2,000'] },
                  ].map((section) => (
                    <div key={section.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className={`bg-gradient-to-r ${section.color} px-4 py-3`}>
                        <h3 className="text-sm font-bold text-white">{section.title} Prize Money</h3>
                        <p className="text-[10px] text-white/70">{section.subtitle}</p>
                      </div>
                      <div className="p-2.5 space-y-1.5">
                        <PrizeRow place="1st" amount={section.prizes[0]} color="gold" />
                        <PrizeRow place="2nd" amount={section.prizes[1]} color="silver" />
                        <PrizeRow place="3rd" amount={section.prizes[2]} color="bronze" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Prize Money Section - HIDDEN (Registration Closed) */}
            <div className="hidden lg:hidden mt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-yellow-200/60">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                  PRIZE MONEY
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: '21.1 KM', subtitle: 'Per Age Category (16-30 / 31-40 / 41-50 / 51+)', color: 'from-emerald-500 to-teal-600', prizes: ['₹5,000', '₹3,000', '₹2,500'] },
                  { title: '10 KM', subtitle: 'Per Age Category (16-30 / 31-40 / 41-50 / 51+)', color: 'from-pink-500 to-rose-600', prizes: ['₹4,000', '₹2,500', '₹2,000'] },
                  { title: '5 KM', subtitle: 'Per Age Category (16-30 / 31-40 / 41-50 / 51+)', color: 'from-violet-500 to-purple-600', prizes: ['₹4,000', '₹2,500', '₹2,000'] },
                ].map((section) => (
                  <div key={section.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className={`bg-gradient-to-r ${section.color} px-4 py-3`}>
                      <h3 className="text-sm font-bold text-white">{section.title} Prize Money</h3>
                      <p className="text-[10px] text-white/70">{section.subtitle}</p>
                    </div>
                    <div className="p-2.5 space-y-1.5">
                      <PrizeRow place="1st" amount={section.prizes[0]} color="gold" />
                      <PrizeRow place="2nd" amount={section.prizes[1]} color="silver" />
                      <PrizeRow place="3rd" amount={section.prizes[2]} color="bronze" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
          </div>
        )}

        {/* STEP 2: Personal Details */}
        {currentStep === 2 && (
          <div className="max-w-[1400px] mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm">
                <button
                  onClick={goBackToStep1}
                  className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                >
                  {selectedRaceData?.isDonation ? 'Donation' : 'Select Race'}
                </button>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">
                  {selectedRaceData?.isDonation ? 'Your Details' : 'Personal Details'}
                </span>
              </div>
              <button
                onClick={goBackToStep1}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {selectedRaceData?.isDonation ? 'Change Amount' : 'Change Distance'}
              </button>
            </div>

            {/* Two Column Layout for Desktop */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-7">
                {/* Form Card with Header */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {/* Section Header inside card */}
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedRaceData?.isDonation ? 'Your Details' : 'Personal Details'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Fields marked with <span className="text-red-500 font-bold">*</span> are required
                    </p>
                  </div>
                  <div className="p-5 sm:p-6 space-y-5">

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your full name"
                        className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-gray-50/50 transition-all placeholder:text-gray-400 ${
                          errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-pink-400 focus:ring-pink-100'
                        }`}
                        required
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Two-column grid for DOB and Gender */}
                    {!selectedRaceData?.isDonation && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            onClick={(e) => e.target.showPicker()}
                            max={new Date().toISOString().split('T')[0]}
                            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-gray-50/50 cursor-pointer transition-all ${
                              errors.dateOfBirth ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-pink-400 focus:ring-pink-100'
                            }`}
                            required
                          />
                          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                          {formData.dateOfBirth && (
                            <p className="mt-1.5 text-xs text-gray-500">
                              Age: <span className="font-semibold text-pink-600">
                                {(() => {
                                  const today = new Date();
                                  const birth = new Date(formData.dateOfBirth);
                                  let age = today.getFullYear() - birth.getFullYear();
                                  const monthDiff = today.getMonth() - birth.getMonth();
                                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                                    age--;
                                  }
                                  return age;
                                })()}
                              </span> years old
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Gender <span className="text-red-500">*</span>
                          </label>
                          <div className={`grid grid-cols-3 gap-2 ${errors.gender ? 'ring-1 ring-red-400 rounded-lg p-0.5' : ''}`}>
                            {['Male', 'Female', 'Other'].map((gender) => (
                              <button
                                key={gender}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, gender: gender.toLowerCase() }))}
                                className={`py-2.5 text-sm font-medium rounded-lg border transition-all ${
                                  formData.gender === gender.toLowerCase()
                                    ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-100'
                                    : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                {gender}
                              </button>
                            ))}
                          </div>
                          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                        </div>
                      </div>
                    )}

                    {/* T-Shirt Size */}
                    {!selectedRaceData?.isDonation && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          T-Shirt Size <span className="text-red-500">*</span>
                        </label>
                        <div className={`grid grid-cols-5 gap-2 ${errors.tshirtSize ? 'ring-1 ring-red-400 rounded-lg p-0.5' : ''}`}>
                          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, tshirtSize: size }))}
                              className={`py-2.5 text-sm font-medium rounded-lg border transition-all ${
                                formData.tshirtSize === size
                                  ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-100'
                                  : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        {errors.tshirtSize ? (
                          <p className="text-red-500 text-xs mt-1">{errors.tshirtSize}</p>
                        ) : (
                          <p className="text-[11px] text-gray-400 mt-1.5">For the marathon kit t-shirt</p>
                        )}
                      </div>
                    )}

                    {/* Email & Phone - Two columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="you@example.com"
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-gray-50/50 transition-all placeholder:text-gray-400 ${
                            errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-pink-400 focus:ring-pink-100'
                          }`}
                          required
                        />
                        {errors.email ? (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        ) : (
                          <p className="text-[11px] text-gray-400 mt-1">Confirmation will be sent here</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="10-digit mobile number"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-gray-50/50 transition-all placeholder:text-gray-400 ${
                            errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-pink-400 focus:ring-pink-100'
                          }`}
                          required
                        />
                        {errors.phone ? (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        ) : (
                          <p className="text-[11px] text-gray-400 mt-1">SMS confirmation to this number</p>
                        )}
                      </div>
                    </div>

                    {/* Emergency Phone */}
                    {!selectedRaceData?.isDonation && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Emergency Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="Emergency contact number"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-gray-50/50 transition-all placeholder:text-gray-400 ${
                            errors.emergencyPhone
                              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                              : 'border-gray-200 focus:border-pink-400 focus:ring-pink-100'
                          }`}
                          required
                        />
                        {errors.emergencyPhone ? (
                          <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.emergencyPhone}
                          </p>
                        ) : (
                          <p className="text-[11px] text-gray-400 mt-1">In case of emergency during the event</p>
                        )}
                      </div>
                    )}

                    {/* Address and Pincode */}
                    {!selectedRaceData?.isDonation && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Address <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="Your complete address"
                            rows={2}
                            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-gray-800 bg-gray-50/50 resize-none transition-all placeholder:text-gray-400 ${errors.address ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
                          />
                          {errors.address && (
                            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.address}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="6-digit pincode"
                            maxLength={6}
                            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-gray-800 bg-gray-50/50 transition-all placeholder:text-gray-400 ${errors.pincode ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`}
                          />
                          {errors.pincode && (
                            <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary (Sticky) */}
              <div className="lg:col-span-5 mt-6 lg:mt-0">
                <div className="lg:sticky lg:top-24">
                  {/* Order Summary Card */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Order Summary</h3>
                    </div>

                    <div className="p-5 space-y-5">
                      {/* Selected Race Info */}
                      <div className="flex items-start gap-4 pb-5 border-b border-gray-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {selectedRaceData?.isDonation ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            )}
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {selectedRaceData?.isDonation ? 'Donation' : 'Selected Race'}
                          </p>
                          <p className="text-base font-bold text-gray-900 mt-0.5">
                            {selectedRaceData?.isDonation ? `₹${basePrice} Donation` : `${selectedRaceData?.distance}`}
                          </p>
                          {!selectedRaceData?.isDonation && (
                            <p className="text-sm text-gray-500">{selectedRaceData?.name}</p>
                          )}
                                                  </div>
                      </div>

                      {/* Age Categories for 21.1 KM */}
                      {selectedRaceData?.distance === '21.1 KM' && (
                        <div className="pb-5 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Age Categories</p>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg px-2 py-2 text-center">
                              <p className="text-blue-700 font-bold text-sm">16-30</p>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg px-2 py-2 text-center">
                              <p className="text-emerald-700 font-bold text-sm">31-40</p>
                            </div>
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg px-2 py-2 text-center">
                              <p className="text-amber-700 font-bold text-sm">41-50</p>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg px-2 py-2 text-center">
                              <p className="text-purple-700 font-bold text-sm">51+</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Age Categories for 5 KM and 10 KM */}
                      {(selectedRaceData?.distance === '5 KM' || selectedRaceData?.distance === '10 KM') && (
                        <div className="pb-5 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Age Categories</p>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg px-2 py-2 text-center">
                              <p className="text-blue-700 font-bold text-sm">16-30</p>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg px-2 py-2 text-center">
                              <p className="text-emerald-700 font-bold text-sm">31-40</p>
                            </div>
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg px-2 py-2 text-center">
                              <p className="text-amber-700 font-bold text-sm">41-50</p>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg px-2 py-2 text-center">
                              <p className="text-purple-700 font-bold text-sm">51+</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Coupon Code - Moved here */}
                      {!selectedRaceData?.isDonation && (
                        <div className="pb-5 border-b border-gray-100">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Have a coupon?
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="couponCode"
                              value={formData.couponCode}
                              onChange={(e) => {
                                handleInputChange(e);
                                setCouponError('');
                                setCouponApplied(false);
                              }}
                              placeholder="Enter code"
                              disabled={couponApplied}
                              className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 text-gray-800 uppercase transition-all placeholder:text-gray-400 ${
                                couponApplied
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                  : couponError
                                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-gray-50/50'
                                    : 'border-gray-200 focus:border-pink-400 focus:ring-pink-100 bg-gray-50/50'
                              }`}
                            />
                            {couponApplied ? (
                              <button
                                type="button"
                                onClick={removeCoupon}
                                className="px-3 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={applyCoupon}
                                disabled={couponLoading}
                                className="px-3 py-2 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px]"
                              >
                                {couponLoading ? (
                                  <svg className="animate-spin h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : 'Apply'}
                              </button>
                            )}
                          </div>
                          {couponApplied ? (
                            <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
                              <CheckIcon className="w-3 h-3" />
                              You save {couponDiscountType === 'percent' ? `${couponPercent}% (₹${calculatedDiscount})` : `₹${calculatedDiscount}`}
                            </p>
                          ) : couponError ? (
                            <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {couponError}
                            </p>
                          ) : null}
                        </div>
                      )}

                      {/* Price Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{selectedRaceData?.isDonation ? 'Donation' : 'Registration Fee'}</span>
                          <span className="text-gray-700 font-medium">₹{basePrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Convenience Fee ({CONVENIENCE_FEE_PERCENT}%)</span>
                          <span className="text-gray-700 font-medium">₹{convenienceFee}</span>
                        </div>
                        {couponApplied && !selectedRaceData?.isDonation && (
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              Discount{couponDiscountType === 'percent' ? ` (${couponPercent}%)` : ''}
                            </span>
                            <span className="text-emerald-600 font-semibold">-₹{calculatedDiscount}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900 font-bold text-base">Total</span>
                            <span className="text-2xl font-bold text-pink-600">₹{selectedRaceData?.isDonation ? (basePrice + convenienceFee) : totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="pt-2">
                        <div className={`flex items-start gap-2.5 p-3 rounded-lg transition-all ${errors.termsAccepted ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-100'}`}>
                          <input
                            type="checkbox"
                            id="termsAccepted"
                            checked={formData.termsAccepted}
                            onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                            className="mt-0.5 w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                          />
                          <label htmlFor="termsAccepted" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                            I agree to the{' '}
                            <a href="/terms-of-service" target="_blank" className="text-pink-500 hover:text-pink-600 underline">Terms and Conditions</a>
                            {' '}and{' '}
                            <a href="/privacy-policy" target="_blank" className="text-pink-500 hover:text-pink-600 underline">Privacy Policy</a>
                            <span className="text-red-500 ml-0.5">*</span>
                          </label>
                        </div>
                        {errors.termsAccepted && <p className="text-red-500 text-xs mt-1.5">{errors.termsAccepted}</p>}
                      </div>

                      {/* Validation Summary - Only show after submit attempt */}
                      {Object.values(errors).some(error => error !== '') && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                          <p className="text-red-700 text-xs font-medium mb-1.5 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            Please fix the following:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {errors.name && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Full Name</span>}
                            {errors.dateOfBirth && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Date of Birth</span>}
                            {errors.gender && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Gender</span>}
                            {errors.tshirtSize && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">T-Shirt Size</span>}
                            {errors.email && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Email</span>}
                            {errors.phone && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Phone</span>}
                            {errors.emergencyPhone && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Emergency Contact</span>}
                            {errors.termsAccepted && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Accept Terms</span>}
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                          loading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-200/50 active:scale-[0.99]'
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : selectedRaceData?.isDonation ? (
                          `Donate ₹${totalAmount}`
                        ) : (
                          `Pay ₹${totalAmount} & Register`
                        )}
                      </button>

                      {/* Security Badge */}
                      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Secure payment powered by PhonePe
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <PartnersAndHelp />

      {/* Video CTA Section */}
      <div className="relative h-[450px] md:h-[500px] overflow-hidden bg-gray-900">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            autoPlay
            muted
            playsInline
            onLoadedMetadata={(e) => { e.target.currentTime = 4; }}
            onTimeUpdate={(e) => { if (e.target.currentTime >= 16) e.target.currentTime = 4; }}
          >
            <source src="/PULSE_Cinematic_Running_Commercial_Sony_FX3_720P.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent z-[1]" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-[1360px] mx-auto px-5 sm:px-6 lg:px-10 flex items-center">
          <div className="w-full max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                <span className="text-pink-400 text-[11px] font-medium tracking-wide">8th March 2026</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
                Run With Purpose.<br />
                <span className="text-pink-400">Make Every Step Count.</span>
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                Join thousands of runners supporting women and children empowerment. Your participation creates real change.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="px-6 py-3 bg-gray-500 text-white text-sm font-semibold rounded-lg flex items-center gap-2 cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Registration Closed
                </div>
                <a href="#route" className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg border border-white/20 transition-all duration-300">
                  View Route
                </a>
              </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/40 backdrop-blur-sm border-t border-white/5">
          <div className="max-w-[1360px] mx-auto px-5 sm:px-6 lg:px-10 py-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>Kharghar, Navi Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>5:00 AM</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-500">BIB Collection:</span>
              <span className="text-white font-medium">6 Mar (4-9 PM) & 7 Mar (1-9 PM), Decathlon Belapur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Prize Card - HIDDEN (Registration Closed) */}
      {currentStep === 1 && false && (
        <div className="lg:hidden fixed bottom-[70px] left-0 right-0 z-40 px-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
            <button
              onClick={() => setShowPrizeModal(!showPrizeModal)}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🏆</span>
                <span className="text-white text-sm font-bold">Prize Money</span>
                <span className="text-white/70 text-[10px]">Age Categories: 16-30 | 31-40 | 41-50 | 51+</span>
              </div>
              <svg className={`w-4 h-4 text-white transition-transform ${showPrizeModal ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            {showPrizeModal && (
              <div className="overflow-hidden">
                  <div className="px-3 py-3 space-y-3">
                    {/* 21.1 KM */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">21.1 KM</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { place: '1st', amount: '₹5,000', bg: 'bg-yellow-50 border-yellow-100', badge: 'bg-yellow-400' },
                          { place: '2nd', amount: '₹3,000', bg: 'bg-gray-50 border-gray-100', badge: 'bg-gray-300' },
                          { place: '3rd', amount: '₹2,500', bg: 'bg-orange-50 border-orange-100', badge: 'bg-amber-500' },
                        ].map((p) => (
                          <div key={p.place} className={`flex flex-col items-center py-1.5 rounded-lg border ${p.bg}`}>
                            <div className={`w-5 h-5 ${p.badge} rounded-full flex items-center justify-center mb-0.5`}>
                              <span className="text-white text-[8px] font-black">{p.place}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-[11px]">{p.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 10 KM */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">10 KM</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { place: '1st', amount: '₹4,000', bg: 'bg-yellow-50 border-yellow-100', badge: 'bg-yellow-400' },
                          { place: '2nd', amount: '₹2,500', bg: 'bg-gray-50 border-gray-100', badge: 'bg-gray-300' },
                          { place: '3rd', amount: '₹2,000', bg: 'bg-orange-50 border-orange-100', badge: 'bg-amber-500' },
                        ].map((p) => (
                          <div key={p.place} className={`flex flex-col items-center py-1.5 rounded-lg border ${p.bg}`}>
                            <div className={`w-5 h-5 ${p.badge} rounded-full flex items-center justify-center mb-0.5`}>
                              <span className="text-white text-[8px] font-black">{p.place}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-[11px]">{p.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 5 KM */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">5 KM</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { place: '1st', amount: '₹4,000', bg: 'bg-yellow-50 border-yellow-100', badge: 'bg-yellow-400' },
                          { place: '2nd', amount: '₹2,500', bg: 'bg-gray-50 border-gray-100', badge: 'bg-gray-300' },
                          { place: '3rd', amount: '₹2,000', bg: 'bg-orange-50 border-orange-100', badge: 'bg-amber-500' },
                        ].map((p) => (
                          <div key={p.place} className={`flex flex-col items-center py-1.5 rounded-lg border ${p.bg}`}>
                            <div className={`w-5 h-5 ${p.badge} rounded-full flex items-center justify-center mb-0.5`}>
                              <span className="text-white text-[8px] font-black">{p.place}</span>
                            </div>
                            <p className="text-gray-800 font-bold text-[11px]">{p.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Donation Form Modal */}
      {showDonationForm && (
        <DonationForm onClose={() => setShowDonationForm(false)} />
      )}
    </div>
  );
}
