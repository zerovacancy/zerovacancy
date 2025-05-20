# Blog Permissions Guide

## Understanding the "Row-Level Security Policy Violation" Error

When you see the error message:

```
new row violates row-level security policy for table "blog_posts"
```

This is because Supabase has Row-Level Security (RLS) enabled on the blog tables, but the current user doesn't have permission to insert or update rows.

## How Row-Level Security Works

1. RLS is a Postgres feature that Supabase uses to control access to tables
2. By default, RLS denies all operations unless explicitly permitted by policies
3. The blog tables have RLS enabled, but may be missing the necessary policies

## Fixing the Issue

### Option 1: Disable RLS (Simplest Solution)

For a development or internal-only system, the simplest approach is to disable RLS:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Run the SQL from `src/scripts/fix-blog-permissions.sql`
4. This will disable RLS on all blog-related tables

### Option 2: Create Permissive Policies

If you want to keep RLS enabled (better for security), you can create policies:

1. Edit `src/scripts/fix-blog-permissions.sql`
2. Comment out Option 1 and uncomment Option 2
3. Run the SQL in the Supabase SQL Editor
4. This creates policies that allow authenticated users full access

## Choosing the Right Option

- **Option 1 (Disable RLS)**: Simpler, but less secure. Good for development.
- **Option 2 (Create Policies)**: More secure but requires more maintenance.

## Supabase RLS Documentation

For more information on Row-Level Security in Supabase, see:
https://supabase.com/docs/guides/auth/row-level-security