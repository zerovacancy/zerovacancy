import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, X, Menu } from 'lucide-react';
import AuthForms from '@/components/auth/AuthForms';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper function for smooth scrolling
const handleNavClick = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Resources dropdown component
const ResourcesDropdown = ({ className, onClick }: { className?: string, onClick?: () => void }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          type="button"
          className={cn(
            "text-[15px] font-medium transition-colors relative py-1.5 px-3",
            "header-nav-link flex items-center justify-center",
            "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:scale-x-0 before:origin-right",
            "before:transition-transform before:duration-300 hover:before:scale-x-100 hover:before:origin-left",
            "before:bg-[#9b87f5]",
            location.pathname.startsWith('/resources') || open
              ? "text-[#9b87f5] before:scale-x-100"
              : "text-black hover:text-[#9b87f5]"
          )}
        >
          Resources
          <ChevronDown className="h-4 w-4 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-[180px] bg-white border border-gray-200 shadow-lg rounded-md mt-1 p-1 z-[1100]"
      >
        <DropdownMenuItem 
          className="hover:bg-gray-50 focus:bg-gray-50 rounded-md p-2 cursor-pointer"
          onClick={() => {
            window.location.href = '/blog';
            setOpen(false);
            if (onClick) onClick();
          }}
        >
          Blog
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-50 focus:bg-gray-50 rounded-md p-2 cursor-pointer"
          onClick={() => {
            window.location.href = '/blog/learn';
            setOpen(false);
            if (onClick) onClick();
          }}
        >
          Learning Center
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Navigation Links component
const NavLinks = ({ className, onClick }: { className?: string, onClick?: () => void }) => {
  const location = useLocation();
  // Don't use conditional logic based on props, create separate components
  const isInMobileView = className?.includes('flex-col') || false;
  
  return (
    <nav className={cn("flex items-center", className)}>
      {/* Navigation Links */}
      {[
        { to: "/#find-creators", label: "Find Creators", sectionId: "find-creators" },
        { to: "/#how-it-works", label: "How It Works", sectionId: "how-it-works" },
        { to: "/#pricing", label: "Pricing", sectionId: "pricing" },
      ].map((link) => {
        // Always render a button, but with different classes based on view
        return (
          <button
            key={link.to}
            onClick={() => {
              if (location.pathname === '/') {
                handleNavClick(link.sectionId);
              } else {
                window.location.href = `/#${link.sectionId}`;
              }
              if (onClick) onClick();
            }}
            className={cn(
              isInMobileView
                ? "text-[16px] font-medium transition-colors w-full text-left py-3 px-1"
                : "text-[15px] font-medium transition-colors relative py-1.5 px-3 header-nav-link flex items-center justify-center before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:scale-x-0 before:origin-right before:transition-transform before:duration-300 hover:before:scale-x-100 hover:before:origin-left before:bg-[#9b87f5]",
              location.pathname === link.to 
                ? "text-[#9b87f5]" + (!isInMobileView ? " before:scale-x-100" : "")
                : "text-black hover:text-[#9b87f5]"
            )}
          >
            {link.label}
          </button>
        );
      })}
      
      {/* Resources section */}
      {!isInMobileView ? (
        // Desktop version - dropdown
        <div className="ml-1">
          <ResourcesDropdown onClick={onClick} />
        </div>
      ) : (
        // Mobile version - expandable section
        <div className="w-full">
          <div className="mb-2 text-[16px] font-medium py-3 px-1 border-b border-gray-100">
            Resources
          </div>
          <button
            onClick={() => {
              window.location.href = '/blog';
              if (onClick) onClick();
            }}
            className="text-[15px] font-normal transition-colors w-full text-left py-2 px-3 pl-4 hover:bg-gray-50 rounded"
          >
            Blog
          </button>
          <button
            onClick={() => {
              window.location.href = '/blog/learn';
              if (onClick) onClick();
            }}
            className="text-[15px] font-normal transition-colors w-full text-left py-2 px-3 pl-4 hover:bg-gray-50 rounded"
          >
            Learning Center
          </button>
        </div>
      )}
    </nav>
  );
};

// Mobile Header Component
const MobileHeaderComponent = ({ 
  isOpen, 
  setIsOpen, 
  handleLogoInteraction, 
  openAuthDialog 
}: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void; 
  handleLogoInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
  openAuthDialog: (type: 'login' | 'register') => void;
}) => {
  const { isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  
  return (
    <div className="flex justify-between items-center w-full h-16">
      {/* Logo */}
      <Link 
        to="/" 
        className="flex items-center transition-opacity active:opacity-80 logo-container"
        onClick={handleLogoInteraction}
        onTouchStart={handleLogoInteraction}
      >
        <img 
          src="/logo.png"
          alt="ZeroVacancy"
          className="h-7 w-auto"
        />
      </Link>
      
      {/* Mobile menu button with rectangular styling */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button 
            type="button"
            onClick={() => setIsOpen(true)}
            className="mobile-menu-btn bg-white"
            aria-label="Open menu"
          >
            <div className="hamburger-icon">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </div>
            <span className="menu-button-text">Menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col pt-16 px-0 w-full max-w-[320px] bg-white">
          {/* Close button positioned in the top-right corner */}
          <div className="absolute top-4 right-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 rounded-full focus:outline-none relative hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          {/* Main navigation links - with improved styling */}
          <div className="w-full px-5 pb-4">
            {/* Primary navigation buttons */}
            <div className="flex flex-col space-y-3 mb-6 w-full">
              {[
                { to: "/#find-creators", label: "Find Creators", sectionId: "find-creators" },
                { to: "/#how-it-works", label: "How It Works", sectionId: "how-it-works" },
                { to: "/#pricing", label: "Pricing", sectionId: "pricing" },
              ].map((link) => (
                <button
                  key={link.to}
                  onClick={() => {
                    if (location.pathname === '/') {
                      handleNavClick(link.sectionId);
                    } else {
                      window.location.href = `/#${link.sectionId}`;
                    }
                    setIsOpen(false);
                  }}
                  className="w-full py-3 px-4 text-left text-[16px] font-medium rounded-md 
                    bg-brand-purple text-white hover:bg-brand-purple-dark transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
            
            {/* Resources section with clearer styling */}
            <div className="mb-6">
              <h3 className="text-[16px] font-medium text-gray-800 mb-3 px-1">Resources</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    window.location.href = '/blog';
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-left text-[15px] font-medium rounded-md 
                    border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Blog
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/blog/learn';
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-left text-[15px] font-medium rounded-md 
                    border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Learning Center
                </button>
              </div>
            </div>
          </div>
          
          {/* Conditional Login/Signup or Dashboard buttons in the mobile menu */}
          <div className="mt-auto border-t border-gray-200 pt-4 px-5 pb-8">
            <h3 className="text-[16px] font-medium text-gray-800 mb-3">Account</h3>
            <div className="space-y-3">
              {!isAuthenticated ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center text-[15px] h-11 border-gray-300 text-gray-700 font-medium"
                    onClick={() => {
                      openAuthDialog('login');
                      setIsOpen(false);
                    }}
                  >
                    Log In
                  </Button>
                  <Button 
                    className="w-full justify-center text-[15px] h-11 bg-brand-purple hover:bg-brand-purple-dark font-medium"
                    onClick={() => {
                      openAuthDialog('register');
                      setIsOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    className="w-full justify-center text-[15px] h-11 bg-brand-purple text-white hover:bg-brand-purple-dark font-medium"
                    onClick={() => {
                      window.location.href = '/dashboard';
                      setIsOpen(false);
                    }}
                  >
                    My Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center text-[15px] h-11 border-gray-300 text-gray-700 font-medium"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    Log Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Desktop Header Component
const DesktopHeaderComponent = ({ 
  handleLogoInteraction, 
  openAuthDialog 
}: { 
  handleLogoInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
  openAuthDialog: (type: 'login' | 'register') => void;
}) => {
  const { isAuthenticated, user, signOut } = useAuth();
  
  return (
    <div className="flex items-center w-full h-[4.5rem]">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link 
          to="/" 
          className="flex items-center transition-opacity active:opacity-80 logo-container"
          onClick={handleLogoInteraction}
          onTouchStart={handleLogoInteraction}
        >
          <img 
            src="/logo.png"
            alt="ZeroVacancy"
            className="h-7 w-auto"
          />
        </Link>
      </div>
      
      {/* Center navigation */}
      <div className="flex justify-center flex-grow">
        <NavLinks className="flex items-center" />
      </div>
      
      {/* Conditional Auth buttons or User menu */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-3 buttons-container">
          <Button
            variant="outline"
            className="text-[15px] h-10 border-gray-300 text-gray-700 font-medium"
            onClick={() => openAuthDialog('login')}
          >
            Log In
          </Button>
          <Button 
            className="text-[15px] h-10 bg-brand-purple hover:bg-brand-purple-dark font-medium"
            onClick={() => openAuthDialog('register')}
          >
            Sign Up
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="text-[15px] h-10 bg-brand-purple text-white hover:bg-brand-purple-dark font-medium"
            onClick={() => window.location.href = '/dashboard'}
          >
            My Dashboard
          </Button>
          <Button 
            variant="outline" 
            className="text-[15px] h-10 border-gray-300 text-gray-700 font-medium"
            onClick={() => signOut()}
          >
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
};

// Main Header component
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Monitor screen size changes to determine if mobile view should be shown
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Prevent scroll on mobile when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle logo interaction
  const handleLogoInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    // If we're already on the home page, scroll to top
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Prevent navigation to avoid page reload
      e.preventDefault();
    }
    // Otherwise, navigation occurs normally
  };

  // Use the openAuthDialog function from the auth context
  const { openAuthDialog } = useAuth();

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white shadow-sm", 
      "transition-all duration-200"
    )}>
      <div className="container mx-auto px-4 lg:px-8">
        {isMobile ? (
          <MobileHeaderComponent 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            handleLogoInteraction={handleLogoInteraction}
            openAuthDialog={openAuthDialog}
          />
        ) : (
          <DesktopHeaderComponent 
            handleLogoInteraction={handleLogoInteraction}
            openAuthDialog={openAuthDialog}
          />
        )}
      </div>
      
      {/* Auth forms are already included in the App component */}
    </header>
  );
}