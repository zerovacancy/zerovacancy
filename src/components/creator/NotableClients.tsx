 import React from 'react';
  import { cn } from '@/lib/utils';
  import { Tooltip } from '../ui/tooltip';
  import { useIsMobile } from '@/hooks/use-mobile';
  import type { NotableClient } from './types';

  interface NotableClientsProps {
    clients: NotableClient[];
  }

  export const NotableClients: React.FC<NotableClientsProps> = ({ clients }) => {
    const isMobile = useIsMobile();

    if (!clients || clients.length === 0) return null;

    return (
      <div className="mb-3">
        <div className="flex items-center mb-1.5">
          <div className="w-0.5 h-3 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mr-1.5"></div>
          <span className="text-xs text-gray-500 font-medium">WORKED WITH</span>
        </div>

        <div className="flex space-x-2">
          {clients.map((client, index) => (
            <Tooltip 
              key={index}
              content={
                <span className="text-xs">
                  {client.projectType && `${client.projectType} for `}
                  {client.name}
                  {client.year && ` (${client.year})`}
                </span>
              }
            >
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
                <img 
                  src={client.logo} 
                  alt={`${client.name} logo`}
                  className="max-h-full max-w-full object-contain p-0.5"
                />
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  };
