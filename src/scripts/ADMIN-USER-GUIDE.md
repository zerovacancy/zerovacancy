# ZeroVacancy Admin User Creation Guide

This guide explains how to create new admin users who can access the blog management system.

## Prerequisites

- Node.js installed on your computer
- Access to your Supabase dashboard
- The service role key from Supabase (never share this key)

## Getting the Supabase Service Role Key

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your ZeroVacancy project
3. Navigate to "Project Settings" → "API"
4. Under "Project API keys", find the `service_role` key
5. Keep this key secure and never commit it to your repository

## Creating a New Admin User

1. Open a terminal in your project directory
2. Run the script:
   ```
   node src/scripts/create-admin-user.js
   ```
3. When prompted, enter:
   - The Supabase service role key
   - The new user's email address
   - A password (minimum 6 characters)
   - The user's full name
   - The role (either "admin" or "editor")

## User Roles

- **admin**: Full access to the blog management system
- **editor**: Can edit and create blog posts but may have limited access to certain administrative functions

## Access Instructions for New Users

After creating a user, they can access the admin panel by:

1. Going to: https://www.zerovacancy.ai/admin/login
2. Logging in with their email and password
3. They will be redirected to the blog management dashboard

## Security Notes

- Never share the service role key
- Create strong passwords for admin users
- If a user no longer needs access, you should delete their account in Supabase
- This script should only be run by authorized team members

## Troubleshooting

If you encounter any issues:

1. Make sure the service role key is correct
2. Check that the user email doesn't already exist
3. Ensure the password is at least 6 characters
4. Verify that your Supabase instance is running correctly

For additional support, contact the tech lead or refer to the Supabase documentation.