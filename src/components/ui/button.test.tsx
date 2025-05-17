import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/utils';
import { Button } from './button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies default className', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-primary-foreground');
  });

  it('applies variant className', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });

  it('applies size className', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
    expect(button).toHaveClass('px-8');
  });

  it('allows passing custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders as a child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="#">Link Button</a>
      </Button>
    );
    
    expect(screen.getByRole('link', { name: /link button/i })).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('passes props to button element', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled data-testid="test-button">
        Click me
      </Button>
    );
    
    const button = screen.getByTestId('test-button');
    expect(button).toBeDisabled();
    
    expect(onClick).not.toHaveBeenCalled();
  });
});