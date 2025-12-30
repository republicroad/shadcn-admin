import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { employees } from '../src/db/schema';
import path from 'path';

const filepath = path.join(__dirname, '../chinook.db');
console.log("Database file path:", filepath);
// const sqlite = new Database('chinook.db');
const sqlite = new Database(filepath);
const db = drizzle({ client: sqlite });
const result = await db.select().from(employees).get();
console.log(result);
// employees 来自 drizzle 的 schema 定义文件