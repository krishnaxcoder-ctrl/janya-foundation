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
      alert(`Campaign ${newStatus} successfully!`);
    } catch (err) {
      console.error(`Error updating campaign to ${newStatus}:`, err);
      alert(`Failed to update campaign: ${err.message || 'Unknown error'}. Have you added the UPDATE policy in Supabase?`);
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
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedCampaign(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden relative border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Simple Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                  {selectedCampaign.category}
                </span>
                <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
                  Pending Review
                </span>
              </div>
              <button 
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                {Icons.x}
              </button>
            </div>

            <div className="p-8">
              {/* Image & Main Info */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                {selectedCampaign.image_url && (
                  <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                    <img src={selectedCampaign.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{selectedCampaign.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{selectedCampaign.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Organizer</p>
                      <p className="text-sm font-semibold">{selectedCampaign.organizer_name}</p>
                      <p className="text-xs text-gray-500">{selectedCampaign.organizer_email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Goal Amount</p>
                      <p className="text-lg font-bold text-gray-900">₹{parseFloat(selectedCampaign.goal_amount || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simple Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button 
                  onClick={() => handleAction(selectedCampaign.id, 'approved')}
                  disabled={processingId === selectedCampaign.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {processingId === selectedCampaign.id ? 'Processing...' : 'Approve Initiative'}
                </button>
                <button 
                  onClick={() => handleAction(selectedCampaign.id, 'rejected')}
                  disabled={processingId === selectedCampaign.id}
                  className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
