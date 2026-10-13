import { describe, it, expect, vi } from 'vitest';
import { SearchArticlesUseCase } from './SearchArticlesUseCase.ts';
import { IArticleRepository } from '../domain/IArticleRepository.ts';
import { Article } from '../domain/Article.ts';
import { MagazineIssue } from '../domain/MagazineIssue.ts';

describe('SearchArticlesUseCase Application Service', () => {
  const sampleIssue = MagazineIssue.create({
    id: 1,
    magazineId: 10,
    magazineName: 'National Geographic',
    issueNumber: '100',
    year: 2022,
  });

  const article1 = Article.create({
    id: 1,
    title: 'Roma Antigua y Monumental',
    startPage: 10,
    endPage: 25,
    city: 'Roma',
    country: 'Italia',
    issue: sampleIssue,
    synopsis: 'Exploración del Foro Romano y el Coliseo.',
  });

  const article2 = Article.create({
    id: 2,
    title: 'Secretos del Vaticano',
    startPage: 30,
    endPage: 40,
    city: 'Roma',
    country: 'Italia',
    issue: sampleIssue,
    synopsis: 'Arte y misterios en la basílica de San Pedro.',
  });

  const article3 = Article.create({
    id: 3,
    title: 'Florencia Renacentista',
    startPage: 42,
    endPage: 50,
    city: 'Florencia',
    country: 'Italia',
    issue: sampleIssue,
    synopsis: 'La cuna del Renacimiento y la Galería Uffizi.',
  });

  it('searches articles and returns mapped DTOs with deduplicated destinations', async () => {
    const mockRepo: IArticleRepository = {
      searchArticles: vi.fn().mockResolvedValue({
        articles: [article1, article2, article3],
        totalCount: 3,
      }),
      findById: vi.fn(),
      findFeatured: vi.fn(),
      getMagazines: vi.fn(),
      getPopularDestinations: vi.fn(),
    };

    const useCase = new SearchArticlesUseCase(mockRepo);
    const response = await useCase.execute({
      query: 'Italia',
      magazineId: 10,
      year: 2022,
      limit: 15,
      offset: 0,
    });

    expect(response.success).toBe(true);
    expect(response.query).toBe('Italia');
    expect(response.total).toBe(3);
    expect(response.articles.length).toBe(3);
    expect(response.isEmpty).toBe(false);

    expect(response.matchedDestinations).toEqual(['Roma · Italia', 'Florencia · Italia']);
    expect(mockRepo.searchArticles).toHaveBeenCalledWith({
      query: 'Italia',
      magazineId: 10,
      year: 2022,
      limit: 15,
      offset: 0,
    });
  });

  it('clamps limit to maximum 100 and minimum 1, defaults offset to 0', async () => {
    const mockRepo: IArticleRepository = {
      searchArticles: vi.fn().mockResolvedValue({ articles: [], totalCount: 0 }),
      findById: vi.fn(),
      findFeatured: vi.fn(),
      getMagazines: vi.fn(),
      getPopularDestinations: vi.fn(),
    };

    const useCase = new SearchArticlesUseCase(mockRepo);

    // Over limit test
    await useCase.execute({ query: '   ', limit: 250, offset: -5 });
    expect(mockRepo.searchArticles).toHaveBeenCalledWith({
      query: '',
      magazineId: undefined,
      year: undefined,
      limit: 100,
      offset: 0,
    });

    // Under limit test
    await useCase.execute({ query: 'Kyoto', limit: 0 });
    expect(mockRepo.searchArticles).toHaveBeenCalledWith({
      query: 'Kyoto',
      magazineId: undefined,
      year: undefined,
      limit: 1,
      offset: 0,
    });
  });

  it('handles empty results and returns isEmpty true', async () => {
    const mockRepo: IArticleRepository = {
      searchArticles: vi.fn().mockResolvedValue({ articles: [], totalCount: 0 }),
      findById: vi.fn(),
      findFeatured: vi.fn(),
      getMagazines: vi.fn(),
      getPopularDestinations: vi.fn(),
    };

    const useCase = new SearchArticlesUseCase(mockRepo);
    const response = await useCase.execute({ query: 'Inexistente' });

    expect(response.success).toBe(true);
    expect(response.isEmpty).toBe(true);
    expect(response.articles).toEqual([]);
    expect(response.matchedDestinations).toEqual([]);
  });
});
