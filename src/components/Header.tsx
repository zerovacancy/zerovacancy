
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { menuItems } from '@/data/menuItems';
import DesktopNavigation from '@/components/navigation/DesktopNavigation';
import MobileMenu from '@/components/navigation/MobileMenu';
import UserMenu from '@/components/navigation/UserMenu';
import AuthButtons from '@/components/navigation/AuthButtons';
import AuthForms from '@/components/auth/AuthForms';
import { useAuth } from '@/components/auth/AuthContext';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    isAuthenticated,
    openAuthDialog
  } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 md:h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 md:h-9 w-auto" />
          </Link>
        </div>

        <DesktopNavigation menuItems={menuItems} onPrelaunchLinkClick={openAuthDialog} />

        <div className="flex items-center space-x-3 md:space-x-4">
          {isAuthenticated ? <UserMenu /> : null}
          
          <AuthButtons />

          {/* Mobile menu button - improved touch target */}
          <button 
            className={cn(
              "inline-flex items-center justify-center rounded-md md:hidden",
              "min-h-[44px] min-w-[44px] p-2",  // Increased touch target
              "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
              "touch-manipulation" // Better handling for touch events
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? 
              <X className="block h-6 w-6" aria-hidden="true" /> : 
              <Menu className="block h-6 w-6" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && <MobileMenu menuItems={menuItems} onClose={() => setIsMenuOpen(false)} />}
      
      {/* Auth Forms Dialog */}
      <AuthForms />
    </header>
  );
};

export default Header;
