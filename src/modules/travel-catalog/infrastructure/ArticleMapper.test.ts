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
        startPage: 14,
        endPage: 32,
        synopsis: 'Expedición ártica en los confines septentrionales de Europa.',
        tags: 'Ártico, Glaciares, Fauna',
        featured: true,
        createdAt: new Date('2022-01-15T00:00:00Z'),
      },
      issue: {
        id: 20,
        magazineId: 10,
        issueNumber: '405',
        year: 2022,
        month: 3,
        title: 'Mares de Hielo',
        coverImageUrl: 'https://images.unsplash.com/issue-cover.jpg',
      },
      magazine: {
        id: 10,
        name: 'National Geographic',
        publisher: 'National Geographic Society',
        country: 'Estados Unidos',
      },
    };

    const article = ArticleMapper.toDomain(rawRow);

    expect(article.id).toBe(1);
    expect(article.title).toBe('Exploración en Svalbard');
    expect(article.subtitle).toBe('Fiordos y osos polares');
    expect(article.author).toBe('Fridtjof Nansen');
    expect(article.startPage).toBe(14);
    expect(article.endPage).toBe(32);
    expect(article.tags).toEqual(['Ártico', 'Glaciares', 'Fauna']);
    expect(article.featured).toBe(true);
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
        startPage: 40,
        endPage: 50,
        synopsis: 'Mosaicos de cúpulas turquesas y caravanas históricas.',
        tags: null,
        featured: null,
        createdAt: null,
      },
      issue: {
        id: 21,
        magazineId: 10,
        issueNumber: '406',
        year: 2023,
        month: null,
        title: null,
        coverImageUrl: null,
      },
      magazine: {
        id: 10,
        name: 'Altaïr Magazine',
        publisher: null,
        country: null,
      },
    };

    const article = ArticleMapper.toDomain(rawRow);

    expect(article.id).toBe(2);
    expect(article.tags).toEqual([]);
    expect(article.featured).toBe(false);
  });
});
