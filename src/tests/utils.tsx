import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Mock the Supabase client
import { vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' }, session: { access_token: 'test-token' } },
        error: null
      }),
      signOut: vi.fn().mockResolvedValue({ error: null })
    }
  }
}));

// Create a custom render function that includes all providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

function AllTheProviders({ children, route = '/' }: { children: React.ReactNode, route?: string }) {
  // Set window location for the test
  window.history.pushState({}, 'Test page', route);
  
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { route, ...renderOptions } = options || {};
  
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: (props) => <AllTheProviders {...props} route={route} />,
      ...renderOptions,
    }),
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };