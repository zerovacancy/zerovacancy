
import React from 'react';
import { Card } from '@/components/ui/layout/card';
import AccountStatusCard from './AccountStatusCard';
import ConnectActionButtons from './ConnectActionButtons';

type ConnectMainCardProps = {
  loading: boolean;
  accountStatus: {
    exists: boolean;
    isOnboarded: boolean;
    accountId?: string;
  } | null;
  onStartOnboarding: () => void;
  onRefreshStatus: () => void;
};

const ConnectMainCard = ({ 
  loading, 
  accountStatus, 
  onStartOnboarding, 
  onRefreshStatus 
}: ConnectMainCardProps) => {
  return (
    <Card className="p-6 border bg-white shadow-md rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Become a Photographer</h2>
        <p className="text-gray-600">
          Complete the Stripe Connect onboarding process to start receiving payments for your photography services.
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <AccountStatusCard accountStatus={accountStatus} />

          <ConnectActionButtons 
            accountStatus={accountStatus} 
            loading={loading} 
            onStartOnboarding={onStartOnboarding} 
            onRefreshStatus={onRefreshStatus} 
          />
          
          <div className="mt-4 text-sm text-gray-500">
            <p>
              Note: You will be redirected to Stripe to complete the onboarding process. After completion, you'll be redirected back to the success page.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ConnectMainCard;
