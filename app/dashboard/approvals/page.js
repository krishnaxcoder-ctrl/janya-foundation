'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard, Icons } from '../layout';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function ApprovalsPage() {
  const { fetchData } = useDashboard();
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingCampaigns(data || []);
    } catch (err) {
      console.error('Error fetching pending campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, newStatus) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh list
      await fetchPending();
      // Refresh layout stats
      fetchData();
      // Close modal
      setSelectedCampaign(null);
    } catch (err) {
      console.error(`Error updating campaign to ${newStatus}:`, err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
        <Button onClick={fetchPending} variant="outline" size="sm" className="gap-2">
          {Icons.refresh} Refresh
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 min-h-0">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Campaign Info</TableHead>
                <TableHead className="font-semibold">Organizer</TableHead>
                <TableHead className="font-semibold text-right">Goal</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-gray-400">Loading pending campaigns...</TableCell>
                </TableRow>
              ) : pendingCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        {Icons.flag}
                      </div>
                      <p className="text-gray-500 font-medium">No pending campaigns</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : pendingCampaigns.map((c) => (
                <TableRow 
                  key={c.id} 
                  className="hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => setSelectedCampaign(c)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{c.title}</span>
                      <span className="text-xs text-gray-500 line-clamp-1">{c.description}</span>
                      <span className="text-[10px] uppercase font-bold text-[#e90074] mt-1">{c.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{c.organizer_name}</span>
                      <span className="text-xs text-gray-400">{c.organizer_email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold">₹{c.goal_amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 h-8 px-4" 
                        onClick={() => handleAction(c.id, 'approved')}
                        disabled={processingId === c.id}
                      >
                        {processingId === c.id ? '...' : 'Approve'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="h-8 px-4"
                        onClick={() => handleAction(c.id, 'rejected')}
                        disabled={processingId === c.id}
                      >
                        {processingId === c.id ? '...' : 'Reject'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
          onClick={() => setSelectedCampaign(null)}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl w-full max-w-3xl rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header / Media Section */}
            <div className="relative h-64 sm:h-80 group">
              {selectedCampaign.image_url ? (
                <img 
                  src={selectedCampaign.image_url} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-200">
                  <span className="scale-[4] opacity-20">{Icons.heart}</span>
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Top Actions */}
              <div className="absolute top-6 right-6 flex items-center gap-3">
                <button 
                  onClick={() => setSelectedCampaign(null)}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-xl border border-white/10"
                >
                  <span className="rotate-45 block">{Icons.refresh}</span>
                </button>
              </div>

              {/* Title & Category Overlay */}
              <div className="absolute bottom-6 left-8 right-8 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-500/30">
                    {selectedCampaign.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-orange-500/30">
                    Pending Review
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight drop-shadow-sm">
                  {selectedCampaign.title}
                </h3>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Left Column: Description & Details */}
                <div className="lg:col-span-3 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">About Initiative</h4>
                    <p className="text-gray-600 leading-relaxed text-lg font-medium selection:bg-pink-100">
                      {selectedCampaign.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Organizer</h4>
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900 border-l-2 border-pink-500 pl-3">{selectedCampaign.organizer_name}</p>
                        <p className="text-xs text-gray-500 pl-3">{selectedCampaign.organizer_email}</p>
                        {selectedCampaign.organizer_phone && (
                          <p className="text-xs text-gray-400 pl-3">{selectedCampaign.organizer_phone}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Goal Info</h4>
                      <p className="text-2xl font-black text-gray-900 leading-none">₹{parseFloat(selectedCampaign.goal_amount || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Target Amount</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Actions / Stats */}
                <div className="lg:col-span-2 flex flex-col justify-end">
                  <div className="space-y-4">
                    <button 
                      onClick={() => handleAction(selectedCampaign.id, 'approved')}
                      disabled={processingId === selectedCampaign.id}
                      className="w-full group relative overflow-hidden bg-gray-900 text-white font-black py-5 rounded-2xl shadow-2xl shadow-gray-200 disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                        {processingId === selectedCampaign.id ? (
                          <span className="">{Icons.refresh}</span>
                        ) : (
                          <>Approve Initiative <span className="rotate-90">{Icons.refresh}</span></>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 translate-y-full group-hover:translate-y-0" />
                    </button>

                    <button 
                      onClick={() => handleAction(selectedCampaign.id, 'rejected')}
                      disabled={processingId === selectedCampaign.id}
                      className="w-full bg-white border-2 border-gray-100 hover:border-red-100 hover:text-red-500 font-bold py-5 rounded-2xl text-gray-500 text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                      Decline Request
                    </button>
                    
                    <p className="text-[9px] text-center text-gray-400 uppercase font-bold tracking-widest pt-2">
                       Manual verification required before approval
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
