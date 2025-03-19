import React from "react";
import { Button3D } from "./button-3d";
import { ArrowRight, Star, Check, Settings } from "lucide-react";

export function Button3DDemo() {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Modern 3D Button Styles</h2>
      
      <div className="space-y-8">
        {/* Primary Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Primary Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button3D variant="primary" size="sm">Small Button</Button3D>
            <Button3D variant="primary">Medium Button</Button3D>
            <Button3D 
              variant="primary" 
              size="lg" 
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Large Button
            </Button3D>
          </div>
        </div>
        
        {/* Secondary Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Secondary Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button3D variant="secondary" size="sm">Small Button</Button3D>
            <Button3D 
              variant="secondary" 
              icon={<Star className="w-4 h-4" />} 
              iconPosition="left"
            >
              With Icon
            </Button3D>
            <Button3D variant="secondary" size="lg">Large Button</Button3D>
          </div>
        </div>
        
        {/* Outline Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Outline Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button3D variant="outline" size="sm">Small Button</Button3D>
            <Button3D 
              variant="outline" 
              icon={<Check className="w-4 h-4" />} 
              iconPosition="left"
            >
              With Icon
            </Button3D>
            <Button3D variant="outline" size="lg">Large Button</Button3D>
          </div>
        </div>
        
        {/* Minimal Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Minimal Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <Button3D variant="minimal" size="sm">Small Button</Button3D>
            <Button3D 
              variant="minimal" 
              icon={<Settings className="w-4 h-4" />} 
              iconPosition="left"
            >
              With Icon
            </Button3D>
            <Button3D variant="minimal" size="lg">Large Button</Button3D>
          </div>
        </div>
        
        {/* Full Width Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Full Width Buttons</h3>
          <div className="space-y-4">
            <Button3D 
              variant="primary" 
              fullWidth
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Primary Full Width
            </Button3D>
            <Button3D 
              variant="outline" 
              fullWidth
              icon={<Check className="w-5 h-5" />}
              iconPosition="left"
            >
              Outline Full Width
            </Button3D>
          </div>
        </div>
      </div>
    </div>
  );
}