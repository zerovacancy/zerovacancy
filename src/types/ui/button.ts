
/**
 * Button UI component types
 */

export interface ButtonProps {
  variant?: string;
  size?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
