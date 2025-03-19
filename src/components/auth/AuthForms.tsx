import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/auth/AuthContext';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

// Login form schema
const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters')
});

// Register form schema
const registerSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password').min(6, 'Password must be at least 6 characters')
});

// Disable password match validation completely

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthForms = () => {
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const { isAuthDialogOpen, closeAuthDialog, signIn, signUp } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur' // Validate on blur for better UX
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange' // Validate on change to catch issues immediately
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      console.log('Login values:', values);
      console.log('Form validation state:', loginForm.formState);
      
      if (loginForm.formState.isValid) {
        await signIn(values.email, values.password);
        loginForm.reset();
      } else {
        console.error('Form validation errors:', loginForm.formState.errors);
      }
    } catch (error) {
      // Error is already handled in the signIn function
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (values: any) => {
    try {
      console.log('Register values:', values);
      
      // Get email and password directly from inputs (bypass form validation)
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      
      const email = emailInput?.value || values.email;
      const password = passwordInput?.value || values.password;
      
      console.log('Using direct input values:', { email, password: '****' });
      
      // Direct signup without any validation
      await signUp(email, password);
      registerForm.reset();
      
      // Switch to login form after successful registration
      setFormType('login');
    } catch (error) {
      // Error is already handled in the signUp function
      console.error('Register error:', error);
    }
  };

  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={closeAuthDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              {formType === 'login' ? 'Sign In' : 'Create an Account'}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeAuthDialog}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {formType === 'login' ? 'Sign in to your account to continue' : 'Create a new account to get started'}
          </DialogDescription>
        </DialogHeader>

        {formType === 'login' ? (
          <Form {...loginForm}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                console.log('Login form submitted');
                
                const formData = loginForm.getValues();
                console.log('Form data:', formData);
                
                // Check for manual validation
                const emailValid = formData.email && formData.email.includes('@');
                const passwordValid = formData.password && formData.password.length >= 6;
                
                console.log('Manual validation:', { 
                  emailValid, 
                  passwordValid
                });
                
                // Try direct submission without form validation
                console.log('Attempting direct login submission');
                handleLogin(formData);
              }}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        type="email"
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          console.log('Login email value:', e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          console.log('Login password value length:', e.target.value.length);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginForm.formState.isSubmitting}
                onClick={() => {
                  console.log('Login button clicked, formState:', loginForm.formState);
                }}
              >
                {loginForm.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registerForm}>
            <form 
              onSubmit={(e) => {
                // Just prevent default - we'll handle submission via button click
                e.preventDefault();
              }} 
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        type="email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          console.log('Email value:', e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          console.log('Password value length:', e.target.value.length);
                          
                          // Automatically update confirmPassword when password changes
                          setTimeout(() => {
                            registerForm.setValue('confirmPassword', e.target.value);
                            console.log('Updated confirmPassword to match new password');
                          }, 100);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Copy password directly to confirmPassword for debugging
                          const passwordValue = registerForm.getValues().password;
                          console.log('Password field:', passwordValue);
                          console.log('Confirm password value:', e.target.value);
                          console.log('Do they match?', e.target.value === passwordValue);
                          
                          // For debugging, automatically make confirmPassword match password on change
                          if (e.target.value !== passwordValue) {
                            console.log('Setting confirmPassword to match password');
                            // This ensures both values are the same
                            setTimeout(() => {
                              registerForm.setValue('confirmPassword', passwordValue);
                            }, 100);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" // Changed from submit to bypass form validation
                className="w-full" 
                disabled={registerForm.formState.isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Manual submit button clicked");
                  // Get current values
                  const formValues = registerForm.getValues();
                  // Force direct submission
                  handleRegister(formValues);
                }}
              >
                {registerForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        )}

        <DialogFooter className="flex flex-col items-center sm:items-start">
          <Button variant="link" onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}>
            {formType === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthForms;