import { describe, it, expect } from 'vitest';
import { Article } from './Article.ts';
import { Topic } from './Topic.ts';
import { MagazineIssue } from './MagazineIssue.ts';

describe('Article Aggregate Root', () => {
  const sampleTopic = Topic.create({
    name: 'Machu Picchu',
    subtopic: 'Cusco',
    category: 'Perú',
  });

  const sampleIssue = MagazineIssue.create({
    id: 1,
    magazineId: 10,
    magazineName: 'Viajes National Geographic',
    issueNumber: '150',
    year: 2021,
    month: 'Mayo',
    volume: 'Vol. 12',
    coverImageUrl: 'https://images.example.com/issue-cover.jpg',
  });

  describe('Creation and Invariants', () => {
    it('creates a valid Article with minimal valid properties', () => {
      const article = Article.create({
        id: 101,
        title: 'El Enigma de los Incas',
        startPage: 34,
        endPage: 48,
        topic: sampleTopic,
        issue: sampleIssue,
        synopsis: 'Un recorrido detallado por la ciudadela sagrada de los incas.',
      });

      expect(article.id).toBe(101);
      expect(article.title).toBe('El Enigma de los Incas');
      expect(article.subtitle).toBeUndefined();
      expect(article.author).toBeUndefined();
      expect(article.photographer).toBeUndefined();
      expect(article.startPage).toBe(34);
      expect(article.endPage).toBe(48);
      expect(article.topic).toBe(sampleTopic);
      expect(article.issue).toBe(sampleIssue);
      expect(article.synopsis).toBe(
        'Un recorrido detallado por la ciudadela sagrada de los incas.'
      );
      expect(article.tags).toEqual([]);
      expect(article.featured).toBe(false);
      expect(article.coverImageUrl).toBeUndefined();
      expect(article.createdAt).toBeUndefined();
    });

    it('creates a valid Article with all optional fields and trims whitespace', () => {
      const date = new Date('2021-05-01');
      const article = Article.create({
        id: 102,
        title: '  Tesoros del Nilo  ',
        subtitle: '  Templos y tumbas  ',
        author: '  Howard Carter  ',
        photographer: '  Harry Burton  ',
        startPage: 12,
        endPage: 25,
        topic: sampleTopic,
        issue: sampleIssue,
        synopsis: '  Exploración arqueológica del Valle de los Reyes en Luxor.  ',
        tags: ['Arqueología', 'Egipto', 'Historia'],
        featured: true,
        coverImageUrl: '  https://images.example.com/article-cover.jpg  ',
        createdAt: date,
      });

      expect(article.title).toBe('Tesoros del Nilo');
      expect(article.subtitle).toBe('Templos y tumbas');
      expect(article.author).toBe('Howard Carter');
      expect(article.photographer).toBe('Harry Burton');
      expect(article.tags).toEqual(['Arqueología', 'Egipto', 'Historia']);
      expect(article.featured).toBe(true);
      expect(article.coverImageUrl).toBe('https://images.example.com/article-cover.jpg');
      expect(article.createdAt).toBe(date);
    });

    it('throws error when title is shorter than 3 characters or empty', () => {
      expect(() =>
        Article.create({
          id: 1,
          title: '  ',
          startPage: 1,
          endPage: 5,
          topic: sampleTopic,
          issue: sampleIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: Title must be at least 3 characters long.');

      expect(() =>
        Article.create({
          id: 1,
          title: 'ab',
          startPage: 1,
          endPage: 5,
          topic: sampleTopic,
          issue: sampleIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: Title must be at least 3 characters long.');
    });

    it('throws error when startPage is not a positive integer >= 1', () => {
      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 0,
          endPage: 5,
          topic: sampleTopic,
          issue: sampleIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: startPage must be a positive integer greater than or equal to 1.');

      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 1.5,
          endPage: 5,
          topic: sampleTopic,
          issue: sampleIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: startPage must be a positive integer greater than or equal to 1.');
    });

    it('throws error when endPage is less than startPage or not an integer', () => {
      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 10,
          endPage: 9,
          topic: sampleTopic,
          issue: sampleIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: endPage must be greater than or equal to startPage.');

      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 10,
          endPage: 12.3,
          topic: sampleTopic,
          issue: sampleIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: endPage must be greater than or equal to startPage.');
    });

    it('throws error when topic is invalid or not an instance of Topic', () => {
      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 1,
          endPage: 5,
          topic: null as unknown as Topic,
          issue: sampleIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: Article must have a valid Topic Value Object.');

      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 1,
          endPage: 5,
          topic: { name: 'Falso' } as unknown as Topic,
          issue: sampleIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: Article must have a valid Topic Value Object.');
    });

    it('throws error when issue is invalid or not an instance of MagazineIssue', () => {
      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 1,
          endPage: 5,
          topic: sampleTopic,
          issue: null as unknown as MagazineIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: Article must be associated with a valid MagazineIssue Entity.');

      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 1,
          endPage: 5,
          topic: sampleTopic,
          issue: { id: 1 } as unknown as MagazineIssue,
          synopsis: 'Sinopsis suficientemente larga para pasar el validador.',
        })
      ).toThrow('Article invariant violation: Article must be associated with a valid MagazineIssue Entity.');
    });

    it('throws error when synopsis is shorter than 10 characters or empty', () => {
      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 1,
          endPage: 5,
          topic: sampleTopic,
          issue: sampleIssue,
          synopsis: 'Corta',
        })
      ).toThrow('Article invariant violation: Synopsis must be at least 10 characters long.');

      expect(() =>
        Article.create({
          id: 1,
          title: 'Título Válido',
          startPage: 1,
          endPage: 5,
          topic: sampleTopic,
          issue: sampleIssue,
          synopsis: '          ',
        })
      ).toThrow('Article invariant violation: Synopsis must be at least 10 characters long.');
    });
  });

  describe('Page Metrics and Citation Formats', () => {
    it('calculates page count correctly for multiple pages', () => {
      const article = Article.create({
        id: 1,
        title: 'Explorando Islandia',
        startPage: 10,
        endPage: 25,
        topic: sampleTopic,
        issue: sampleIssue,
        synopsis: 'Ruta completa por cascadas y glaciares nórdicos.',
      });

      expect(article.getPageCount()).toBe(16);
      expect(article.getPageCitation()).toBe('pp. 10–25');
    });

    it('formats single page citation as "p. X"', () => {
      const article = Article.create({
        id: 2,
        title: 'Rincón Gastronómico',
        startPage: 42,
        endPage: 42,
        topic: sampleTopic,
        issue: sampleIssue,
        synopsis: 'Una página de recomendaciones culinarias locales.',
      });

      expect(article.getPageCount()).toBe(1);
      expect(article.getPageCitation()).toBe('p. 42');
    });

    it('generates full catalog reference combining issue citation and pages', () => {
      const article = Article.create({
        id: 3,
        title: 'Misterios de Creta',
        startPage: 14,
        endPage: 22,
        topic: sampleTopic,
        issue: sampleIssue,
        synopsis: 'El palacio de Cnosos y la leyenda del laberinto del Minotauro.',
      });

      expect(article.getCatalogReference()).toBe(
        'Viajes National Geographic · Vol. 12, Nº 150 (Mayo 2021) · pp. 14–22'
      );
    });
  });

  describe('Topic Search and DTO Mapping', () => {
    it('delegates matchesTopic to Topic value object', () => {
      const article = Article.create({
        id: 4,
        title: 'Crónica del Machu Picchu',
        startPage: 1,
        endPage: 10,
        topic: sampleTopic,
        issue: sampleIssue,
        synopsis: 'Detalles de la expedición por el Camino Inca.',
      });

      expect(article.matchesTopic('machu picchu')).toBe(true);
      expect(article.matchesTopic('cusco')).toBe(true);
      expect(article.matchesTopic('peru')).toBe(true);
      expect(article.matchesTopic('tokio')).toBe(false);
    });

    it('maps article correctly to DTO using issue cover image fallback when article has none', () => {
      const article = Article.create({
        id: 5,
        title: 'Selva Amazónica',
        startPage: 50,
        endPage: 60,
        topic: sampleTopic,
        issue: sampleIssue,
        synopsis: 'Expedición en canoa por el río Madre de Dios.',
      });

      const dto = article.toDTO();

      expect(dto).toEqual({
        id: 5,
        title: 'Selva Amazónica',
        subtitle: undefined,
        author: undefined,
        photographer: undefined,
        startPage: 50,
        endPage: 60,
        pageCount: 11,
        pageCitation: 'pp. 50–60',
        topic: {
          name: 'Machu Picchu',
          category: 'Perú',
          subtopic: 'Cusco',
          formatted: "Machu Picchu · Cusco · Perú",
        },
        magazine: {
          id: 10,
          name: 'Viajes National Geographic',
          issueNumber: '150',
          year: 2021,
          month: 'Mayo',
          fullCitation: 'Viajes National Geographic · Vol. 12, Nº 150 (Mayo 2021)',
          coverImageUrl: 'https://images.example.com/issue-cover.jpg',
        },
        synopsis: 'Expedición en canoa por el río Madre de Dios.',
        tags: [],
        featured: false,
        coverImageUrl: 'https://images.example.com/issue-cover.jpg',
        catalogReference: 'Viajes National Geographic · Vol. 12, Nº 150 (Mayo 2021) · pp. 50–60',
      });
    });

    it('maps article to DTO with explicit cover image overriding issue cover image', () => {
      const article = Article.create({
        id: 6,
        title: 'Selva Amazónica Especial',
        startPage: 50,
        endPage: 60,
        topic: sampleTopic,
        issue: sampleIssue,
        synopsis: 'Expedición en canoa por el río Madre de Dios.',
        coverImageUrl: 'https://images.example.com/custom-article-cover.jpg',
      });

      const dto = article.toDTO();
      expect(dto.coverImageUrl).toBe('https://images.example.com/custom-article-cover.jpg');
    });
  });
});
