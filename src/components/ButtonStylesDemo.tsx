import React from 'react';
import { Button } from '@/components/ui/button';
import { Button3DBorder } from '@/components/ui/button-3d-border';
import { Button3DEnhanced } from '@/components/ui/button-3d-enhanced';
import { Button3DPhysical } from '@/components/ui/button-3d-physical';
import { ArrowRight } from 'lucide-react';

interface ButtonStylesDemoProps {
  className?: string;
}

export const ButtonStylesDemo = ({ className }: ButtonStylesDemoProps) => {
  return (
    <div className={className}>
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-gray-800">Button Styles Comparison</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Compare different 3D button styles to see which best fits your design aesthetic
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {/* Original Button */}
          <div className="flex flex-col items-center space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Original</h3>
            <div className="flex justify-center">
              <Button 
                className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium"
              >
                JOIN WAITLIST
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* 3D Border Button */}
          <div className="flex flex-col items-center space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">3D Border</h3>
            <div className="flex justify-center">
              <Button3DBorder 
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                JOIN WAITLIST
              </Button3DBorder>
            </div>
          </div>
          
          {/* Enhanced 3D Button */}
          <div className="flex flex-col items-center space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Enhanced 3D</h3>
            <div className="flex justify-center">
              <Button3DEnhanced 
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                JOIN WAITLIST
              </Button3DEnhanced>
            </div>
          </div>
          
          {/* Physical 3D Button */}
          <div className="flex flex-col items-center space-y-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Physical 3D</h3>
            <div className="flex justify-center">
              <Button3DPhysical 
                variant="primary"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                JOIN WAITLIST
              </Button3DPhysical>
            </div>
          </div>
        </div>
        
        {/* Secondary Buttons */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {/* Original Button */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex justify-center">
              <Button 
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                EXPLORE PORTFOLIOS
              </Button>
            </div>
          </div>
          
          {/* 3D Border Button */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex justify-center">
              <Button3DBorder 
                variant="outline"
              >
                EXPLORE PORTFOLIOS
              </Button3DBorder>
            </div>
          </div>
          
          {/* Enhanced 3D Button */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex justify-center">
              <Button3DEnhanced 
                variant="outline"
              >
                EXPLORE PORTFOLIOS
              </Button3DEnhanced>
            </div>
          </div>
          
          {/* Physical 3D Button */}
          <div className="flex flex-col items-center space-y-3">
            <div className="flex justify-center">
              <Button3DPhysical 
                variant="outline"
              >
                EXPLORE PORTFOLIOS
              </Button3DPhysical>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Hover and click to experience the interactive differences between button styles
          </p>
          <p className="text-xs text-gray-400 mt-2">
            View detailed demos at: <span className="text-purple-600">/physical-3d-buttons</span>
          </p>
        </div>
      </div>
    </div>
  );
};