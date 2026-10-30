import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'file:local.db',
		authToken: process.env.DATABASE_AUTH_TOKEN || undefined
	},
	strict: true,
	verbose: true
});
