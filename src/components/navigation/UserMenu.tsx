
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
import { useAuth } from '@/components/auth/AuthContext';

const UserMenu = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  // Get user's email or default display text
  const userEmail = user?.email || 'User';
  // Display only the first part of the email (before @)
  const displayName = userEmail.includes('@') ? userEmail.split('@')[0] : userEmail;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full">
          <UserCircle className="h-5 w-5 mr-1" />
          <span className="hidden sm:inline-block">
            {displayName}
          </span>
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
        <DropdownMenuItem onClick={signOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
