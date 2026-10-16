/**
 * Database Seeding Script
 *
 * Populates Cloud SQL with historical travel magazines.
 * Can be run programmatically or via npm script.
 */
import { db } from '../../../db/index.ts';
import { magazines } from '../../../db/schema.ts';

export async function runCatalogSeed() {
  console.log('Catalog seed invoked (no example data).');
}
