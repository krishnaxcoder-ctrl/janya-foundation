'use client';

import React from 'react';
import CampaignSubmissionForm from '@/app/components/CampaignSubmissionForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function StartFundraiserPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-gray-900">Start a <span className="text-[#e90074]">Fundraiser</span></CardTitle>
          <CardDescription className="text-gray-500">Submit your fundraiser request for review. Once approved, it will be visible to everyone.</CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignSubmissionForm onClose={() => {}} inline={true} />
        </CardContent>
      </Card>
    </div>
  );
}
