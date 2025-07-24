import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { generateDatabaseUrl } from './supabase-config';

// Force use of Supabase database URL - prioritize SUPABASE_DATABASE_URL
const connectionString = process.env.SUPABASE_DATABASE_URL || generateDatabaseUrl();

console.log('🔗 Connecting to Supabase database...');
console.log('📍 Project: https://ctbcdiedhsaqibcvcdmd.supabase.co');
console.log('🔌 Connection string:', connectionString.replace(/:[^:@]*@/, ':****@'));
console.log('🔍 Using SUPABASE_DATABASE_URL:', !!process.env.SUPABASE_DATABASE_URL);
console.log('🔍 Raw env check:', process.env.SUPABASE_DATABASE_URL ? 'SET' : 'NOT_SET');

if (connectionString.includes('[YOUR-PASSWORD]')) {
  console.warn('⚠️  Please set SUPABASE_DATABASE_URL with your actual database password:');
  console.warn('   SUPABASE_DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres');
} else {
  console.log('✅ Supabase database connection configured');
}

// Create postgres connection for Supabase
const client = postgres(connectionString, {
  ssl: 'require',
  max: 10,
  idle_timeout: 30,
  transform: {
    undefined: null
  }
});

export const db = drizzle(client, { schema });