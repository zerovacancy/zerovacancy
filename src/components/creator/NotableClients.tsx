import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import type { NotableClient } from './types';

interface NotableClientsProps {
  clients: NotableClient[];
}

export const NotableClients: React.FC<NotableClientsProps> = ({ clients }) => {
  const isMobile = useIsMobile();

  // Ensure we always have at least 2 clients for consistency
  const displayClients = clients.length >= 2 ? clients : [
    ...clients,
    ...Array(2 - clients.length).fill({}).map(() => ({
      name: 'Client',
      logo: '/placeholder.svg',
      projectType: 'Creative work'
    }))
  ];

  return (
    <div className="mb-3">
      <div className="flex items-center mb-1.5">
        <div className="w-0.5 h-3 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mr-1.5"></div>
        <span className="text-xs text-gray-500 font-medium">WORKED WITH</span>
      </div>

      <div className="flex space-x-2">
        {displayClients.map((client, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "rounded-md overflow-hidden",
                    "border border-gray-100",
                    "bg-white shadow-sm",
                    "flex items-center justify-center",
                    "hover:scale-105 transition-transform duration-200",
                    isMobile ? "h-5 w-10" : "h-6 w-12"
                  )}
                >
                  {/* Use placeholder SVG if image fails to load */}
                  <img 
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="max-h-full max-w-full object-contain p-0.5"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = '/placeholder.svg'; // Fallback to placeholder
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <span className="text-xs">
                  {client.projectType && `${client.projectType} for `}
                  {client.name}
                  {client.year && ` (${client.year})`}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};