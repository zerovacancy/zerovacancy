// Script to add "Team Zero" author to Supabase
// Run with: node src/scripts/add-team-author.js

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Create readline interface for input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

async function addTeamZeroAuthor() {
  try {
    // Supabase credentials
    const SUPABASE_URL = "https://pozblfzhjqlsxkakhowp.supabase.co";
    const serviceRoleKey = await prompt('Enter Supabase service role key: ');
    
    // Create Supabase client with service role key for admin privileges
    const supabase = createClient(SUPABASE_URL, serviceRoleKey);
    
    console.log('Adding Team Zero author to blog_authors table...');
    
    // Check if Team Zero author already exists
    const { data: existingAuthor, error: checkError } = await supabase
      .from('blog_authors')
      .select('id, name')
      .eq('name', 'Team Zero')
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking for existing Team Zero author:', checkError);
      return;
    }
    
    if (existingAuthor) {
      console.log('Team Zero author already exists with ID:', existingAuthor.id);
      return;
    }
    
    // Add Team Zero author
    const { data, error } = await supabase
      .from('blog_authors')
      .insert({
        name: 'Team Zero',
        role: 'ZeroVacancy Team',
        bio: 'The ZeroVacancy team shares insights about property marketing and content creation.'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding Team Zero author:', error);
      return;
    }
    
    console.log('Successfully added Team Zero author with ID:', data.id);
    console.log('You can now select "Team Zero" from the author dropdown in the blog editor.');
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    rl.close();
  }
}

addTeamZeroAuthor();