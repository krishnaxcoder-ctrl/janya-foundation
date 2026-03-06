'use client';

import React, { useState } from 'react';
import { useDashboard, Icons } from '../layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegistrationsPage() {
  const { allRegistrations, fetchData } = useDashboard();

  // Filter state
  const [regSearchTerm, setRegSearchTerm] = useState('');
  const [regFilterRace, setRegFilterRace] = useState('all');
  const [regFilterPayment, setRegFilterPayment] = useState('all');
  const [regFilterTshirt, setRegFilterTshirt] = useState('all');
  const [regFilterDate, setRegFilterDate] = useState('');
  const [regFilterEmail, setRegFilterEmail] = useState('all');

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDateFrom, setExportDateFrom] = useState('');
  const [exportDateTo, setExportDateTo] = useState('');

  // Copy to clipboard state
  const [copiedId, setCopiedId] = useState(null);

  // Resend email state
  const [resendingEmail, setResendingEmail] = useState(null);

  // Resend email function
  const resendEmail = async (transactionId) => {
    setResendingEmail(transactionId);
    try {
      const response = await fetch('/api/marathon/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Email sent successfully to ${data.participant.name} (${data.participant.email})`);
        fetchData(); // Refresh data
      } else {
        alert(`Failed to send email: ${data.participantError || data.adminError || data.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setResendingEmail(null);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Computed values
  const regAllRaces = [...new Set(allRegistrations.map(r => r.race_category).filter(Boolean))].sort();
  const regAllTshirtSizes = [...new Set(allRegistrations.map(r => r.tshirt_size).filter(Boolean))].sort();

  const regFiltered = allRegistrations.filter(r => {
    // Hide only PENDING from default "all" view (show SUCCESS and FAILED)
    if (r.payment_status === 'PENDING' && regFilterPayment === 'all') return false;
    const matchSearch = regSearchTerm === '' ||
      (r.name && r.name.toLowerCase().includes(regSearchTerm.toLowerCase())) ||
      (r.email && r.email.toLowerCase().includes(regSearchTerm.toLowerCase())) ||
      (r.phone && r.phone.includes(regSearchTerm));
    const matchRace = regFilterRace === 'all' || r.race_category === regFilterRace;
    const matchPayment = regFilterPayment === 'all' || r.payment_status === regFilterPayment;
    const matchTshirt = regFilterTshirt === 'all' || r.tshirt_size === regFilterTshirt;

    // Email filter - only apply to SUCCESS payments
    let matchEmail = true;
    if (regFilterEmail === 'sent') {
      matchEmail = r.email_sent === true;
    } else if (regFilterEmail === 'failed') {
      matchEmail = r.payment_status === 'SUCCESS' && r.email_sent !== true;
    }

    // Date filter - match registrations from the selected date
    let matchDate = true;
    if (regFilterDate) {
      const filterDate = new Date(regFilterDate);
      const regDate = new Date(r.created_at);
      matchDate = filterDate.toDateString() === regDate.toDateString();
    }

    return matchSearch && matchRace && matchPayment && matchTshirt && matchDate && matchEmail;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const exportToCSV = () => {
    let dataToExport = allRegistrations.filter(r => r.payment_status === 'SUCCESS');

    if (exportDateFrom) {
      const fromDate = new Date(exportDateFrom);
      fromDate.setHours(0, 0, 0, 0);
      dataToExport = dataToExport.filter(r => new Date(r.created_at) >= fromDate);
    }
    if (exportDateTo) {
      const toDate = new Date(exportDateTo);
      toDate.setHours(23, 59, 59, 999);
      dataToExport = dataToExport.filter(r => new Date(r.created_at) <= toDate);
    }

    if (dataToExport.length === 0) {
      alert('No registrations found for the selected date range');
      return;
    }

    const headers = ['#', 'Name', 'Phone', 'Email', 'Race', 'Age', 'Gender', 'T-Shirt Size', 'Address', 'Emergency Phone', 'Coupon', 'Amount', 'Convenience Fee', 'Total Amount', 'Payment ID', 'Transaction ID', 'Payment Status', 'Date'];

    const rows = dataToExport.map((r, i) => [
      i + 1,
      r.name || '',
      r.phone || '',
      r.email || '',
      r.race_category || '',
      r.date_of_birth ? new Date().getFullYear() - new Date(r.date_of_birth).getFullYear() : r.age_legacy || '',
      r.gender || '',
      r.tshirt_size || '',
      (r.address || '').replace(/,/g, ' '),
      r.emergency_phone || '',
      r.coupon_code || '',
      r.amount || 0,
      r.convenience_fee || 0,
      r.total_amount || 0,
      r.payment_id || '',
      r.transaction_id || '',
      r.payment_status || '',
      r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const fileName = `registrations_${exportDateFrom || 'all'}_to_${exportDateTo || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(false);
    setExportDateFrom('');
    setExportDateTo('');
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex gap-2 items-center flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{Icons.search}</span>
            <Input
              placeholder="Search..."
              value={regSearchTerm}
              onChange={e => setRegSearchTerm(e.target.value)}
              className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white w-full"
            />
          </div>
          {/* Filter Dropdowns */}
          <Select value={regFilterTshirt} onValueChange={setRegFilterTshirt}>
            <SelectTrigger className="w-[90px] h-9 bg-gray-50 border-gray-200 text-xs">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              {regAllTshirtSizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={regFilterEmail} onValueChange={setRegFilterEmail}>
            <SelectTrigger className="w-[100px] h-9 bg-gray-50 border-gray-200 text-xs">
              <SelectValue placeholder="Email" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Emails</SelectItem>
              <SelectItem value="sent">Email Sent</SelectItem>
              <SelectItem value="failed">Email Failed</SelectItem>
            </SelectContent>
          </Select>
          {/* Payment Status Filter */}
          <Select value={regFilterPayment} onValueChange={setRegFilterPayment}>
            <SelectTrigger className="w-[100px] h-9 bg-gray-50 border-gray-200 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
          {/* Date & Actions */}
          <Input
            type="date"
            value={regFilterDate}
            onChange={e => setRegFilterDate(e.target.value)}
            className="w-[160px] h-9 bg-gray-50 border-gray-200 text-xs"
            title="Filter by date"
          />
          {(regSearchTerm || regFilterRace !== 'all' || regFilterPayment !== 'all' || regFilterTshirt !== 'all' || regFilterDate || regFilterEmail !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setRegSearchTerm(''); setRegFilterRace('all'); setRegFilterPayment('all'); setRegFilterTshirt('all'); setRegFilterDate(''); setRegFilterEmail('all'); }}
              className="h-9 px-2 text-gray-500 hover:text-gray-700"
            >
              {Icons.x}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={fetchData} className="h-9 px-2">
            {Icons.refresh}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)} className="h-9 px-2">
            {Icons.download}
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 min-h-0">
        <div className="h-full overflow-auto">
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-10 font-semibold text-gray-600">#</TableHead>
                  <TableHead className="w-28 font-semibold text-gray-600">Participant</TableHead>
                  <TableHead className="w-28 font-semibold text-gray-600">Phone</TableHead>
                  <TableHead className="w-40 font-semibold text-gray-600">Email</TableHead>
                  <TableHead className="w-52 sm:w-24 font-semibold text-gray-600">Race</TableHead>
                  <TableHead className="w-10 font-semibold text-gray-600">Age</TableHead>
                  <TableHead className="w-16 font-semibold text-gray-600">Gender</TableHead>
                  <TableHead className="w-20 font-semibold text-gray-600">T-Shirt</TableHead>
                  <TableHead className="w-20 font-semibold text-gray-600">Coupon</TableHead>
                  <TableHead className="w-20 font-semibold text-gray-600 text-right">Amount</TableHead>
                  <TableHead className="w-16 font-semibold text-gray-600 text-center">Status</TableHead>
                  <TableHead className="w-20 font-semibold text-gray-600 text-center">Email</TableHead>
                  <TableHead className="w-36 font-semibold text-gray-600">Transaction ID</TableHead>
                  <TableHead className="w-24 font-semibold text-gray-600">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regFiltered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          {Icons.users}
                        </div>
                        <p className="text-gray-500 font-medium">No registrations found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : regFiltered.map((r, i) => (
                  <TableRow key={r.id || i} className="hover:bg-gray-50/50">
                    <TableCell className="text-gray-400 font-mono text-sm">{i + 1}</TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{r.name || '-'}</p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">{r.phone || '-'}</TableCell>
                    <TableCell className="text-sm text-gray-700 max-w-[160px]">
                      {r.email ? (
                        <button
                          onClick={() => copyToClipboard(r.email, `email-${r.id}`)}
                          className="truncate max-w-[160px] block text-left hover:text-pink-600 cursor-pointer transition-colors group relative"
                          title="Click to copy"
                        >
                          {copiedId === `email-${r.id}` ? (
                            <span className="text-green-600 font-medium">Copied!</span>
                          ) : (
                            <span className="group-hover:underline">{r.email}</span>
                          )}
                        </button>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 whitespace-nowrap">
                        {r.race_category || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {r.date_of_birth ? new Date().getFullYear() - new Date(r.date_of_birth).getFullYear() : r.age_legacy || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{r.gender || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {r.tshirt_size ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 whitespace-nowrap">
                          {r.tshirt_size}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.coupon_code ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-600">
                          {r.coupon_code}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-gray-900">₹{parseFloat(r.total_amount || 0).toLocaleString('en-IN')}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {r.payment_status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          Paid
                        </span>
                      ) : r.payment_status === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {r.payment_status === 'SUCCESS' ? (
                        r.email_sent ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Sent
                          </span>
                        ) : (
                          <button
                            onClick={() => resendEmail(r.transaction_id)}
                            disabled={resendingEmail === r.transaction_id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer disabled:opacity-50"
                            title="Click to resend email"
                          >
                            {resendingEmail === r.transaction_id ? (
                              <>
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                Sending...
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Resend
                              </>
                            )}
                          </button>
                        )
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.transaction_id ? (
                        <button
                          onClick={() => copyToClipboard(r.transaction_id, `txn-${r.id}`)}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-700 cursor-pointer transition-colors"
                          title="Click to copy"
                        >
                          {copiedId === `txn-${r.id}` ? (
                            <span className="text-green-600">Copied!</span>
                          ) : (
                            r.transaction_id
                          )}
                        </button>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(r.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Registrations</DialogTitle>
            <DialogDescription>Select date range to export registrations as CSV</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={exportDateFrom}
                  onChange={e => setExportDateFrom(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={exportDateTo}
                  onChange={e => setExportDateTo(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Note:</span> Leave dates empty to export all registrations. Only paid registrations will be exported.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowExportModal(false); setExportDateFrom(''); setExportDateTo(''); }}>Cancel</Button>
            <Button onClick={exportToCSV} className="gap-2">{Icons.download} Export CSV</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
