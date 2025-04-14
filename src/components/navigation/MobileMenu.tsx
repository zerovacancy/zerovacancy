
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { cn } from '@/lib/utils';

type MobileMenuProps = {
  menuItems: MenuItem[];
  onClose: () => void;
};

const MobileMenu = ({ 
  menuItems, 
  onClose 
}: MobileMenuProps) => {
  const { isAuthenticated, user, signOut, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  
  // Close menu on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop directly, not menu items
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-[var(--z-index-modal)] bg-black/10 backdrop-blur-sm md:hidden touch-manipulation"
      onClick={handleBackdropClick}
    >
      <div 
        className={cn(
          "absolute top-[calc(var(--mobile-header-height))] left-0 right-0 mx-space-sm",
          "pt-space-sm pb-space-md rounded-xl mobile-card-gradient mobile-card",
          "touch-manipulation transform-gpu animate-in fade-in slide-in-from-top duration-300"
        )}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on menu from closing
      >
        <div className="space-y-space-xs">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="mobile-touch-target block px-space-md py-space-sm mobile-text-base font-medium text-brand-purple-dark 
                hover:bg-purple-100 hover:text-brand-purple rounded-lg transition-colors
                active:bg-purple-200 min-h-[var(--touch-target-size)]"
              onClick={(e) => {
                // If it's not a hash link to a section, prevent default and show waitlist
                if (!item.href.startsWith('/#')) {
                  e.preventDefault();
                  openAuthDialog();
                }
                onClose();
              }}
            >
              {item.label}
              {!item.href.startsWith('/#') && (
                <span className="ml-2 px-1.5 py-0.5 mobile-text-xs font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
