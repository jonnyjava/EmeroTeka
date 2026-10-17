import { describe, it, expect } from 'vitest';
import { MagazineIssueInputSchema } from './MagazineIssueAdminEntity';

describe('MagazineIssueInputSchema', () => {
  it('should validate valid magazine issue input with integer month', () => {
    const valid = {
      magazineId: 1,
      issueNumber: '542',
      year: 2026,
      month: 10,
      title: 'Especial Ruta de la Seda',
      coverImageUrl: '/images/mag_altair_silkroad_1791410402139.jpg',
    };

    const result = MagazineIssueInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.month).toBe(10);
    }
  });

  it('should allow null or empty month', () => {
    const valid = {
      magazineId: 1,
      issueNumber: '542',
      year: 2026,
      month: '',
    };

    const result = MagazineIssueInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.month).toBeNull();
    }
  });

  it('should reject invalid month number outside 1-12', () => {
    const invalid = {
      magazineId: 1,
      issueNumber: '542',
      year: 2026,
      month: 13,
    };

    const result = MagazineIssueInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
