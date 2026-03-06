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

export default function RacesPage() {
  const { races, fetchData } = useDashboard();

  // UI state
  const [showRaceModal, setShowRaceModal] = useState(false);
  const [editingRace, setEditingRace] = useState(null);

  // Form state
  const [raceForm, setRaceForm] = useState({
    id: '', distance: '', name: '', price: '', description: '', category: 'competitive',
    is_run_for_cause: false, is_kids_run: false, is_donation: false, is_test: false,
    is_sold_out: false, is_active: true, min_age: 5, max_age: 100, sort_order: 0
  });

  const activeRaces = races.filter(r => r.is_active).length;

  const openRaceModal = (race = null) => {
    if (race) {
      setEditingRace(race);
      setRaceForm({ ...race });
    } else {
      setEditingRace(null);
      setRaceForm({
        id: '', distance: '', name: '', price: '', description: '', category: 'competitive',
        is_run_for_cause: false, is_kids_run: false, is_donation: false, is_test: false,
        is_sold_out: false, is_active: true, min_age: 5, max_age: 100, sort_order: 0
      });
    }
    setShowRaceModal(true);
  };

  const saveRace = async () => {
    try {
      const payload = { ...raceForm, price: parseInt(raceForm.price), sort_order: parseInt(raceForm.sort_order) };
      if (editingRace) {
        await fetch('/api/admin/races', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch('/api/admin/races', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      setShowRaceModal(false);
      fetchData();
    } catch {
      alert('Failed to save race');
    }
  };

  const deleteRace = async (id) => {
    if (!confirm('Delete this race?')) return;
    await fetch(`/api/admin/races?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  const toggleRaceStatus = async (race, field) => {
    await fetch('/api/admin/races', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: race.id, [field]: !race[field] })
    });
    fetchData();
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-purple-50 rounded-lg">
              <span className="text-xs text-gray-500">Total:</span>
              <span className="text-xs font-semibold text-purple-600">{races.length}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1.5 bg-green-50 rounded-lg">
              <span className="text-xs text-gray-500">Active:</span>
              <span className="text-xs font-semibold text-green-600">{activeRaces}</span>
            </div>
          </div>
          <Button onClick={() => openRaceModal()} size="sm" className="gap-1 h-8 text-xs">{Icons.plus} Add</Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 min-h-0">
        <div className="h-full overflow-auto">
          <div className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-10 font-semibold text-gray-600">#</TableHead>
                  <TableHead className="font-semibold text-gray-600">ID</TableHead>
                  <TableHead className="font-semibold text-gray-600">Distance</TableHead>
                  <TableHead className="font-semibold text-gray-600">Name</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Price</TableHead>
                  <TableHead className="font-semibold text-gray-600">Category</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-gray-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {races.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          {Icons.flag}
                        </div>
                        <p className="text-gray-500 font-medium">No races found</p>
                        <p className="text-gray-400 text-sm">Create your first race</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : races.map((r, i) => (
                  <TableRow key={r.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-gray-400 font-mono text-sm">{i + 1}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-600">
                        {r.id}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{r.distance}</TableCell>
                    <TableCell className="text-sm text-gray-600">{r.name}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-gray-900">₹{r.price}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {r.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch checked={r.is_active} onCheckedChange={() => toggleRaceStatus(r, 'is_active')} />
                        {r.is_sold_out && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                            Sold Out
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon">{Icons.more}</Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openRaceModal(r)}>{Icons.edit}<span className="ml-2">Edit</span></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleRaceStatus(r, 'is_sold_out')}>{Icons.flag}<span className="ml-2">{r.is_sold_out ? 'Unmark Sold Out' : 'Mark Sold Out'}</span></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteRace(r.id)} className="text-destructive">{Icons.trash}<span className="ml-2">Delete</span></DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Race Modal */}
      <Dialog open={showRaceModal} onOpenChange={setShowRaceModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRace ? 'Edit Race' : 'Add Race'}</DialogTitle>
            <DialogDescription>Configure race settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <Input value={raceForm.id} onChange={e => setRaceForm({ ...raceForm, id: e.target.value.toLowerCase().replace(/\s/g, '') })} placeholder="e.g. 5km" disabled={!!editingRace} />
              </div>
              <div className="space-y-2">
                <Label>Distance</Label>
                <Input value={raceForm.distance} onChange={e => setRaceForm({ ...raceForm, distance: e.target.value })} placeholder="e.g. 5 KM" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={raceForm.name} onChange={e => setRaceForm({ ...raceForm, name: e.target.value })} placeholder="e.g. Medium Distance" />
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" value={raceForm.price} onChange={e => setRaceForm({ ...raceForm, price: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={raceForm.description} onChange={e => setRaceForm({ ...raceForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={raceForm.category} onValueChange={v => setRaceForm({ ...raceForm, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competitive">Competitive</SelectItem>
                    <SelectItem value="non-competitive">Non-Competitive</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={raceForm.sort_order} onChange={e => setRaceForm({ ...raceForm, sort_order: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2"><Switch checked={raceForm.is_sold_out} onCheckedChange={v => setRaceForm({ ...raceForm, is_sold_out: v })} /><Label>Sold Out</Label></div>
              <div className="flex items-center gap-2"><Switch checked={raceForm.is_active} onCheckedChange={v => setRaceForm({ ...raceForm, is_active: v })} /><Label>Active</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRaceModal(false)}>Cancel</Button>
            <Button onClick={saveRace}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
