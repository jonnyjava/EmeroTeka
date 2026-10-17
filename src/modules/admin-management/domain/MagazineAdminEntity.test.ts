import { describe, it, expect } from 'vitest';
import { MagazineInputSchema } from './MagazineAdminEntity';

describe('MagazineAdminEntity Domain Model', () => {
  it('validates valid magazine input data', () => {
    const valid = {
      name: 'Viajes El Mundo',
      publisher: 'Unidad Editorial',
      country: 'España',
    };

    const result = MagazineInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('allows empty or omitted optional fields', () => {
    const minimal = {
      name: 'Revista Test',
    };

    const result = MagazineInputSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it('rejects a name that is too short', () => {
    const invalid = {
      name: 'A',
    };

    const result = MagazineInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
