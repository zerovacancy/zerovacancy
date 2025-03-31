import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Common profile schema for both user types
const baseProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().optional()
});

// Schema for property team
const propertyTeamSchema = baseProfileSchema.extend({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Your role is required'),
  propertyCount: z.string().optional(),
});

// Schema for agencies (reusing property team schema with different role options)
const agencySchema = baseProfileSchema.extend({
  company: z.string().min(1, 'Agency name is required'),
  role: z.string().min(1, 'Your role is required'),
  propertyCount: z.string().optional(),
  agencyType: z.string().optional(),
});

// Schema for creators
const creatorSchema = baseProfileSchema.extend({
  specialty: z.string().min(1, 'Specialty is required'),
  experience: z.string().min(1, 'Experience level is required'),
  portfolioUrl: z.string().optional(),
});

type UserType = 'property_team' | 'creator' | 'agency';

type ProfileFormProps = {
  userType: UserType;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
};

const ProfileForm = ({ userType, onSubmit, isLoading = false }: ProfileFormProps) => {
  // Using dynamic schema based on user type
  let schema;
  let defaultValues;
  
  if (userType === 'creator') {
    schema = creatorSchema;
    defaultValues = { fullName: '', phone: '', specialty: '', experience: '', portfolioUrl: '' };
  } else if (userType === 'agency') {
    schema = agencySchema;
    defaultValues = { fullName: '', phone: '', company: '', role: '', propertyCount: '', agencyType: '' };
  } else {
    schema = propertyTeamSchema;
    defaultValues = { fullName: '', phone: '', company: '', role: '', propertyCount: '' };
  }
  
  // Set up form with the appropriate schema
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
  });

  // Handle form submission
  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      userType
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h2 className="text-xl font-bold mb-4">
          {userType === 'property_team' 
            ? 'Property Team Profile' 
            : userType === 'creator' 
              ? 'Creator Profile' 
              : 'Agency Profile'}
        </h2>
        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {userType === 'property_team' || userType === 'agency' ? (
          // Property Team or Agency specific fields
          <>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userType === 'agency' ? (
                        <>
                          <SelectItem value="agency_owner">Agency Owner</SelectItem>
                          <SelectItem value="agency_manager">Agency Manager</SelectItem>
                          <SelectItem value="marketing_director">Marketing Director</SelectItem>
                          <SelectItem value="content_director">Content Director</SelectItem>
                          <SelectItem value="agency_other">Other</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="owner">Property Owner</SelectItem>
                          <SelectItem value="manager">Property Manager</SelectItem>
                          <SelectItem value="marketing">Marketing Manager</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {userType === 'agency' && (
              <FormField
                control={form.control}
                name="agencyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agency type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="marketing">Marketing Agency</SelectItem>
                        <SelectItem value="property_management">Property Management</SelectItem>
                        <SelectItem value="media_production">Media Production</SelectItem>
                        <SelectItem value="digital_marketing">Digital Marketing</SelectItem>
                        <SelectItem value="creative_agency">Creative Agency</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="propertyCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {userType === 'agency' 
                      ? 'Number of Clients (optional)' 
                      : 'Number of Properties (optional)'}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          userType === 'agency' 
                            ? "Select client count" 
                            : "Select property count"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 {userType === 'agency' ? 'clients' : 'properties'}</SelectItem>
                      <SelectItem value="6-20">6-20 {userType === 'agency' ? 'clients' : 'properties'}</SelectItem>
                      <SelectItem value="21-50">21-50 {userType === 'agency' ? 'clients' : 'properties'}</SelectItem>
                      <SelectItem value="50+">More than 50 {userType === 'agency' ? 'clients' : 'properties'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          // Creator specific fields
          <>
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Specialty</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="videography">Videography</SelectItem>
                      <SelectItem value="drone">Drone Photography/Videography</SelectItem>
                      <SelectItem value="virtual_tours">Virtual Tours</SelectItem>
                      <SelectItem value="3d_rendering">3D Rendering</SelectItem>
                      <SelectItem value="content_writing">Content Writing</SelectItem>
                      <SelectItem value="social_media">Social Media Management</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      <SelectItem value="professional">Professional (Full-time)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourportfolio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;