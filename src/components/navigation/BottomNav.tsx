
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { mobileOptimizationClasses } from '@/utils/mobile-optimization';

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
        "flex flex-col items-center gap-1 py-2 px-3",
        "touch-manipulation select-none active:scale-95",
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
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
};

export const BottomNav = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { gradientBgMobile, improvedShadowMobile } = mobileOptimizationClasses;
  
  // Hide the bottom nav on the index page
  if (!isMobile || location.pathname === "/") return null;
  
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t border-purple-100 ${improvedShadowMobile} ${gradientBgMobile} rounded-t-xl`}>
      <div className="flex items-center justify-around w-full mx-auto h-16 px-2">
        <NavItem icon="home" label="Home" to="/" />
        <NavItem icon="search" label="Discover" to="/search" />
        <NavItem icon="message" label="Messages" to="/messages" />
        <NavItem icon="user" label="Profile" to="/profile" />
      </div>
    </nav>
  );
};
