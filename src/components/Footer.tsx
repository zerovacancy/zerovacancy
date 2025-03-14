
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TermsModal from './TermsModal';
import { Mail, Clock, MapPin, ExternalLink, Search, Users, HelpCircle, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { GlowDialog } from '@/components/ui/glow-dialog';

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showGlowDialog, setShowGlowDialog] = useState(false);
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-12 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "grid gap-8 sm:gap-12", 
          isMobile ? "grid-cols-1 sm:grid-cols-2" : "md:grid-cols-4"
        )}>
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-brand-purple-dark to-brand-purple-medium bg-clip-text text-transparent font-jakarta">
              ZeroVacancy
            </h3>
            <p className="text-brand-text-primary text-sm leading-relaxed font-inter">
              ZeroVacancy: Connecting property professionals with vetted visual content creators
            </p>
            
            {/* Social media icons */}
            <div className="flex space-x-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors hover:bg-gray-200 cursor-pointer relative group" onClick={() => setShowGlowDialog(true)}>
                <Users size={16} className="text-brand-purple-medium" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  Coming Soon
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors hover:bg-gray-200 cursor-pointer relative group" onClick={() => setShowGlowDialog(true)}>
                <Search size={16} className="text-brand-purple-medium" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Property Managers */}
          <div>
            <h4 className="font-semibold mb-4 text-brand-purple-medium flex items-center text-base font-jakarta">
              <Search size={18} className="mr-2 text-brand-purple" />
              Property Managers
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/#find-creators" className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center group font-inter">
                  <span className="h-0.5 w-0 bg-brand-purple-medium transition-all duration-300 mr-0 group-hover:w-2 group-hover:mr-2"></span>
                  Find Creators
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center group font-inter">
                  <span className="h-0.5 w-0 bg-brand-purple-medium transition-all duration-300 mr-0 group-hover:w-2 group-hover:mr-2"></span>
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#pricing" className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center group font-inter">
                  <span className="h-0.5 w-0 bg-brand-purple-medium transition-all duration-300 mr-0 group-hover:w-2 group-hover:mr-2"></span>
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowGlowDialog(true);
                }} className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center group font-inter">
                  <span className="h-0.5 w-0 bg-brand-purple-medium transition-all duration-300 mr-0 group-hover:w-2 group-hover:mr-2"></span>
                  Success Stories
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Creators */}
          <div>
            <h4 className="font-semibold mb-4 text-brand-purple-medium flex items-center text-base font-jakarta">
              <Users size={18} className="mr-2 text-brand-purple" />
              Creators
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowGlowDialog(true);
                }} className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center group font-inter">
                  <span className="h-0.5 w-0 bg-brand-purple-medium transition-all duration-300 mr-0 group-hover:w-2 group-hover:mr-2"></span>
                  Apply to Join
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowGlowDialog(true);
                }} className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center group font-inter">
                  <span className="h-0.5 w-0 bg-brand-purple-medium transition-all duration-300 mr-0 group-hover:w-2 group-hover:mr-2"></span>
                  Creator Guidelines
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowGlowDialog(true);
                }} className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center group font-inter">
                  <span className="h-0.5 w-0 bg-brand-purple-medium transition-all duration-300 mr-0 group-hover:w-2 group-hover:mr-2"></span>
                  Commission Structure
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowGlowDialog(true);
                }} className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center group font-inter">
                  <span className="h-0.5 w-0 bg-brand-purple-medium transition-all duration-300 mr-0 group-hover:w-2 group-hover:mr-2"></span>
                  Resources
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="font-semibold mb-4 text-brand-purple-medium flex items-center text-base font-jakarta">
              <HelpCircle size={18} className="mr-2 text-brand-purple" />
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:help@zerovacancy.ai" 
                  className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center font-inter"
                >
                  <Mail className="w-4 h-4 mr-2 text-brand-purple-medium/70" />
                  help@zerovacancy.ai
                </a>
              </li>
              <li className="text-brand-text-light text-sm flex items-center pl-6 font-inter">
                <Clock className="w-4 h-4 mr-2 text-brand-purple-medium/70" />
                <span className="bg-gray-50 px-2 py-0.5 rounded text-brand-text-primary">Mon-Fri, 9am-5pm EST</span>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowGlowDialog(true);
                  }}
                  className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center mt-2 font-inter"
                >
                  <MapPin className="w-4 h-4 mr-2 text-brand-purple-medium/70" />
                  Contact Us
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowGlowDialog(true);
                  }}
                  className="text-brand-text-secondary hover:text-brand-purple-medium text-sm transition-colors flex items-center mt-2 font-inter"
                >
                  <HelpCircle className="w-4 h-4 mr-2 text-brand-purple-medium/70" />
                  FAQ
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-gray-100 text-gray-500 rounded">Soon</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row with copyright and legal links */}
        <div className="pt-8 mt-8 border-t border-border/40">
          <div className={cn(
            "flex justify-between items-center gap-4",
            isMobile ? "flex-col" : "sm:flex-row"
          )}>
            <p className="text-brand-text-light text-sm font-inter">
              © {currentYear} ZeroVacancy. All rights reserved.
            </p>
            <div className={cn(
              "flex items-center",
              isMobile ? "flex-col space-y-3 mt-3" : "gap-6"
            )}>
              <button
                onClick={() => setShowTerms(true)}
                className="text-brand-text-light hover:text-brand-purple-medium text-sm transition-colors flex items-center font-inter"
              >
                <span>Terms & Conditions</span>
                <ExternalLink className="ml-1 w-3 h-3 text-gray-400" />
              </button>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTerms(true);
                }}
                className="text-brand-text-light hover:text-brand-purple-medium text-sm transition-colors font-inter"
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowTerms(true);
                }}
                className="text-brand-text-light hover:text-brand-purple-medium text-sm transition-colors font-inter"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 w-10 h-10 rounded-full bg-white shadow-md",
          "flex items-center justify-center hover:bg-gray-50 transition-colors",
          "border border-gray-200",
          "touch-manipulation", // Better mobile handling
          "z-20" // Ensure it's above all content
        )}
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5 text-brand-purple-medium" />
      </button>

      <TermsModal
        open={showTerms}
        onOpenChange={setShowTerms}
      />
      
      <GlowDialog 
        open={showGlowDialog} 
        onOpenChange={setShowGlowDialog} 
      />
    </footer>
  );
};

export default Footer;
