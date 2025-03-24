
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
  // Use a ref instead of state for the timeout to avoid hook dependency issues
  const logoClickTimeoutRef = React.useRef<number | null>(null);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const {
    user,
    isAuthenticated,
    openAuthDialog
  } = useAuth();
  
  // Clean up the timeout on unmount
  React.useEffect(() => {
    // Return a cleanup function that will be called when the component unmounts
    return () => {
      // Check if we have an active timeout and clear it
      if (logoClickTimeoutRef.current !== null) {
        window.clearTimeout(logoClickTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array to run only on mount/unmount
  
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-8 md:h-9 w-auto"
              onTouchStart={(e) => {
                // For mobile devices, use touch events
                if (logoClickTimeoutRef.current !== null) {
                  window.clearTimeout(logoClickTimeoutRef.current);
                }
                
                logoClickTimeoutRef.current = window.setTimeout(() => {
                  setLogoClickCount(0);
                  logoClickTimeoutRef.current = null;
                }, 3000);
                
                setLogoClickCount(prev => {
                  const newCount = prev + 1;
                  if (newCount >= 10) {
                    const secretWord = prompt('Enter admin verification word:');
                    if (secretWord === 'zerovacancy2025') {
                      sessionStorage.setItem('adminAccessToken', 'granted');
                      window.location.href = '/hidden-admin-login';
                    }
                    return 0;
                  }
                  return newCount;
                });
              }}
              onClick={(e) => {
                // For desktop devices
                e.preventDefault();
                e.stopPropagation();
                
                // Reset timeout if it exists
                if (logoClickTimeoutRef.current !== null) {
                  window.clearTimeout(logoClickTimeoutRef.current);
                }
                
                // Set a new timeout to reset click count after 3 seconds of inactivity
                logoClickTimeoutRef.current = window.setTimeout(() => {
                  setLogoClickCount(0);
                  logoClickTimeoutRef.current = null;
                }, 3000);
                
                setLogoClickCount(prev => {
                  const newCount = prev + 1;
                  if (newCount >= 10) {
                    // After 10 clicks, prompt for a password
                    const secretWord = prompt('Enter admin verification word:');
                    if (secretWord === 'zerovacancy2025') { // This should be changed in production
                      // Set the admin access token before redirecting
                      sessionStorage.setItem('adminAccessToken', 'granted');
                      window.location.href = '/hidden-admin-login';
                    }
                    return 0;
                  }
                  return newCount;
                });
              }}
            />
          </Link>
        </div>

        <DesktopNavigation menuItems={menuItems} onPrelaunchLinkClick={openAuthDialog} />

        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Auth functionality temporarily hidden */}
          {/* {isAuthenticated ? <UserMenu /> : null}
          <AuthButtons /> */}

          {/* Mobile menu button - improved touch target */}
          <button 
            className={cn(
              "inline-flex items-center justify-center rounded-md md:hidden",
              "min-h-[50px] min-w-[50px] p-3",  // Further increased touch target
              "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
              "touch-manipulation active:bg-gray-200", // Better feedback on touch
              "transition-colors duration-200" // Smoother transition
            )}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <div className="p-1 flex items-center justify-center touch-manipulation">
                <X className="block h-7 w-7" aria-hidden="true" />
              </div>
            ) : (
              <div className="p-1 flex items-center justify-center touch-manipulation">
                <Menu className="block h-7 w-7" aria-hidden="true" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && <MobileMenu menuItems={menuItems} onClose={() => setIsMenuOpen(false)} />}
      
      {/* Auth Forms Dialog - temporarily hidden */}
      {/* <AuthForms /> */}
    </header>
  );
};

export default Header;
