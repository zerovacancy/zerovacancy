
import React from 'react';
import { ShimmerButton } from './ui/shimmer-button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <div className="w-full mx-auto max-w-4xl text-center relative z-10 px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20 will-change-transform">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/40 to-white -z-10 opacity-80"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzNFRkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMGgxdjFoLTF2LTF6bS03LTJoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptMi0yaDF2MWgtMXYtMXptMiAxMGgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] -z-10 opacity-40"></div>
      
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <TrendingUp className="w-6 h-6 text-brand-purple mr-2 animate-float-subtle" />
        {isMobile ? (
          // Mobile version: single coherent headline with all text in one line
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-jakarta tracking-tight">
            OUR <span className="bg-gradient-to-r from-brand-purple-dark to-brand-purple bg-clip-text text-transparent font-extrabold">GUARANTEE</span>
          </h2>
        ) : (
          // Desktop version: original inline-flex layout
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-jakarta tracking-tight inline-flex items-center">
            OUR <span className="bg-gradient-to-r from-brand-purple-dark to-brand-purple ml-2 bg-clip-text text-transparent font-extrabold">GUARANTEE</span>
          </h2>
        )}
      </div>
      
      {/* Decorative element under the heading */}
      <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 animate-pulse-subtle" />
      
      <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 font-inter mb-8 sm:mb-9 leading-relaxed">
        Your satisfaction is our priority. If the delivered content doesn't align with what was promised, we'll arrange for revisions at no additional cost. If you're still not satisfied, we'll refund your payment completely.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-5 justify-center items-center mt-2">
        <ShimmerButton 
          className="w-full sm:w-auto min-w-[200px] h-[52px] text-base font-semibold transition-all duration-300 hover:scale-105"
          onClick={() => navigate('/waitlist')}
        >
          <span>JOIN THE WAITLIST</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/90" />
        </ShimmerButton>
        
        <ShimmerButton 
          className="w-full sm:w-auto min-w-[180px] h-[52px] text-base font-semibold bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 transition-all duration-300"
          onClick={() => navigate('/creators')}
        >
          <span>EXPLORE CREATOR PORTFOLIOS</span>
        </ShimmerButton>
      </div>
      
      {/* Added extra bottom padding on mobile */}
      <div className={`${isMobile ? 'h-8' : 'h-0'}`}></div>
    </div>
  );
};

export default CallToActionSection;
