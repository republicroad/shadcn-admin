import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/sqlite/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: 'file:./chinook.db', // Path to your SQLite file
  },
});

// export const dbpath = './chinook.db'