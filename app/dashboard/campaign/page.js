'use client';

import React, { useState } from 'react';
import { useDashboard, Icons } from '../layout';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CampaignPage() {
  const { campaignDonations, campaignStats } = useDashboard();
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredDonations = campaignDonations.filter(d =>
    !campaignSearchTerm ||
    d.donor_name?.toLowerCase().includes(campaignSearchTerm.toLowerCase()) ||
    d.donor_email?.toLowerCase().includes(campaignSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex flex-col gap-3">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icons.search}</span>
            <Input
              placeholder="Search by name or email..."
              value={campaignSearchTerm}
              onChange={e => setCampaignSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-green-50 rounded-lg">
              <span className="text-xs text-gray-500">Raised:</span>
              <span className="text-xs font-semibold text-green-600">₹{campaignStats.totalRaised?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1.5 bg-blue-50 rounded-lg">
              <span className="text-xs text-gray-500">Donors:</span>
              <span className="text-xs font-semibold text-blue-600">{campaignStats.donorCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 min-h-0">
        <div className="h-full overflow-auto">
          <div className="overflow-x-auto">
            <Table className="min-w-[500px]">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-10 font-semibold text-gray-600">#</TableHead>
                  <TableHead className="font-semibold text-gray-600">Donor</TableHead>
                  <TableHead className="font-semibold text-gray-600">Email</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          {Icons.heart}
                        </div>
                        <p className="text-gray-500 font-medium">No donations found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDonations.map((d, i) => (
                  <TableRow key={d.id || i} className="hover:bg-gray-50/50">
                    <TableCell className="text-gray-400 font-mono text-sm">{i + 1}</TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">
                        {d.is_anonymous ? <span className="italic text-gray-400">Anonymous</span> : d.donor_name || '-'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500 truncate max-w-[150px]">{d.donor_email || '-'}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-gray-900">₹{parseFloat(d.amount || 0).toLocaleString('en-IN')}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {d.payment_status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          {d.payment_status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(d.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
