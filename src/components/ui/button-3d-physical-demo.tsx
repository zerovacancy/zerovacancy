import React from "react";
import { Button3DPhysical } from "./button-3d-physical";
import { ArrowRight, Star, PlusCircle, CheckCircle2, Zap, Globe, Settings, Check } from "lucide-react";

export function Button3DPhysicalDemo() {
  return (
    <div className="w-full p-8 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 text-center">True 3D Physical Buttons</h2>
      <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
        Buttons with authentic physical properties - real depth, natural shadows, consistent lighting, and proper interaction physics
      </p>
      
      <div className="space-y-16">
        {/* Primary Buttons */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Primary Buttons</h3>
          
          {/* Interactive example with caption */}
          <div className="bg-gray-50/70 p-6 rounded-xl mb-8">
            <p className="text-gray-600 text-sm text-center mb-6">
              Try clicking to see the physical press animation with accurate depth
            </p>
            <div className="flex flex-wrap gap-8 justify-center">
              <Button3DPhysical
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Primary Action
              </Button3DPhysical>
              
              <Button3DPhysical
                variant="primary"
                size="lg"
                icon={<Globe className="w-5 h-5" />}
                iconPosition="left"
              >
                Explore Now
              </Button3DPhysical>
            </div>
          </div>
          
          {/* Size variations */}
          <div className="flex flex-wrap gap-6 justify-center">
            <Button3DPhysical
              variant="primary"
              size="sm"
              icon={<PlusCircle className="w-4 h-4" />}
              iconPosition="left"
            >
              Small
            </Button3DPhysical>
            
            <Button3DPhysical
              variant="primary"
              icon={<Zap className="w-4 h-4" />}
              iconPosition="left"
            >
              Medium
            </Button3DPhysical>
            
            <Button3DPhysical
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Large
            </Button3DPhysical>
          </div>
        </section>
        
        {/* Secondary Buttons */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Secondary Buttons</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button3DPhysical
              variant="secondary"
              size="sm"
            >
              Small Button
            </Button3DPhysical>
            
            <Button3DPhysical
              variant="secondary"
              icon={<Star className="w-4 h-4" />}
              iconPosition="left"
            >
              With Icon
            </Button3DPhysical>
            
            <Button3DPhysical
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Large Button
            </Button3DPhysical>
          </div>
        </section>
        
        {/* Outline Buttons */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Outline Buttons</h3>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button3DPhysical
              variant="outline"
              size="sm"
            >
              Small Button
            </Button3DPhysical>
            
            <Button3DPhysical
              variant="outline"
              icon={<CheckCircle2 className="w-4 h-4" />}
              iconPosition="left"
            >
              With Icon
            </Button3DPhysical>
            
            <Button3DPhysical
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Large Button
            </Button3DPhysical>
          </div>
        </section>
        
        {/* White Buttons on Dark Background */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">White Buttons</h3>
          <div className="bg-gradient-to-r from-slate-800 to-purple-900 p-8 rounded-xl">
            <div className="flex flex-wrap gap-6 justify-center">
              <Button3DPhysical
                variant="white"
                size="sm"
              >
                Small Button
              </Button3DPhysical>
              
              <Button3DPhysical
                variant="white"
                icon={<Settings className="w-4 h-4" />}
                iconPosition="left"
              >
                With Icon
              </Button3DPhysical>
              
              <Button3DPhysical
                variant="white"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Large Button
              </Button3DPhysical>
            </div>
          </div>
        </section>
        
        {/* Full Width Buttons */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Full Width Buttons</h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            <Button3DPhysical
              variant="primary"
              fullWidth
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              JOIN THE WAITLIST
            </Button3DPhysical>
            
            <Button3DPhysical
              variant="outline"
              fullWidth
              size="lg"
              icon={<Check className="w-5 h-5" />}
              iconPosition="left"
            >
              EXPLORE CREATOR PORTFOLIOS
            </Button3DPhysical>
          </div>
        </section>
      </div>
      
      {/* Technical Details */}
      <div className="mt-16 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Physical Dimension Techniques</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">True Physical Edge</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Unlike flat designs that simulate depth with simple shadows, these buttons have an actual visible "side" 
              element positioned below the button face that creates genuine physical dimension.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Exponential Shadow Falloff</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Using a precisely engineered combination of five shadow layers with incrementally 
              increasing blur values creates the natural falloff seen in real-world objects.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Interactive Physics</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              When pressed, the button physically moves down with a subtle horizontal squeeze (just like real materials),
              the edge element disappears with precise timing, and the shadow changes to a tight, close shadow.
              The 0.08s transition with custom easing creates that perfect tactile feel.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Consistent Light Source</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              All lighting effects (edge highlights, surface gradients, and shadows) are 
              positioned consistently from the top-left, creating a cohesive dimensional model.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">Implementation Details</h4>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>Uses React state to track pressed/unpressed for precise interaction physics with horizontal squeeze effect</li>
            <li>Creates the physical edge using an absolutely positioned element that disappears when clicked</li>
            <li>Combines dual gradients with subtle 1-2% noise texture overlay for enhanced material quality</li>
            <li>Fine-tuned transition timing (0.08s) with custom cubic-bezier easing for perfect tactile feel</li>
            <li>Uses the exact shadow formula: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">0 1px 1px rgba(0,0,0,0.12), 0 2px 2px rgba(0,0,0,0.12), 0 4px 4px rgba(0,0,0,0.12), 0 8px 8px rgba(0,0,0,0.12), 0 16px 16px rgba(0,0,0,0.12)</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}