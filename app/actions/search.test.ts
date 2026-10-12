import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  searchArticlesAction,
  getCatalogOverviewAction,
  getArticleDetailAction,
} from './search.ts';
import { SearchArticlesByTopicUseCase } from '@/src/modules/travel-catalog/application/SearchArticlesByTopicUseCase.ts';
import { GetCatalogOverviewUseCase } from '@/src/modules/travel-catalog/application/GetCatalogOverviewUseCase.ts';
import { PostgresArticleRepository } from '@/src/modules/travel-catalog/infrastructure/PostgresArticleRepository.ts';
import { Article } from '@/src/modules/travel-catalog/domain/Article.ts';
import { Topic } from '@/src/modules/travel-catalog/domain/Topic.ts';
import { MagazineIssue } from '@/src/modules/travel-catalog/domain/MagazineIssue.ts';

describe('Server Actions: search.ts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchArticlesAction', () => {
    it('calls use case with params and returns response', async () => {
      const mockResult = {
        success: true,
        query: 'Petra',
        articles: [],
        total: 0,
        matchedTopics: [],
        isEmpty: true,
      };

      vi.spyOn(SearchArticlesByTopicUseCase.prototype, 'execute').mockResolvedValueOnce(mockResult);

      const response = await searchArticlesAction({ query: 'Petra', magazineId: 1, year: 2020 });
      expect(response).toEqual(mockResult);
    });

    it('defaults query to empty string when falsy', async () => {
      const mockResult = {
        success: true,
        query: '',
        articles: [],
        total: 0,
        matchedTopics: [],
        isEmpty: true,
      };

      const spy = vi.spyOn(SearchArticlesByTopicUseCase.prototype, 'execute').mockResolvedValueOnce(mockResult);

      const response = await searchArticlesAction({ query: '' });
      expect(response).toEqual(mockResult);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ query: '' }));
    });

    it('catches errors and returns failure response', async () => {
      vi.spyOn(SearchArticlesByTopicUseCase.prototype, 'execute').mockRejectedValueOnce(
        new Error('Database error')
      );

      const response = await searchArticlesAction({ query: 'ErrorTest' });
      expect(response).toEqual({
        success: false,
        query: 'ErrorTest',
        articles: [],
        total: 0,
        matchedTopics: [],
        isEmpty: true,
      });
    });
  });

  describe('getCatalogOverviewAction', () => {
    it('calls use case and returns overview data', async () => {
      const mockOverview = {
        magazines: [{ id: 1, name: 'NatGeo', issuesCount: 10, articlesCount: 50 }],
        featuredArticles: [],
        popularTopics: ['Kioto · Japón'],
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
        popularTopics: [],
      });
    });
  });

  describe('getArticleDetailAction', () => {
    it('returns article DTO when article is found', async () => {
      const topic = Topic.create({ name: 'Petra', category: 'Jordania' });
      const issue = MagazineIssue.create({
        id: 1,
        magazineId: 1,
        magazineName: 'NatGeo',
        issueNumber: '10',
        year: 2020,
      });
      const article = Article.create({
        id: 42,
        title: 'Petra Revelada',
        startPage: 10,
        endPage: 20,
        topic,
        issue,
        synopsis: 'La ciudad esculpida en la roca rosada.',
      });

      vi.spyOn(PostgresArticleRepository.prototype, 'findById').mockResolvedValueOnce(article);

      const result = await getArticleDetailAction(42);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(42);
      expect(result?.title).toBe('Petra Revelada');
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
