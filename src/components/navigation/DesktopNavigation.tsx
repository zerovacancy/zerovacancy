
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { MenuItem } from '@/types/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DesktopNavigationProps = {
  menuItems: MenuItem[];
  onPrelaunchLinkClick?: () => void;
};

const DesktopNavigation = ({ menuItems, onPrelaunchLinkClick }: DesktopNavigationProps) => {
  return (
    <nav className="hidden md:flex items-center justify-center flex-1 mx-auto">
      <div className="flex items-center space-x-4">
        {menuItems.map((item) => {
          if (item.children) {
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900">
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.label}>
                      <Link
                        to={child.href}
                        target={child.isExternal ? '_blank' : undefined}
                        rel={child.isExternal ? 'noopener noreferrer' : undefined}
                        className="w-full"
                      >
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          // If it's a hash link to a section on the homepage
          if (item.href.startsWith('/#')) {
            return (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </a>
            );
          } else {
            // For links to non-existent pages, trigger waitlist dialog instead
            return (
              <button
                key={item.label}
                onClick={onPrelaunchLinkClick}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 relative group"
              >
                {item.label}
                {/* "Coming Soon" tooltip on hover */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
                  Coming Soon
                </div>
              </button>
            );
          }
        })}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
