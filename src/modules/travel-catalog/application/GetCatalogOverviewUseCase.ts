import { IArticleRepository, MagazineSummary } from '../domain/IArticleRepository.ts';
import { ArticleDTO } from '../domain/Article.ts';

export interface CatalogOverviewResponse {
  magazines: MagazineSummary[];
  featuredArticles: ArticleDTO[];
  popularDestinations: string[];
}

export class GetCatalogOverviewUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  public async execute(): Promise<CatalogOverviewResponse> {
    const [magazines, featuredArticlesEntities, locations] = await Promise.all([
      this.articleRepository.getMagazines(),
      this.articleRepository.findFeatured(8),
      this.articleRepository.getPopularLocations(),
    ]);

    return {
      magazines,
      featuredArticles: featuredArticlesEntities.map(article => article.toDTO()),
      popularDestinations: locations.map(loc => loc.toFormattedString()),
    };
  }
}
