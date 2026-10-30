import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL;
if (!url?.startsWith('file:')) throw new Error('Backup requires a local SQLite database');
const databasePath = fileURLToPath(new URL(url));
if (existsSync(databasePath)) {
  const folder = join(dirname(databasePath), 'backups');
  mkdirSync(folder, { recursive: true });
  const destination = join(folder, `${new Date().toISOString().replaceAll(':', '-')}.db`);
  const client = createClient({ url });
  try {
    await client.execute({ sql: 'VACUUM INTO ?', args: [destination] });
    console.log('SQLite backup saved:', destination);
  } finally {
    client.close();
  }
} else {
  console.log('First deployment: no database to back up');
}
