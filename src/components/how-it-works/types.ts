
import { LucideIcon } from 'lucide-react';
import { ReactElement } from 'react';

export interface Step {
  title: string;
  description: string;
  icon: ReactElement<LucideIcon>;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: string;
  tips?: string;
}
