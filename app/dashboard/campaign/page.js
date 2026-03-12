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
    } catch (err) {
      console.error(`Error updating campaign to ${newStatus}:`, err);
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

              {/* Title & Status Overlay */}
              <div className="absolute bottom-6 left-8 right-8 text-white text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#e90074] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-500/30">
                    {selectedCampaign.category}
                  </span>
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full h-2 w-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                    ID: {selectedCampaign.id.slice(0, 8)}
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight drop-shadow-sm">
                  {selectedCampaign.title}
                </h3>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 sm:p-10 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Left Column: Description & Metadata */}
                <div className="lg:col-span-3 space-y-8">
                  <p className="text-gray-600 leading-relaxed text-lg font-medium selection:bg-pink-100 underline decoration-pink-500/20 underline-offset-4 decoration-2">
                    {selectedCampaign.description}
                  </p>

                  <div className="flex flex-wrap gap-10 border-t border-gray-100 pt-8">
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organizer</h4>
                      <p className="font-bold text-gray-900">{selectedCampaign.organizer_name}</p>
                      <p className="text-xs text-gray-500">{selectedCampaign.organizer_email}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility</h4>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedCampaign.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Financials & Action */}
                <div className="lg:col-span-2 flex flex-col justify-end">
                  <div className="bg-gray-50/80 rounded-3xl p-8 border border-white shadow-sm space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Financial Progress</h4>
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-2xl font-black text-gray-900 leading-none">
                          ₹{parseFloat(selectedCampaign.raised_amount || 0).toLocaleString()}
                        </span>
                        <span className="text-pink-600 font-black text-sm">
                          {Math.round((parseFloat(selectedCampaign.raised_amount || 0) / parseFloat(selectedCampaign.goal_amount || 0)) * 100)}%
                        </span>
                      </div>
                      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#e90074] rounded-full shadow-[0_0_15px_rgba(233,0,116,0.3)]"
                          style={{ width: `${(parseFloat(selectedCampaign.raised_amount || 0) / parseFloat(selectedCampaign.goal_amount || 0)) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Goal: ₹{parseFloat(selectedCampaign.goal_amount || 0).toLocaleString()}</p>
                        <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest underline underline-offset-4 underline-thickness-2">{selectedCampaign.donors_count || 0} Donors</p>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      {selectedCampaign.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleAction(selectedCampaign.id, 'approved')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-100 text-xs uppercase tracking-widest"
                          >
                            Approve Now
                          </button>
                          <button 
                            onClick={() => handleAction(selectedCampaign.id, 'rejected')}
                            className="w-full bg-white border border-red-100 text-red-500 font-black py-4 rounded-2xl transition-all text-[10px] uppercase tracking-widest hover:bg-red-50"
                          >
                            Reject Initiative
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setSelectedCampaign(null)}
                          className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black shadow-2xl shadow-gray-200 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          Close Preview
                        </button>
                      )}
                    </div>
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
