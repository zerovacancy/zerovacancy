
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types/navigation';
import { mobileOptimizationClasses } from '@/utils/mobile-optimization';

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
  const { gradientBgMobile, improvedShadowMobile, coloredBorderMobile } = mobileOptimizationClasses;
  
  return (
    <div className="md:hidden">
      <div className={`pt-2 pb-4 space-y-1 sm:px-3 rounded-xl ${gradientBgMobile} ${improvedShadowMobile} ${coloredBorderMobile}`}>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="block px-4 py-3 text-base font-medium text-brand-purple-dark hover:bg-purple-100 hover:text-brand-purple rounded-lg my-1 transition-colors"
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        
        {!user ? (
          <Button 
            variant="default" 
            className="w-full justify-start bg-brand-purple hover:bg-brand-purple-medium mt-2"
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
              className="block px-4 py-3 text-base font-medium text-brand-purple-dark hover:bg-purple-100 hover:text-brand-purple rounded-lg my-1 transition-colors"
              onClick={onClose}
            >
              My Account
            </Link>
            <Link
              to="/connect/onboarding"
              className="block px-4 py-3 text-base font-medium text-brand-purple-dark hover:bg-purple-100 hover:text-brand-purple rounded-lg my-1 transition-colors"
              onClick={onClose}
            >
              Connect Setup
            </Link>
            <button
              className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg my-1 transition-colors"
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
