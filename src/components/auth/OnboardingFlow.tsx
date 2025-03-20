import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import UserTypeSelection from './UserTypeSelection';
import ProfileForm from './ProfileForm';

type UserType = 'property_team' | 'creator' | null;

enum OnboardingStep {
  TYPE_SELECTION = 0,
  PROFILE_CREATION = 1,
  COMPLETED = 2,
}

const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.TYPE_SELECTION);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch the current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    getUser();
  }, []);

  // Handle user type selection
  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
  };

  // Go to the next step
  const handleNextStep = () => {
    if (step < OnboardingStep.COMPLETED) {
      setStep(prev => (prev + 1) as OnboardingStep);
    }
  };

  // Go to the previous step
  const handlePrevStep = () => {
    if (step > OnboardingStep.TYPE_SELECTION) {
      setStep(prev => (prev - 1) as OnboardingStep);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (profileData: any) => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You need to be signed in to complete your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create a combined object with user info and profile data
      const userData = {
        user_id: user.id,
        user_type: userType,
        email: user.email,
        ...profileData,
        created_at: new Date().toISOString(),
      };

      console.log('Saving user profile:', userData);

      // Determine which table to insert into based on user type
      const tableName = userType === 'property_team' ? 'property_teams' : 'creators';

      // Insert the profile data into the appropriate table
      console.log(`Inserting into table ${tableName} with data:`, userData);
      const { data, error } = await supabase
        .from(tableName)
        .upsert([userData])
        .select();

      if (error) {
        console.error(`Error upserting to ${tableName}:`, error);
        console.error(`Error status:`, error.code, error.message, error.details);
        throw error;
      }
      
      console.log(`Successfully inserted into ${tableName}:`, data);

      // Also save the user type in the profiles table for easier querying
      console.log("Inserting into profiles table with data:", {
        id: user.id,
        user_type: userType,
        email: user.email,
        full_name: profileData.fullName,
      });
      
      const { data: profileData2, error: profileError } = await supabase
        .from('profiles')
        .upsert([{
          id: user.id,
          user_type: userType,
          email: user.email,
          full_name: profileData.fullName,
          updated_at: new Date().toISOString(),
        }])
        .select();
        
      if (profileError) {
        console.error("Error upserting to profiles:", profileError);
        console.error("Error status:", profileError.code, profileError.message, profileError.details);
        // We're not throwing here to allow the flow to continue even if this fails
      } else {
        console.log("Successfully inserted into profiles:", profileData2);
      }

      toast({
        title: "Profile Saved",
        description: "Your profile has been successfully created.",
      });

      // Move to the completed step
      setStep(OnboardingStep.COMPLETED);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error Saving Profile",
        description: error.message || "There was a problem saving your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle completing the onboarding
  const handleComplete = () => {
    // Redirect to the appropriate dashboard based on user type
    if (userType === 'creator') {
      navigate('/creator/dashboard');
    } else {
      navigate('/property/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= OnboardingStep.TYPE_SELECTION 
                ? 'bg-brand-purple text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step > OnboardingStep.TYPE_SELECTION ? <CheckCircle2 className="w-5 h-5" /> : 1}
            </div>
            <span className="text-sm font-medium">Choose Type</span>
          </div>
          <div className="h-1 w-16 bg-gray-200 flex-shrink-0">
            <div className={`h-full bg-brand-purple transition-all ${
              step > OnboardingStep.TYPE_SELECTION ? 'w-full' : 'w-0'
            }`}></div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= OnboardingStep.PROFILE_CREATION 
                ? 'bg-brand-purple text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step > OnboardingStep.PROFILE_CREATION ? <CheckCircle2 className="w-5 h-5" /> : 2}
            </div>
            <span className="text-sm font-medium">Create Profile</span>
          </div>
          <div className="h-1 w-16 bg-gray-200 flex-shrink-0">
            <div className={`h-full bg-brand-purple transition-all ${
              step > OnboardingStep.PROFILE_CREATION ? 'w-full' : 'w-0'
            }`}></div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= OnboardingStep.COMPLETED 
                ? 'bg-brand-purple text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step > OnboardingStep.COMPLETED ? <CheckCircle2 className="w-5 h-5" /> : 3}
            </div>
            <span className="text-sm font-medium">Complete</span>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <AnimatePresence mode="wait">
          {step === OnboardingStep.TYPE_SELECTION && (
            <motion.div
              key="type-selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <UserTypeSelection 
                selectedType={userType} 
                onTypeSelect={handleUserTypeSelect} 
              />
            </motion.div>
          )}

          {step === OnboardingStep.PROFILE_CREATION && userType && (
            <motion.div
              key="profile-creation"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ProfileForm 
                userType={userType} 
                onSubmit={handleProfileSubmit}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {step === OnboardingStep.COMPLETED && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Onboarding Complete!</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {userType === 'property_team' 
                  ? "Your property team profile has been set up successfully. You can now start posting projects and browsing creators."
                  : "Your creator profile has been set up successfully. You can now start browsing projects and receiving requests from property owners."}
              </p>
              <Button
                size="lg"
                onClick={handleComplete}
                className="bg-brand-purple hover:bg-brand-purple-dark"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {step !== OnboardingStep.COMPLETED && (
        <div className="flex justify-between">
          {step > OnboardingStep.TYPE_SELECTION ? (
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div></div> /* Empty div for flex layout */
          )}

          {step === OnboardingStep.TYPE_SELECTION && (
            <Button
              onClick={handleNextStep}
              disabled={!userType}
              className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-dark"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;