
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/buttons/button';

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
          className="hidden sm:flex"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      )}
      
      <Button
        size="sm"
        className="hidden sm:flex"
        onClick={() => user ? navigate('/account') : onSignInClick()}
      >
        {user ? 'My Dashboard' : 'Get Started'}
      </Button>
    </>
  );
};

export default AuthButtons;
