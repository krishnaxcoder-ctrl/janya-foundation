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
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [updating, setUpdating] = useState(false);

  const raceCategoryLabels = {
    '5km': '5 KM Competitive',
    '10km': '10 KM Competitive',
    '21km': '21.1 KM Half Marathon',
    'cause5km': '5 KM Run for Cause',
    'cause10km': '10 KM Run for Cause',
    '3km': '3 KM Fun Run',
    'kidsrun': 'Kids Run',
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    paid: 'bg-purple-100 text-purple-800',
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
        setSelectedClaim(null);
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

    return matchesSearch && matchesStatus;
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Claims</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">Paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {Icons.money}
            Prize Claims
          </CardTitle>
          <CardDescription>
            Manage marathon prize claim submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, phone, or claim ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="paid">Paid</option>
            </select>
            <Button onClick={fetchClaims} variant="outline" size="icon">
              {Icons.refresh}
            </Button>
          </div>

          {/* Claims Table */}
          {filteredClaims.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No prize claims found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium">Claim ID</th>
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Contact</th>
                    <th className="text-left p-3 font-medium">Race</th>
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
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[claim.status] || 'bg-gray-100'}`}>
                          {claim.status}
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
          )}
        </CardContent>
      </Card>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Prize Claim Details</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedClaim(null)}>
                  {Icons.x}
                </Button>
              </div>

              <div className="space-y-6">
                {/* Claim Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Claim ID</label>
                    <p className="font-mono">{selectedClaim.claim_id}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <p>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[selectedClaim.status]}`}>
                        {selectedClaim.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Full Name</label>
                      <p className="font-medium">{selectedClaim.full_name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Age</label>
                      <p>{selectedClaim.age} years</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email</label>
                      <p>{selectedClaim.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Phone</label>
                      <p>{selectedClaim.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-500">Address</label>
                      <p>{selectedClaim.address}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Race Category</label>
                      <p>{raceCategoryLabels[selectedClaim.race_category] || selectedClaim.race_category}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Submitted On</label>
                      <p>{new Date(selectedClaim.created_at).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a
                      href={selectedClaim.age_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {Icons.download}
                      <span className="text-sm">Age Proof</span>
                    </a>
                    <a
                      href={selectedClaim.aadhar_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {Icons.download}
                      <span className="text-sm">Aadhar Card</span>
                    </a>
                    <a
                      href={selectedClaim.pan_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {Icons.download}
                      <span className="text-sm">PAN Card</span>
                    </a>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedClaim.admin_notes && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Admin Notes</h3>
                    <p className="text-sm text-gray-600">{selectedClaim.admin_notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateClaimStatus(selectedClaim.claim_id, 'under_review')}
                      disabled={updating || selectedClaim.status === 'under_review'}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    >
                      Mark Under Review
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateClaimStatus(selectedClaim.claim_id, 'verified')}
                      disabled={updating || selectedClaim.status === 'verified'}
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    >
                      Mark Verified
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateClaimStatus(selectedClaim.claim_id, 'paid')}
                      disabled={updating || selectedClaim.status === 'paid'}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                    >
                      Mark Paid
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateClaimStatus(selectedClaim.claim_id, 'rejected')}
                      disabled={updating || selectedClaim.status === 'rejected'}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    >
                      Reject
                    </Button>
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
