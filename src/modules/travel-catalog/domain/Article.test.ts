import { describe, it, expect } from 'vitest';
import { Article } from './Article.ts';
import { MagazineIssue } from './MagazineIssue.ts';

describe('Article Aggregate Root', () => {
  const sampleIssue = MagazineIssue.create({
    id: 1,
    magazineId: 10,
    magazineName: 'National Geographic',
    issueNumber: '315',
    year: 2021,
    month: 'Noviembre',
    coverImageUrl: 'https://images.unsplash.com/photo-sample.jpg',
  });

  const validProps = {
    id: 100,
    title: 'Crónicas de los Andes',
    subtitle: 'Viaje a través del Valle Sagrado',
    author: 'Mario Vargas',
    photographer: 'Martin Chambi',
    startPage: 40,
    endPage: 55,
    city: 'Cusco',
    region: 'Valle Sagrado',
    country: 'Perú',
    issue: sampleIssue,
    synopsis: 'Un recorrido detallado por la arquitectura y senderos incas.',
    tags: ['Inca', 'Andes', 'Arqueología'],
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/cover-article.jpg',
    createdAt: new Date('2021-11-01T00:00:00Z'),
  };

  describe('Creation and Invariants', () => {
    it('creates a valid Article instance with full properties', () => {
      const article = Article.create(validProps);

      expect(article.id).toBe(100);
      expect(article.title).toBe('Crónicas de los Andes');
      expect(article.subtitle).toBe('Viaje a través del Valle Sagrado');
      expect(article.author).toBe('Mario Vargas');
      expect(article.photographer).toBe('Martin Chambi');
      expect(article.startPage).toBe(40);
      expect(article.endPage).toBe(55);
      expect(article.city).toBe('Cusco');
      expect(article.region).toBe('Valle Sagrado');
      expect(article.country).toBe('Perú');
      expect(article.issue).toBe(sampleIssue);
      expect(article.synopsis).toBe('Un recorrido detallado por la arquitectura y senderos incas.');
      expect(article.tags).toEqual(['Inca', 'Andes', 'Arqueología']);
      expect(article.featured).toBe(true);
      expect(article.coverImageUrl).toBe('https://images.unsplash.com/cover-article.jpg');
      expect(article.createdAt).toEqual(new Date('2021-11-01T00:00:00Z'));
    });

    it('creates an article with minimal optional fields', () => {
      const article = Article.create({
        id: 101,
        title: 'Ruta Polar',
        startPage: 1,
        endPage: 1,
        country: 'Noruega',
        issue: sampleIssue,
        synopsis: 'Breve crónica sobre navegación entre fiordos.',
      });

      expect(article.subtitle).toBeUndefined();
      expect(article.author).toBeUndefined();
      expect(article.photographer).toBeUndefined();
      expect(article.city).toBeUndefined();
      expect(article.region).toBeUndefined();
      expect(article.country).toBe('Noruega');
      expect(article.tags).toEqual([]);
      expect(article.featured).toBe(false);
      expect(article.coverImageUrl).toBeUndefined();
      expect(article.createdAt).toBeUndefined();
    });

    it('throws error when title is missing or shorter than 3 characters', () => {
      expect(() =>
        Article.create({
          ...validProps,
          title: '',
        })
      ).toThrow('Article invariant violation: Title must be at least 3 characters long.');

      expect(() =>
        Article.create({
          ...validProps,
          title: '  ab  ',
        })
      ).toThrow('Article invariant violation: Title must be at least 3 characters long.');
    });

    it('throws error when startPage is not a positive integer', () => {
      expect(() =>
        Article.create({
          ...validProps,
          startPage: 0,
        })
      ).toThrow('Article invariant violation: startPage must be a positive integer greater than or equal to 1.');

      expect(() =>
        Article.create({
          ...validProps,
          startPage: 2.5,
        })
      ).toThrow('Article invariant violation: startPage must be a positive integer greater than or equal to 1.');
    });

    it('throws error when endPage is less than startPage or not an integer', () => {
      expect(() =>
        Article.create({
          ...validProps,
          startPage: 20,
          endPage: 19,
        })
      ).toThrow('Article invariant violation: endPage must be greater than or equal to startPage.');

      expect(() =>
        Article.create({
          ...validProps,
          startPage: 20,
          endPage: 25.5,
        })
      ).toThrow('Article invariant violation: endPage must be greater than or equal to startPage.');
    });

    it('throws error when country is missing or too short', () => {
      expect(() =>
        Article.create({
          ...validProps,
          country: '',
        })
      ).toThrow('Article invariant violation: Country must be at least 2 characters long.');

      expect(() =>
        Article.create({
          ...validProps,
          country: 'A',
        })
      ).toThrow('Article invariant violation: Country must be at least 2 characters long.');
    });

    it('throws error when issue is missing or invalid', () => {
      expect(() =>
        Article.create({
          ...validProps,
          issue: null as unknown as MagazineIssue,
        })
      ).toThrow('Article invariant violation: Article must be associated with a valid MagazineIssue Entity.');

      expect(() =>
        Article.create({
          ...validProps,
          issue: { id: 1 } as unknown as MagazineIssue,
        })
      ).toThrow('Article invariant violation: Article must be associated with a valid MagazineIssue Entity.');
    });

    it('throws error when synopsis is missing or shorter than 10 characters', () => {
      expect(() =>
        Article.create({
          ...validProps,
          synopsis: '',
        })
      ).toThrow('Article invariant violation: Synopsis must be at least 10 characters long.');

      expect(() =>
        Article.create({
          ...validProps,
          synopsis: 'Corto',
        })
      ).toThrow('Article invariant violation: Synopsis must be at least 10 characters long.');
    });
  });

  describe('Calculated Properties and Citations', () => {
    it('calculates page count correctly for multiple pages and single page', () => {
      const multiPage = Article.create({ ...validProps, startPage: 10, endPage: 25 });
      expect(multiPage.getPageCount()).toBe(16);

      const singlePage = Article.create({ ...validProps, startPage: 5, endPage: 5 });
      expect(singlePage.getPageCount()).toBe(1);
    });

    it('generates correct bibliographic page citations', () => {
      const multiPage = Article.create({ ...validProps, startPage: 12, endPage: 20 });
      expect(multiPage.getPageCitation()).toBe('pp. 12–20');

      const singlePage = Article.create({ ...validProps, startPage: 15, endPage: 15 });
      expect(singlePage.getPageCitation()).toBe('p. 15');
    });

    it('builds full catalog reference combining issue citation and pages', () => {
      const article = Article.create(validProps);
      expect(article.getCatalogReference()).toBe(
        'National Geographic · Nº 315 (Noviembre 2021) · pp. 40–55'
      );
    });

    it('formats location correctly with city, region, or country only', () => {
      const withCity = Article.create({
        ...validProps,
        city: 'Cusco',
        region: 'Andes',
        country: 'Perú',
      });
      expect(withCity.getLocation()).toBe('Cusco · Perú');

      const withRegionOnly = Article.create({
        ...validProps,
        city: undefined,
        region: 'Patagonia',
        country: 'Argentina',
      });
      expect(withRegionOnly.getLocation()).toBe('Patagonia · Argentina');

      const withCountryOnly = Article.create({
        ...validProps,
        city: undefined,
        region: undefined,
        country: 'Japón',
      });
      expect(withCountryOnly.getLocation()).toBe('Japón');
    });

    it('maps correctly to DTO with fallback cover image from issue', () => {
      const articleWithoutCover = Article.create({
        ...validProps,
        coverImageUrl: undefined,
      });

      const dto = articleWithoutCover.toDTO();
      expect(dto.id).toBe(100);
      expect(dto.title).toBe('Crónicas de los Andes');
      expect(dto.location).toBe('Cusco · Perú');
      expect(dto.city).toBe('Cusco');
      expect(dto.region).toBe('Valle Sagrado');
      expect(dto.country).toBe('Perú');
      expect(dto.coverImageUrl).toBe(sampleIssue.coverImageUrl);
      expect(dto.magazine.name).toBe('National Geographic');
      expect(dto.magazine.fullCitation).toBe('National Geographic · Nº 315 (Noviembre 2021)');
    });
  });
});
