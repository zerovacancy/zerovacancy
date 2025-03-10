
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export default function ResendTest() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const metadata = {
        test: true,
        timestamp: new Date().toISOString(),
      };
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('submit-waitlist-email', {
        body: { 
          email, 
          source: 'resend_test', 
          marketingConsent: true, 
          metadata 
        }
      });
      
      if (error) {
        console.error("Error testing email:", error);
        toast({
          title: "Test failed",
          description: error.message || "Failed to send test email",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Test response:", data);
      
      if (data?.status === 'already_subscribed') {
        toast({
          title: "Already subscribed",
          description: data.message || "This email is already on the waitlist",
        });
      } else if (data?.emailSent) {
        toast({
          title: "Test successful",
          description: `Email sent successfully to ${email}`,
        });
      } else {
        toast({
          title: "Partial success",
          description: "Email was added to waitlist but email delivery failed",
          variant: "warning"
        });
      }
    } catch (error: any) {
      console.error("Error testing email:", error);
      toast({
        title: "Test failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Test Resend Integration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isLoading}
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full"
        >
          {isLoading ? "Sending..." : "Send Test Email"}
        </Button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>This will:</p>
        <ol className="list-decimal pl-5 space-y-1 mt-2">
          <li>Add your email to the waitlist database</li>
          <li>Send a welcome email using Resend</li>
          <li>Return the result for verification</li>
        </ol>
      </div>
    </div>
  );
}
