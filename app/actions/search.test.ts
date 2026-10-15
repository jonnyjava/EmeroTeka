import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  searchArticlesAction,
  getCatalogOverviewAction,
  getArticleDetailAction,
} from './search.ts';
import { SearchArticlesUseCase } from '@/src/modules/travel-catalog/application/SearchArticlesUseCase.ts';
import { GetCatalogOverviewUseCase } from '@/src/modules/travel-catalog/application/GetCatalogOverviewUseCase.ts';
import { PostgresArticleRepository } from '@/src/modules/travel-catalog/infrastructure/PostgresArticleRepository.ts';
import { Article } from '@/src/modules/travel-catalog/domain/Article.ts';
import { MagazineIssue } from '@/src/modules/travel-catalog/domain/MagazineIssue.ts';

describe('Server Actions: search.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchArticlesAction', () => {
    it('calls SearchArticlesUseCase and returns successful response', async () => {
      const mockResult = {
        success: true,
        query: 'Petra',
        articles: [],
        total: 0,
        matchedDestinations: [],
        isEmpty: true,
      };

      vi.spyOn(SearchArticlesUseCase.prototype, 'execute').mockResolvedValueOnce(mockResult);

      const response = await searchArticlesAction({
        query: 'Petra',
        magazineId: 1,
        year: 2020,
      });

      expect(response).toEqual(mockResult);
      expect(SearchArticlesUseCase.prototype.execute).toHaveBeenCalledWith({
        query: 'Petra',
        magazineId: 1,
        year: 2020,
        limit: 30,
      });
    });

    it('catches errors and returns failure response', async () => {
      vi.spyOn(SearchArticlesUseCase.prototype, 'execute').mockRejectedValueOnce(
        new Error('Database error')
      );

      const response = await searchArticlesAction({
        query: 'ErrorCase',
      });

      expect(response).toEqual({
        success: false,
        query: 'ErrorCase',
        articles: [],
        total: 0,
        matchedDestinations: [],
        isEmpty: true,
      });
    });

    it('handles falsy query gracefully by passing empty string', async () => {
      const mockResult = {
        success: true,
        query: '',
        articles: [],
        total: 0,
        matchedDestinations: [],
        isEmpty: true,
      };

      vi.spyOn(SearchArticlesUseCase.prototype, 'execute').mockResolvedValueOnce(mockResult);

      const response = await searchArticlesAction({
        query: '',
      });

      expect(response.success).toBe(true);
      expect(SearchArticlesUseCase.prototype.execute).toHaveBeenCalledWith({
        query: '',
        magazineId: undefined,
        year: undefined,
        limit: 30,
      });
    });
  });

  describe('getCatalogOverviewAction', () => {
    it('calls GetCatalogOverviewUseCase and returns overview response', async () => {
      const mockOverview = {
        magazines: [],
        featuredArticles: [],
        popularDestinations: ['Kioto · Japón'],
      };

      vi.spyOn(GetCatalogOverviewUseCase.prototype, 'execute').mockResolvedValueOnce(mockOverview);

      const response = await getCatalogOverviewAction();
      expect(response).toEqual(mockOverview);
    });

    it('catches errors and returns empty overview', async () => {
      vi.spyOn(GetCatalogOverviewUseCase.prototype, 'execute').mockRejectedValueOnce(
        new Error('Failed overview')
      );

      const response = await getCatalogOverviewAction();
      expect(response).toEqual({
        magazines: [],
        featuredArticles: [],
        popularDestinations: [],
      });
    });
  });

  describe('getArticleDetailAction', () => {
    const sampleIssue = MagazineIssue.create({
      id: 1,
      magazineId: 2,
      magazineName: 'Altaïr',
      issueNumber: '50',
      year: 2021,
    });

    const sampleArticle = Article.create({
      id: 123,
      title: 'Mares del Sur',
      startPage: 10,
      endPage: 20,
      issue: sampleIssue,
      synopsis: 'Navegaciones por los atolones de coral.',
    });

    it('returns article DTO when article exists', async () => {
      vi.spyOn(PostgresArticleRepository.prototype, 'findById').mockResolvedValueOnce(sampleArticle);

      const result = await getArticleDetailAction(123);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(123);
      expect(result?.title).toBe('Mares del Sur');
    });

    it('returns null when article is not found', async () => {
      vi.spyOn(PostgresArticleRepository.prototype, 'findById').mockResolvedValueOnce(null);

      const result = await getArticleDetailAction(999);
      expect(result).toBeNull();
    });

    it('catches errors and returns null', async () => {
      vi.spyOn(PostgresArticleRepository.prototype, 'findById').mockRejectedValueOnce(
        new Error('Database error')
      );

      const result = await getArticleDetailAction(123);
      expect(result).toBeNull();
    });
  });
});
