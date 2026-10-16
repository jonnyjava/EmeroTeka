import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.EMEROTK_POSTGRES_URL ||
  process.env.emerotk_POSTGRES_URL ||
  process.env.EMEROTK_POSTGRES_URL_NON_POOLING ||
  process.env.emerotk_POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const sqlHost = process.env.EMEROTK_SQL_HOST || process.env.emerotk_SQL_HOST || process.env.SQL_HOST;
const sqlDbName = process.env.EMEROTK_SQL_DB_NAME || process.env.emerotk_SQL_DB_NAME || process.env.SQL_DB_NAME;
const user = process.env.EMEROTK_SQL_ADMIN_USER || process.env.emerotk_SQL_ADMIN_USER || process.env.EMEROTK_SQL_USER || process.env.emerotk_SQL_USER || process.env.SQL_ADMIN_USER || process.env.SQL_USER;
const password = process.env.EMEROTK_SQL_ADMIN_PASSWORD || process.env.emerotk_SQL_ADMIN_PASSWORD || process.env.EMEROTK_SQL_PASSWORD || process.env.emerotk_SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD;

if (!connectionString) {
  if (!sqlHost) {
    throw new Error("SQL_HOST or POSTGRES_URL must be set in environment variables.");
  }
  if (!sqlDbName) {
    throw new Error("SQL_DB_NAME must be set in environment variables.");
  }
  if (!user) {
    throw new Error("SQL_ADMIN_USER must be set in environment variables.");
  }
  if (!password) {
    throw new Error("SQL_ADMIN_PASSWORD must be set in environment variables.");
  }
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: connectionString
    ? { url: connectionString }
    : {
        host: sqlHost!,
        user: user!,
        password: password!,
        database: sqlDbName!,
        ssl: false,
      },
  verbose: true,
});
