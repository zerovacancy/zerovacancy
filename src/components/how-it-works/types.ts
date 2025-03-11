
import { ReactNode, CSSProperties } from 'react';
import { LucideIcon } from 'lucide-react';

export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  number: string;
  iconClass: string;
  numberClass: string;
  borderClass: string;
  gradientClass?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: string;
  gradientStyle?: CSSProperties;
  tips?: string;
}
