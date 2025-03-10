
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlowDialog } from '@/components/ui/glow-dialog';
import { menuItems } from '@/data/menuItems';
import DesktopNavigation from '@/components/navigation/DesktopNavigation';
import MobileMenu from '@/components/navigation/MobileMenu';
import UserMenu from '@/components/navigation/UserMenu';
import AuthButtons from '@/components/navigation/AuthButtons';
import { useAuthState } from '@/hooks/use-auth-state';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const {
    user,
    handleSignOut
  } = useAuthState();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className={cn(
        "mx-auto flex items-center justify-between",
        "h-[65px] sm:h-[70px]", 
        "px-3 sm:px-5 lg:px-8",
        "max-w-7xl"
      )}>
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-7 sm:h-9 w-auto" />
            <span className="ml-2 text-lg sm:text-xl font-semibold text-blue-700">zerovacancy</span>
          </Link>
        </div>

        <DesktopNavigation menuItems={menuItems} />

        <div className="flex items-center space-x-3 sm:space-x-4">
          {user ? <UserMenu onSignOut={handleSignOut} /> : null}
          
          <AuthButtons user={user} onSignInClick={() => setShowSignInModal(true)} />

          {/* Mobile menu button */}
          <button 
            className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? 
              <X className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" /> : 
              <Menu className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && <MobileMenu menuItems={menuItems} user={user} onSignInClick={() => setShowSignInModal(true)} onSignOut={handleSignOut} onClose={() => setIsMenuOpen(false)} />}
      
      {/* Sign In Dialog */}
      <GlowDialog open={showSignInModal} onOpenChange={setShowSignInModal} />
    </header>
  );
};

export default Header;
