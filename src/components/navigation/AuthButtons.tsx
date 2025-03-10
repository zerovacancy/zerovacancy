
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AuthButtonsProps = {
  user: any;
  onSignInClick: () => void;
};

const AuthButtons = ({ user, onSignInClick }: AuthButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      {!user && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignInClick}
          className="hidden sm:flex focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
          aria-label="Sign in to your account"
        >
          <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
          Sign In
        </Button>
      )}
      
      <Button
        size="sm"
        className="hidden sm:flex focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
        onClick={() => user ? navigate('/account') : onSignInClick()}
        aria-label={user ? "Go to my dashboard" : "Get started with our service"}
      >
        {user ? 'My Dashboard' : 'Get Started'}
      </Button>
    </>
  );
};

export default AuthButtons;
