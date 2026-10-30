import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const client = createClient({ url: process.env.DATABASE_URL || 'file:local.db' });
try {
  await migrate(drizzle(client), { migrationsFolder: './drizzle' });
  console.log('Database migrations complete');
} finally {
  client.close();
}
