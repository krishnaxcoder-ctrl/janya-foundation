'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/registrations');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );
}
