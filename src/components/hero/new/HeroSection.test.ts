import { expect, test, describe, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { HeroSection } from './HeroSection';

// Mock hooks 
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn()
}));

describe('HeroSection Component', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  test('renders correctly on desktop', () => {
    // Mock desktop view
    const { useIsMobile } = require('@/hooks/use-mobile');
    useIsMobile.mockReturnValue(false);
    
    render(<HeroSection />);
    
    // Check for core elements
    expect(screen.getByText('PROPERTY CONTENT THAT')).toBeInTheDocument();
    
    // Should show desktop text
    expect(screen.getByText(/Connect with elite content creators/)).toBeInTheDocument();
    
    // Should have two buttons on desktop
    expect(screen.getByText('RESERVE YOUR SPOT')).toBeInTheDocument();
    expect(screen.getByText('JOIN AS CREATOR')).toBeInTheDocument();
    
    // Social proof should be present
    expect(screen.getByText('members joined')).toBeInTheDocument();
  });

  test('renders correctly on mobile', () => {
    // Mock mobile view
    const { useIsMobile } = require('@/hooks/use-mobile');
    useIsMobile.mockReturnValue(true);
    
    render(<HeroSection />);
    
    // Check for core elements
    expect(screen.getByText('PROPERTY CONTENT THAT')).toBeInTheDocument();
    
    // Should show mobile text
    expect(screen.getByText(/Connect with top creators/)).toBeInTheDocument();
    
    // Only one button on mobile
    expect(screen.getByText('RESERVE EARLY ACCESS')).toBeInTheDocument();
    expect(screen.queryByText('JOIN AS CREATOR')).not.toBeInTheDocument();
    
    // Should have scroll indicator
    expect(screen.getByText('Scroll to explore')).toBeInTheDocument();
  });

  test('handles accessibility requirements', () => {
    const { useIsMobile } = require('@/hooks/use-mobile');
    useIsMobile.mockReturnValue(false);
    
    const { container } = render(<HeroSection />);
    
    // Check for proper landmark
    const section = container.querySelector('section[id="hero"]');
    expect(section).toBeInTheDocument();
    
    // Check for aria-labelledby
    expect(section).toHaveAttribute('aria-labelledby', 'hero-title');
    
    // Heading should be properly structured
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveAttribute('id', 'hero-title');
  });

  test('component has smooth fading animation', () => {
    const { useIsMobile } = require('@/hooks/use-mobile');
    useIsMobile.mockReturnValue(false);
    
    const { container } = render(<HeroSection />);
    
    // Check for animation classes
    const animatedElements = container.querySelectorAll('.animate-fade-in');
    expect(animatedElements.length).toBeGreaterThan(0);
  });
});