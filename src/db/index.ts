import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const connectionString =
      process.env.EMEROTK_POSTGRES_URL ||
      process.env.emerotk_POSTGRES_URL ||
      process.env.EMEROTK_POSTGRES_URL_NON_POOLING ||
      process.env.emerotk_POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_URL_NON_POOLING;

    const host = process.env.EMEROTK_SQL_HOST || process.env.emerotk_SQL_HOST || process.env.SQL_HOST;
    const user = process.env.EMEROTK_SQL_USER || process.env.emerotk_SQL_USER || process.env.EMEROTK_SQL_ADMIN_USER || process.env.emerotk_SQL_ADMIN_USER || process.env.SQL_USER || process.env.SQL_ADMIN_USER;
    const password = process.env.EMEROTK_SQL_PASSWORD || process.env.emerotk_SQL_PASSWORD || process.env.EMEROTK_SQL_ADMIN_PASSWORD || process.env.emerotk_SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD;
    const database = process.env.EMEROTK_SQL_DB_NAME || process.env.emerotk_SQL_DB_NAME || process.env.SQL_DB_NAME;

    global._postgresPool = new Pool(
      connectionString
        ? { connectionString, max: 10, connectionTimeoutMillis: 15000 }
        : {
            host,
            user,
            password,
            database,
            max: 10,
            connectionTimeoutMillis: 15000,
          }
    );

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
