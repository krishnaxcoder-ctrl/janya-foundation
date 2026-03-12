'use client';

import { useState, useEffect } from 'react';

export default function CampaignSubmissionForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    campaignTitle: '',
    description: '',
    goalAmount: '',
    category: 'Education'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-xl rounded-none shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {isSuccess ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
              <p className="text-gray-500">Your campaign form has been received. It will be **reviewed and published** on our platform within 24-48 hours. Thank you for your initiative!</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'sohne-var, sans-serif' }}>Start a <span className="text-[#e90074]">Fundraiser</span></h2>
              <p className="text-gray-500 mb-8">Tell us about the cause you want to support. We'll help you reach the world.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Your Name</label>
                    <input required type="text" className="w-full border-b-2 border-gray-100 p-2 focus:border-[#e90074] outline-none transition-colors text-sm" placeholder="John Doe" onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email Address</label>
                    <input required type="email" className="w-full border-b-2 border-gray-100 p-2 focus:border-[#e90074] outline-none transition-colors text-sm" placeholder="john@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Campaign Title</label>
                  <input required type="text" className="w-full border-b-2 border-gray-100 p-2 focus:border-[#e90074] outline-none transition-colors text-sm" placeholder="e.g., Books for Village Kids" onChange={e => setFormData({...formData, campaignTitle: e.target.value})} />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Description</label>
                  <textarea required className="w-full border-b-2 border-gray-100 p-2 focus:border-[#e90074] outline-none transition-colors text-sm h-24 resize-none" placeholder="Explain the impact and need..." onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Goal Amount (₹)</label>
                    <input required type="number" className="w-full border-b-2 border-gray-100 p-2 focus:border-[#e90074] outline-none transition-colors text-sm" placeholder="50,000" onChange={e => setFormData({...formData, goalAmount: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Category</label>
                    <input required type="text" className="w-full border-b-2 border-gray-100 p-2 focus:border-[#e90074] outline-none transition-colors text-sm" placeholder="e.g., Education" onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#e90074] text-white font-bold py-4 rounded-none shadow-xl shadow-pink-100 hover:shadow-pink-200 active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing Submission...' : 'Launch Fundraiser Request'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
