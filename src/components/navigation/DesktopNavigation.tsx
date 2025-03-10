
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
};

const DesktopNavigation = ({ menuItems }: DesktopNavigationProps) => {
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

          return (
            <Link
              key={item.label}
              to={item.href}
              className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
