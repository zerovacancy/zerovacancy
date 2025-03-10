
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function ResendTester() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleTestResend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // Call our test edge function
      const { data, error } = await supabase.functions.invoke('test-resend', {
        body: { email }
      });
      
      if (error) {
        console.error("Error testing Resend:", error);
        toast.error("Failed to test Resend integration");
        setResult({
          success: false,
          message: "Failed to test Resend integration",
          details: error
        });
        return;
      }
      
      console.log("Resend test response:", data);
      toast.success("Test email sent successfully! Please check your inbox.");
      setResult({
        success: true,
        message: "Test email sent successfully! Please check your inbox.",
        details: data
      });
    } catch (error) {
      console.error("Error testing Resend:", error);
      toast.error("An unexpected error occurred");
      setResult({
        success: false,
        message: "An unexpected error occurred",
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Resend Integration</CardTitle>
        <CardDescription>
          Send a test email to verify that the Resend integration is working properly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTestResend} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input 
              id="email"
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              disabled={isLoading}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Test Email'
            )}
          </Button>
        </form>

        {result && (
          <div className={`mt-4 p-4 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.success ? 'Success' : 'Error'}
                </h3>
                <div className={`mt-2 text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  <p>{result.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        You'll need to check your email inbox to confirm the test was successful.
      </CardFooter>
    </Card>
  );
}
