
import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  icon: 'home' | 'search' | 'message' | 'user';
  label: string;
  to?: string;
}

// Memoized NavItem component to prevent unnecessary re-renders
const NavItem = memo(({ icon, label, to = '/' }: NavItemProps) => {
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
        "transition-colors duration-200", // Only animate colors, not transforms
        isActive 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
      style={{
        WebkitTapHighlightColor: "transparent", // Remove tap highlight on mobile
        touchAction: "manipulation", // Optimize for touch
        willChange: "auto", // Only use will-change when actually changing
        textRendering: "optimizeSpeed", // Optimize text rendering
      }}
    >
      <IconComponent className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
      <span className="text-[10px] sm:text-xs font-medium">{label}</span>
    </Link>
  );
});

NavItem.displayName = "NavItem";

// Memoized BottomNav component to prevent unnecessary re-renders
export const BottomNav = memo(() => {
  // Force return null to hide the bottom nav completely
  return null; 
  
  // The below code is kept but won't execute due to the early return above
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
      style={{
        willChange: "transform", // Optimize for animations
        transform: "translateZ(0)", // Force GPU rendering
        backfaceVisibility: "hidden", // Prevent flickering
        WebkitBackfaceVisibility: "hidden", // For Safari
        WebkitFontSmoothing: "antialiased", // Smooth rendering
      }}
    >
      <div className="flex items-center justify-around w-full mx-auto h-14">
        <NavItem icon="home" label="Home" to="/" />
        <NavItem icon="search" label="Discover" to="/search" />
        <NavItem icon="message" label="Messages" to="/messages" />
        <NavItem icon="user" label="Profile" to="/profile" />
      </div>
    </nav>
  );
});

BottomNav.displayName = "BottomNav";

export default BottomNav;
