
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { GlowDialog } from '@/components/ui/glow-dialog';
import { addBottomNavSpacer } from '@/utils/mobile-safety';

interface NavItemProps {
  icon: 'home' | 'search' | 'message' | 'user';
  label: string;
  to?: string;
}

const NavItem = ({ icon, label, to = '/' }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const IconComponent = {
    home: Home,
    search: Search,
    message: MessageSquare,
    user: User
  }[icon];

  return (
    <Link
      to={to}
      className={cn(
        "mobile-touch-target flex flex-col items-center gap-1 py-space-xs px-space-sm",
        "touch-manipulation select-none mobile-active-state",
        "transition-all duration-200 rounded-lg",
        isActive 
          ? "text-white bg-gradient-to-r from-brand-purple to-brand-purple-medium" 
          : "text-brand-purple-dark hover:bg-purple-50"
      )}
    >
      <IconComponent className={cn(
        "w-5 h-5",
        isActive ? "text-white" : "text-brand-purple"
      )} />
      <span className="mobile-text-xs font-medium">{label}</span>
    </Link>
  );
};

export const BottomNav = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Always declare state variables at the top level
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  
  // Add bottom spacer to prevent content from being hidden behind the nav
  useEffect(() => {
    // Only run this effect on mobile and non-index routes
    if (isMobile && location.pathname !== "/" && location.pathname !== "") {
      // Add spacer when the component mounts
      addBottomNavSpacer();
      
      // Add class to body to enable proper padding
      document.body.classList.add('has-fixed-bottom');
      
      // Clean up when component unmounts
      return () => {
        document.body.classList.remove('has-fixed-bottom');
        // We don't remove the spacer as it might be needed by other fixed elements
      };
    }
  }, [isMobile, location.pathname]);
  
  // Early return after all hooks are called
  if (!isMobile || location.pathname === "/" || location.pathname === "") return null;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-[var(--z-index-fixed)] mobile-card border-t border-purple-100 rounded-t-xl fixed-bottom safe-area-inset"
        style={{
          height: 'var(--mobile-bottom-nav-height)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
          background: 'linear-gradient(to bottom, #ffffff, #fafafa)'
        }}
      >
        <div className="flex items-center justify-around w-full mx-auto h-full px-space-xs">
          <NavItem icon="home" label="Home" to="/" />
          
          {/* Discover link with mobile styling */}
          <a 
            href="#"
            className="mobile-touch-target flex flex-col items-center gap-1 py-space-xs px-space-sm mobile-active-state 
              transition-all duration-200 rounded-lg text-brand-purple-dark hover:bg-purple-50"
            onClick={(e) => {
              e.preventDefault();
              setShowGlowDialog(true);
            }}
          >
            <Search className="w-5 h-5 text-brand-purple" />
            <span className="mobile-text-xs font-medium">
              Discover
              <span className="text-[8px] ml-0.5 opacity-75">Soon</span>
            </span>
          </a>
          
          {/* Messages link with mobile styling */}
          <a 
            href="#"
            className="mobile-touch-target flex flex-col items-center gap-1 py-space-xs px-space-sm mobile-active-state 
              transition-all duration-200 rounded-lg text-brand-purple-dark hover:bg-purple-50"
            onClick={(e) => {
              e.preventDefault();
              setShowGlowDialog(true);
            }}
          >
            <MessageSquare className="w-5 h-5 text-brand-purple" />
            <span className="mobile-text-xs font-medium">
              Messages
              <span className="text-[8px] ml-0.5 opacity-75">Soon</span>
            </span>
          </a>
          
          {/* Profile link with mobile styling */}
          <a 
            href="#"
            className="mobile-touch-target flex flex-col items-center gap-1 py-space-xs px-space-sm mobile-active-state 
              transition-all duration-200 rounded-lg text-brand-purple-dark hover:bg-purple-50"
            onClick={(e) => {
              e.preventDefault();
              setShowGlowDialog(true);
            }}
          >
            <User className="w-5 h-5 text-brand-purple" />
            <span className="mobile-text-xs font-medium">
              Profile
              <span className="text-[8px] ml-0.5 opacity-75">Soon</span>
            </span>
          </a>
        </div>
      </nav>
      
      <GlowDialog open={showGlowDialog} onOpenChange={setShowGlowDialog} />
    </>
  );
};
