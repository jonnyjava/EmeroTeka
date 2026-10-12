import { IArticleRepository, MagazineSummary } from '../domain/IArticleRepository.ts';
import { ArticleDTO } from '../domain/Article.ts';

export interface CatalogOverviewResponse {
  magazines: MagazineSummary[];
  featuredArticles: ArticleDTO[];
  popularTopics: string[];
}

export class GetCatalogOverviewUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  public async execute(): Promise<CatalogOverviewResponse> {
    const [magazines, featuredArticlesEntities, topics] = await Promise.all([
      this.articleRepository.getMagazines(),
      this.articleRepository.findFeatured(8),
      this.articleRepository.getPopularTopics(),
    ]);

    return {
      magazines,
      featuredArticles: featuredArticlesEntities.map(article => article.toDTO()),
      popularTopics: topics.map(top => top.toFormattedString()),
    };
  }
}
