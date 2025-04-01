import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Building, Calendar, Camera, CreditCard, FileText, Home, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PropertyDashboard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [propertyProfile, setPropertyProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get URL parameters and set agency view state
  const searchParams = new URLSearchParams(window.location.search);
  const [isAgency, setIsAgency] = useState(searchParams.get('view') === 'agency');

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to be signed in to access your dashboard.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  // Get property team profile
  useEffect(() => {
    const getPropertyProfile = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingProfile(true);
        
        // Fetch profile from the property_teams table
        const { data, error } = await supabase
          .from('property_teams')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // Record not found
            // Redirect to onboarding if profile doesn't exist
            toast({
              title: "Profile Setup Required",
              description: "Please complete your profile setup to access your dashboard.",
            });
            navigate('/onboarding');
            return;
          }
          throw error;
        }

        // Check if this is an agency by role or agencyType field
        const isAgencyRole = data.role && (
          data.role.includes('agency') || 
          data.agencyType || 
          data.user_type === 'agency'
        );
        setIsAgency(isAgency || isAgencyRole);
        setPropertyProfile(data);
      } catch (error: any) {
        toast({
          title: "Error Loading Profile",
          description: error.message || "There was a problem loading your profile.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user?.id) {
      getPropertyProfile();
    }
  }, [user, navigate, toast, isAgency]);

  // Show loading state
  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
              <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                <div className="flex flex-col items-center mb-6 pb-6 border-b">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl mb-4">
                    {propertyProfile?.fullName?.charAt(0) || user?.email?.charAt(0) || 'P'}
                  </div>
                  <h2 className="text-lg font-semibold">{propertyProfile?.fullName || 'Property Team'}</h2>
                  <p className="text-sm text-gray-500">
                    {isAgency 
                      ? (propertyProfile?.agencyType === 'marketing' 
                          ? 'Marketing Agency'
                          : propertyProfile?.agencyType === 'property_management'
                          ? 'Property Management'
                          : propertyProfile?.agencyType === 'media_production'
                          ? 'Media Production'
                          : 'Digital Agency')
                      : (propertyProfile?.company || 'Property Management')}
                  </p>
                </div>
                
                <nav className="flex flex-col space-y-1">
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-900 bg-gray-100 rounded-md">
                    <Home className="w-5 h-5 text-blue-600" />
                    <span>Dashboard</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    <Building className="w-5 h-5 text-gray-500" />
                    <span>Properties</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    <Camera className="w-5 h-5 text-gray-500" />
                    <span>Find Creators</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span>Bookings</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span>Projects</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <span>Billing</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    <User className="w-5 h-5 text-gray-500" />
                    <span>Team</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>Settings</span>
                  </a>
                </nav>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h1 className="text-2xl font-bold mb-6">
                  {isAgency ? 'Agency Dashboard' : 'Property Team Dashboard'}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {isAgency ? (
                    <>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-600 mb-1">Active Clients</h3>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                        <h3 className="font-semibold text-brand-purple mb-1">Active Creators</h3>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <h3 className="font-semibold text-green-600 mb-1">Total Projects</h3>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-600 mb-1">Active Projects</h3>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                        <h3 className="font-semibold text-brand-purple mb-1">Upcoming Shoots</h3>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <h3 className="font-semibold text-green-600 mb-1">Completed Projects</h3>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {isAgency ? (
                      <>
                        <Button className="bg-brand-purple hover:bg-brand-purple-dark">
                          <Camera className="w-4 h-4 mr-2" />
                          Find Creators
                        </Button>
                        <Button variant="outline">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                          </svg>
                          Add Client
                        </Button>
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Create Project
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="bg-brand-purple hover:bg-brand-purple-dark">
                          <Camera className="w-4 h-4 mr-2" />
                          Find Creators
                        </Button>
                        <Button variant="outline">
                          <Building className="w-4 h-4 mr-2" />
                          Add Property
                        </Button>
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Create Project
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {isAgency ? (
                      <>
                        <p className="mb-4">Welcome to your agency dashboard! Here are some steps to get started:</p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                          <li>Add your first client</li>
                          <li>Connect with content creators</li>
                          <li>Create your first project</li>
                          <li>Invite team members to collaborate</li>
                        </ol>
                      </>
                    ) : (
                      <>
                        <p className="mb-4">Welcome to your property team dashboard! Here are some steps to get started:</p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                          <li>Add your properties to your profile</li>
                          <li>Browse available content creators</li>
                          <li>Create your first project</li>
                          <li>Schedule a booking with a creator</li>
                        </ol>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Recommended Creators</h2>
                <p className="text-gray-600">No recommended creators yet. Start browsing our directory to find the perfect match for your projects.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDashboard;