import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite", // or 'mysql' | 'sqlite' | 'postgresql'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "./drizzle", // Folder where generated files will be saved
});
