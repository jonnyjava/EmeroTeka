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
    startPage: 12,
    endPage: 28,
    synopsis: 'Paseo por los monumentos y callejones de Roma.',
    tags: 'Historia, Monumentos',
    featured: true,
    createdAt: new Date('2022-05-01'),
  };

  const mockDbIssue = {
    id: 20,
    magazineId: 10,
    issueNumber: '105',
    year: 2022,
    month: 'Mayo',
    title: 'Ciudades Clásicas',
    coverImageUrl: 'https://images.unsplash.com/issue.jpg',
  };

  const mockDbMagazine = {
    id: 10,
    name: 'National Geographic',
    publisher: 'NG Society',
    country: 'USA',
    description: 'Revista de divulgación.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PostgresArticleRepository();
  });

  describe('searchArticles', () => {
    it('executes query with join and maps results to domain Article entities', async () => {
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
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin1 });

      const mockCountWhere = vi.fn().mockResolvedValue([{ count: 1 }]);
      const mockCountJoin2 = vi.fn().mockReturnValue({ where: mockCountWhere });
      const mockCountJoin1 = vi.fn().mockReturnValue({ innerJoin: mockCountJoin2 });
      const mockCountFrom = vi.fn().mockReturnValue({ innerJoin: mockCountJoin1 });

      vi.mocked(db.select)
        .mockReturnValueOnce({ from: mockFrom } as unknown as ReturnType<typeof db.select>)
        .mockReturnValueOnce({ from: mockCountFrom } as unknown as ReturnType<typeof db.select>);

      const result = await repository.searchArticles({
        query: 'Roma',
        magazineId: 10,
        year: 2022,
        limit: 10,
        offset: 0,
      });

      expect(result.totalCount).toBe(1);
      expect(result.articles.length).toBe(1);
      expect(result.articles[0].id).toBe(1);
      expect(result.articles[0].title).toBe('Crónicas de Roma');
      expect(result.articles[0].issue.magazineName).toBe('National Geographic');
    });

    it('throws domain error when query fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Database connection failed');
      });

      await expect(
        repository.searchArticles({
          query: 'Test',
        })
      ).rejects.toThrow('Error al consultar el catálogo de artículos.');
    });
  });

  describe('findById', () => {
    it('returns an article when found by ID', async () => {
      const mockRow = {
        article: mockDbArticle,
        issue: mockDbIssue,
        magazine: mockDbMagazine,
      };

      const mockLimit = vi.fn().mockResolvedValue([mockRow]);
      const mockWhere = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockInnerJoin2 = vi.fn().mockReturnValue({ where: mockWhere });
      const mockInnerJoin1 = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin2 });
      const mockFrom = vi.fn().mockReturnValue({ innerJoin: mockInnerJoin1 });

      vi.mocked(db.select).mockReturnValueOnce({ from: mockFrom } as unknown as ReturnType<typeof db.select>);

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

      vi.mocked(db.select).mockReturnValueOnce({ from: mockFrom } as unknown as ReturnType<typeof db.select>);

      const article = await repository.findById(999);
      expect(article).toBeNull();
    });

    it('throws domain error when findById fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Connection lost');
      });

      await expect(repository.findById(1)).rejects.toThrow(
        'Error al recuperar el artículo con ID 1.'
      );
    });
  });

  describe('findFeatured', () => {
    it('returns featured articles', async () => {
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

      vi.mocked(db.select).mockReturnValueOnce({ from: mockFrom } as unknown as ReturnType<typeof db.select>);

      const featured = await repository.findFeatured(5);

      expect(featured.length).toBe(1);
      expect(featured[0].featured).toBe(true);
    });

    it('throws domain error when findFeatured fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Timeout');
      });

      await expect(repository.findFeatured()).rejects.toThrow(
        'Error al recuperar artículos destacados.'
      );
    });
  });

  describe('getMagazines', () => {
    it('returns magazine summaries with issues and articles count', async () => {
      const mockMags = [mockDbMagazine];

      const mockOrderBy = vi.fn().mockResolvedValue(mockMags);
      const mockFromMags = vi.fn().mockReturnValue({ orderBy: mockOrderBy });

      const mockIssuesWhere = vi.fn().mockResolvedValue([{ count: 3 }]);
      const mockIssuesFrom = vi.fn().mockReturnValue({ where: mockIssuesWhere });

      const mockArticlesWhere = vi.fn().mockResolvedValue([{ count: 7 }]);
      const mockArticlesFrom = vi.fn().mockReturnValue({ where: mockArticlesWhere });

      vi.mocked(db.select)
        .mockReturnValueOnce({ from: mockFromMags } as unknown as ReturnType<typeof db.select>)
        .mockReturnValueOnce({ from: mockIssuesFrom } as unknown as ReturnType<typeof db.select>)
        .mockReturnValueOnce({ from: mockArticlesFrom } as unknown as ReturnType<typeof db.select>);

      const summaries = await repository.getMagazines();

      expect(summaries.length).toBe(1);
      expect(summaries[0].id).toBe(10);
      expect(summaries[0].name).toBe('National Geographic');
      expect(summaries[0].issuesCount).toBe(3);
      expect(summaries[0].articlesCount).toBe(7);
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
    it('returns distinct countries from magazines', async () => {
      const mockDistinctRows = [
        { country: 'España' },
        { country: 'Estados Unidos' },
        { country: 'Japón' },
      ];

      const mockLimit = vi.fn().mockResolvedValue(mockDistinctRows);
      const mockOrderBy = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });

      vi.mocked(db.selectDistinct).mockReturnValueOnce({ from: mockFrom } as unknown as ReturnType<typeof db.selectDistinct>);

      const destinations = await repository.getPopularDestinations();

      expect(destinations.length).toBe(3);
      expect(destinations[0]).toBe('España');
      expect(destinations[1]).toBe('Estados Unidos');
      expect(destinations[2]).toBe('Japón');
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
