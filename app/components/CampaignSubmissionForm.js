'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CampaignSubmissionForm({ onClose, inline = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    campaignTitle: '',
    description: '',
    goalAmount: '',
    category: 'Education',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: submitError } = await supabase
        .from('campaigns')
        .insert([{
          title: formData.campaignTitle,
          description: formData.description,
          image_url: formData.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1170&auto=format&fit=crop',
          goal_amount: parseFloat(formData.goalAmount),
          category: formData.category,
          organizer_name: formData.name,
          organizer_email: formData.email,
          organizer_phone: formData.phone,
          status: 'pending'
        }]);

      if (submitError) throw submitError;

      setIsSuccess(true);
      if (!inline) {
        setTimeout(() => onClose(), 2000);
      }
    } catch (err) {
      console.error('Error submitting campaign:', err.message || err);
      setError(err.message || 'Failed to submit campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className={`${inline ? '' : 'p-8'}`}>
      {!inline && (
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      {isSuccess ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-500">Your campaign form has been received. It will be **reviewed and published** on our platform within 24-48 hours. Thank you for your initiative!</p>
          {inline && (
            <button 
              onClick={() => setIsSuccess(false)}
              className="mt-6 text-sm font-semibold text-[#e90074] hover:underline"
            >
              Submit another fundraiser
            </button>
          )}
        </div>
      ) : (
        <>
          <h2 className={`text-3xl font-bold text-gray-900 mb-2 ${inline ? 'hidden' : ''}`} style={{ fontFamily: 'sohne-var, sans-serif' }}>Start a <span className="text-[#e90074]">Fundraiser</span></h2>
          <p className={`text-gray-500 mb-8 ${inline ? 'hidden' : ''}`}>Tell us about the cause you want to support. We'll help you reach the world.</p>

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

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Cover Image URL (Optional)</label>
              <input type="text" className="w-full border-b-2 border-gray-100 p-2 focus:border-[#e90074] outline-none transition-colors text-sm" placeholder="https://example.com/image.jpg" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
            </div>

            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

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
  );

  if (inline) return formContent;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-xl rounded-none shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {formContent}
      </div>
    </div>
  );
}
