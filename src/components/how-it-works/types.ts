
import { LucideIcon } from 'lucide-react';
import { ReactElement, CSSProperties } from 'react';

export interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: string;
  tips?: string;
  // Add missing properties
  number: string;
  iconClass: string;
  numberClass: string;
  borderClass: string;
  gradientClass?: string;
  gradientStyle?: CSSProperties;
}
