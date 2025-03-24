-- This script adds the "Team Zero" author to your blog_authors table
-- Run this in your Supabase SQL Editor

-- First check if the author already exists
DO $$
DECLARE
  author_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM blog_authors WHERE name = 'Team Zero') INTO author_exists;
  
  IF NOT author_exists THEN
    -- Insert the Team Zero author
    INSERT INTO blog_authors (name, role, bio)
    VALUES (
      'Team Zero',
      'ZeroVacancy Team',
      'The ZeroVacancy team shares insights about property marketing and content creation.'
    );
    
    RAISE NOTICE 'Team Zero author has been added successfully';
  ELSE
    RAISE NOTICE 'Team Zero author already exists';
  END IF;
END $$;