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
                <TableRow key={c.id}>
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
    </div>
  );
}
