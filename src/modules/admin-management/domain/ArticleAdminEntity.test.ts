import { describe, it, expect } from 'vitest';
import { ArticleInputSchema, buildLocationSearchIndex } from './ArticleAdminEntity';

describe('ArticleAdminEntity Domain Model', () => {
  it('validates a complete, valid article input', () => {
    const valid = {
      magazineId: 1,
      issueId: 2,
      title: 'Las Ruinas de Petra al Amanecer',
      subtitle: 'Secretos de los nabateos',
      author: 'Carlos Ruiz',
      photographer: 'Elena Vance',
      startPage: 40,
      endPage: 55,
      city: 'Wadi Musa',
      region: 'Ma\'an',
      country: 'Jordania',
      synopsis: 'Una crónica exhaustiva explorando los cañones del Siq y el Tesoro nabateo.',
      tags: 'arqueologia, jordania, historia',
      featured: true,
      coverImageUrl: 'https://example.com/petra.jpg',
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
      country: 'España',
      synopsis: 'Sinopsis suficientemente larga para pasar la validación mínima.',
    };

    const result = ArticleInputSchema.safeParse(invalidPages);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('La página final no puede ser menor');
    }
  });

  it('rejects when country is missing or empty', () => {
    const missingCountry = {
      magazineId: 1,
      issueId: 2,
      title: 'Título de Prueba',
      startPage: 10,
      endPage: 20,
      country: '',
      synopsis: 'Sinopsis suficientemente larga para pasar la validación mínima.',
    };

    const result = ArticleInputSchema.safeParse(missingCountry);
    expect(result.success).toBe(false);
  });

  it('buildLocationSearchIndex generates formatted comma-separated location index', () => {
    expect(buildLocationSearchIndex('Roma', 'Lacio', 'Italia')).toBe('Roma, Lacio, Italia');
    expect(buildLocationSearchIndex('Tokio', null, 'Japón')).toBe('Tokio, Japón');
    expect(buildLocationSearchIndex(null, null, 'Grecia')).toBe('Grecia');
    expect(buildLocationSearchIndex('  Sevilla  ', '  Andalucía  ', '  España  ')).toBe('Sevilla, Andalucía, España');
  });
});
