'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { jsPDF } from 'jspdf';

function MarathonSuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const [status, setStatus] = useState('checking');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [participantData, setParticipantData] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [registrationSaved, setRegistrationSaved] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  const downloadPDF = (autoDownload = false) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to draw a row in table style
    const drawTableRow = (label, value, y, options = {}) => {
      const { labelWidth = 55, valueColor = [31, 41, 55], isBold = false, isGreen = false, isPink = false } = options;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128); // gray-500
      doc.text(label, margin + 8, y);

      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      if (isGreen) {
        doc.setTextColor(22, 163, 74); // green-600
      } else if (isPink) {
        doc.setTextColor(219, 39, 119); // pink-600
      } else {
        doc.setTextColor(...valueColor);
      }
      doc.text(String(value || 'N/A'), margin + labelWidth, y);
      doc.setTextColor(31, 41, 55);
      return y + 7;
    };

    // Calculate age from date of birth
    const calculateAge = (dob) => {
      if (!dob) return null;
      const today = new Date();
      const birth = new Date(dob);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    // ===== HEADER SECTION =====
    // Pink gradient header
    doc.setFillColor(236, 72, 153);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Darker pink accent bar
    doc.setFillColor(219, 39, 119);
    doc.rect(0, 50, pageWidth, 3, 'F');

    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('JANYA FOUNDATION', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Marathon 2026 - Registration Receipt', pageWidth / 2, 32, { align: 'center' });

    // Date on header
    const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    doc.setFontSize(8);
    doc.text(currentDate, pageWidth / 2, 44, { align: 'center' });

    // ===== STATUS BADGE =====
    let statusText = '';
    let statusColor = [];
    let statusBg = [];

    if (status === 'success') {
      statusText = 'CONFIRMED';
      statusColor = [255, 255, 255];
      statusBg = [22, 163, 74]; // green-600
    } else if (status === 'pending') {
      statusText = 'PENDING';
      statusColor = [255, 255, 255];
      statusBg = [202, 138, 4]; // yellow-600
    } else {
      statusText = 'FAILED';
      statusColor = [255, 255, 255];
      statusBg = [220, 38, 38]; // red-600
    }

    const badgeWidth = 70;
    const badgeX = pageWidth - margin - badgeWidth;
    doc.setFillColor(...statusBg);
    doc.roundedRect(badgeX, 58, badgeWidth, 14, 2, 2, 'F');
    doc.setTextColor(...statusColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, badgeX + badgeWidth / 2, 67, { align: 'center' });

    // Transaction ID badge
    doc.setFillColor(243, 244, 246); // gray-100
    doc.roundedRect(margin, 58, 95, 14, 2, 2, 'F');
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Transaction ID', margin + 4, 64);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(transactionId || 'N/A', margin + 4, 70);

    let currentY = 82;

    // ===== PARTICIPANT DETAILS SECTION =====
    // Section header with icon effect
    doc.setFillColor(249, 250, 251); // gray-50
    doc.roundedRect(margin, currentY, contentWidth, 8, 2, 2, 'F');
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PARTICIPANT DETAILS', margin + 4, currentY + 6);
    currentY += 12;

    // Participant details box
    doc.setDrawColor(229, 231, 235); // gray-200
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, 50, 3, 3, 'FD');
    currentY += 8;

    const dobDisplay = participantData?.dateOfBirth
      ? new Date(participantData.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'N/A';
    const age = calculateAge(participantData?.dateOfBirth);
    const ageDisplay = age ? ` (${age} yrs)` : '';

    // Two column layout for participant details
    const col1X = margin + 8;
    const col2X = margin + contentWidth / 2 + 4;
    const col1LabelW = 35;
    const col2LabelW = 35;

    // Column 1
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Name', col1X, currentY);
    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(participantData?.name || 'N/A', col1X + col1LabelW, currentY);

    // Column 2
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Phone', col2X, currentY);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(9);
    doc.text(participantData?.phone || 'N/A', col2X + col2LabelW, currentY);
    currentY += 10;

    // Row 2
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Email', col1X, currentY);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(9);
    doc.text(participantData?.email || 'N/A', col1X + col1LabelW, currentY);

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Gender', col2X, currentY);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(9);
    const genderDisplay = participantData?.gender ? participantData.gender.charAt(0).toUpperCase() + participantData.gender.slice(1) : 'N/A';
    doc.text(genderDisplay, col2X + col2LabelW, currentY);
    currentY += 10;

    // Row 3
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('DOB', col1X, currentY);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(9);
    doc.text(dobDisplay + ageDisplay, col1X + col1LabelW, currentY);

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('T-Shirt', col2X, currentY);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(9);
    doc.text(participantData?.tshirtSize || 'N/A', col2X + col2LabelW, currentY);
    currentY += 18;

    // ===== RACE DETAILS SECTION =====
    doc.setFillColor(253, 242, 248); // pink-50
    doc.roundedRect(margin, currentY, contentWidth, 8, 2, 2, 'F');
    doc.setTextColor(236, 72, 153);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RACE DETAILS', margin + 4, currentY + 6);
    currentY += 12;

    // Race details box
    doc.setDrawColor(252, 231, 243); // pink-100
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, 45, 3, 3, 'FD');
    currentY += 8;

    // Race category highlight
    const raceTypeLabel = participantData?.isRunForCause ? ' (Run for Cause)' : '';
    const raceDisplay = `${participantData?.raceCategory || 'N/A'} - ${participantData?.raceName || ''}${raceTypeLabel}`;

    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Race Category', col1X, currentY);
    doc.setTextColor(219, 39, 119); // pink-600
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(raceDisplay, col1X + 35, currentY);
    currentY += 10;

    // Race type
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Race Type', col1X, currentY);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(9);
    const raceTypeDisplay = participantData?.raceType || (participantData?.isRunForCause ? 'Non-Competitive' : 'Competitive');
    doc.text(raceTypeDisplay, col1X + 35, currentY);

    if (participantData?.isRunForCause) {
      doc.setFontSize(7);
      doc.setTextColor(107, 114, 128);
      doc.text('(No prize, No chip | T-shirt, Medal, E-certificate & Refreshment)', col1X + 70, currentY);
    }
    currentY += 16;

    // ===== PAYMENT DETAILS SECTION =====
    doc.setFillColor(240, 253, 244); // green-50
    doc.roundedRect(margin, currentY, contentWidth, 8, 2, 2, 'F');
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT SUMMARY', margin + 4, currentY + 6);
    currentY += 12;

    // Payment box
    const hasCoupon = participantData?.couponCode && participantData?.couponDiscount > 0;
    // For raceFinalPrice coupons, amount is already the discounted price and coupon_discount shows savings
    // Detect by checking if coupon_discount > amount (savings larger than final price = special pricing)
    const isSpecialPricing = hasCoupon && participantData?.couponDiscount > participantData?.amount;
    const originalPrice = isSpecialPricing
      ? (participantData?.amount || 0) + (participantData?.couponDiscount || 0)
      : participantData?.amount || 0;
    // Calculate actual fee percentage (3% for special pricing, 3.5% for regular)
    const feePercent = participantData?.amount > 0
      ? Math.round((participantData?.convenienceFee / participantData?.amount) * 100 * 10) / 10
      : 3.5;
    const paymentBoxHeight = hasCoupon ? 49 : 35;
    doc.setDrawColor(187, 247, 208); // green-200
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, contentWidth, paymentBoxHeight, 3, 3, 'FD');
    currentY += 8;

    // Payment details in a clean table format
    const payLabelX = margin + 8;
    const payValueX = margin + contentWidth - 8;

    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(isSpecialPricing ? 'Original Price' : 'Registration Fee', payLabelX, currentY);
    doc.setTextColor(31, 41, 55);
    doc.text(`Rs. ${isSpecialPricing ? originalPrice : (participantData?.amount || '0')}`, payValueX, currentY, { align: 'right' });
    currentY += 7;

    if (hasCoupon) {
      doc.setTextColor(107, 114, 128);
      doc.text(`Coupon (${participantData.couponCode})`, payLabelX, currentY);
      doc.setTextColor(22, 163, 74); // green
      doc.text(`- Rs. ${participantData.couponDiscount}`, payValueX, currentY, { align: 'right' });
      currentY += 7;
    }

    doc.setTextColor(107, 114, 128);
    doc.text(`Convenience Fee (${feePercent}%)`, payLabelX, currentY);
    doc.setTextColor(31, 41, 55);
    doc.text(`Rs. ${participantData?.convenienceFee || '0'}`, payValueX, currentY, { align: 'right' });
    currentY += 7;

    // Divider line
    doc.setDrawColor(209, 213, 219);
    doc.line(payLabelX, currentY, payValueX, currentY);
    currentY += 6;

    // Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text('Total Paid', payLabelX, currentY);
    doc.setTextColor(22, 163, 74);
    doc.text(`Rs. ${participantData?.totalAmount || paymentDetails?.amount || '0'}`, payValueX, currentY, { align: 'right' });
    currentY += 14;

    // ===== IMPORTANT INFO SECTION =====
    if (status === 'success') {
      doc.setFillColor(254, 249, 195); // yellow-100
      doc.setDrawColor(253, 224, 71); // yellow-300
      doc.roundedRect(margin, currentY, contentWidth, 32, 3, 3, 'FD');

      doc.setTextColor(161, 98, 7); // yellow-700
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('IMPORTANT INFORMATION', margin + 4, currentY + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(113, 63, 18); // yellow-900
      doc.text('BIB Collection:', margin + 8, currentY + 15);
      doc.text('6 Mar (4-9 PM) & 7 Mar (1-9 PM) - Decathlon, Belapur', margin + 70, currentY + 15);
      doc.text('Marathon Day:', margin + 8, currentY + 23);
      doc.text('March 8, 2026 (5:00 AM) - BD Somani International School, Sector 27', margin + 70, currentY + 23);
    }

    // ===== FOOTER =====
    doc.setFillColor(31, 41, 55); // gray-800
    doc.rect(0, pageHeight - 22, pageWidth, 22, 'F');

    doc.setTextColor(156, 163, 175); // gray-400
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Janya Foundation Marathon | https://janyafoundation.in | +91 93214 96142', pageWidth / 2, pageHeight - 13, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    doc.text('This is a computer-generated receipt. No signature required.', pageWidth / 2, pageHeight - 6, { align: 'center' });

    // Save the PDF
    const fileName = `marathon-registration-${status}-${transactionId || 'receipt'}.pdf`;
    doc.save(fileName);

    // Mark PDF as downloaded (for auto-download flow)
    if (autoDownload) {
      setPdfDownloaded(true);
    }
  };

  useEffect(() => {
    if (transactionId) {
      checkPaymentStatus();
    } else {
      setStatus('unknown');
    }
  }, [transactionId]);

  // Auto download PDF when status is determined and we have participant data
  useEffect(() => {
    if (status !== 'checking' && status !== 'unknown' && transactionId && participantData && !pdfDownloaded) {
      const timer = setTimeout(() => {
        downloadPDF(true); // true = autoDownload
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, participantData, pdfDownloaded]);

  // Fetch registration data from DB (webhook already handles emails)
  const fetchRegistrationData = async () => {
    try {
      const response = await axios.get(`/api/marathon/get-registration?transactionId=${transactionId}`);
      if (response.data.success && response.data.registration) {
        const reg = response.data.registration;
        setParticipantData({
          name: reg.name,
          email: reg.email,
          phone: reg.phone,
          emergencyPhone: reg.emergency_phone,
          dateOfBirth: reg.date_of_birth,
          gender: reg.gender,
          tshirtSize: reg.tshirt_size,
          address: reg.address,
          raceCategory: reg.race_category,
          raceName: reg.race_name,
          isRunForCause: reg.is_run_for_cause,
          raceType: reg.race_type,
          amount: reg.amount,
          convenienceFee: reg.convenience_fee,
          couponCode: reg.coupon_code,
          couponDiscount: reg.coupon_discount,
          totalAmount: reg.total_amount,
          isDonation: reg.is_donation
        });
        setRegistrationSaved(true);
        setEmailSent(reg.email_sent || false);
        // Clear sessionStorage since we got data from DB
        sessionStorage.removeItem('marathonParticipantData');
      } else {
        // Use sessionStorage data if DB fetch fails
        const storedData = sessionStorage.getItem('marathonParticipantData');
        if (storedData) {
          setParticipantData(JSON.parse(storedData));
        }
      }
    } catch (error) {
      console.error('Failed to fetch registration:', error);
      // Use sessionStorage data as fallback
      const storedData = sessionStorage.getItem('marathonParticipantData');
      if (storedData) {
        setParticipantData(JSON.parse(storedData));
      }
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch('/api/phonepe/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      });

      const data = await response.json();

      if (data.success && data.status === 'SUCCESS') {
        setStatus('success');
        setPaymentDetails(data);
        setEmailSent(data.emailSent || false);

        // Fetch participant data from DB (webhook handles emails, status API is backup)
        fetchRegistrationData();
      } else if (data.status === 'PENDING') {
        setStatus('pending');
        setTimeout(checkPaymentStatus, 3000);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full">
        {status === 'checking' && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Verifying Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your registration...</p>
          </div>
        )}

        {status === 'success' && (!participantData || !pdfDownloaded) && (
          <div className="text-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              {!participantData ? 'Loading Registration Details...' : 'Preparing Your Receipt...'}
            </h1>
            <p className="text-gray-600 mb-4">
              {!participantData
                ? 'Fetching your registration data from server...'
                : 'Your PDF receipt is being generated and will download automatically.'}
            </p>
            {transactionId && (
              <p className="text-sm text-gray-400">
                Transaction ID: {transactionId}
              </p>
            )}
            <div className="mt-6 flex justify-center gap-2">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        {status === 'success' && participantData && pdfDownloaded && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h1>
            <p className="text-gray-600 mb-4">Your marathon registration has been confirmed.</p>

            <div className="bg-pink-50 rounded-lg p-4 mb-4 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Registration Details</h3>
              <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {participantData.name}</p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Race:</span> {participantData.raceCategory} - {participantData.raceName}
                {participantData.isRunForCause && <span className="text-green-600 ml-1">(Run for Cause)</span>}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Race Type:</span> {participantData.raceType || (participantData.isRunForCause ? 'No Competition' : 'Competition')}
              </p>
              {participantData.isRunForCause && (
                <p className="text-xs text-gray-500 italic">* No prize, No chip | T-shirt, Medal, E-certificate & Refreshment</p>
              )}
              {(() => {
                const hasCouponDiscount = participantData.couponCode && participantData.couponDiscount > 0;
                const isSpecialPricing = hasCouponDiscount && participantData.couponDiscount > participantData.amount;
                const originalPrice = isSpecialPricing
                  ? (participantData.amount || 0) + (participantData.couponDiscount || 0)
                  : participantData.amount || 0;
                const feePercent = participantData.amount > 0
                  ? Math.round((participantData.convenienceFee / participantData.amount) * 100 * 10) / 10
                  : 3.5;
                return (
                  <>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{isSpecialPricing ? 'Original Price:' : 'Registration Fee:'}</span> ₹{isSpecialPricing ? originalPrice : participantData.amount}
                    </p>
                    {hasCouponDiscount && (
                      <p className="text-sm text-green-600"><span className="font-medium">Coupon Applied:</span> {participantData.couponCode} (-₹{participantData.couponDiscount})</p>
                    )}
                    <p className="text-sm text-gray-600"><span className="font-medium">Convenience Fee ({feePercent}%):</span> ₹{participantData.convenienceFee}</p>
                    <p className="text-sm text-gray-800 font-semibold mt-1"><span className="font-medium">Total Paid:</span> ₹{participantData.totalAmount}</p>
                  </>
                );
              })()}
            </div>

            {transactionId && (
              <p className="text-sm text-gray-500 mb-4">
                Transaction ID: {transactionId}
              </p>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Dates</h4>
              <p className="text-sm text-yellow-700">📅 BIB Collection: 6 Mar (4-9 PM) & 7 Mar (1-9 PM) - Decathlon, Belapur</p>
              <p className="text-sm text-yellow-700">🏃 Marathon Day: March 8, 2026 (5:00 AM) - BD Somani International School, Sector 27</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => downloadPDF(false)}
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Payment Pending</h1>
            <p className="text-gray-600 mb-4">Your payment is being processed. Please wait...</p>
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            {transactionId && (
              <p className="text-sm text-gray-500 mb-4">
                Transaction ID: {transactionId}
              </p>
            )}
            <button
              onClick={() => downloadPDF(false)}
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Receipt
            </button>
          </div>
        )}

        {(status === 'failed' || status === 'error') && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Registration Failed</h1>
            <p className="text-gray-600 mb-4">
              We couldn't process your registration. Please try again.
            </p>
            {transactionId && (
              <p className="text-sm text-gray-500 mb-4">
                Transaction ID: {transactionId}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => downloadPDF(false)}
                className="inline-flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </button>
              <Link
                href="/marathon"
                className="inline-flex items-center justify-center bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
              >
                Try Again
              </Link>
            </div>
          </div>
        )}

        {status === 'unknown' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Unknown Status</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find your transaction details. If you completed a payment, please contact support.
            </p>
            <Link
              href="/marathon"
              className="inline-block bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              Back to Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h1>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}

export default function MarathonSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MarathonSuccessContent />
    </Suspense>
  );
}
