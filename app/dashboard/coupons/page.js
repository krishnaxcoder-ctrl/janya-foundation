'use client';

import React, { useState } from 'react';
import { useDashboard, Icons } from '../layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function CouponsPage() {
  const { coupons, races, allRegistrations, fetchData } = useDashboard();

  // UI state
  const [expandedCouponId, setExpandedCouponId] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Form state
  const [couponForm, setCouponForm] = useState({
    code: '', type: 'fixed', amount: 100, percent: 50, discount_by_race: '{}', final_price_by_race: '{}', competitive_only: false, is_active: true, max_uses: '', expires_at: '', valid_for: 'all', valid_race_ids: []
  });

  const activeCoupons = coupons.filter(c => c.is_active).length;

  // Calculate coupon performance from registrations
  const couponPerformance = allRegistrations
    .filter(r => r.payment_status === 'SUCCESS' && r.coupon_code)
    .reduce((acc, r) => {
      const code = r.coupon_code.toUpperCase();
      if (!acc[code]) {
        acc[code] = { registrations: 0, revenue: 0, discount: 0 };
      }
      acc[code].registrations += 1;
      acc[code].revenue += parseFloat(r.total_amount) || 0;
      acc[code].discount += parseFloat(r.coupon_discount) || 0;
      return acc;
    }, {});

  const openCouponModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponForm({
        code: coupon.code,
        type: coupon.type,
        amount: coupon.amount || 100,
        percent: coupon.percent || 50,
        discount_by_race: JSON.stringify(coupon.discount_by_race || {}),
        final_price_by_race: JSON.stringify(coupon.final_price_by_race || {}),
        competitive_only: coupon.competitive_only || false,
        is_active: coupon.is_active,
        max_uses: coupon.max_uses || '',
        expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
        valid_for: coupon.valid_race_ids?.length > 0 ? 'specific' : 'all',
        valid_race_ids: coupon.valid_race_ids || []
      });
    } else {
      setEditingCoupon(null);
      setCouponForm({ code: '', type: 'fixed', amount: 100, percent: 50, discount_by_race: '{}', final_price_by_race: '{}', competitive_only: false, is_active: true, max_uses: '', expires_at: '', valid_for: 'all', valid_race_ids: [] });
    }
    setShowCouponModal(true);
  };

  const saveCoupon = async () => {
    try {
      const payload = {
        code: couponForm.code,
        type: couponForm.type,
        amount: couponForm.type === 'fixed' ? parseInt(couponForm.amount) : null,
        percent: couponForm.type === 'percent' ? parseFloat(couponForm.percent) : null,
        discount_by_race: couponForm.type === 'raceFixed' ? JSON.parse(couponForm.discount_by_race) : null,
        final_price_by_race: couponForm.type === 'raceFinalPrice' ? JSON.parse(couponForm.final_price_by_race) : null,
        competitive_only: couponForm.competitive_only || false,
        is_active: couponForm.is_active,
        max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
        expires_at: couponForm.expires_at || null,
        valid_race_ids: couponForm.valid_for === 'specific' && couponForm.valid_race_ids.length > 0 ? couponForm.valid_race_ids : null
      };

      if (editingCoupon) {
        payload.id = editingCoupon.id;
        await fetch('/api/admin/coupons', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch('/api/admin/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      setShowCouponModal(false);
      fetchData();
    } catch {
      alert('Failed to save coupon');
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const toggleCouponStatus = async (coupon) => {
    await fetch('/api/admin/coupons', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: coupon.id, is_active: !coupon.is_active })
    });
    fetchData();
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-amber-50 rounded-lg">
              <span className="text-xs text-gray-500">Total:</span>
              <span className="text-xs font-semibold text-amber-600">{coupons.length}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1.5 bg-green-50 rounded-lg">
              <span className="text-xs text-gray-500">Active:</span>
              <span className="text-xs font-semibold text-green-600">{activeCoupons}</span>
            </div>
          </div>
          <Button onClick={() => openCouponModal()} size="sm" className="gap-1 h-8 text-xs">{Icons.plus} Add</Button>
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
                  <TableHead className="font-semibold text-gray-600">Code</TableHead>
                  <TableHead className="font-semibold text-gray-600">Type</TableHead>
                  <TableHead className="font-semibold text-gray-600">Discount</TableHead>
                  <TableHead className="font-semibold text-gray-600">Uses</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center">Paid</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Revenue</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Disc. Given</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          {Icons.ticket}
                        </div>
                        <p className="text-gray-500 font-medium">No coupons found</p>
                        <p className="text-gray-400 text-sm">Create your first coupon</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : coupons.map((c, i) => {
                  const perf = couponPerformance[c.code.toUpperCase()] || { registrations: 0, revenue: 0, discount: 0 };
                  const isExpanded = expandedCouponId === c.id;
                  const validRaces = c.valid_race_ids?.length > 0
                    ? races.filter(r => c.valid_race_ids.includes(r.id))
                    : [];
                  return (
                    <React.Fragment key={c.id}>
                      <TableRow
                        className={`hover:bg-gray-50/50 cursor-pointer ${isExpanded ? 'bg-amber-50/50' : ''}`}
                        onClick={() => setExpandedCouponId(isExpanded ? null : c.id)}
                      >
                        <TableCell className="text-gray-400 font-mono text-sm">
                          <span className={`inline-flex items-center justify-center w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            {c.code}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {c.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {c.type === 'fixed' ? `₹${c.amount}` : c.type === 'percent' ? `${c.percent}%` : c.type === 'raceFinalPrice' ? 'Final Price' : 'Race-based'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {c.uses_count || 0}{c.max_uses ? `/${c.max_uses}` : ''}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${perf.registrations > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                            {perf.registrations}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm font-semibold ${perf.revenue > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            ₹{perf.revenue.toLocaleString('en-IN')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm ${perf.discount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {perf.discount > 0 ? `-₹${perf.discount.toLocaleString('en-IN')}` : '₹0'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Switch checked={c.is_active} onCheckedChange={() => toggleCouponStatus(c)} />
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon">{Icons.more}</Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openCouponModal(c)}>{Icons.edit}<span className="ml-2">Edit</span></DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => deleteCoupon(c.id)} className="text-destructive">{Icons.trash}<span className="ml-2">Delete</span></DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow className="bg-amber-50/30">
                          <TableCell colSpan={10} className="py-3 px-4">
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 font-medium">Valid For: </span>
                                {validRaces.length === 0 ? (
                                  <span className="text-green-600 font-medium">All Races</span>
                                ) : (
                                  <span className="inline-flex flex-wrap gap-1.5 ml-1">
                                    {validRaces.map(r => (
                                      <span key={r.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                        {r.distance} - {r.name}
                                      </span>
                                    ))}
                                  </span>
                                )}
                              </div>
                              {c.expires_at && (
                                <div>
                                  <span className="text-gray-500 font-medium">Expires: </span>
                                  <span className="text-gray-700">{new Date(c.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                              )}
                              {c.type === 'raceFixed' && c.discount_by_race && (
                                <div>
                                  <span className="text-gray-500 font-medium">Race Discounts: </span>
                                  <span className="inline-flex flex-wrap gap-1.5 ml-1">
                                    {Object.entries(typeof c.discount_by_race === 'string' ? JSON.parse(c.discount_by_race || '{}') : (c.discount_by_race || {})).map(([raceId, discount]) => {
                                      const race = races.find(r => r.id === raceId);
                                      return race && discount ? (
                                        <span key={raceId} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                          {race.distance}: ₹{discount}
                                        </span>
                                      ) : null;
                                    })}
                                  </span>
                                </div>
                              )}
                              {c.type === 'raceFinalPrice' && c.final_price_by_race && (
                                <div>
                                  <span className="text-gray-500 font-medium">Final Prices: </span>
                                  <span className="inline-flex flex-wrap gap-1.5 ml-1">
                                    {Object.entries(typeof c.final_price_by_race === 'string' ? JSON.parse(c.final_price_by_race || '{}') : (c.final_price_by_race || {})).map(([raceId, price]) => {
                                      const race = races.find(r => r.id === raceId);
                                      return race && price ? (
                                        <span key={raceId} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                          {race.distance}: ₹{price} + 3%
                                        </span>
                                      ) : null;
                                    })}
                                  </span>
                                </div>
                              )}
                              {c.competitive_only && (
                                <div>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    Competitive Only
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      <Dialog open={showCouponModal} onOpenChange={setShowCouponModal}>
        <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
            <DialogDescription>Configure coupon settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE100" disabled={!!editingCoupon} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={couponForm.type} onValueChange={v => setCouponForm({ ...couponForm, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  <SelectItem value="percent">Percentage (%)</SelectItem>
                  <SelectItem value="raceFixed">Race-based Fixed Discount</SelectItem>
                  <SelectItem value="raceFinalPrice">Final Price by Race</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {couponForm.type === 'fixed' && (
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" value={couponForm.amount} onChange={e => setCouponForm({ ...couponForm, amount: e.target.value })} />
              </div>
            )}
            {couponForm.type === 'percent' && (
              <div className="space-y-2">
                <Label>Percent (%)</Label>
                <Input type="number" value={couponForm.percent} onChange={e => setCouponForm({ ...couponForm, percent: e.target.value })} />
              </div>
            )}
            {couponForm.type === 'raceFixed' && (
              <div className="space-y-2">
                <Label>Discount by Race (₹)</Label>
                <p className="text-xs text-gray-500">Set different discount amounts for each race</p>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {races.filter(r => r.is_active && !r.is_donation).map(race => {
                      const discountByRace = (() => {
                        try {
                          return typeof couponForm.discount_by_race === 'string'
                            ? JSON.parse(couponForm.discount_by_race)
                            : (couponForm.discount_by_race || {});
                        } catch { return {}; }
                      })();
                      return (
                        <div key={race.id} className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block truncate">{race.distance}</span>
                            <span className="text-xs text-gray-400">{race.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-sm">₹</span>
                            <Input
                              type="number"
                              className="w-20 h-8 text-sm"
                              placeholder="0"
                              value={discountByRace[race.id] || ''}
                              onChange={e => {
                                const newDiscount = { ...discountByRace };
                                if (e.target.value) {
                                  newDiscount[race.id] = parseInt(e.target.value);
                                } else {
                                  delete newDiscount[race.id];
                                }
                                setCouponForm({ ...couponForm, discount_by_race: JSON.stringify(newDiscount) });
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {couponForm.type === 'raceFinalPrice' && (
              <div className="space-y-2">
                <Label>Final Price by Race (₹)</Label>
                <p className="text-xs text-gray-500">Set the final base price for each race (3% convenience fee will be added)</p>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {races.filter(r => r.is_active && !r.is_donation && r.category === 'competitive').map(race => {
                      const finalPriceByRace = (() => {
                        try {
                          return typeof couponForm.final_price_by_race === 'string'
                            ? JSON.parse(couponForm.final_price_by_race)
                            : (couponForm.final_price_by_race || {});
                        } catch { return {}; }
                      })();
                      return (
                        <div key={race.id} className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block truncate">{race.distance}</span>
                            <span className="text-xs text-gray-400">{race.name} (was ₹{race.price})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-sm">₹</span>
                            <Input
                              type="number"
                              className="w-20 h-8 text-sm"
                              placeholder="0"
                              value={finalPriceByRace[race.id] || ''}
                              onChange={e => {
                                const newPrices = { ...finalPriceByRace };
                                if (e.target.value) {
                                  newPrices[race.id] = parseInt(e.target.value);
                                } else {
                                  delete newPrices[race.id];
                                }
                                setCouponForm({ ...couponForm, final_price_by_race: JSON.stringify(newPrices) });
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md">
                  <input
                    type="checkbox"
                    checked={couponForm.competitive_only}
                    onChange={e => setCouponForm({ ...couponForm, competitive_only: e.target.checked })}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    id="competitive_only"
                  />
                  <label htmlFor="competitive_only" className="text-sm text-amber-800 cursor-pointer">
                    Only valid for competitive races (recommended for this type)
                  </label>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Uses</Label>
                <Input type="number" value={couponForm.max_uses} onChange={e => setCouponForm({ ...couponForm, max_uses: e.target.value })} placeholder="Unlimited" />
              </div>
              <div className="space-y-2">
                <Label>Expires</Label>
                <Input type="date" value={couponForm.expires_at} onChange={e => setCouponForm({ ...couponForm, expires_at: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valid For Races</Label>
                <Select value={couponForm.valid_for} onValueChange={v => setCouponForm({ ...couponForm, valid_for: v, valid_race_ids: v === 'all' ? [] : couponForm.valid_race_ids })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Races</SelectItem>
                    <SelectItem value="specific">Specific Races</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2 h-9 px-3 border rounded-md">
                  <Switch checked={couponForm.is_active} onCheckedChange={v => setCouponForm({ ...couponForm, is_active: v })} />
                  <span className="text-sm">{couponForm.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
            {couponForm.valid_for === 'specific' && (
              <div className="space-y-2">
                <Label>Select Races</Label>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {races.filter(r => r.is_active && !r.is_donation).map(race => (
                      <label key={race.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200">
                        <input
                          type="checkbox"
                          checked={couponForm.valid_race_ids.includes(race.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setCouponForm({ ...couponForm, valid_race_ids: [...couponForm.valid_race_ids, race.id] });
                            } else {
                              setCouponForm({ ...couponForm, valid_race_ids: couponForm.valid_race_ids.filter(id => id !== race.id) });
                            }
                          }}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block truncate">{race.distance} - {race.name}</span>
                          <span className="text-xs text-gray-400">₹{race.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {couponForm.valid_race_ids.length > 0 && (
                  <p className="text-xs text-gray-500">{couponForm.valid_race_ids.length} race(s) selected</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCouponModal(false)}>Cancel</Button>
            <Button onClick={saveCoupon}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
