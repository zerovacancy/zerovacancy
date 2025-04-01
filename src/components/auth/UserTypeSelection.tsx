import React, { useState, useCallback } from 'react';
import { Building2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type UserType = 'property_team' | 'creator' | 'agency' | null;

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
  // Use a safer method to handle selection to avoid React hook errors
  const handleSelection = useCallback((type: UserType) => {
    if (typeof onTypeSelect === 'function') {
      onTypeSelect(type);
    }
  }, [onTypeSelect]);
  
  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-lg font-semibold text-center mb-4">I am a:</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => handleSelection('property_team')}
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
          onClick={() => handleSelection('creator')}
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
        
        <button
          type="button"
          onClick={() => handleSelection('agency')}
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all",
            "hover:shadow-md",
            selectedType === 'agency' 
              ? "border-brand-purple bg-brand-purple/5 shadow-sm" 
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
            selectedType === 'agency' 
              ? "bg-brand-purple text-white" 
              : "bg-gray-100 text-gray-500"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-1">Digital Agency</h3>
          <p className="text-sm text-gray-500 text-center">
            I manage creators or properties for clients
          </p>
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelection;