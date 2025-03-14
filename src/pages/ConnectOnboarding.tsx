
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthCheckingState from '@/components/connect/AuthCheckingState';
import ConnectMainCard from '@/components/connect/ConnectMainCard';
import { useAuthCheck } from '@/hooks/use-auth-check';
import { useConnectAccount } from '@/hooks/use-connect-account';

const ConnectOnboarding = () => {
  const { authChecking } = useAuthCheck();
  const { loading, accountStatus, checkAccountStatus, startOnboarding } = useConnectAccount();

  // Once authentication is confirmed, check account status
  useEffect(() => {
    if (!authChecking) {
      checkAccountStatus();
    }
  }, [authChecking, checkAccountStatus]);

  if (authChecking) {
    return <AuthCheckingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Stripe Connect Onboarding
          </h1>
          
          <ConnectMainCard
            loading={loading}
            accountStatus={accountStatus}
            onStartOnboarding={startOnboarding}
            onRefreshStatus={checkAccountStatus}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConnectOnboarding;
