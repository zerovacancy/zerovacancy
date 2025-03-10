
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
        "flex flex-col items-center gap-0.5 py-1.5 px-2 sm:px-4",
        "touch-manipulation select-none active:scale-95",
        "transition-all duration-200",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <IconComponent className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
      <span className="text-[10px] sm:text-xs font-medium">{label}</span>
    </Link>
  );
};

export const BottomNav = () => {
  // Force return null to hide the bottom nav completely
  return null; 
  
  // The below code is kept but won't execute due to the early return above
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around w-full mx-auto h-14">
        <NavItem icon="home" label="Home" to="/" />
        <NavItem icon="search" label="Discover" to="/search" />
        <NavItem icon="message" label="Messages" to="/messages" />
        <NavItem icon="user" label="Profile" to="/profile" />
      </div>
    </nav>
  );
};
