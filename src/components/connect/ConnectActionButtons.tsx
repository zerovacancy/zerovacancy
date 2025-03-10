
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, RefreshCw } from 'lucide-react';

type ConnectActionButtonsProps = {
  accountStatus: {
    exists: boolean;
    isOnboarded: boolean;
    accountId?: string;
  } | null;
  loading: boolean;
  onStartOnboarding: () => void;
  onRefreshStatus: () => void;
};

const ConnectActionButtons = ({ 
  accountStatus, 
  loading, 
  onStartOnboarding, 
  onRefreshStatus 
}: ConnectActionButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {accountStatus?.isOnboarded ? (
        <Button 
          variant="default" 
          className="w-full sm:w-auto focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" 
          onClick={() => navigate('/account')}
          aria-label="Go to your dashboard"
        >
          <DollarSign className="mr-2 h-4 w-4" aria-hidden="true" />
          Go to Dashboard
        </Button>
      ) : (
        <Button 
          variant="default" 
          className="w-full sm:w-auto focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" 
          onClick={onStartOnboarding}
          disabled={loading}
          aria-label={accountStatus?.exists ? "Continue your onboarding process" : "Start the onboarding process"}
        >
          <CreditCard className="mr-2 h-4 w-4" aria-hidden="true" />
          {accountStatus?.exists ? 'Continue Onboarding' : 'Start Onboarding'}
        </Button>
      )}
      
      <Button 
        variant="outline" 
        className="w-full sm:w-auto focus:ring-2 focus:ring-indigo-500/30 focus:outline-none" 
        onClick={onRefreshStatus}
        disabled={loading}
        aria-label="Refresh account status"
      >
        <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
        Refresh Status
      </Button>
    </div>
  );
};

export default ConnectActionButtons;
