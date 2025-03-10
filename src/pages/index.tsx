
import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { Features } from '@/components/Features';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { PreviewSearch } from '@/components/PreviewSearch';
import { Testimonials } from '@/components/Testimonials';
import { FeaturedCreators } from '@/components/FeaturedCreators';
import { CallToActionSection } from '@/components/CallToActionSection';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Features />
        <HowItWorksSection />
        <PreviewSearch />
        <Testimonials />
        <FeaturedCreators />
        <CallToActionSection />
        
        {/* Add a link to the Resend test page for easy access */}
        <div className="max-w-7xl mx-auto my-8 px-4 text-center">
          <Link to="/resend-test">
            <Button variant="outline">Test Resend Integration</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
