import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostgresArticleRepository } from './PostgresArticleRepository.ts';
import { db } from '../../../db/index.ts';

vi.mock('../../../db/index.ts', () => ({
  db: {
    select: vi.fn(),
    selectDistinct: vi.fn(),
  },
}));

describe('PostgresArticleRepository', () => {
  let repository: PostgresArticleRepository;

  const mockDbArticle = {
    id: 1,
    magazineId: 10,
    issueId: 20,
    title: 'Crónicas de Roma',
    subtitle: 'La Ciudad Eterna',
    author: 'Enrique Gómez',
    photographer: 'Alberto Rossi',
    startPage: 12,
    endPage: 28,
    city: 'Roma',
    region: 'Lacio',
    country: 'Italia',
    locationSearchIndex: 'roma lacio italia',
    synopsis: 'Paseo por los monumentos y callejones de Roma.',
    tags: 'Historia, Monumentos',
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/rome.jpg',
    createdAt: new Date('2022-05-01'),
  };

  const mockDbIssue = {
    id: 20,
    magazineId: 10,
    issueNumber: '105',
    year: 2022,
    month: 'Mayo',
    volume: 'Vol. 10',
    title: 'Ciudades Clásicas',
    coverImageUrl: 'https://images.unsplash.com/issue.jpg',
  };

  const mockDbMagazine = {
    id: 10,
    name: 'National Geographic',
    publisher: 'NG Society',
    country: 'USA',
    description: 'Revista de divulgación.',
    coverImageUrl: 'https://images.unsplash.com/natgeo.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PostgresArticleRepository();
  });

  describe('searchArticles', () => {
    it('executes search with query, magazineId, year filters and returns mapped articles and total count', async () => {
      const mockRows = [
        {
          article: mockDbArticle,
          issue: mockDbIssue,
          magazine: mockDbMagazine,
        },
      ];

      const mockOffset = vi.fn().mockResolvedValue(mockRows);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin2 = vi.fn().mockReturnValue({ where: mockWhere });
      const mockInnerJoin1 = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin2 });
      const mockFromArticles = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin1 });

      const mockCountWhere = vi.fn().mockResolvedValue([{ count: 1 }]);
      const mockCountInnerJoin2 = vi.fn().mockReturnValue({ where: mockCountWhere });
      const mockCountInnerJoin1 = vi.fn().mockReturnValue({ innerJoin: mockCountInnerJoin2 });
      const mockCountFrom = vi.fn().mockReturnValue({ innerJoin: mockCountInnerJoin1 });

      vi.mocked(db.select)
        .mockReturnValueOnce({ from: mockFromArticles } as any)
        .mockReturnValueOnce({ from: mockCountFrom } as any);

      const result = await repository.searchArticles({
        query: 'Roma',
        magazineId: 10,
        year: 2022,
        limit: 10,
        offset: 0,
      });

      expect(result.articles.length).toBe(1);
      expect(result.articles[0].title).toBe('Crónicas de Roma');
      expect(result.articles[0].getLocation()).toBe('Roma · Italia');
      expect(result.totalCount).toBe(1);
    });

    it('executes search without any filters when query is empty string or undefined', async () => {
      const mockRows = [
        {
          article: mockDbArticle,
          issue: mockDbIssue,
          magazine: mockDbMagazine,
        },
      ];

      const mockOffset = vi.fn().mockResolvedValue(mockRows);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin2 = vi.fn().mockReturnValue({ where: mockWhere });
      const mockInnerJoin1 = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin2 });
      const mockFromArticles = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin1 });

      const mockCountWhere = vi.fn().mockResolvedValue([]);
      const mockCountInnerJoin2 = vi.fn().mockReturnValue({ where: mockCountWhere });
      const mockCountInnerJoin1 = vi.fn().mockReturnValue({ innerJoin: mockCountInnerJoin2 });
      const mockCountFrom = vi.fn().mockReturnValue({ innerJoin: mockCountInnerJoin1 });

      vi.mocked(db.select)
        .mockReturnValueOnce({ from: mockFromArticles } as any)
        .mockReturnValueOnce({ from: mockCountFrom } as any);

      const result = await repository.searchArticles({
        query: '',
      });

      expect(result.articles.length).toBe(1);
      expect(result.totalCount).toBe(1);
    });

    it('throws domain error when query fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });

      await expect(repository.searchArticles({ query: 'test' })).rejects.toThrow(
        'Error al consultar el catálogo de artículos.'
      );
    });
  });

  describe('findById', () => {
    it('returns domain article when found by ID', async () => {
      const mockRows = [
        {
          article: mockDbArticle,
          issue: mockDbIssue,
          magazine: mockDbMagazine,
        },
      ];

      const mockLimit = vi.fn().mockResolvedValue(mockRows);
      const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockInnerJoin2 = vi.fn().mockReturnValue({ where: mockWhere });
      const mockInnerJoin1 = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin2 });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin1 });

      vi.mocked(db.select).mockReturnValueOnce({ from: mockFrom } as any);

      const article = await repository.findById(1);

      expect(article).not.toBeNull();
      expect(article?.id).toBe(1);
      expect(article?.title).toBe('Crónicas de Roma');
    });

    it('returns null when article is not found', async () => {
      const mockLimit = vi.fn().mockResolvedValue([]);
      const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockInnerJoin2 = vi.fn().mockReturnValue({ where: mockWhere });
      const mockInnerJoin1 = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin2 });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin1 });

      vi.mocked(db.select).mockReturnValueOnce({ from: mockFrom } as any);

      const article = await repository.findById(999);
      expect(article).toBeNull();
    });

    it('throws domain error when query by id fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Timeout error');
      });

      await expect(repository.findById(1)).rejects.toThrow(
        'Error al recuperar el artículo con ID 1.'
      );
    });
  });

  describe('findFeatured', () => {
    it('returns list of featured articles', async () => {
      const mockRows = [
        {
          article: mockDbArticle,
          issue: mockDbIssue,
          magazine: mockDbMagazine,
        },
      ];

      const mockLimit = vi.fn().mockResolvedValue(mockRows);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockInnerJoin2 = vi.fn().mockReturnValue({ where: mockWhere });
      const mockInnerJoin1 = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin2 });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin1 });

      vi.mocked(db.select).mockReturnValueOnce({ from: mockFrom } as any);

      const articles = await repository.findFeatured(5);
      expect(articles.length).toBe(1);
      expect(articles[0].featured).toBe(true);
    });

    it('throws domain error when findFeatured fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Connection error');
      });

      await expect(repository.findFeatured()).rejects.toThrow(
        'Error al recuperar artículos destacados.'
      );
    });
  });

  describe('getMagazines', () => {
    it('returns magazine summaries with issues and articles count', async () => {
      const mockMagazines = [
        {
          id: 1,
          name: 'Altaïr',
          publisher: 'Altaïr Editores',
          country: 'España',
          description: 'Revista de viajes y crónicas.',
          coverImageUrl: 'https://images.unsplash.com/altair.jpg',
        },
      ];

      const mockOrderBy = vi.fn().mockResolvedValue(mockMagazines);
      const mockFromMags = vi.fn().mockReturnValue({ orderBy: mockOrderBy });

      const mockIssuesWhere = vi.fn().mockResolvedValue([{ count: 12 }]);
      const mockIssuesFrom = vi.fn().mockReturnValue({ where: mockIssuesWhere });

      const mockArticlesWhere = vi.fn().mockResolvedValue([{ count: 48 }]);
      const mockArticlesFrom = vi.fn().mockReturnValue({ where: mockArticlesWhere });

      vi.mocked(db.select)
        .mockReturnValueOnce({ from: mockFromMags } as any)
        .mockReturnValueOnce({ from: mockIssuesFrom } as any)
        .mockReturnValueOnce({ from: mockArticlesFrom } as any);

      const summaries = await repository.getMagazines();

      expect(summaries.length).toBe(1);
      expect(summaries[0].name).toBe('Altaïr');
      expect(summaries[0].issuesCount).toBe(12);
      expect(summaries[0].articlesCount).toBe(48);
    });

    it('throws domain error when getMagazines fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Connection timeout');
      });

      await expect(repository.getMagazines()).rejects.toThrow(
        'Error al consultar el catálogo de revistas.'
      );
    });
  });

  describe('getPopularDestinations', () => {
    it('returns formatted distinct destinations', async () => {
      const mockDistinctRows = [
        { city: 'Kioto', region: 'Kansai', country: 'Japón' },
        { city: null, region: 'Patagonia', country: 'Argentina' },
        { city: null, region: null, country: 'Islandia' },
      ];

      const mockLimit = vi.fn().mockResolvedValue(mockDistinctRows);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });

      vi.mocked(db.selectDistinct).mockReturnValueOnce({ from: mockFrom } as any);

      const destinations = await repository.getPopularDestinations();

      expect(destinations.length).toBe(3);
      expect(destinations[0]).toBe('Kioto · Japón');
      expect(destinations[1]).toBe('Patagonia · Argentina');
      expect(destinations[2]).toBe('Islandia');
    });

    it('throws domain error when getPopularDestinations fails', async () => {
      vi.mocked(db.selectDistinct).mockImplementationOnce(() => {
        throw new Error('Failed to query distinct');
      });

      await expect(repository.getPopularDestinations()).rejects.toThrow(
        'Error al consultar los destinos del catálogo.'
      );
    });
  });
});
