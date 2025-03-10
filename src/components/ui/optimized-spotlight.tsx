
'use client';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

type OptimizedSpotlightProps = {
  className?: string;
  size?: number;
};

export function OptimizedSpotlight({
  className,
  size = 200,
}: OptimizedSpotlightProps) {
  // We're rendering an empty component since we're removing the spotlight animation
  return null;
}

export default OptimizedSpotlight;
