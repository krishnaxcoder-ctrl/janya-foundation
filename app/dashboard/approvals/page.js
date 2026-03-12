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
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCampaign(null)}>
          <div 
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Header with Image */}
            <div className="relative h-48 sm:h-64 bg-gray-100">
              {selectedCampaign.image_url ? (
                <img src={selectedCampaign.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Icons.flag className="w-12 h-12" />
                </div>
              )}
              <button 
                onClick={() => setSelectedCampaign(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCampaign.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] uppercase font-bold">Pending</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{selectedCampaign.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Organizer Details</span>
                    <p className="font-bold text-gray-900">{selectedCampaign.organizer_name}</p>
                    <p className="text-xs text-gray-500">{selectedCampaign.organizer_email}</p>
                    {selectedCampaign.organizer_phone && <p className="text-xs text-gray-500">{selectedCampaign.organizer_phone}</p>}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Category</span>
                    <p className="font-bold text-[#e90074]">{selectedCampaign.category}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Financial Goal</span>
                    <p className="text-2xl font-black text-gray-900">₹{parseFloat(selectedCampaign.goal_amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Submission Date</span>
                    <p className="text-sm font-medium">{new Date(selectedCampaign.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleAction(selectedCampaign.id, 'approved')}
                  disabled={processingId === selectedCampaign.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-100 disabled:opacity-50"
                >
                  {processingId === selectedCampaign.id ? 'Processing...' : 'Approve Campaign'}
                </button>
                <button 
                  onClick={() => handleAction(selectedCampaign.id, 'rejected')}
                  disabled={processingId === selectedCampaign.id}
                  className="flex-1 bg-white border-2 border-red-50 hover:bg-red-50 text-red-600 font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
