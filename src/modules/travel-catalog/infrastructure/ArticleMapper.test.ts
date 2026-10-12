import { describe, it, expect } from 'vitest';
import { ArticleMapper, RawDatabaseArticleJoined } from './ArticleMapper.ts';

describe('ArticleMapper Infrastructure Mapper', () => {
  it('maps complete database row with all fields to domain Article Aggregate Root', () => {
    const raw: RawDatabaseArticleJoined = {
      article: {
        id: 1,
        magazineId: 10,
        issueId: 20,
        title: 'Los Secretos del Nilo',
        subtitle: 'Templos de Abu Simbel',
        author: 'Jean-François Champollion',
        photographer: 'David Roberts',
        startPage: 40,
        endPage: 55,
        city: 'Aswan',
        region: 'Alto Egipto',
        country: 'Egipto',
        locationSearchIndex: 'aswan alto egipto egipto',
        synopsis: 'Un análisis arqueológico y fotográfico de los monumentos faraónicos.',
        tags: 'Arqueología, Nilo, Historia Antigua',
        featured: true,
        coverImageUrl: 'https://images.example.com/article-aswan.jpg',
        createdAt: new Date('2023-01-01'),
      },
      issue: {
        id: 20,
        magazineId: 10,
        issueNumber: '450',
        year: 2021,
        month: 'Marzo',
        volume: 'Vol. 45',
        title: 'Egipto Eterno',
        coverImageUrl: 'https://images.example.com/issue-cover.jpg',
      },
      magazine: {
        id: 10,
        name: 'National Geographic',
        publisher: 'RBA Revistas',
        country: 'España',
        description: 'Revista de exploración y ciencia.',
        coverImageUrl: 'https://images.example.com/mag-cover.jpg',
      },
    };

    const domainArticle = ArticleMapper.toDomain(raw);

    expect(domainArticle.id).toBe(1);
    expect(domainArticle.title).toBe('Los Secretos del Nilo');
    expect(domainArticle.subtitle).toBe('Templos de Abu Simbel');
    expect(domainArticle.author).toBe('Jean-François Champollion');
    expect(domainArticle.photographer).toBe('David Roberts');
    expect(domainArticle.startPage).toBe(40);
    expect(domainArticle.endPage).toBe(55);
    expect(domainArticle.synopsis).toBe(
      'Un análisis arqueológico y fotográfico de los monumentos faraónicos.'
    );
    expect(domainArticle.tags).toEqual(['Arqueología', 'Nilo', 'Historia Antigua']);
    expect(domainArticle.featured).toBe(true);
    expect(domainArticle.coverImageUrl).toBe('https://images.example.com/article-aswan.jpg');

    // Topic verification
    expect(domainArticle.topic.name).toBe('Aswan');
    expect(domainArticle.topic.subtopic).toBe('Alto Egipto');
    expect(domainArticle.topic.category).toBe('Egipto');

    // Issue verification
    expect(domainArticle.issue.id).toBe(20);
    expect(domainArticle.issue.magazineName).toBe('National Geographic');
    expect(domainArticle.issue.issueNumber).toBe('450');
    expect(domainArticle.issue.coverImageUrl).toBe('https://images.example.com/issue-cover.jpg');
  });

  it('maps row with null optional fields and applies correct fallbacks', () => {
    const raw: RawDatabaseArticleJoined = {
      article: {
        id: 2,
        magazineId: 11,
        issueId: 21,
        title: 'Travesía por el Sahara',
        subtitle: null,
        author: null,
        photographer: null,
        startPage: 12,
        endPage: 24,
        city: null, // city is null -> fallback to country
        region: null,
        country: 'Argelia',
        locationSearchIndex: 'argelia',
        synopsis: 'Ruta en caravana por las dunas saharianas y oasis bereberes.',
        tags: null, // tags is null -> empty array
        featured: null, // featured is null -> default false
        coverImageUrl: null, // article cover null -> fallback to issue/mag cover
        createdAt: null,
      },
      issue: {
        id: 21,
        magazineId: 11,
        issueNumber: '12',
        year: 2019,
        month: null,
        volume: null,
        title: null,
        coverImageUrl: null, // issue cover null -> fallback to mag cover
      },
      magazine: {
        id: 11,
        name: 'Altaïr Magazine',
        publisher: null,
        country: null,
        description: null,
        coverImageUrl: 'https://images.example.com/altair-mag-cover.jpg',
      },
    };

    const domainArticle = ArticleMapper.toDomain(raw);

    expect(domainArticle.topic.name).toBe('Argelia'); // fallback
    expect(domainArticle.topic.category).toBe('Argelia');
    expect(domainArticle.topic.subtopic).toBeUndefined();
    expect(domainArticle.tags).toEqual([]);
    expect(domainArticle.featured).toBe(false);
    expect(domainArticle.issue.coverImageUrl).toBe('https://images.example.com/altair-mag-cover.jpg');
    expect(domainArticle.coverImageUrl).toBe('https://images.example.com/altair-mag-cover.jpg');
  });
});
