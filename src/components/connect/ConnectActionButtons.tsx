
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/buttons/button';
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
          className="w-full sm:w-auto" 
          onClick={() => navigate('/account')}
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Go to Dashboard
        </Button>
      ) : (
        <Button 
          variant="default" 
          className="w-full sm:w-auto" 
          onClick={onStartOnboarding}
          disabled={loading}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {accountStatus?.exists ? 'Continue Onboarding' : 'Start Onboarding'}
        </Button>
      )}
      
      <Button 
        variant="outline" 
        className="w-full sm:w-auto" 
        onClick={onRefreshStatus}
        disabled={loading}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Status
      </Button>
    </div>
  );
};

export default ConnectActionButtons;
