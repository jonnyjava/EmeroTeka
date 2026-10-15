import { describe, it, expect, vi } from 'vitest';
import { GetCatalogOverviewUseCase } from './GetCatalogOverviewUseCase.ts';
import { IArticleRepository, MagazineSummary } from '../domain/IArticleRepository.ts';
import { Article } from '../domain/Article.ts';
import { MagazineIssue } from '../domain/MagazineIssue.ts';

describe('GetCatalogOverviewUseCase Application Service', () => {
  const sampleMagazines: MagazineSummary[] = [
    {
      id: 1,
      name: 'National Geographic',
      issuesCount: 50,
      articlesCount: 200,
    },
    {
      id: 2,
      name: 'Lonely Planet Magazine',
      issuesCount: 30,
      articlesCount: 120,
    },
  ];

  const sampleIssue = MagazineIssue.create({
    id: 1,
    magazineId: 1,
    magazineName: 'National Geographic',
    issueNumber: '300',
    year: 2020,
  });

  const featuredArticle = Article.create({
    id: 5,
    title: 'Misterios de Kioto',
    startPage: 12,
    endPage: 28,
    tags: ['Kioto', 'Japón'],
    issue: sampleIssue,
    synopsis: 'Templos zen y jardines tradicionales de Kioto.',
    featured: true,
  });

  it('orchestrates repository methods in parallel and returns structured catalog overview', async () => {
    const mockRepo: IArticleRepository = {
      getMagazines: vi.fn().mockResolvedValue(sampleMagazines),
      findFeatured: vi.fn().mockResolvedValue([featuredArticle]),
      getPopularDestinations: vi.fn().mockResolvedValue(['Kioto · Japón', 'Petra · Jordania']),
      searchArticles: vi.fn(),
      findById: vi.fn(),
    };

    const useCase = new GetCatalogOverviewUseCase(mockRepo);
    const result = await useCase.execute();

    expect(result.magazines).toEqual(sampleMagazines);
    expect(result.featuredArticles.length).toBe(1);
    expect(result.featuredArticles[0].id).toBe(5);
    expect(result.featuredArticles[0].title).toBe('Misterios de Kioto');
    expect(result.popularDestinations).toEqual(['Kioto · Japón', 'Petra · Jordania']);

    expect(mockRepo.getMagazines).toHaveBeenCalledTimes(1);
    expect(mockRepo.findFeatured).toHaveBeenCalledWith(8);
    expect(mockRepo.getPopularDestinations).toHaveBeenCalledTimes(1);
  });
});
