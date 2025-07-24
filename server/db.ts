import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';
import { generateDatabaseUrl } from './supabase-config';

// Use Supabase connection string format
const connectionString = process.env.DATABASE_URL || generateDatabaseUrl();

console.log('Database connection configured for Supabase');
if (connectionString.includes('[YOUR-PASSWORD]')) {
  console.warn('⚠️  DATABASE_URL contains placeholder password. Please set the DATABASE_URL environment variable with your actual Supabase database password.');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });