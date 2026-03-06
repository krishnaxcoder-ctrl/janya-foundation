'use client';

import React, { useState } from 'react';

// Readable labels for custom fields
const FIELD_LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  pan_number: 'PAN Number',
  donation_type: 'Donation Type',
  race_category: 'Race Category',
  race_type: 'Race Type',
  gender: 'Gender',
  date_of_birth: 'Date of Birth',
  tshirt_size: 'T-Shirt Size',
  address: 'Address',
  emergency_phone: 'Emergency Phone',
  coupon_code: 'Coupon Code',
  coupon_discount: 'Coupon Discount',
  convenience_fee: 'Convenience Fee',
  is_run_for_cause: 'Run for Cause',
  is_donation: 'Is Donation',
};

export default function TransactionsPage() {
  const [singleId, setSingleId] = useState('');
  const [bulkIds, setBulkIds] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('single');
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchTransactions = async (ids) => {
    setLoading(true);
    setError('');
    setExpandedRow(null);
    try {
      const res = await fetch('/api/phonepe/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionIds: ids }),
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
      } else {
        setError(data.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSingleSearch = (e) => {
    e.preventDefault();
    const id = singleId.trim();
    if (!id) return;
    fetchTransactions([id]);
  };

  const handleBulkSearch = (e) => {
    e.preventDefault();
    const ids = bulkIds
      .split(/[\n,]+/)
      .map((id) => id.trim())
      .filter(Boolean);
    if (ids.length === 0) return;
    if (ids.length > 50) {
      setError('Maximum 50 transaction IDs at a time');
      return;
    }
    fetchTransactions(ids);
  };

  const getStatusColor = (state) => {
    switch (state) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'CREATED':
        return 'bg-blue-100 text-blue-700';
      case 'FAILED':
      case 'ERROR':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentMode = (txn) => {
    if (!txn.paymentDetails || txn.paymentDetails.length === 0) return '-';
    const detail = txn.paymentDetails[0];
    return detail.paymentMode || detail.rail?.type || '-';
  };

  const getPaymentId = (txn) => {
    if (!txn.paymentDetails || txn.paymentDetails.length === 0) return '-';
    return txn.paymentDetails[0].transactionId || '-';
  };

  // Get non-null custom fields for a transaction
  const getCustomFields = (txn) => {
    if (!txn.customFields) return [];
    return Object.entries(txn.customFields)
      .filter(([, value]) => value !== null && value !== '' && value !== undefined)
      .map(([key, value]) => ({
        key,
        label: FIELD_LABELS[key] || key,
        value,
      }));
  };

  // Summary stats
  const completedTxns = transactions.filter(
    (t) => t.state === 'COMPLETED' || t.state === 'SUCCESS'
  );
  const totalAmount = completedTxns.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const pendingCount = transactions.filter(
    (t) => t.state === 'PENDING' || t.state === 'CREATED'
  ).length;
  const failedCount = transactions.filter(
    (t) => t.state === 'FAILED' || t.state === 'ERROR'
  ).length;

  const exportCSV = () => {
    if (transactions.length === 0) return;
    const headers = [
      'Transaction ID',
      'Order ID',
      'Status',
      'Amount (INR)',
      'Payment Mode',
      'Payment ID',
      'Name',
      'Email',
      'Phone',
      'Race Category',
      'Race Type',
      'Gender',
      'DOB',
      'T-Shirt',
      'Address',
      'Emergency Phone',
      'Coupon',
      'Coupon Discount',
      'Convenience Fee',
      'PAN Number',
      'Donation Type',
    ];
    const rows = transactions.map((t) => {
      const cf = t.customFields || {};
      return [
        t.transactionId || '',
        t.orderId || '',
        t.state || '',
        t.amount || '',
        getPaymentMode(t),
        getPaymentId(t),
        cf.name || '',
        cf.email || '',
        cf.phone || '',
        cf.race_category || '',
        cf.race_type || '',
        cf.gender || '',
        cf.date_of_birth || '',
        cf.tshirt_size || '',
        `"${(cf.address || '').replace(/"/g, '""')}"`,
        cf.emergency_phone || '',
        cf.coupon_code || '',
        cf.coupon_discount || '',
        cf.convenience_fee || '',
        cf.pan_number || '',
        cf.donation_type || '',
      ];
    });
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phonepe-transactions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                PhonePe Transactions
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Real-time transaction status from PhonePe
              </p>
            </div>
            <a
              href="/"
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              Home
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Search Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setMode('single')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  mode === 'single'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Single Lookup
              </button>
              <button
                onClick={() => setMode('bulk')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  mode === 'bulk'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bulk Lookup
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 sm:py-5">
            {mode === 'single' ? (
              <form onSubmit={handleSingleSearch} className="flex gap-3">
                <input
                  type="text"
                  value={singleId}
                  onChange={(e) => setSingleId(e.target.value)}
                  placeholder="Enter PhonePe Transaction / Order ID (e.g. JANYA1738...)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-gray-900 bg-white"
                />
                <button
                  type="submit"
                  disabled={loading || !singleId.trim()}
                  className="px-5 py-3 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {loading ? 'Checking...' : 'Check Status'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleBulkSearch} className="space-y-3">
                <textarea
                  value={bulkIds}
                  onChange={(e) => setBulkIds(e.target.value)}
                  placeholder={'Enter multiple Transaction IDs (one per line or comma-separated)\n\ne.g.\nJANYA1738000001\nMARATHON1738000002\nJANYA1738000003'}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-pink-500 text-gray-900 bg-white font-mono"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {bulkIds
                      .split(/[\n,]+/)
                      .map((id) => id.trim())
                      .filter(Boolean).length}{' '}
                    ID(s) entered (max 50)
                  </p>
                  <button
                    type="submit"
                    disabled={loading || !bulkIds.trim()}
                    className="px-5 py-3 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Checking...' : 'Check All'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Fetching from PhonePe...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && transactions.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Total Checked</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Completed Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Failed</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{failedCount}</p>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Results ({transactions.length})
                </h2>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-gray-100">
                {transactions.map((txn, i) => {
                  const fields = getCustomFields(txn);
                  const isExpanded = expandedRow === txn.transactionId;
                  return (
                    <div key={txn.transactionId || i} className="p-3">
                      <div
                        className="cursor-pointer"
                        onClick={() => setExpandedRow(isExpanded ? null : txn.transactionId)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0 flex-1 mr-2">
                            <p className="font-mono text-xs text-gray-900 truncate">
                              {txn.transactionId}
                            </p>
                            {txn.customFields?.name && (
                              <p className="text-xs text-gray-600 font-medium mt-0.5">
                                {txn.customFields.name}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${getStatusColor(txn.state)}`}
                          >
                            {txn.state}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{getPaymentMode(txn)}</span>
                          <span className="font-semibold text-gray-900 text-sm">
                            {txn.amount !== null ? `₹${txn.amount.toLocaleString('en-IN')}` : '-'}
                          </span>
                        </div>
                        <p className="text-[10px] text-pink-500 mt-1">
                          {isExpanded ? 'Tap to collapse' : 'Tap to view details'}
                        </p>
                      </div>

                      {/* Expanded custom fields (mobile) */}
                      {isExpanded && fields.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-2">
                            Custom Fields
                          </p>
                          <div className="space-y-1.5">
                            {fields.map(({ key, label, value }) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-gray-500">{label}</span>
                                <span className="text-gray-900 font-medium text-right ml-2 max-w-[60%] truncate">
                                  {value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {isExpanded && fields.length === 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400">No custom field data available</p>
                        </div>
                      )}

                      {txn.errorMessage && (
                        <p className="text-[10px] text-red-500 mt-1">{txn.errorMessage}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase">#</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Transaction ID</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Status</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Amount</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Payment Mode</th>
                      <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((txn, i) => {
                      const fields = getCustomFields(txn);
                      const isExpanded = expandedRow === txn.transactionId;
                      return (
                        <React.Fragment key={txn.transactionId || i}>
                          <tr
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                              setExpandedRow(isExpanded ? null : txn.transactionId)
                            }
                          >
                            <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                            <td className="px-4 py-3">
                              <p className="font-mono text-xs text-gray-900">{txn.transactionId}</p>
                              {txn.orderId && (
                                <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                                  {txn.orderId}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900">
                                {txn.customFields?.name || '-'}
                              </p>
                              {txn.customFields?.phone && (
                                <p className="text-xs text-gray-500">{txn.customFields.phone}</p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(txn.state)}`}
                              >
                                {txn.state}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-900">
                              {txn.amount !== null
                                ? `₹${txn.amount.toLocaleString('en-IN')}`
                                : '-'}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{getPaymentMode(txn)}</td>
                            <td className="px-4 py-3">
                              <button className="text-pink-600 hover:text-pink-700 text-xs font-medium">
                                {isExpanded ? 'Hide' : 'View'}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Row - Custom Fields */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="px-4 py-0">
                                <div className="py-4 px-4 bg-gray-50 rounded-lg my-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                                    {/* Payment Info Column */}
                                    <div>
                                      <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-2">
                                        Payment Info
                                      </p>
                                      <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                          <span className="text-gray-500">Payment ID</span>
                                          <span className="text-gray-900 font-mono">{getPaymentId(txn)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                          <span className="text-gray-500">Order ID</span>
                                          <span className="text-gray-900 font-mono">{txn.orderId || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                          <span className="text-gray-500">Payment Mode</span>
                                          <span className="text-gray-900">{getPaymentMode(txn)}</span>
                                        </div>
                                        {txn.expireAt && (
                                          <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Expires At</span>
                                            <span className="text-gray-900">{txn.expireAt}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Custom Fields Column */}
                                    <div>
                                      <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider mb-2 mt-3 md:mt-0">
                                        Custom Fields (metaInfo)
                                      </p>
                                      {fields.length > 0 ? (
                                        <div className="space-y-1.5">
                                          {fields.map(({ key, label, value }) => (
                                            <div key={key} className="flex justify-between text-xs">
                                              <span className="text-gray-500">{label}</span>
                                              <span className="text-gray-900 font-medium text-right ml-4 max-w-[65%] truncate">
                                                {value}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-gray-400">
                                          No custom field data returned by PhonePe
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Raw metaInfo for debugging */}
                                  {txn.metaInfo && Object.keys(txn.metaInfo).length > 0 && (
                                    <details className="mt-4">
                                      <summary className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider cursor-pointer hover:text-gray-600">
                                        Raw metaInfo (UDF fields)
                                      </summary>
                                      <div className="mt-2 bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1">
                                          {Object.entries(txn.metaInfo).map(([key, value]) => (
                                            <div key={key} className="flex justify-between text-xs py-0.5">
                                              <span className="text-gray-400 font-mono">{key}</span>
                                              <span className="text-gray-700 ml-2 truncate max-w-[60%] text-right">
                                                {value || '-'}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </details>
                                  )}

                                  {/* Raw API response for debugging */}
                                  {txn._raw && (
                                    <details className="mt-2">
                                      <summary className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider cursor-pointer hover:text-gray-600">
                                        Full PhonePe API Response (Debug)
                                      </summary>
                                      <div className="mt-2 bg-white rounded-lg p-3 border border-gray-200 overflow-x-auto">
                                        <pre className="text-[10px] text-gray-600 whitespace-pre-wrap break-all font-mono">
                                          {JSON.stringify(txn._raw, null, 2)}
                                        </pre>
                                      </div>
                                    </details>
                                  )}

                                  {txn.errorMessage && (
                                    <div className="mt-3 px-3 py-2 bg-red-50 rounded-lg">
                                      <p className="text-xs text-red-600">
                                        Error: {txn.errorMessage}
                                        {txn.errorCode && ` (${txn.errorCode})`}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Error details for failed lookups */}
              {transactions.some((t) => t.errorMessage) && (
                <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-red-50">
                  <p className="text-xs font-medium text-red-700 mb-1">Errors:</p>
                  {transactions
                    .filter((t) => t.errorMessage)
                    .map((t, i) => (
                      <p key={i} className="text-xs text-red-600">
                        {t.transactionId}: {t.errorMessage}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && transactions.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Look up PhonePe transactions
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Enter a transaction ID above to fetch its real-time status and
              custom field data directly from PhonePe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
