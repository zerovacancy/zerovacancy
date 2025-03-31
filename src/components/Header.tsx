import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, X, Menu } from 'lucide-react';
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

const handleNavClick = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

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
            window.location.href = '/resources/blog';
            setOpen(false);
            if (onClick) onClick();
          }}
        >
          Blog
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-gray-50 focus:bg-gray-50 rounded-md p-2 cursor-pointer"
          onClick={() => {
            window.location.href = '/resources/learn';
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
              window.location.href = '/resources/blog';
              if (onClick) onClick();
            }}
            className="text-[15px] font-normal transition-colors w-full text-left py-2 px-3 pl-4 hover:bg-gray-50 rounded"
          >
            Blog
          </button>
          <button
            onClick={() => {
              window.location.href = '/resources/learn';
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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Use a ref instead of state for the timeout to avoid hook dependency issues
  const logoClickTimeoutRef = React.useRef<number | null>(null);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const { openAuthDialog } = useAuth();
  
  // Handle logo click for admin access - unified handler for both click and touch
  const handleLogoInteraction = (e: React.MouseEvent | React.TouchEvent) => {
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
  };
  
  // Clean up the timeout on unmount
  React.useEffect(() => {
    return () => {
      if (logoClickTimeoutRef.current !== null) {
        window.clearTimeout(logoClickTimeoutRef.current);
      }
    };
  }, []);
  
  // Track scroll state for enhanced header styling
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Mobile layout
  const MobileHeader = () => (
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
                    window.location.href = '/resources/blog';
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-left text-[15px] font-medium rounded-md 
                    border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Blog
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/resources/learn';
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
          
          {/* Login and Sign Up buttons in the mobile menu - with consistent styling */}
          <div className="mt-auto border-t border-gray-200 pt-4 px-5 pb-8">
            <h3 className="text-[16px] font-medium text-gray-800 mb-3">Account</h3>
            <div className="space-y-3">
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
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
  
  // Desktop layout
  const DesktopHeader = () => (
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
      
      {/* Auth buttons */}
      <div className="flex items-center gap-3 buttons-container">
        <Button 
          variant="ghost" 
          onClick={() => openAuthDialog('login')}
          className="header-btn-secondary flex items-center justify-center"
        >
          Log In
        </Button>
        <Button 
          onClick={() => openAuthDialog('register')}
          className="header-btn-primary bg-primary hover:bg-primary/90 hover:shadow-lg flex items-center justify-center"
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
  
  return (
    <header className={`sticky top-0 z-50 w-full mobile-sticky-header ${isScrolled ? 'scrolled' : ''} bg-white border-b border-gray-100`}>
      <div className="w-full px-4 md:container md:mx-auto md:px-6">
        {/* Responsive header layout */}
        <div className="md:hidden">
          <MobileHeader />
        </div>
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
      </div>
    </header>
  );
};

export default Header;