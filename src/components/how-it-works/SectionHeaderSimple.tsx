
import React from 'react';

interface SectionHeaderSimpleProps {
  title: string;
  subtitle: string;
}

const SectionHeaderSimple: React.FC<SectionHeaderSimpleProps> = ({
  title,
  subtitle
}) => {
  return (
    <div className="text-center w-full">
      <h2 id="design-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-6 font-jakarta tracking-tight text-center headingLarge">
        {title}
      </h2>
      
      {/* Decorative element under the heading */}
      <div className="w-20 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 mx-auto mb-3 sm:mb-6 rounded-full"></div>
      
      <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 font-inter leading-relaxed text-center bodyText">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeaderSimple;
