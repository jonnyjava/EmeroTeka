import { describe, it, expect } from 'vitest';
import { ArticleInputSchema } from './ArticleAdminEntity';

describe('ArticleAdminEntity Domain Model', () => {
  it('validates a complete, valid article input', () => {
    const valid = {
      magazineId: 1,
      issueId: 2,
      title: 'Las Ruinas de Petra al Amanecer',
      subtitle: 'Secretos de los nabateos',
      author: 'Carlos Ruiz',
      startPage: 40,
      endPage: 55,
      synopsis: 'Una crónica exhaustiva explorando los cañones del Siq y el Tesoro nabateo.',
      tags: 'arqueologia, historia',
      featured: true,
    };

    const result = ArticleInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects when endPage is less than startPage', () => {
    const invalidPages = {
      magazineId: 1,
      issueId: 2,
      title: 'Título de Prueba',
      startPage: 50,
      endPage: 40,
      synopsis: 'Sinopsis suficientemente larga para pasar la validación mínima.',
    };

    const result = ArticleInputSchema.safeParse(invalidPages);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('La página final no puede ser menor');
    }
  });

  it('rejects when title is too short', () => {
    const missingTitle = {
      magazineId: 1,
      issueId: 2,
      title: 'ab',
      startPage: 10,
      endPage: 20,
      synopsis: 'Sinopsis suficientemente larga para pasar la validación mínima.',
    };

    const result = ArticleInputSchema.safeParse(missingTitle);
    expect(result.success).toBe(false);
  });
});
