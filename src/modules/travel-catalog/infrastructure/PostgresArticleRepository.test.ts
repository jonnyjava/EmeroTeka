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
    title: 'Viaje a Kioto',
    subtitle: 'Templos y jardines',
    author: 'Kenji Sato',
    photographer: 'Hiroshi T.',
    startPage: 10,
    endPage: 25,
    city: 'Kioto',
    region: 'Kansai',
    country: 'Japón',
    locationSearchIndex: 'kioto kansai japon',
    synopsis: 'Guía cultural completa de la antigua capital japonesa.',
    tags: 'Templos, Japón, Zen',
    featured: true,
    coverImageUrl: 'https://images.example.com/kioto.jpg',
    createdAt: new Date('2021-01-01'),
  };

  const mockDbIssue = {
    id: 20,
    magazineId: 10,
    issueNumber: '102',
    year: 2021,
    month: 'Abril',
    volume: 'Vol. 10',
    title: 'Especial Asia',
    coverImageUrl: 'https://images.example.com/issue.jpg',
  };

  const mockDbMagazine = {
    id: 10,
    name: 'National Geographic',
    publisher: 'RBA',
    country: 'España',
    description: 'Ciencia y exploración',
    coverImageUrl: 'https://images.example.com/natgeo.jpg',
  };

  const mockJoinedRow = {
    article: mockDbArticle,
    issue: mockDbIssue,
    magazine: mockDbMagazine,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PostgresArticleRepository();
  });

  describe('searchByTopic', () => {
    it('executes search with query, magazineId, and year filters', async () => {
      // Mock chaining for main query
      const mainQueryChain: any = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([mockJoinedRow]),
      };

      // Mock chaining for count query
      const countQueryChain: any = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(db.select)
        .mockReturnValueOnce(mainQueryChain)
        .mockReturnValueOnce(countQueryChain);

      const result = await repository.searchByTopic({
        query: 'Kioto',
        magazineId: 10,
        year: 2021,
        limit: 10,
        offset: 0,
      });

      expect(db.select).toHaveBeenCalledTimes(2);
      expect(result.totalCount).toBe(1);
      expect(result.articles).toHaveLength(1);
      expect(result.articles[0].title).toBe('Viaje a Kioto');
    });

    it('executes search with empty query and default pagination', async () => {
      const mainQueryChain: any = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([]),
      };

      const countQueryChain: any = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]), // no rows returned
      };

      vi.mocked(db.select)
        .mockReturnValueOnce(mainQueryChain)
        .mockReturnValueOnce(countQueryChain);

      const result = await repository.searchByTopic({ query: '' });

      expect(result.totalCount).toBe(0);
      expect(result.articles).toHaveLength(0);
    });

    it('throws domain error when query execution fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Database connection lost');
      });

      await expect(repository.searchByTopic({ query: 'Error' })).rejects.toThrow(
        'No se pudo completar la búsqueda en el catálogo de revistas.'
      );
    });
  });

  describe('findById', () => {
    it('returns domain article when found', async () => {
      const queryChain: any = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockJoinedRow]),
      };

      vi.mocked(db.select).mockReturnValueOnce(queryChain);

      const article = await repository.findById(1);
      expect(article).not.toBeNull();
      expect(article?.id).toBe(1);
      expect(article?.title).toBe('Viaje a Kioto');
    });

    it('returns null when not found', async () => {
      const queryChain: any = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select).mockReturnValueOnce(queryChain);

      const article = await repository.findById(999);
      expect(article).toBeNull();
    });

    it('throws error when database fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Database query failure');
      });

      await expect(repository.findById(1)).rejects.toThrow(
        'Error al recuperar el artículo con identificador 1.'
      );
    });
  });

  describe('findFeatured', () => {
    it('returns array of featured articles', async () => {
      const queryChain: any = {
        from: vi.fn().mockReturnThis(),
        innerJoin: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([mockJoinedRow]),
      };

      vi.mocked(db.select).mockReturnValueOnce(queryChain);

      const articles = await repository.findFeatured(5);
      expect(articles).toHaveLength(1);
      expect(articles[0].id).toBe(1);
    });

    it('throws domain error when query fails', async () => {
      vi.mocked(db.select).mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await expect(repository.findFeatured()).rejects.toThrow(
        'Error al cargar artículos destacados de la base de datos.'
      );
    });
  });

  describe('getMagazines', () => {
    it('retrieves magazine summaries with issue and article counts', async () => {
      const magazinesChain: any = {
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([
          {
            id: 1,
            name: 'National Geographic',
            publisher: 'RBA',
            country: 'España',
            description: 'Exploración',
            coverImageUrl: 'https://images.example.com/natgeo.jpg',
          },
          {
            id: 2,
            name: 'Altaïr',
            publisher: null,
            country: null,
            description: null,
            coverImageUrl: null,
          },
        ]),
      };

      const countChain1: any = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 50 }]),
      };
      const countChain2: any = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 200 }]),
      };
      const countChain3: any = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };
      const countChain4: any = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(db.select)
        .mockReturnValueOnce(magazinesChain)
        .mockReturnValueOnce(countChain1)
        .mockReturnValueOnce(countChain2)
        .mockReturnValueOnce(countChain3)
        .mockReturnValueOnce(countChain4);

      const summaries = await repository.getMagazines();

      expect(summaries).toHaveLength(2);
      expect(summaries[0].name).toBe('National Geographic');
      expect(summaries[0].issuesCount).toBe(50);
      expect(summaries[0].articlesCount).toBe(200);

      expect(summaries[1].name).toBe('Altaïr');
      expect(summaries[1].issuesCount).toBe(0);
      expect(summaries[1].articlesCount).toBe(0);
      expect(summaries[1].publisher).toBeUndefined();
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

  describe('getPopularTopics', () => {
    it('returns unique topic value objects', async () => {
      const distinctChain: any = {
        from: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue([
          { city: 'Kioto', region: 'Kansai', country: 'Japón' },
          { city: null, region: 'Patagonia', country: 'Chile' },
        ]),
      };

      vi.mocked(db.selectDistinct).mockReturnValueOnce(distinctChain);

      const topics = await repository.getPopularTopics();

      expect(topics).toHaveLength(2);
      expect(topics[0].name).toBe('Kioto');
      expect(topics[0].category).toBe('Japón');
      expect(topics[1].name).toBe('Chile');
      expect(topics[1].subtopic).toBe('Patagonia');
    });

    it('throws domain error when getPopularTopics fails', async () => {
      vi.mocked(db.selectDistinct).mockImplementationOnce(() => {
        throw new Error('Failed to query distinct');
      });

      await expect(repository.getPopularTopics()).rejects.toThrow(
        'Error al consultar las temáticas del catálogo.'
      );
    });
  });
});
