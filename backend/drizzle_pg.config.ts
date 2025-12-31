import { defineConfig } from "drizzle-kit";
import { drizzle } from 'drizzle-orm/bun-sql';
// 注意, drizzle-kit 不支持 postgresql 12 以下的版本
// https://github.com/drizzle-team/drizzle-orm/issues/3684#issuecomment-2677743082

export default defineConfig({
  dialect: "postgresql", // or 'mysql' | 'sqlite' | 'postgresql'
  schema: './src/db/pg/schema.ts',
  out: "./drizzle_pg", // Folder where generated files will be saved
  dbCredentials: {
    host: "10.141.125.66", // "10.141.125.66"  192.168.0.59
    port: 5432,
    user: "postgres",
    password: "fccdjny",  //"123qwe"
    database: "postgres",
    ssl: false, // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
  },  // url: "postgresql://postgres:123qwe@192.168.0.59:5439/brde_db"
      // url: "postgresql://postgres:fccdjny@10.141.125.66:5432/postgres"
});

// export default defineConfig({
//   dialect: "postgresql",
//   schema: './src/db/schema_pg.ts',
//   out: "./drizzle_pg", // Folder where generated files will be saved
//   dbCredentials: {
//     url: "postgresql://postgres:123qwe@192.168.0.59:5439/brde_db", // "postgres://user:password@host:port/db",
//   }
// });