import { describe, it, expect, vi } from 'vitest';
import { SearchArticlesByTopicUseCase } from './SearchArticlesByTopicUseCase.ts';
import { IArticleRepository } from '../domain/IArticleRepository.ts';
import { Article } from '../domain/Article.ts';
import { Topic } from '../domain/Topic.ts';
import { MagazineIssue } from '../domain/MagazineIssue.ts';

describe('SearchArticlesByTopicUseCase', () => {
  const topic1 = Topic.create({ name: 'Roma', category: 'Italia' });
  const topic2 = Topic.create({ name: 'Florencia', category: 'Italia' });

  const issue = MagazineIssue.create({
    id: 1,
    magazineId: 1,
    magazineName: 'National Geographic',
    issueNumber: '100',
    year: 2020,
  });

  const article1 = Article.create({
    id: 1,
    title: 'El Coliseo al detalle',
    startPage: 10,
    endPage: 20,
    topic: topic1,
    issue,
    synopsis: 'Secretos de los gladiadores y arquitectura romana.',
  });

  const article2 = Article.create({
    id: 2,
    title: 'El Vaticano y sus museos',
    startPage: 22,
    endPage: 35,
    topic: topic1, // Same topic as article 1 to test deduplication in matchedTopics
    issue,
    synopsis: 'Paseo por las galerías renacentistas de Roma.',
  });

  const article3 = Article.create({
    id: 3,
    title: 'El Renacimiento en la Toscana',
    startPage: 36,
    endPage: 45,
    topic: topic2,
    issue,
    synopsis: 'La cuna del arte italiano entre los Medici y Miguel Ángel.',
  });

  it('searches with default query parameters and maps articles to DTOs', async () => {
    const mockRepo: IArticleRepository = {
      searchByTopic: vi.fn().mockResolvedValue({
        articles: [article1, article2, article3],
        totalCount: 3,
      }),
      findById: vi.fn(),
      findFeatured: vi.fn(),
      getMagazines: vi.fn(),
      getPopularTopics: vi.fn(),
    };

    const useCase = new SearchArticlesByTopicUseCase(mockRepo);
    const response = await useCase.execute({ query: '   ' });

    expect(mockRepo.searchByTopic).toHaveBeenCalledWith({
      query: '',
      magazineId: undefined,
      year: undefined,
      limit: 20,
      offset: 0,
    });

    expect(response.success).toBe(true);
    expect(response.query).toBe('');
    expect(response.total).toBe(3);
    expect(response.articles).toHaveLength(3);
    expect(response.isEmpty).toBe(false);
    // Unique formatted topics extracted (Roma · Italia once, Florencia · Italia once)
    expect(response.matchedTopics).toEqual(['Roma · Italia', 'Florencia · Italia']);
  });

  it('clamps limit to maximum 100 and minimum 1, and clamps negative offset to 0', async () => {
    const mockRepo: IArticleRepository = {
      searchByTopic: vi.fn().mockResolvedValue({
        articles: [],
        totalCount: 0,
      }),
      findById: vi.fn(),
      findFeatured: vi.fn(),
      getMagazines: vi.fn(),
      getPopularTopics: vi.fn(),
    };

    const useCase = new SearchArticlesByTopicUseCase(mockRepo);

    // Limit exceeding 100 and negative offset
    await useCase.execute({
      query: 'Japón',
      limit: 500,
      offset: -10,
      magazineId: 3,
      year: 2019,
    });

    expect(mockRepo.searchByTopic).toHaveBeenCalledWith({
      query: 'Japón',
      magazineId: 3,
      year: 2019,
      limit: 100,
      offset: 0,
    });

    // Limit below 1
    await useCase.execute({
      query: 'Islandia',
      limit: -5,
      offset: 15,
    });

    expect(mockRepo.searchByTopic).toHaveBeenCalledWith({
      query: 'Islandia',
      magazineId: undefined,
      year: undefined,
      limit: 1,
      offset: 15,
    });
  });

  it('handles empty search results cleanly', async () => {
    const mockRepo: IArticleRepository = {
      searchByTopic: vi.fn().mockResolvedValue({
        articles: [],
        totalCount: 0,
      }),
      findById: vi.fn(),
      findFeatured: vi.fn(),
      getMagazines: vi.fn(),
      getPopularTopics: vi.fn(),
    };

    const useCase = new SearchArticlesByTopicUseCase(mockRepo);
    const response = await useCase.execute({ query: 'NoExistente' });

    expect(response.success).toBe(true);
    expect(response.query).toBe('NoExistente');
    expect(response.total).toBe(0);
    expect(response.articles).toEqual([]);
    expect(response.matchedTopics).toEqual([]);
    expect(response.isEmpty).toBe(true);
  });

  it('handles undefined or falsy query by defaulting to empty string', async () => {
    const mockRepo: IArticleRepository = {
      searchByTopic: vi.fn().mockResolvedValue({
        articles: [],
        totalCount: 0,
      }),
      findById: vi.fn(),
      findFeatured: vi.fn(),
      getMagazines: vi.fn(),
      getPopularTopics: vi.fn(),
    };

    const useCase = new SearchArticlesByTopicUseCase(mockRepo);
    const response = await useCase.execute({ query: undefined as unknown as string });

    expect(mockRepo.searchByTopic).toHaveBeenCalledWith(
      expect.objectContaining({ query: '' })
    );
    expect(response.query).toBe('');
  });
});
