-- This script fixes Row-Level Security (RLS) issues for the blog tables
-- It disables RLS on blog tables or creates policies that allow full access for authenticated users
-- Run this in your Supabase SQL Editor

-- Option 1: Disable RLS on blog tables (simplest approach)
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_tags DISABLE ROW LEVEL SECURITY;

-- Option 2: Create permissive policies (if you prefer to keep RLS enabled)
-- Uncomment this section and comment out Option 1 if you want to use this approach instead

/*
-- Create policies for blog posts
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON blog_posts;
CREATE POLICY "Allow full access to authenticated users" 
  ON blog_posts FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create policies for blog categories
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON blog_categories;
CREATE POLICY "Allow full access to authenticated users" 
  ON blog_categories FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create policies for blog authors
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON blog_authors;
CREATE POLICY "Allow full access to authenticated users" 
  ON blog_authors FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create policies for blog tags
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON blog_tags;
CREATE POLICY "Allow full access to authenticated users" 
  ON blog_tags FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create policies for blog posts tags
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON blog_posts_tags;
CREATE POLICY "Allow full access to authenticated users" 
  ON blog_posts_tags FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);
*/