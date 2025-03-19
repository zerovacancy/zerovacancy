
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button3DPhysical } from '@/components/ui/button-3d-physical';
import { useAuth } from '@/components/auth/AuthContext';

const AuthButtons = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthDialog } = useAuth();
  
  return (
    <>
      {!isAuthenticated && (
        <Button3DPhysical
          variant="white"
          size="sm"
          icon={<LogIn className="h-3.5 w-3.5" />}
          iconPosition="left"
          onClick={openAuthDialog}
          className="hidden sm:flex"
        >
          Sign In
        </Button3DPhysical>
      )}
      
      <Button3DPhysical
        variant="primary"
        size="sm"
        className="hidden sm:flex"
        onClick={() => isAuthenticated ? navigate('/account') : openAuthDialog()}
      >
        {isAuthenticated ? 'My Dashboard' : 'Get Started'}
      </Button3DPhysical>
    </>
  );
};

export default AuthButtons;
