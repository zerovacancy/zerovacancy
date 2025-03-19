
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button3DPhysical } from '@/components/ui/button-3d-physical';

type AuthButtonsProps = {
  user: any;
  onSignInClick: () => void;
};

const AuthButtons = ({ user, onSignInClick }: AuthButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      {!user && (
        <Button3DPhysical
          variant="white"
          size="sm"
          icon={<LogIn className="h-3.5 w-3.5" />}
          iconPosition="left"
          onClick={onSignInClick}
          className="hidden sm:flex"
        >
          Sign In
        </Button3DPhysical>
      )}
      
      <Button3DPhysical
        variant="primary"
        size="sm"
        className="hidden sm:flex"
        onClick={() => user ? navigate('/account') : onSignInClick()}
      >
        {user ? 'My Dashboard' : 'Get Started'}
      </Button3DPhysical>
    </>
  );
};

export default AuthButtons;
