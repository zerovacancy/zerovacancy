import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Form schemas
const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthForms = () => {
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { 
    isAuthDialogOpen, 
    closeAuthDialog, 
    signIn, 
    signUp, 
    signInWithGoogle,
    authDialogFormType
  } = useAuth();
  
  // Update the form type when the dialog opens with a specific form type
  useEffect(() => {
    if (isAuthDialogOpen) {
      setFormType(authDialogFormType);
    }
  }, [isAuthDialogOpen, authDialogFormType]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur'
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    },
    mode: 'onChange'
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      console.log("Login attempt initiated in AuthForms component");
      await signIn(values.email, values.password);
      console.log("Login completed successfully");
      loginForm.reset();
    } catch (error) {
      console.error("Login error caught in AuthForms:", error);
      // Error is already handled in signIn function
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      console.log("Registration attempt initiated in AuthForms component");
      await signUp(values.email, values.password);
      console.log("Registration completed successfully");
      registerForm.reset();
      
      // Switch to login form after successful registration
      setFormType('login');
    } catch (error) {
      console.error("Registration error caught in AuthForms:", error);
      // Error is already handled in signUp function
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("Google sign-in attempt initiated");
      await signInWithGoogle();
      console.log("Google sign-in process started");
    } catch (error) {
      console.error("Google sign-in error caught in AuthForms:", error);
      // Error is already handled in signInWithGoogle function
    }
  };

  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={closeAuthDialog}>
      <AnimatePresence mode="wait">
        {isAuthDialogOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-xl">
              <div className="flex items-center justify-between p-6 border-b">
                <DialogTitle className="text-xl font-jakarta">
                  {formType === 'login' ? 'Sign In' : 'Create an Account'}
                </DialogTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeAuthDialog}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6 pt-4">
                <DialogDescription className="text-sm text-gray-500 mb-6">
                  {formType === 'login' 
                    ? 'Welcome back! Sign in to access your account.' 
                    : 'Create a new account to get started with ZeroVacancy.'}
                </DialogDescription>
              
                <AnimatePresence mode="wait">
                  {formType === 'login' ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Form {...loginForm}>
                        <form 
                          onSubmit={loginForm.handleSubmit(handleLogin)}
                          className="space-y-4"
                        >
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      placeholder="you@example.com" 
                                      type="email"
                                      className="h-10 pl-10 border-gray-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                                      {...field} 
                                    />
                                    <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="mb-6">
                                <div className="flex items-center justify-between">
                                  <FormLabel className="text-sm font-medium text-gray-700">
                                    Password
                                  </FormLabel>
                                  <Button 
                                    variant="link" 
                                    className="text-xs font-medium text-brand-purple p-0 h-auto"
                                    type="button"
                                    onClick={() => {
                                      // Password reset logic
                                      alert("Password reset functionality will be implemented in a future update.");
                                    }}
                                  >
                                    Forgot password?
                                  </Button>
                                </div>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••" 
                                      className="h-10 pl-10 pr-10 border-gray-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                                      {...field}
                                    />
                                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <button
                                      type="button"
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full h-11 bg-brand-purple hover:bg-brand-purple-dark text-white font-medium rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-md"
                            disabled={loginForm.formState.isSubmitting}
                          >
                            {loginForm.formState.isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Signing In...
                              </div>
                            ) : (
                              "Sign In"
                            )}
                          </Button>
                          
                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-white px-2 text-gray-500">or continue with</span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <Button 
                              variant="outline" 
                              type="button" 
                              className="w-full h-11 flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                              onClick={handleGoogleSignIn}
                            >
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#4285F4"/>
                                <path d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z" fill="#34A853"/>
                                <path d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" fill="#FBBC05"/>
                                <path d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335"/>
                              </svg>
                              Continue with Google
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Form {...registerForm}>
                        <form 
                          onSubmit={registerForm.handleSubmit(handleRegister)}
                          className="space-y-4"
                        >
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      placeholder="you@example.com" 
                                      type="email"
                                      className="h-10 pl-10 border-gray-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                                      {...field}
                                    />
                                    <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••" 
                                      className="h-10 pl-10 pr-10 border-gray-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                                      {...field}
                                    />
                                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <button
                                      type="button"
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel className="text-sm font-medium text-gray-700">
                                  Confirm Password
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type={showConfirmPassword ? "text" : "password"}
                                      placeholder="••••••••" 
                                      className="h-10 pl-10 pr-10 border-gray-300 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                                      {...field}
                                    />
                                    <Lock className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                    <button
                                      type="button"
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                      {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="acceptTerms"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <div className="flex items-center space-x-2">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                                    />
                                  </FormControl>
                                  <FormLabel className="text-xs text-gray-600">
                                    I agree to the <a href="/terms" className="text-brand-purple hover:underline">Terms of Service</a> and <a href="/privacy" className="text-brand-purple hover:underline">Privacy Policy</a>
                                  </FormLabel>
                                </div>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full h-11 bg-brand-purple hover:bg-brand-purple-dark text-white font-medium rounded-lg transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-md"
                            disabled={registerForm.formState.isSubmitting}
                          >
                            {registerForm.formState.isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Creating Account...
                              </div>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                          
                          <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-white px-2 text-gray-500">or continue with</span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <Button 
                              variant="outline" 
                              type="button" 
                              className="w-full h-11 flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                              onClick={handleGoogleSignIn}
                            >
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" fill="#4285F4"/>
                                <path d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z" fill="#34A853"/>
                                <path d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" fill="#FBBC05"/>
                                <path d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335"/>
                              </svg>
                              Continue with Google
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <DialogFooter className="flex flex-col items-center p-6 pt-4 border-t bg-gray-50">
                <div className="text-sm text-center">
                  {formType === 'login' 
                    ? (
                      <div>
                        New to ZeroVacancy?{' '}
                        <Button 
                          variant="link" 
                          onClick={() => setFormType('register')}
                          className="p-0 h-auto font-medium text-brand-purple"
                        >
                          Create an account
                        </Button>
                      </div>
                    ) : (
                      <div>
                        Already have an account?{' '}
                        <Button 
                          variant="link" 
                          onClick={() => setFormType('login')}
                          className="p-0 h-auto font-medium text-brand-purple"
                        >
                          Sign in
                        </Button>
                      </div>
                    )
                  }
                </div>
              </DialogFooter>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default AuthForms;