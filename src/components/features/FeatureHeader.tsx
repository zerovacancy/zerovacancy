
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureHeaderProps {
  title: string;
  description: string;
}

export const FeatureHeader = ({
  title,
  description
}: FeatureHeaderProps) => {
  return (
    <div className="text-center mb-12 sm:mb-14 lg:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="inline-block mb-3"
      >
        <div className="flex items-center justify-center gap-1 mb-2">
          <Star className="h-4 w-4 text-indigo-400 fill-indigo-100" />
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-500 font-space">Featured Services</span>
          <Star className="h-4 w-4 text-indigo-400 fill-indigo-100" />
        </div>
        <div className="h-1.5 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 animate-pulse-subtle" />
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="heading-2 text-gray-900 mb-4 sm:mb-5"
      >
        {title}
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="paragraph-base max-w-2xl mx-auto leading-relaxed"
      >
        {description}
      </motion.p>
    </div>
  );
};

export default FeatureHeader;
