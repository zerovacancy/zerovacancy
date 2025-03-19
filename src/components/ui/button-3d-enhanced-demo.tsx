import React from "react";
import { Button3DEnhanced } from "./button-3d-enhanced";
import { ArrowRight, Star, Check, Settings, CheckCircle2, PlusCircle, Globe, Zap } from "lucide-react";

export function Button3DEnhancedDemo() {
  return (
    <div className="w-full p-8 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 text-center">Modern 3D Button Collection</h2>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Enhanced with sophisticated 3D effects, layered shadows, and proper depth simulation
      </p>
      
      <div className="space-y-12">
        {/* Primary Buttons Showcase */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Primary Buttons</h3>
          
          {/* Main demo row with sizes */}
          <div className="flex flex-wrap gap-8 justify-center">
            <Button3DEnhanced
              variant="primary"
              size="sm"
              icon={<PlusCircle className="w-4 h-4" />}
              iconPosition="left"
            >
              Small Button
            </Button3DEnhanced>
            
            <Button3DEnhanced
              variant="primary"
              icon={<Zap className="w-5 h-5" />}
              iconPosition="left"
            >
              Medium Button
            </Button3DEnhanced>
            
            <Button3DEnhanced
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Large Button
            </Button3DEnhanced>
          </div>
          
          {/* Interactive state demo */}
          <div className="p-6 bg-gradient-to-br from-purple-50/80 to-gray-50/80 rounded-xl">
            <p className="text-sm text-gray-600 mb-5 text-center">Hover over buttons to see enhanced interactive states</p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button3DEnhanced
                variant="primary"
                size="lg"
                className="min-w-36"
              >
                Call to Action
              </Button3DEnhanced>
              
              <Button3DEnhanced
                variant="primary"
                size="lg"
                icon={<Globe className="w-5 h-5" />} 
                iconPosition="left"
                className="min-w-36"
              >
                Explore
              </Button3DEnhanced>
            </div>
          </div>
        </section>
        
        {/* Secondary Buttons */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Secondary Buttons</h3>
          <div className="flex flex-wrap gap-8 justify-center">
            <Button3DEnhanced
              variant="secondary"
              size="sm"
            >
              Small Button
            </Button3DEnhanced>
            
            <Button3DEnhanced
              variant="secondary"
              icon={<Star className="w-4 h-4" />} 
              iconPosition="left"
            >
              With Icon
            </Button3DEnhanced>
            
            <Button3DEnhanced
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Large Button
            </Button3DEnhanced>
          </div>
        </section>
        
        {/* Outline Buttons */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Outline Buttons</h3>
          <div className="flex flex-wrap gap-8 justify-center">
            <Button3DEnhanced
              variant="outline"
              size="sm"
            >
              Small Button
            </Button3DEnhanced>
            
            <Button3DEnhanced
              variant="outline"
              icon={<CheckCircle2 className="w-4 h-4" />} 
              iconPosition="left"
            >
              With Icon
            </Button3DEnhanced>
            
            <Button3DEnhanced
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Large Button
            </Button3DEnhanced>
          </div>
        </section>
        
        {/* White Buttons */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">White Buttons</h3>
          
          <div className="p-6 bg-gradient-to-r from-slate-800 to-purple-900 rounded-xl">
            <div className="flex flex-wrap gap-8 justify-center">
              <Button3DEnhanced
                variant="white"
                size="sm"
              >
                Small Button
              </Button3DEnhanced>
              
              <Button3DEnhanced
                variant="white"
                icon={<Settings className="w-4 h-4" />} 
                iconPosition="left"
              >
                With Icon
              </Button3DEnhanced>
              
              <Button3DEnhanced
                variant="white"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Large Button
              </Button3DEnhanced>
            </div>
          </div>
        </section>
        
        {/* Full Width Buttons */}
        <section className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Full Width Buttons</h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            <Button3DEnhanced 
              variant="primary" 
              fullWidth
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Join the Waitlist
            </Button3DEnhanced>
            
            <Button3DEnhanced 
              variant="outline" 
              fullWidth
              size="lg"
              icon={<Check className="w-5 h-5" />}
              iconPosition="left"
            >
              Explore Creator Portfolios
            </Button3DEnhanced>
          </div>
        </section>
      </div>
      
      {/* Technical Details */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Enhanced 3D Button Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Shadow Layering</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Multiple shadow layers with different blur values create a natural depth falloff, similar to how real objects cast shadows under light.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Inner Highlighting</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Subtle top border highlights simulate light hitting the top edge, enhancing the sense of elevation and dimensionality.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Surface Enhancement</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Carefully crafted gradients across button surfaces create the illusion of curved surfaces responding to ambient light.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Interactive Physics</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Hover and click states simulate realistic physical interactions - buttons appear to float higher on hover and press down when clicked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}