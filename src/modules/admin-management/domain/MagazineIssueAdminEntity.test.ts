import { describe, it, expect } from 'vitest';
import { MagazineIssueInputSchema } from './MagazineIssueAdminEntity';

describe('MagazineIssueInputSchema', () => {
  it('should validate valid magazine issue input', () => {
    const valid = {
      magazineId: 1,
      issueNumber: '542',
      year: 2026,
      month: 'Octubre',
      title: 'Especial Ruta de la Seda',
      coverImageUrl: '/images/mag_altair_silkroad_1791410402139.jpg',
    };

    const result = MagazineIssueInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should fail when magazineId is missing or invalid', () => {
    const invalid = {
      magazineId: 0,
      issueNumber: '542',
      year: 2026,
    };

    const result = MagazineIssueInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should fail when issueNumber is empty', () => {
    const invalid = {
      magazineId: 1,
      issueNumber: '',
      year: 2026,
    };

    const result = MagazineIssueInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should fail when year is out of bounds', () => {
    const invalid = {
      magazineId: 1,
      issueNumber: '542',
      year: 1700,
    };

    const result = MagazineIssueInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
