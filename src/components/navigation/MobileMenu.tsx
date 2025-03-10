
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
    <div className="md:hidden" role="dialog" aria-label="Mobile navigation menu">
      <div className="pt-2 pb-4 space-y-1 sm:px-3" role="menu">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            onClick={onClose}
            role="menuitem"
          >
            {item.label}
          </Link>
        ))}
        
        {!user ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
            onClick={() => {
              onClose();
              onSignInClick();
            }}
            aria-label="Sign in to your account"
          >
            <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
            Sign In
          </Button>
        ) : (
          <>
            <Link
              to="/account"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              onClick={onClose}
              role="menuitem"
            >
              My Account
            </Link>
            <Link
              to="/connect/onboarding"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              onClick={onClose}
              role="menuitem"
            >
              Connect Setup
            </Link>
            <button
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              onClick={() => {
                onSignOut();
                onClose();
              }}
              role="menuitem"
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
