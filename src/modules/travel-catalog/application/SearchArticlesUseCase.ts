import { IArticleRepository, SearchArticlesFilter } from '../domain/IArticleRepository.ts';
import { ArticleDTO } from '../domain/Article.ts';

export interface SearchArticlesRequest {
  query: string;
  magazineId?: number;
  year?: number;
  limit?: number;
  offset?: number;
}

export interface SearchArticlesResponse {
  success: boolean;
  query: string;
  articles: ArticleDTO[];
  total: number;
  matchedDestinations: string[];
  isEmpty: boolean;
}

export class SearchArticlesUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  public async execute(request: SearchArticlesRequest): Promise<SearchArticlesResponse> {
    const rawQuery = request.query ? request.query.trim() : '';
    const rawLimit = request.limit !== undefined ? request.limit : 20;
    const limit = Math.min(Math.max(rawLimit, 1), 100);
    const offset = Math.max(request.offset || 0, 0);

    const filter: SearchArticlesFilter = {
      query: rawQuery,
      magazineId: request.magazineId ? Number(request.magazineId) : undefined,
      year: request.year ? Number(request.year) : undefined,
      limit,
      offset,
    };

    const searchResult = await this.articleRepository.searchArticles(filter);

    // Map rich domain entities to data transfer objects (DTO)
    const articleDTOs = searchResult.articles.map((article) => article.toDTO());

    // Extract unique destinations present in the results
    const destinationSet = new Set<string>();
    for (const item of articleDTOs) {
      if (item.location) {
        destinationSet.add(item.location);
      }
    }

    return {
      success: true,
      query: rawQuery,
      articles: articleDTOs,
      total: searchResult.totalCount,
      matchedDestinations: Array.from(destinationSet),
      isEmpty: articleDTOs.length === 0,
    };
  }
}
