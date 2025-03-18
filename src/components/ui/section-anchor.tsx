
import React from 'react';
import { Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionAnchorProps {
  id: string;
  className?: string;
}

export const SectionAnchor: React.FC<SectionAnchorProps> = ({ id, className }) => {
  return (
    <a 
      href={`#${id}`}
      className={cn(
        "absolute opacity-0 group-hover:opacity-70 hover:opacity-100",
        "-left-5 top-1/2 -translate-y-1/2 md:top-[0.65rem] md:translate-y-0",
        "transition-opacity duration-200",
        className
      )}
      aria-label={`Link to ${id} section`}
    >
      <Link className="h-4 w-4 text-purple-500" />
    </a>
  );
};
