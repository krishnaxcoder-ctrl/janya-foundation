'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { jsPDF } from 'jspdf';

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const [status, setStatus] = useState('checking');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Header
    doc.setFillColor(55, 67, 66); // #374342
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Janya Foundation', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Donation Receipt', pageWidth / 2, 32, { align: 'center' });

    // Status Badge
    doc.setTextColor(0, 0, 0);
    let statusText = '';
    let statusColor = [];

    if (status === 'success') {
      statusText = 'PAYMENT SUCCESSFUL';
      statusColor = [34, 197, 94]; // green
    } else if (status === 'pending') {
      statusText = 'PAYMENT PENDING';
      statusColor = [234, 179, 8]; // yellow
    } else {
      statusText = 'PAYMENT FAILED';
      statusColor = [239, 68, 68]; // red
    }

    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth / 2 - 40, 50, 80, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(statusText, pageWidth / 2, 58, { align: 'center' });

    // Receipt Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const startY = 80;
    const lineHeight = 10;
    const labelX = 25;
    const valueX = 90;

    // Draw a box for details
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(20, startY - 8, pageWidth - 40, 70, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.text('Transaction ID:', labelX, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(transactionId || 'N/A', valueX, startY);

    doc.setFont('helvetica', 'bold');
    doc.text('Date:', labelX, startY + lineHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(currentDate, valueX, startY + lineHeight);

    doc.setFont('helvetica', 'bold');
    doc.text('Amount:', labelX, startY + lineHeight * 2);
    doc.setFont('helvetica', 'normal');
    const amount = paymentDetails?.amount ? `₹${paymentDetails.amount.toLocaleString()}` : 'N/A';
    doc.text(amount, valueX, startY + lineHeight * 2);

    doc.setFont('helvetica', 'bold');
    doc.text('Status:', labelX, startY + lineHeight * 3);
    doc.setFont('helvetica', 'normal');
    doc.text(status === 'success' ? 'Completed' : status === 'pending' ? 'Pending' : 'Failed', valueX, startY + lineHeight * 3);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', labelX, startY + lineHeight * 4);
    doc.setFont('helvetica', 'normal');
    doc.text('PhonePe', valueX, startY + lineHeight * 4);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment ID:', labelX, startY + lineHeight * 5);
    doc.setFont('helvetica', 'normal');
    doc.text(paymentDetails?.paymentId || 'N/A', valueX, startY + lineHeight * 5);

    // Thank you message (only for success)
    if (status === 'success') {
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(20, 165, pageWidth - 40, 30, 3, 3, 'F');
      doc.setTextColor(22, 101, 52);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      const thankYouText = 'Thank you for your generous donation! Your contribution will help us';
      const thankYouText2 = 'continue our mission to empower women and children.';
      doc.text(thankYouText, pageWidth / 2, 178, { align: 'center' });
      doc.text(thankYouText2, pageWidth / 2, 186, { align: 'center' });
    } else if (status === 'pending') {
      doc.setFillColor(254, 249, 195);
      doc.roundedRect(20, 165, pageWidth - 40, 25, 3, 3, 'F');
      doc.setTextColor(133, 77, 14);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.text('Your payment is being processed. Please check back later.', pageWidth / 2, 180, { align: 'center' });
    } else {
      doc.setFillColor(254, 226, 226);
      doc.roundedRect(20, 165, pageWidth - 40, 25, 3, 3, 'F');
      doc.setTextColor(153, 27, 27);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'italic');
      doc.text('Payment could not be processed. Please try again or contact support.', pageWidth / 2, 180, { align: 'center' });
    }

    // Footer
    doc.setFillColor(55, 67, 66);
    doc.rect(0, 270, pageWidth, 27, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Janya Foundation | https://janyafoundation.in', pageWidth / 2, 280, { align: 'center' });
    doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, 288, { align: 'center' });

    // Save the PDF
    const fileName = `janya-donation-${status}-${transactionId || 'receipt'}.pdf`;
    doc.save(fileName);
  };

  useEffect(() => {
    if (transactionId) {
      checkPaymentStatus();
    } else {
      setStatus('unknown');
    }
  }, [transactionId]);

  // Auto download PDF when status is determined (not checking)
  useEffect(() => {
    if (status !== 'checking' && status !== 'unknown' && transactionId) {
      // Small delay to ensure UI is rendered first
      const timer = setTimeout(() => {
        downloadPDF();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
      } else if (data.status === 'PENDING') {
        setStatus('pending');
        // Retry after 3 seconds
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
    <div className="min-h-screen bg-[#bdcbcc] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'checking' && (
          <>
            <div className="w-16 h-16 border-4 border-[#374342] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Verifying Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your donation...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
            <p className="text-gray-600 mb-4">Your donation has been received successfully.</p>
            {paymentDetails?.amount && (
              <p className="text-lg font-semibold text-[#374342] mb-4">
                Amount: ₹{paymentDetails.amount.toLocaleString()}
              </p>
            )}
            {transactionId && (
              <p className="text-sm text-gray-500 mb-6">
                Transaction ID: {transactionId}
              </p>
            )}
            <p className="text-gray-600 mb-6">
              Your generous contribution will help us continue our mission to empower women and children.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={downloadPDF}
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </button>
              <Link
                href="/"
                className="inline-block bg-[#374342] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2D3B3A] transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Payment Pending</h1>
            <p className="text-gray-600 mb-4">Your payment is being processed. Please wait...</p>
            <div className="w-8 h-8 border-4 border-[#374342] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            {transactionId && (
              <p className="text-sm text-gray-500 mb-4">
                Transaction ID: {transactionId}
              </p>
            )}
            <button
              onClick={downloadPDF}
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Receipt
            </button>
          </>
        )}

        {(status === 'failed' || status === 'error') && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-4">
              We couldn't process your donation. Please try again or contact support.
            </p>
            {transactionId && (
              <p className="text-sm text-gray-500 mb-4">
                Transaction ID: {transactionId}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={downloadPDF}
                className="inline-flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Receipt
              </button>
              <Link
                href="/"
                className="inline-block bg-[#374342] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2D3B3A] transition-colors"
              >
                Try Again
              </Link>
            </div>
          </>
        )}

        {status === 'unknown' && (
          <>
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
              href="/"
              className="inline-block bg-[#374342] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2D3B3A] transition-colors"
            >
              Return to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#bdcbcc] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 border-4 border-[#374342] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h1>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}

export default function DonationSuccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DonationSuccessContent />
    </Suspense>
  );
}
