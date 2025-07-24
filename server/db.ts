import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Use Supabase connection string format
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:[YOUR-PASSWORD]@db.ctbcdiedhsaqibcvcdmd.supabase.co:5432/postgres';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });