import React from 'react';
import { PreviewCard } from './PreviewCard';
import { PreviewContent } from './PreviewContent';
import { PreviewHeader } from './PreviewHeader';
import { cn } from '@/lib/utils';

interface PreviewSearchProps {
  className?: string;
}

const PreviewSearch: React.FC<PreviewSearchProps> = ({ className }) => {
  return (
    <div className={cn("max-w-6xl mx-auto px-4 sm:px-6 py-8", className)}>
      <PreviewHeader />
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <PreviewCard
          title="Photography"
          tag="Most Popular"
          image="/placeholder.svg"
          rating={4.9}
          reviews={42}
        >
          <PreviewContent
            description="Expert real estate photography services to showcase your property in the best light"
            items={["Professional equipment", "Interior & exterior shots", "Advanced editing"]}
          />
        </PreviewCard>
        
        <PreviewCard
          title="Videography"
          tag="Featured"
          image="/placeholder.svg"
          rating={4.8}
          reviews={36}
        >
          <PreviewContent
            description="Cinematic video tours that tell your property's unique story"
            items={["Aerial drone footage", "Guided walkthroughs", "Professional editing"]}
          />
        </PreviewCard>
        
        <PreviewCard
          title="Virtual Tours"
          tag="New"
          image="/placeholder.svg"
          rating={4.7}
          reviews={28}
        >
          <PreviewContent
            description="Immersive 3D virtual tours that let potential clients explore every corner"
            items={["360° room captures", "Interactive elements", "Matterport integration"]}
          />
        </PreviewCard>
      </div>
    </div>
  );
};

export default PreviewSearch;