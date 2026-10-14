import { describe, it, expect } from 'vitest';
import { MagazineInputSchema } from './MagazineAdminEntity';

describe('MagazineAdminEntity Domain Model', () => {
  it('validates valid magazine input data', () => {
    const valid = {
      name: 'Viajes El Mundo',
      publisher: 'Unidad Editorial',
      country: 'España',
      issn: '1234-5678',
      description: 'Revista dedicada a reportajes de expedición.',
      coverImageUrl: 'https://example.com/cover.jpg',
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

  it('validates ISSN format correctly and rejects malformed values', () => {
    const validISSN = MagazineInputSchema.safeParse({
      name: 'Valid ISSN Mag',
      issn: '0027-9358',
    });
    expect(validISSN.success).toBe(true);

    const invalidISSN = MagazineInputSchema.safeParse({
      name: 'Invalid ISSN Mag',
      issn: '12345678',
    });
    expect(invalidISSN.success).toBe(false);
  });
});
