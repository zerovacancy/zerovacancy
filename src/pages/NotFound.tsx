
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BackgroundEffects } from '@/components/features/BackgroundEffects';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Page Not Found | ZeroVacancy" 
        description="Sorry, the page you're looking for cannot be found."
        noindex={true}
      />
      <Header />
      
      <main className="flex-1 relative">
        <BackgroundEffects
          blobColors={{
            first: "bg-purple-100",
            second: "bg-indigo-100",
            third: "bg-violet-100"
          }}
          blobOpacity={0.15}
          withSpotlight={true}
          spotlightClassName="from-purple-500/5 via-violet-500/5 to-blue-500/5"
          baseColor="bg-white/80" 
          pattern="none"
          className="py-0"
          animationSpeed="slow"
        >
          <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
            <div className="relative z-10">
              <h1 className="mb-2 text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                404
              </h1>
              
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 mx-auto my-6 rounded-full"></div>
              
              <h2 className="mb-4 text-3xl font-bold text-gray-800">
                Page Not Found
              </h2>
              
              <p className="mb-8 text-gray-600 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved. Don't worry, you can find your way back home!
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-indigo-300 text-indigo-700"
                  asChild
                >
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </BackgroundEffects>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
