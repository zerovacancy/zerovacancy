
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { menuItems } from '@/data/menuItems';
import { useAuth } from '@/components/auth/AuthContext';
import { cn } from '@/lib/utils';
import { Magnetic } from '@/components/ui/magnetic';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
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
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group">
        <span className={cn(
          "text-[15px] font-medium transition-colors relative py-1.5",
          "flex items-center h-[40px]", /* Match the height of other nav items */
          "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:scale-x-0 before:origin-right",
          "before:transition-transform before:duration-300 group-hover:before:scale-x-100 before:origin-left",
          "before:bg-[#9b87f5]",
          location.pathname.startsWith('/resources')
            ? "text-[#9b87f5] before:scale-x-100"
            : "text-black hover:text-[#9b87f5]"
        )}>
          Resources
          <ChevronDown className="h-4 w-4 ml-1" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px] bg-white border border-border/40 shadow-lg">
        <DropdownMenuItem asChild onClick={onClick} className="hover:bg-accent focus:bg-accent">
          <Link to="/resources/blog" className="w-full cursor-pointer">Blog</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={onClick} className="hover:bg-accent focus:bg-accent">
          <Link to="/resources/learn" className="w-full cursor-pointer">Learn</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavLinks = ({ className, onClick }: { className?: string, onClick?: () => void }) => {
  const location = useLocation();
  
  return (
    <nav className={cn("flex items-center gap-10", className)}>
      {[
        { to: "/#search", label: "Find Creators", sectionId: "search" },
        { to: "/#how-it-works", label: "How It Works", sectionId: "how-it-works" },
        { to: "/#pricing", label: "Pricing", sectionId: "pricing" },
      ].map((link) => (
        <Magnetic key={link.to} intensity={0.5}>
          <button
            onClick={() => {
              if (location.pathname === '/') {
                handleNavClick(link.sectionId);
              } else {
                window.location.href = `/#${link.sectionId}`;
              }
              if (onClick) onClick();
            }}
            className={cn(
              "text-[15px] font-medium transition-colors relative py-1.5",
              "flex items-center h-[40px]", /* Add consistent height and flex alignment */
              "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:scale-x-0 before:origin-right",
              "before:transition-transform before:duration-300 hover:before:scale-x-100 hover:before:origin-left",
              "before:bg-[#9b87f5]",
              location.pathname === link.to 
                ? "text-[#9b87f5] before:scale-x-100" 
                : "text-black hover:text-[#9b87f5]"
            )}
          >
            {link.label}
          </button>
        </Magnetic>
      ))}
      <Magnetic intensity={0.5}>
        <ResourcesDropdown onClick={onClick} />
      </Magnetic>
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
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 mobile-sticky-header">
      <div className="container flex h-16 items-center justify-between lg:px-8 md:px-6 px-4 header-container">
        {/* Logo */}
        <Magnetic intensity={0.3}>
          <Link 
            to="/" 
            className="flex items-center transition-opacity active:opacity-80 -ml-1 md:ml-0"
            onClick={handleLogoInteraction}
            onTouchStart={handleLogoInteraction}
          >
            <motion.img 
              src="/logo.png"
              alt="ZeroVacancy"
              initial={false}
              animate={{ scale: isOpen ? 0.95 : 1 }}
              className="h-7 w-auto"
            />
          </Link>
        </Magnetic>

        {/* Navigation - with flex alignment */}
        <NavLinks className="hidden md:flex md:items-center" />

        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-6 pt-10">
            <NavLinks onClick={() => setIsOpen(false)} className="flex-col items-start gap-4" />
            <div className="flex flex-col gap-2 mt-4">
              <Button variant="ghost" asChild className="justify-start h-[40px]">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild className="justify-start h-[40px]">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Right side buttons - with consistent height */}
        <div className="hidden md:flex items-center gap-3 buttons-container">
          <Magnetic intensity={0.4}>
            <Button 
              variant="ghost" 
              asChild 
              className="h-[40px] px-5 text-[15px] font-medium hover:bg-accent/50"
            >
              <Link to="/login">Log In</Link>
            </Button>
          </Magnetic>
          <Magnetic intensity={0.4}>
            <Button 
              asChild 
              className="h-[40px] px-5 text-[15px] font-medium bg-primary hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
            >
              <Link to="/signup">Sign Up</Link>
            </Button>
          </Magnetic>
        </div>
      </div>
    </header>
  );
};

export default Header;
