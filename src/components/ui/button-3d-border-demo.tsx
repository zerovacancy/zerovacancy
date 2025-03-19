import React from "react";
import { Button3DBorder } from "./button-3d-border";
import { ArrowRight, Star, Check, Settings } from "lucide-react";

export function Button3DBorderDemo() {
  return (
    <div className="w-full p-8 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800 text-center">Modern 3D Border Button Styles</h2>
      
      <div className="space-y-10">
        {/* Primary Buttons */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Primary Buttons (Purple)</h3>
          <div className="flex flex-wrap gap-6">
            <Button3DBorder variant="primary" size="sm">Small Button</Button3DBorder>
            <Button3DBorder variant="primary">Medium Button</Button3DBorder>
            <Button3DBorder 
              variant="primary" 
              size="lg" 
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Large Button
            </Button3DBorder>
          </div>
        </div>
        
        {/* Secondary Buttons */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Secondary Buttons (Indigo)</h3>
          <div className="flex flex-wrap gap-6">
            <Button3DBorder variant="secondary" size="sm">Small Button</Button3DBorder>
            <Button3DBorder 
              variant="secondary" 
              icon={<Star className="w-4 h-4" />} 
              iconPosition="left"
            >
              With Icon
            </Button3DBorder>
            <Button3DBorder variant="secondary" size="lg">Large Button</Button3DBorder>
          </div>
        </div>
        
        {/* Outline Buttons */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Outline Buttons</h3>
          <div className="flex flex-wrap gap-6">
            <Button3DBorder variant="outline" size="sm">Small Button</Button3DBorder>
            <Button3DBorder 
              variant="outline" 
              icon={<Check className="w-4 h-4" />} 
              iconPosition="left"
            >
              With Icon
            </Button3DBorder>
            <Button3DBorder variant="outline" size="lg">Large Button</Button3DBorder>
          </div>
        </div>
        
        {/* White Buttons */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">White Buttons</h3>
          <div className="flex flex-wrap gap-6">
            <Button3DBorder variant="white" size="sm">Small Button</Button3DBorder>
            <Button3DBorder 
              variant="white" 
              icon={<Settings className="w-4 h-4" />} 
              iconPosition="left"
            >
              With Icon
            </Button3DBorder>
            <Button3DBorder variant="white" size="lg">Large Button</Button3DBorder>
          </div>
        </div>
        
        {/* Interactive Demo */}
        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Interactive Demo</h3>
          <p className="text-gray-600 mb-4">Hover and click the buttons below to see the 3D effect in action.</p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button3DBorder 
              variant="primary" 
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Call to Action
            </Button3DBorder>
            
            <Button3DBorder 
              variant="outline" 
              size="lg"
              icon={<Star className="w-5 h-5" />}
              iconPosition="left"
            >
              Learn More
            </Button3DBorder>
          </div>
        </div>
        
        {/* Full Width Buttons */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Full Width Buttons</h3>
          <div className="space-y-6">
            <Button3DBorder 
              variant="primary" 
              fullWidth
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Primary Full Width Button
            </Button3DBorder>
            
            <Button3DBorder 
              variant="outline" 
              fullWidth
              icon={<Check className="w-5 h-5" />}
              iconPosition="left"
            >
              Outline Full Width Button
            </Button3DBorder>
          </div>
        </div>
      </div>
      
      {/* Technical Details */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Technical Details</h3>
        <p className="text-gray-700 mb-3">This 3D button effect is created using:</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Pseudo-elements <code>:before</code> and <code>:after</code> for the layered 3D appearance</li>
          <li>CSS transforms to create the depth perception</li>
          <li>Z-index layering to stack the elements properly</li>
          <li>Tailwind CSS for styling in a utility-first approach</li>
          <li>Interactive states (hover, active) with transition effects</li>
        </ul>
      </div>
    </div>
  );
}