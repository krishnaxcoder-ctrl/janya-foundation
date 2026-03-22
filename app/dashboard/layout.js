'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

// Icons
export const Icons = {
  menu: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  refresh: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  logout: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  users: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  money: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ticket: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  flag: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
  heart: <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  plus: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  search: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  edit: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  trash: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  more: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>,
  lock: <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  x: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  download: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
};

// Dashboard Context
const DashboardContext = createContext(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardLayout');
  }
  return context;
}

// Header with Horizontal Tabs Component
function DashboardHeader({ stats, onLogout }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { id: 'start-fundraiser', path: '/dashboard/start-fundraiser', label: 'New Fundraiser', icon: Icons.plus, count: 0, color: 'bg-green-500' },
    { id: 'registrations', path: '/dashboard/registrations', label: 'Registrations', icon: Icons.users, count: stats.registrations, color: 'bg-blue-500' },
    { id: 'prize-claims', path: '/dashboard/prize-claims', label: 'Prize Claims', icon: Icons.money, count: stats.prizeClaims || 0, color: 'bg-yellow-500' },
    { id: 'campaign', path: '/dashboard/campaign', label: 'Campaigns', icon: Icons.heart, count: stats.donations, color: 'bg-pink-500' },
    { id: 'approvals', path: '/dashboard/approvals', label: 'Approvals', icon: Icons.refresh, count: stats.pendingApprovals || 0, color: 'bg-orange-500' },
    { id: 'coupons', path: '/dashboard/coupons', label: 'Coupons', icon: Icons.ticket, count: stats.coupons, color: 'bg-amber-500' },
    { id: 'races', path: '/dashboard/races', label: 'Races', icon: Icons.flag, count: stats.races, color: 'bg-purple-500' },
  ];

  const isActive = (path) => pathname === path || (path === '/dashboard/registrations' && pathname === '/dashboard');

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Horizontal Tabs */}
      <div className="px-4 flex items-center justify-between">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                isActive(item.path)
                  ? 'border-b-gray-900 text-gray-900'
                  : 'border-b-transparent text-gray-500 hover:text-gray-700 hover:border-b-gray-300'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive(item.path) ? item.color + ' text-white' : 'bg-gray-100 text-gray-500'}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isActive(item.path) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {item.count}
              </span>
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          {Icons.logout}
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Auth state
  const [authChecking, setAuthChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data state
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [races, setRaces] = useState([]);
  const [campaignDonations, setCampaignDonations] = useState([]);
  const [campaignStats, setCampaignStats] = useState({ 
    totalCampaigns: 0, 
    pendingApprovals: 0, 
    totalRegistrations: 0, 
    totalCoupons: 0, 
    totalRaces: 0 
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchData();
    }
    setAuthChecking(false);
  }, []);

  // Redirect /dashboard to /dashboard/registrations
  useEffect(() => {
    if (isLoggedIn && pathname === '/dashboard') {
      router.replace('/dashboard/start-fundraiser');
    }
  }, [isLoggedIn, pathname, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        fetchData();
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch data from legacy APIs if still needed for list views (keeping them for now)
      const [regRes, allCouponsRes, racesRes] = await Promise.all([
        fetch('/api/dashboard/registrations'),
        fetch('/api/admin/coupons'),
        fetch('/api/admin/races'),
      ]);
      
      const [regData, allCouponsData, racesData] = await Promise.all([
        regRes.json(),
        allCouponsRes.json(),
        racesRes.json(),
      ]);

      if (regData.success) setAllRegistrations(regData.registrations || []);
      if (allCouponsData.success) setCoupons(allCouponsData.coupons || []);
      if (racesData.success) setRaces(racesData.races || []);

      // FETCH COUNTS FROM SUPABASE (Source of truth)
      // Perform all count queries in parallel
      const [
        { count: regCount, error: regErr },
        { count: campaignCount, error: campErr },
        { count: pendingCount, error: pendErr },
        { count: couponCount, error: coupErr },
        { count: raceCount, error: raceErr },
        { count: prizeClaimsCount, error: prizeErr }
      ] = await Promise.all([
        supabase.from('marathon_registrations').select('*', { count: 'exact', head: true }),
        supabase.from('campaigns').select('*', { count: 'exact', head: true }),
        supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('coupons').select('*', { count: 'exact', head: true }),
        supabase.from('races').select('*', { count: 'exact', head: true }),
        supabase.from('prize_claims').select('*', { count: 'exact', head: true })
      ]);

      if (regErr) console.error('Error fetching registrations count:', regErr);
      if (campErr) console.error('Error fetching campaigns count:', campErr);
      if (pendErr) console.error('Error fetching pending count:', pendErr);
      if (coupErr) console.error('Error fetching coupons count:', coupErr);
      if (raceErr) console.error('Error fetching races count:', raceErr);
      if (prizeErr) console.error('Error fetching prize claims count:', prizeErr);

      setCampaignStats({
        pendingApprovals: pendingCount || 0,
        totalCampaigns: campaignCount || 0,
        totalRegistrations: regCount || 0,
        totalCoupons: couponCount || 0,
        totalRaces: raceCount || 0,
        totalPrizeClaims: prizeClaimsCount || 0
      });

    } catch (err) {
      console.error('Final fetchData error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Computed values
  const totalRevenue = allRegistrations.filter(r => r.payment_status === 'SUCCESS').reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0);
  const successfulRegs = allRegistrations.filter(r => r.payment_status === 'SUCCESS').length;
  const activeCoupons = coupons.filter(c => c.is_active).length;
  const activeRaces = races.filter(r => r.is_active).length;

  const sidebarStats = {
    registrations: campaignStats.totalRegistrations || 0,
    donations: campaignStats.totalCampaigns || 0,
    pendingApprovals: campaignStats.pendingApprovals || 0,
    coupons: campaignStats.totalCoupons || 0,
    races: campaignStats.totalRaces || 0,
    prizeClaims: campaignStats.totalPrizeClaims || 0,
    activeCoupons: coupons.filter(c => c.is_active).length,
    activeRaces: races.filter(r => r.is_active).length,
  };

  // Loading states
  if (authChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-sm mx-4 shadow-xl border-0">
          <CardContent className="pt-8 pb-8 space-y-6">
            <Skeleton className="h-20 w-20 rounded-2xl mx-auto animate-pulse" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 mx-auto animate-pulse" />
              <Skeleton className="h-4 w-32 mx-auto animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              {Icons.lock}
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter credentials to access dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              {loginError && <p className="text-sm text-destructive">{loginError}</p>}
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Context value
  const contextValue = {
    allRegistrations,
    coupons,
    races,
    campaignDonations,
    campaignStats,
    loading,
    fetchData,
    totalRevenue,
    successfulRegs,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
        {/* Header with Horizontal Tabs */}
        <header className="sticky top-0 z-10">
          <DashboardHeader stats={sidebarStats} onLogout={handleLogout} />
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col p-2 sm:p-4 lg:p-6 overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
