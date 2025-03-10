
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  onSignOut: () => void;
};

const UserMenu = ({ onSignOut }: UserMenuProps) => {
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full focus:ring-2 focus:ring-indigo-500/30 focus:outline-none"
          aria-label="Account menu"
        >
          <UserCircle className="h-5 w-5 mr-1" aria-hidden="true" />
          <span className="hidden sm:inline-block">Account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate('/account')}>
          My Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/connect/onboarding')}>
          Connect Setup
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
