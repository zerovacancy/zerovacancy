
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types/navigation';

type MobileMenuProps = {
  menuItems: MenuItem[];
  user: any;
  onSignInClick: () => void;
  onSignOut: () => void;
  onClose: () => void;
};

const MobileMenu = ({ 
  menuItems, 
  user, 
  onSignInClick, 
  onSignOut,
  onClose 
}: MobileMenuProps) => {
  return (
    <div className="md:hidden">
      <div className="pt-2 pb-4 space-y-1 sm:px-3">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        
        {!user ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => {
              onClose();
              onSignInClick();
            }}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        ) : (
          <>
            <Link
              to="/account"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={onClose}
            >
              My Account
            </Link>
            <Link
              to="/connect/onboarding"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={onClose}
            >
              Connect Setup
            </Link>
            <button
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => {
                onSignOut();
                onClose();
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
