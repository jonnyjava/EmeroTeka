import { describe, it, expect, vi } from 'vitest';
import { GetCatalogOverviewUseCase } from './GetCatalogOverviewUseCase.ts';
import { IArticleRepository, MagazineSummary } from '../domain/IArticleRepository.ts';
import { Article } from '../domain/Article.ts';
import { Topic } from '../domain/Topic.ts';
import { MagazineIssue } from '../domain/MagazineIssue.ts';

describe('GetCatalogOverviewUseCase', () => {
  it('orchestrates repository methods and returns formatted overview response', async () => {
    const mockMagazines: MagazineSummary[] = [
      {
        id: 1,
        name: 'National Geographic',
        issuesCount: 120,
        articlesCount: 450,
      },
      {
        id: 2,
        name: 'Altaïr',
        issuesCount: 80,
        articlesCount: 300,
      },
    ];

    const topic1 = Topic.create({ name: 'Kioto', category: 'Japón' });
    const topic2 = Topic.create({ name: 'Petra', category: 'Jordania' });

    const issue = MagazineIssue.create({
      id: 10,
      magazineId: 1,
      magazineName: 'National Geographic',
      issueNumber: '400',
      year: 2022,
    });

    const mockArticle = Article.create({
      id: 99,
      title: 'Jardines Zen de Kioto',
      startPage: 14,
      endPage: 28,
      topic: topic1,
      issue,
      synopsis: 'Armonía y templos ancestrales en la capital cultural de Japón.',
    });

    const mockRepo: IArticleRepository = {
      searchByTopic: vi.fn(),
      findById: vi.fn(),
      findFeatured: vi.fn().mockResolvedValue([mockArticle]),
      getMagazines: vi.fn().mockResolvedValue(mockMagazines),
      getPopularTopics: vi.fn().mockResolvedValue([topic1, topic2]),
    };

    const useCase = new GetCatalogOverviewUseCase(mockRepo);
    const result = await useCase.execute();

    expect(mockRepo.getMagazines).toHaveBeenCalledTimes(1);
    expect(mockRepo.findFeatured).toHaveBeenCalledWith(8);
    expect(mockRepo.getPopularTopics).toHaveBeenCalledTimes(1);

    expect(result.magazines).toEqual(mockMagazines);
    expect(result.featuredArticles).toHaveLength(1);
    expect(result.featuredArticles[0].id).toBe(99);
    expect(result.featuredArticles[0].title).toBe('Jardines Zen de Kioto');
    expect(result.popularTopics).toEqual(['Kioto · Japón', 'Petra · Jordania']);
  });

  it('handles empty results gracefully', async () => {
    const mockRepo: IArticleRepository = {
      searchByTopic: vi.fn(),
      findById: vi.fn(),
      findFeatured: vi.fn().mockResolvedValue([]),
      getMagazines: vi.fn().mockResolvedValue([]),
      getPopularTopics: vi.fn().mockResolvedValue([]),
    };

    const useCase = new GetCatalogOverviewUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result.magazines).toEqual([]);
    expect(result.featuredArticles).toEqual([]);
    expect(result.popularTopics).toEqual([]);
  });
});
