import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// Initialize the SQLite database
const sqlite = new Database("sports-betting.db");
export const db = drizzle(sqlite, { schema });
