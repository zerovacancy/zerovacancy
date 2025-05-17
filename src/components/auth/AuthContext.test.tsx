import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@/tests/utils';
import { AuthProvider, useAuth } from './AuthContext';
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/mocks/server';

// Test component that uses useAuth
const AuthTestComponent = () => {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="auth-state">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  it('provides initial authentication state', async () => {
    render(<AuthTestComponent />);
    
    // Initially should be in loading state
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading');
    
    // After loading completes
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
    });
    
    // Should start unauthenticated
    expect(screen.getByTestId('auth-state')).toHaveTextContent('Not authenticated');
  });
  
  it('handles successful sign in', async () => {
    render(<AuthTestComponent />);
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
    });
    
    // Click sign in button
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await act(async () => {
      signInButton.click();
    });
    
    // After sign in, should be authenticated
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });
  
  it('handles sign out', async () => {
    // Mock successful authentication
    server.use(
      http.get('https://test.supabase.co/auth/v1/user', () => {
        return HttpResponse.json({
          user: {
            id: '123',
            email: 'test@example.com'
          }
        });
      })
    );
    
    render(<AuthTestComponent />);
    
    // Wait for loaded and authenticated state
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated');
    });
    
    // Click sign out button
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await act(async () => {
      signOutButton.click();
    });
    
    // After sign out, should be unauthenticated
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Not authenticated');
    });
  });
});