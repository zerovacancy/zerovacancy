
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/types/navigation';
import { mobileOptimizationClasses } from '@/utils/mobile-optimization';
import { useAuth } from '@/components/auth/AuthContext';

type MobileMenuProps = {
  menuItems: MenuItem[];
  onClose: () => void;
};

const MobileMenu = ({ 
  menuItems, 
  onClose 
}: MobileMenuProps) => {
  const { gradientBgMobile, improvedShadowMobile, coloredBorderMobile } = mobileOptimizationClasses;
  const { isAuthenticated, user, signOut, openAuthDialog } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="md:hidden">
      <div className={`pt-2 pb-4 space-y-1 sm:px-3 rounded-xl ${gradientBgMobile} ${improvedShadowMobile} ${coloredBorderMobile}`}>
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block px-4 py-3 text-base font-medium text-brand-purple-dark hover:bg-purple-100 hover:text-brand-purple rounded-lg my-1 transition-colors"
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
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
            )}
          </a>
        ))}
        
        {/* Authentication options hidden until ready */}
      </div>
    </div>
  );
};

export default MobileMenu;
