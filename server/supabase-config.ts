// Supabase Configuration Helper
// This file helps configure the database connection for Supabase

interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  serviceRoleKey: string;
  databasePassword: string;
}

// Your Supabase configuration
export const supabaseConfig: Partial<SupabaseConfig> = {
  projectUrl: 'https://ctbcdiedhsaqibcvcdmd.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YmNkaWVkaHNhcWliY3ZjZG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTIyNjksImV4cCI6MjA2ODg4ODI2OX0.McIXGB-YBOM4KYegNyHL0Lu9BNAn8XcNVsntJEZlgKQ',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YmNkaWVkaHNhcWliY3ZjZG1kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMxMjI2OSwiZXhwIjoyMDY4ODg4MjY5fQ.DoXrkF_2-k_78we3ViSyVN2mw0f698pNpKCBTVdPIW4',
  // databasePassword: 'YOUR_PASSWORD_HERE' // You need to provide this
};

// Generate the DATABASE_URL connection string
export function generateDatabaseUrl(password?: string): string {
  const dbPassword = password || process.env.SUPABASE_DB_PASSWORD || '[YOUR-PASSWORD]';
  return `postgresql://postgres:${dbPassword}@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres`;
}

// Check if we're using the correct Supabase URL
export function isSupabaseConnection(url: string): boolean {
  return url.includes('ctbcdiedhsaqibcvcdmd.supabase.co');
}

// Instructions for user
export const setupInstructions = `
To complete the Supabase setup:

1. Go to your Supabase dashboard: https://ctbcdiedhsaqibcvcdmd.supabase.co
2. Navigate to Settings > Database
3. Find your database password (the one you set when creating the project)
4. Set the DATABASE_URL environment variable with the complete connection string:

   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres

5. Replace YOUR_PASSWORD with your actual database password

Alternative: You can also set SUPABASE_DB_PASSWORD as an environment variable with just the password.
`;

console.log(setupInstructions);