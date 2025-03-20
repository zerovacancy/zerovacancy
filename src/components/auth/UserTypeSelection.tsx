import React from 'react';
import { Building2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type UserType = 'property_team' | 'creator' | null;

type UserTypeSelectionProps = {
  selectedType: UserType;
  onTypeSelect: (type: UserType) => void;
  className?: string;
};

const UserTypeSelection = ({
  selectedType,
  onTypeSelect,
  className,
}: UserTypeSelectionProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-lg font-semibold text-center mb-4">I am a:</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onTypeSelect('property_team')}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all",
            "hover:shadow-md",
            selectedType === 'property_team' 
              ? "border-brand-purple bg-brand-purple/5 shadow-sm" 
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
            selectedType === 'property_team' 
              ? "bg-brand-purple text-white" 
              : "bg-gray-100 text-gray-500"
          )}>
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-1">Property Team</h3>
          <p className="text-sm text-gray-500 text-center">
            I want to find and hire content creators
          </p>
        </button>
        
        <button
          type="button"
          onClick={() => onTypeSelect('creator')}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all",
            "hover:shadow-md",
            selectedType === 'creator' 
              ? "border-brand-purple bg-brand-purple/5 shadow-sm" 
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
            selectedType === 'creator' 
              ? "bg-brand-purple text-white" 
              : "bg-gray-100 text-gray-500"
          )}>
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-1">Content Creator</h3>
          <p className="text-sm text-gray-500 text-center">
            I want to find and apply for property projects
          </p>
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelection;