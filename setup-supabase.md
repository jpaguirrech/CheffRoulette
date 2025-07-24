# Supabase Setup Guide

## Quick Setup

Your Supabase project is already configured with these details:

- **Project URL**: https://ctbcdiedhsaqibcvcdmd.supabase.co
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...`

## Database Connection Setup

To connect the app to your Supabase database, you need to provide your database password:

### Option 1: Set SUPABASE_DATABASE_URL (Recommended)

1. Go to your Supabase dashboard: https://ctbcdiedhsaqibcvcdmd.supabase.co
2. Navigate to **Settings** > **Database**
3. Find your database password (the one you created when setting up the project)
4. In Replit, go to the **Secrets** tab
5. Add a new secret:
   - **Key**: `SUPABASE_DATABASE_URL`
   - **Value**: `postgresql://postgres:YOUR_PASSWORD@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres`
   - Replace `YOUR_PASSWORD` with your actual database password

**Note**: We use `SUPABASE_DATABASE_URL` instead of `DATABASE_URL` because Replit may have its own `DATABASE_URL` pointing to a Neon database.

### Option 2: Set Password Only

Alternatively, you can just set the password:
1. In Replit Secrets, add:
   - **Key**: `SUPABASE_DB_PASSWORD`
   - **Value**: Your database password

## Database Tables

The following tables will be created automatically:
- `social_media_content` - Stores social media URLs and metadata
- `extracted_recipes` - Stores AI-processed recipe data
- `users` - User accounts and gamification data
- `sessions` - Session management for authentication

## Testing the Connection

Once you've set the DATABASE_URL secret:
1. The app will automatically restart
2. Check the console for "Database connection configured for Supabase"
3. If you see warnings about placeholder passwords, double-check your DATABASE_URL

## Troubleshooting

- **Connection refused**: Check that your DATABASE_URL is correct
- **Authentication failed**: Verify your database password
- **Table not found**: The tables should be created automatically, but you can run the SQL manually if needed

Need help? The connection details are stored in `server/supabase-config.ts`.