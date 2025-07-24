import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';
import { generateDatabaseUrl } from './supabase-config';

// Force use of Supabase database URL - prioritize SUPABASE_DATABASE_URL
const connectionString = process.env.SUPABASE_DATABASE_URL || generateDatabaseUrl();

console.log('🔗 Connecting to Supabase database...');
console.log('📍 Project: https://ctbcdiedhsaqibcvcdmd.supabase.co');

if (connectionString.includes('[YOUR-PASSWORD]')) {
  console.warn('⚠️  Please set SUPABASE_DATABASE_URL with your actual database password:');
  console.warn('   SUPABASE_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres');
} else {
  console.log('✅ Supabase database connection configured');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });