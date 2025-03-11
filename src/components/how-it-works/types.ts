
import { ReactNode, CSSProperties } from 'react';

export interface Step {
  icon: ReactNode;
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
}
