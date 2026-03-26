'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '../layout';

export default function PrizeClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openCategoryFilter, setOpenCategoryFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [updating, setUpdating] = useState(false);

  const raceCategoryLabels = {
    '5km': '5 KM Competitive',
    '10km': '10 KM Competitive',
    '21km': '21.1 KM Half Marathon',
    'kidsrun': 'Kids Run',
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    paid: 'bg-purple-100 text-purple-800',
  };

  const statusLabels = {
    pending: 'Pending',
    under_review: 'Under Review',
    verified: 'Verified',
    rejected: 'Rejected',
    paid: 'Paid',
  };

  const openCategoryLabels = {
    received: 'Received',
    not_received: 'Not received',
  };

  const openCategoryColors = {
    received: 'bg-green-100 text-green-800',
    not_received: 'bg-orange-100 text-orange-800',
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prize-claim');
      const data = await res.json();
      if (data.success) {
        setClaims(data.claims || []);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (claimId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/prize-claim', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setClaims(claims.map(c => c.claim_id === claimId ? { ...c, status: newStatus } : c));
        setSelectedClaim(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating claim:', error);
    } finally {
      setUpdating(false);
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch =
      claim.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.phone?.includes(searchTerm) ||
      claim.claim_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesOpenCategory = openCategoryFilter === 'all' || claim.open_category_prize_money === openCategoryFilter;

    return matchesSearch && matchesStatus && matchesOpenCategory;
  });

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    verified: claims.filter(c => c.status === 'verified').length,
    paid: claims.filter(c => c.status === 'paid').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Claims</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            {Icons.money}
            Prize Claims
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Manage marathon prize claim submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button onClick={fetchClaims} variant="outline" size="icon" className="shrink-0">
                {Icons.refresh}
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border rounded-md bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="paid">Paid</option>
              </select>
              <select
                value={openCategoryFilter}
                onChange={(e) => setOpenCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border rounded-md bg-white text-sm"
              >
                <option value="all">All Open Category</option>
                <option value="received">Received</option>
                <option value="not_received">Not received</option>
              </select>
            </div>
          </div>

          {/* Claims List */}
          {filteredClaims.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No prize claims found
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3">
                {filteredClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 truncate">{claim.full_name}</h3>
                        <p className="text-xs text-gray-500 font-mono truncate">{claim.claim_id}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusColors[claim.status] || 'bg-gray-100'}`}>
                        {statusLabels[claim.status] || claim.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-500 text-xs">Phone</span>
                        <p className="text-gray-900 truncate">{claim.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Age</span>
                        <p className="text-gray-900">{claim.age} years</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Email</span>
                        <p className="text-gray-900 truncate">{claim.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Open Category</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${openCategoryColors[claim.open_category_prize_money] || 'bg-gray-100'}`}>
                          {openCategoryLabels[claim.open_category_prize_money] || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-[120px]">
                          {raceCategoryLabels[claim.race_category] || claim.race_category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(claim.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedClaim(claim)}
                        className="text-xs"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">Claim ID</th>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Contact</th>
                      <th className="text-left p-3 font-medium">Race</th>
                      <th className="text-left p-3 font-medium">Open Category</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClaims.map((claim) => (
                      <tr key={claim.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-mono text-xs">{claim.claim_id}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-medium">{claim.full_name}</div>
                          <div className="text-xs text-gray-500">Age: {claim.age}</div>
                        </td>
                        <td className="p-3">
                          <div>{claim.email}</div>
                          <div className="text-xs text-gray-500">{claim.phone}</div>
                        </td>
                        <td className="p-3">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {raceCategoryLabels[claim.race_category] || claim.race_category}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${openCategoryColors[claim.open_category_prize_money] || 'bg-gray-100'}`}>
                            {openCategoryLabels[claim.open_category_prize_money] || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[claim.status] || 'bg-gray-100'}`}>
                            {statusLabels[claim.status] || claim.status}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-gray-500">
                          {new Date(claim.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedClaim(claim)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:rounded-lg sm:max-w-2xl sm:w-full sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">Prize Claim Details</h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedClaim.claim_id}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedClaim(null)} className="shrink-0">
                {Icons.x}
              </Button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-5">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Current Status:</span>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[selectedClaim.status]}`}>
                    {statusLabels[selectedClaim.status] || selectedClaim.status}
                  </span>
                </div>

                {/* Personal Info */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-3 text-sm text-gray-700">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 block">Full Name</label>
                      <p className="font-medium text-gray-900">{selectedClaim.full_name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Age</label>
                      <p className="text-gray-900">{selectedClaim.age} years</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Email</label>
                      <p className="text-gray-900 break-all">{selectedClaim.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Phone</label>
                      <p className="text-gray-900">{selectedClaim.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-500 block">Address</label>
                      <p className="text-gray-900">{selectedClaim.address}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Race Category</label>
                      <p className="text-gray-900">{raceCategoryLabels[selectedClaim.race_category] || selectedClaim.race_category}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Open Category Prize Money</label>
                      <span className={`text-xs px-2 py-1 rounded-full ${openCategoryColors[selectedClaim.open_category_prize_money] || 'bg-gray-100'}`}>
                        {openCategoryLabels[selectedClaim.open_category_prize_money] || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block">Submitted On</label>
                      <p className="text-gray-900">{new Date(selectedClaim.created_at).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-sm text-gray-700">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href={selectedClaim.age_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
                        {Icons.download}
                      </div>
                      <div>
                        <span className="text-sm font-medium block">Age Proof</span>
                        <span className="text-xs text-gray-500">View document</span>
                      </div>
                    </a>
                    <a
                      href={selectedClaim.aadhar_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                        {Icons.download}
                      </div>
                      <div>
                        <span className="text-sm font-medium block">Aadhar Card</span>
                        <span className="text-xs text-gray-500">View document</span>
                      </div>
                    </a>
                    <a
                      href={selectedClaim.pan_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
                        {Icons.download}
                      </div>
                      <div>
                        <span className="text-sm font-medium block">PAN Card</span>
                        <span className="text-xs text-gray-500">View document</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedClaim.admin_notes && (
                  <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                    <h3 className="font-medium mb-2 text-sm text-yellow-800">Admin Notes</h3>
                    <p className="text-sm text-yellow-700">{selectedClaim.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer - Status Actions */}
            <div className="border-t p-4 sm:p-6 bg-gray-50 sticky bottom-0">
              <h3 className="font-medium mb-3 text-sm text-gray-700">Update Status</h3>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateClaimStatus(selectedClaim.claim_id, 'under_review')}
                  disabled={updating || selectedClaim.status === 'under_review'}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs sm:text-sm"
                >
                  {updating ? '...' : 'Under Review'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateClaimStatus(selectedClaim.claim_id, 'verified')}
                  disabled={updating || selectedClaim.status === 'verified'}
                  className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 text-xs sm:text-sm"
                >
                  {updating ? '...' : 'Verified'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateClaimStatus(selectedClaim.claim_id, 'paid')}
                  disabled={updating || selectedClaim.status === 'paid'}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 text-xs sm:text-sm"
                >
                  {updating ? '...' : 'Mark Paid'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateClaimStatus(selectedClaim.claim_id, 'rejected')}
                  disabled={updating || selectedClaim.status === 'rejected'}
                  className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 text-xs sm:text-sm"
                >
                  {updating ? '...' : 'Reject'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
