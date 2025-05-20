// Script to create a new admin user in Supabase
// Run with Node.js: node scripts/create-admin-user.js

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Supabase credentials
const SUPABASE_URL = "https://pozblfzhjqlsxkakhowp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvemJsZnpoanFsc3hrYWtob3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMDM0MDUsImV4cCI6MjA1NTY3OTQwNX0.qICEbtyj5hsnu489FuQFiwfFgAJbQ0zmul4sQX5ODbM";

// Ask for the admin service key in the console for security
// You'll need to retrieve this from the Supabase dashboard
// Project Settings > API > Project API keys > service_role key
// NEVER commit this key to your repository

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

async function createAdminUser() {
  try {
    // Get service role key from user
    const serviceRoleKey = await prompt('Enter Supabase service role key: ');
    
    // Create Supabase client with service role key for admin privileges
    const supabase = createClient(SUPABASE_URL, serviceRoleKey);
    
    // Get user details
    const email = await prompt('Enter user email: ');
    const password = await prompt('Enter password (min 6 characters): ');
    const fullName = await prompt('Enter full name: ');
    const role = await prompt('Enter role (admin or editor): ');
    
    // Validate inputs
    if (password.length < 6) {
      console.error('Password must be at least 6 characters');
      return;
    }
    
    if (role !== 'admin' && role !== 'editor') {
      console.error('Role must be either "admin" or "editor"');
      return;
    }
    
    console.log(`Creating user with email: ${email}...`);
    
    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // Auto-confirm the email
    });
    
    if (authError) {
      console.error('Error creating user:', authError.message);
      return;
    }
    
    console.log('User created successfully in Auth');
    console.log('User ID:', authData.user.id);
    
    // Add user to profiles table with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        user_type: 'admin',
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (profileError) {
      console.error('Error creating profile:', profileError.message);
      return;
    }
    
    console.log(`User ${email} created successfully with ${role} role!`);
    console.log('They can now log in at: https://www.zerovacancy.ai/admin/login');
  } catch (error) {
    console.error('Unexpected error:', error.message);
  } finally {
    rl.close();
  }
}

createAdminUser();