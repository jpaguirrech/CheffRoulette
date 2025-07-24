import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Use Neon database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

console.log('🔗 Connecting to Neon database...');
console.log('🔌 Connection string:', connectionString.replace(/:[^:@]*@/, ':****@'));

// Create postgres connection for Neon
const client = postgres(connectionString, {
  ssl: 'require',
  max: 10,
  idle_timeout: 30,
  transform: {
    undefined: null
  }
});

export const db = drizzle(client, { schema });