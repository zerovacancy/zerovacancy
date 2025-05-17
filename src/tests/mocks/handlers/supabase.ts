import { http, HttpResponse } from 'msw';

// Mock user data
const mockUsers = [
  { 
    id: '123e4567-e89b-12d3-a456-426614174000', 
    email: 'test@example.com',
    created_at: '2025-01-01T00:00:00.000Z',
    last_sign_in_at: '2025-04-01T00:00:00.000Z',
    user_metadata: { 
      full_name: 'Test User',
    }
  }
];

// Supabase API Handlers
export const supabaseHandlers = [
  // Auth - Sign in
  http.post('https://test.supabase.co/auth/v1/token', async ({ request }) => {
    const body = await request.json();
    
    if (body.grant_type === 'password') {
      const { email, password } = body;
      
      // Basic validation
      if (email === 'test@example.com' && password === 'password') {
        return HttpResponse.json({
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          user: mockUsers[0]
        });
      }
      
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Invalid login credentials'
      });
    }
    
    return new HttpResponse(null, { status: 400 });
  }),
  
  // Auth - Get user
  http.get('https://test.supabase.co/auth/v1/user', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader === 'Bearer mock-access-token') {
      return HttpResponse.json({
        user: mockUsers[0]
      });
    }
    
    return new HttpResponse(null, { status: 401 });
  }),
  
  // Auth - Sign up
  http.post('https://test.supabase.co/auth/v1/signup', async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return new HttpResponse(null, { 
        status: 400,
        statusText: 'Email and password are required' 
      });
    }
    
    // Check if user already exists
    if (email === 'test@example.com') {
      return new HttpResponse(null, { 
        status: 400,
        statusText: 'User already registered' 
      });
    }
    
    // Create new user
    const newUser = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      email,
      created_at: new Date().toISOString(),
      user_metadata: {}
    };
    
    return HttpResponse.json({
      user: newUser,
      access_token: 'mock-access-token-new-user',
      refresh_token: 'mock-refresh-token-new-user',
    });
  }),
  
  // Auth - Sign out
  http.post('https://test.supabase.co/auth/v1/logout', () => {
    return HttpResponse.json({});
  }),
  
  // Handle any unhandled Supabase requests
  http.all('https://test.supabase.co/*', ({ request }) => {
    console.warn(`Unhandled Supabase request: ${request.method} ${request.url}`);
    return new HttpResponse(null, { status: 404 });
  }),
];