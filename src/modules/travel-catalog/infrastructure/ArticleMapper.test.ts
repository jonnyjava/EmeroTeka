import { describe, it, expect } from 'vitest';
import { ArticleMapper, RawDatabaseArticleJoined } from './ArticleMapper.ts';

describe('ArticleMapper Infrastructure Mapper', () => {
  it('maps complete database row with all fields to domain Article Aggregate Root', () => {
    const rawRow: RawDatabaseArticleJoined = {
      article: {
        id: 1,
        magazineId: 10,
        issueId: 20,
        title: 'Exploración en Svalbard',
        subtitle: 'Fiordos y osos polares',
        author: 'Fridtjof Nansen',
        photographer: 'Juho Karhu',
        startPage: 14,
        endPage: 32,
        city: 'Longyearbyen',
        region: 'Svalbard',
        country: 'Noruega',
        locationSearchIndex: 'longyearbyen svalbard noruega',
        synopsis: 'Expedición ártica en los confines septentrionales de Europa.',
        tags: 'Ártico, Glaciares, Fauna',
        featured: true,
        coverImageUrl: 'https://images.unsplash.com/custom-cover.jpg',
        createdAt: new Date('2022-01-15T00:00:00Z'),
      },
      issue: {
        id: 20,
        magazineId: 10,
        issueNumber: '405',
        year: 2022,
        month: 'Marzo',
        volume: 'Vol. 34',
        title: 'Mares de Hielo',
        coverImageUrl: 'https://images.unsplash.com/issue-cover.jpg',
      },
      magazine: {
        id: 10,
        name: 'National Geographic',
        publisher: 'National Geographic Society',
        country: 'Estados Unidos',
        description: 'Revista de exploración y ciencia.',
        coverImageUrl: 'https://images.unsplash.com/mag-cover.jpg',
      },
    };

    const article = ArticleMapper.toDomain(rawRow);

    expect(article.id).toBe(1);
    expect(article.title).toBe('Exploración en Svalbard');
    expect(article.subtitle).toBe('Fiordos y osos polares');
    expect(article.author).toBe('Fridtjof Nansen');
    expect(article.photographer).toBe('Juho Karhu');
    expect(article.startPage).toBe(14);
    expect(article.endPage).toBe(32);
    expect(article.city).toBe('Longyearbyen');
    expect(article.region).toBe('Svalbard');
    expect(article.country).toBe('Noruega');
    expect(article.getLocation()).toBe('Longyearbyen · Noruega');
    expect(article.tags).toEqual(['Ártico', 'Glaciares', 'Fauna']);
    expect(article.featured).toBe(true);
    expect(article.coverImageUrl).toBe('https://images.unsplash.com/custom-cover.jpg');
    expect(article.issue.magazineName).toBe('National Geographic');
  });

  it('handles null and fallback values from joined tables correctly', () => {
    const rawRow: RawDatabaseArticleJoined = {
      article: {
        id: 2,
        magazineId: 10,
        issueId: 21,
        title: 'Ruta de la Seda en Samarcanda',
        subtitle: null,
        author: null,
        photographer: null,
        startPage: 40,
        endPage: 50,
        city: null,
        region: null,
        country: 'Uzbekistán',
        locationSearchIndex: 'samarcanda uzbekistan',
        synopsis: 'Mosaicos de cúpulas turquesas y caravanas históricas.',
        tags: null,
        featured: null,
        coverImageUrl: null,
        createdAt: null,
      },
      issue: {
        id: 21,
        magazineId: 10,
        issueNumber: '406',
        year: 2023,
        month: null,
        volume: null,
        title: null,
        coverImageUrl: null,
      },
      magazine: {
        id: 10,
        name: 'Altaïr Magazine',
        publisher: null,
        country: null,
        description: null,
        coverImageUrl: 'https://images.unsplash.com/fallback-mag.jpg',
      },
    };

    const article = ArticleMapper.toDomain(rawRow);

    expect(article.id).toBe(2);
    expect(article.city).toBeUndefined();
    expect(article.region).toBeUndefined();
    expect(article.country).toBe('Uzbekistán');
    expect(article.getLocation()).toBe('Uzbekistán');
    expect(article.tags).toEqual([]);
    expect(article.featured).toBe(false);
    expect(article.coverImageUrl).toBe('https://images.unsplash.com/fallback-mag.jpg');
  });
});
