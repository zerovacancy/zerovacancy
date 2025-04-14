
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getSectionGradient, getBackgroundPattern } from "@/utils/performance-optimizations";
import { useIsMobile } from "@/hooks/use-mobile";

export const BackgroundEffects = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {/* Base gradient background optimized for desktop */}
      {!isMobile && (
        <>
          {/* Base gradient background */}
          <div className={cn("absolute inset-0", getSectionGradient(4))}></div>
          
          {/* Pattern overlay */}
          <div className={cn(
            "absolute inset-0",
            getBackgroundPattern('diagonal', 0.05)
          )}></div>
          
          {/* Single optimized blob with lighter blur for better performance */}
          <div 
            className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-100/30 rounded-full opacity-30"
            style={{
              filter: 'blur(80px)',
              transform: 'translateZ(0)'
            }}
          ></div>
        </>
      )}
      
      {/* Mobile-specific background with distinct color scheme */}
      {isMobile && (
        <>
          {/* Full-width background with distinct color */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-blue-50/50" />
          
          {/* Top edge visual divider */}
          <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-indigo-200 via-blue-300 to-indigo-200 opacity-60" />
          
          {/* Subtle pattern overlay specific to pricing */}
          <div className="absolute inset-0 opacity-10" 
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'64\' height=\'64\' viewBox=\'0 0 64 64\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M8 16L56 16\' stroke=\'%23334155\' stroke-opacity=\'0.3\' stroke-width=\'0.8\'/%3E%3Cpath d=\'M8 32L56 32\' stroke=\'%23334155\' stroke-opacity=\'0.3\' stroke-width=\'0.8\'/%3E%3Cpath d=\'M8 48L56 48\' stroke=\'%23334155\' stroke-opacity=\'0.3\' stroke-width=\'0.8\'/%3E%3Cpath d=\'M16 8L16 56\' stroke=\'%23334155\' stroke-opacity=\'0.3\' stroke-width=\'0.8\'/%3E%3Cpath d=\'M32 8L32 56\' stroke=\'%23334155\' stroke-opacity=\'0.3\' stroke-width=\'0.8\'/%3E%3Cpath d=\'M48 8L48 56\' stroke=\'%23334155\' stroke-opacity=\'0.3\' stroke-width=\'0.8\'/%3E%3C/svg%3E")',
                 backgroundSize: '32px 32px'
               }}
          />
          
          {/* Distinctive pricing section blobs with cooler, more blue-based colors */}
          <motion.div 
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-100/80 to-indigo-100/70 rounded-full blur-3xl" 
          />
          
          <motion.div 
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            className="absolute top-1/2 -left-24 w-80 h-80 bg-gradient-to-tr from-slate-100/70 to-blue-100/60 rounded-full blur-3xl" 
          />
          
          <motion.div 
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 2 }}
            className="absolute -bottom-24 right-1/4 w-64 h-64 bg-gradient-to-tl from-indigo-100/60 to-blue-100/50 rounded-full blur-3xl" 
          />
        </>
      )}
    </div>
  );
};
