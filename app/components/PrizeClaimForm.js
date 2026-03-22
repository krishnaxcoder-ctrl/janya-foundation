'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PrizeClaimForm({ onClose }) {
  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    ageCategory: '',
    age: '',
  });

  const [files, setFiles] = useState({
    ageProof: null,
    aadharCard: null,
    panCard: null,
  });

  const [fileNames, setFileNames] = useState({
    ageProof: '',
    aadharCard: '',
    panCard: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const ageCategories = [
    { id: '5km', label: '5 KM Competitive' },
    { id: '10km', label: '10 KM Competitive' },
    { id: '21km', label: '21.1 KM Half Marathon' },
    { id: 'cause5km', label: '5 KM Run for Cause' },
    { id: 'cause10km', label: '10 KM Run for Cause' },
    { id: '3km', label: '3 KM Fun Run' },
    { id: 'kidsrun', label: 'Kids Run' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPG, PNG, and PDF files are allowed');
        return;
      }
      setError('');
      setFiles({
        ...files,
        [fieldName]: file,
      });
      setFileNames({
        ...fileNames,
        [fieldName]: file.name,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('phone', formData.phone);
      submitData.append('email', formData.email);
      submitData.append('address', formData.address);
      submitData.append('ageCategory', formData.ageCategory);
      submitData.append('age', formData.age);

      if (files.ageProof) {
        submitData.append('ageProof', files.ageProof);
      }
      if (files.aadharCard) {
        submitData.append('aadharCard', files.aadharCard);
      }
      if (files.panCard) {
        submitData.append('panCard', files.panCard);
      }

      const response = await axios.post('/api/prize-claim', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSubmitted(true);
      } else {
        setError(response.data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.phone &&
      formData.email &&
      formData.address &&
      formData.ageCategory &&
      formData.age &&
      files.ageProof &&
      files.aadharCard &&
      files.panCard
    );
  };

  // Success State
  if (submitted) {
    return (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[2147483647] overflow-y-auto"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-lg overflow-hidden w-full mx-auto my-8 max-w-[500px]"
        >
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Thank You for Submitting!
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Your documents have been received successfully. Your prize money will be credited within{' '}
              <span className="font-semibold text-pink-600">60-70 working days</span> after verifying everything.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700 text-left">
                  We will contact you via email or phone if any additional information is required during verification.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[2147483647] overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg overflow-hidden w-full mx-auto my-8 max-w-[500px] max-h-[90vh] overflow-y-auto"
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Claim Your Prize</h2>
              <p className="text-sm text-gray-500">Marathon 2025 Winners</p>
            </div>
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

          {/* Info Banner */}
          <div className="bg-pink-50 border border-pink-100 rounded-lg p-3 mb-5">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-pink-700">
                Please upload clear images of your documents. All fields are mandatory for prize claim verification.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="text-sm text-gray-700 mb-1 block font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name as per Aadhar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-800"
                  required
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone" className="text-sm text-gray-700 mb-1 block font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm text-gray-700 mb-1 block font-medium">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="text-sm text-gray-700 mb-1 block font-medium">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-800 resize-none"
                  required
                />
              </div>

              {/* Age Category & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ageCategory" className="text-sm text-gray-700 mb-1 block font-medium">
                    Race Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="ageCategory"
                    name="ageCategory"
                    value={formData.ageCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-800 bg-white"
                    required
                  >
                    <option value="">Select category</option>
                    {ageCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="age" className="text-sm text-gray-700 mb-1 block font-medium">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Your age"
                    min="5"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Document Uploads */}
              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Upload Documents
                </h3>

                {/* Age Proof */}
                <div className="mb-3">
                  <label className="text-sm text-gray-700 mb-1 block">
                    Age Proof (Birth Certificate / School ID) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="ageProof"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={(e) => handleFileChange(e, 'ageProof')}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="ageProof"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        fileNames.ageProof
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                      }`}
                    >
                      {fileNames.ageProof ? (
                        <>
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-green-700 truncate max-w-[200px]">{fileNames.ageProof}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500">Click to upload age proof</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Aadhar Card */}
                <div className="mb-3">
                  <label className="text-sm text-gray-700 mb-1 block">
                    Aadhar Card <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="aadharCard"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={(e) => handleFileChange(e, 'aadharCard')}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="aadharCard"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        fileNames.aadharCard
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                      }`}
                    >
                      {fileNames.aadharCard ? (
                        <>
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-green-700 truncate max-w-[200px]">{fileNames.aadharCard}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <span className="text-sm text-gray-500">Click to upload Aadhar card</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* PAN Card */}
                <div className="mb-3">
                  <label className="text-sm text-gray-700 mb-1 block">
                    PAN Card <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="panCard"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={(e) => handleFileChange(e, 'panCard')}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="panCard"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        fileNames.panCard
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                      }`}
                    >
                      {fileNames.panCard ? (
                        <>
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-green-700 truncate max-w-[200px]">{fileNames.panCard}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="text-sm text-gray-500">Click to upload PAN card</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: JPG, PNG, PDF (Max 5MB each)
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className={`w-full py-3 rounded-lg text-white text-sm font-medium transition-colors mt-4 ${
                  loading || !isFormValid()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-pink-500 hover:bg-pink-600'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Documents'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Your documents are secure and will only be used for prize verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
