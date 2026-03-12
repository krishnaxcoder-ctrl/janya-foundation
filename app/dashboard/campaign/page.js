'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard, Icons } from '../layout';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ManageCampaignsPage() {
  const { fetchData } = useDashboard();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchAllCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCampaigns();
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
      await fetchAllCampaigns();
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

  const filteredCampaigns = campaigns.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.organizer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Approved</Badge>;
      case 'pending': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">Pending</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">All Campaigns</h2>
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icons.search}</span>
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 min-h-0">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-600">Campaign</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                <TableHead className="font-semibold text-gray-600">Raised / Goal</TableHead>
                <TableHead className="font-semibold text-gray-600">Organizer</TableHead>
                <TableHead className="font-semibold text-gray-600">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-gray-400 font-medium">Loading campaigns...</TableCell>
                </TableRow>
              ) : filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-24">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        {Icons.heart}
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-900 font-bold text-lg">No campaigns found</p>
                        <p className="text-gray-500">Either there are no fundraisers yet or your search matched nothing.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCampaigns.map((c) => (
                <TableRow 
                  key={c.id} 
                  className="hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => setSelectedCampaign(c)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {c.image_url && (
                        <img src={c.image_url} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 line-clamp-1">{c.title}</span>
                        <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wider">{c.category}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(c.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-sm">₹{parseFloat(c.raised_amount || 0).toLocaleString()}</span>
                      <span className="text-xs text-gray-400">Goal: ₹{parseFloat(c.goal_amount || 0).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">{c.organizer_name}</span>
                      <span className="text-[10px] text-gray-400">{c.organizer_email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Campaign Detail Modal */}
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
                <span className="px-2.5 py-1 rounded bg-pink-100 text-pink-700 text-[10px] font-bold uppercase tracking-wider">
                  {selectedCampaign.category}
                </span>
                {getStatusBadge(selectedCampaign.status)}
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

              {/* Progress Bar */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Financial Progress</span>
                  <span className="text-xs font-bold text-pink-600">{Math.round((parseFloat(selectedCampaign.raised_amount || 0) / parseFloat(selectedCampaign.goal_amount || 0)) * 100)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-pink-600 rounded-full"
                    style={{ width: `${Math.min(100, (parseFloat(selectedCampaign.raised_amount || 0) / parseFloat(selectedCampaign.goal_amount || 0)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>RAISED: ₹{parseFloat(selectedCampaign.raised_amount || 0).toLocaleString()}</span>
                  <span>TARGET: ₹{parseFloat(selectedCampaign.goal_amount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Simple Actions */}
              <div className="flex gap-3">
                {selectedCampaign.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleAction(selectedCampaign.id, 'approved')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-sm transition-colors"
                    >
                      Approve Campaign
                    </button>
                    <button 
                      onClick={() => handleAction(selectedCampaign.id, 'rejected')}
                      className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-lg text-sm transition-colors"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setSelectedCampaign(null)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg text-sm transition-colors"
                  >
                    Close Preview
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
