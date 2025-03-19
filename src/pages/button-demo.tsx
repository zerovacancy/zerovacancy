import React from 'react';
import { Button } from '@/components/ui/button';
import { Button3DBorder } from '@/components/ui/button-3d-border';
import { Button3DEnhanced } from '@/components/ui/button-3d-enhanced';
import { Button3DPhysical } from '@/components/ui/button-3d-physical';
import { ArrowRight, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const ButtonDemo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Button Styles Demo | ZeroVacancy" 
        description="Comparing different 3D button styles for ZeroVacancy"
      />
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-4">3D Button Styles</h1>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Compare different 3D button styles to find the perfect fit for your UI
          </p>
          
          {/* Main Buttons Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12">
            <h2 className="text-xl font-semibold mb-6">Primary Buttons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
              {/* Original Button */}
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 flex items-center justify-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Original</h3>
                </div>
                <div className="flex justify-center">
                  <Button 
                    className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    JOIN WAITLIST
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Flat design with simple hover effect
                </div>
              </div>
              
              {/* 3D Border Button */}
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 flex items-center justify-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">3D Border</h3>
                </div>
                <div className="flex justify-center">
                  <Button3DBorder 
                    variant="primary"
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    JOIN WAITLIST
                  </Button3DBorder>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Basic 3D effect with visible borders
                </div>
              </div>
              
              {/* Enhanced 3D Button */}
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 flex items-center justify-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Enhanced 3D</h3>
                </div>
                <div className="flex justify-center">
                  <Button3DEnhanced 
                    variant="primary"
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    JOIN WAITLIST
                  </Button3DEnhanced>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Improved shadows and surface effects
                </div>
              </div>
              
              {/* Physical 3D Button */}
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 flex items-center justify-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Physical 3D</h3>
                </div>
                <div className="flex justify-center">
                  <Button3DPhysical 
                    variant="primary"
                    icon={<ArrowRight className="h-4 w-4" />}
                  >
                    JOIN WAITLIST
                  </Button3DPhysical>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  True physical dimension with edge
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-6 mt-12">Secondary/Outline Buttons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-6">
              {/* Original Button */}
              <div className="flex flex-col items-center space-y-4">
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
              <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center">
                  <Button3DBorder 
                    variant="outline"
                  >
                    EXPLORE PORTFOLIOS
                  </Button3DBorder>
                </div>
              </div>
              
              {/* Enhanced 3D Button */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center">
                  <Button3DEnhanced 
                    variant="outline"
                  >
                    EXPLORE PORTFOLIOS
                  </Button3DEnhanced>
                </div>
              </div>
              
              {/* Physical 3D Button */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center">
                  <Button3DPhysical 
                    variant="outline"
                    icon={<Check className="h-4 w-4 mr-1" />}
                    iconPosition="left"
                  >
                    EXPLORE PORTFOLIOS
                  </Button3DPhysical>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interaction Demo */}
          <div className="bg-gray-50 rounded-xl p-8 mt-8 max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold mb-3 text-center">Try the Interactive Physics</h2>
            <p className="text-sm text-gray-600 mb-8 text-center">
              Click each button to feel the difference in the physical interaction models
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button3DPhysical
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                JOIN WAITLIST
              </Button3DPhysical>
              
              <Button3DPhysical
                variant="outline"
                size="lg"
              >
                EXPLORE PORTFOLIOS
              </Button3DPhysical>
              
              <Button3DPhysical
                variant="secondary"
                size="lg"
                icon={<Check className="w-5 h-5" />}
                iconPosition="left"
              >
                SELECTED OPTION
              </Button3DPhysical>
            </div>
            
            <div className="mt-8 text-xs text-gray-500 text-center">
              The Physical 3D buttons include subtle texture, exponential shadow falloff, and realistic press physics
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ButtonDemo;