import { IArticleRepository, SearchTopicFilter } from '../domain/IArticleRepository.ts';
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
  matchedTopics: string[];
  isEmpty: boolean;
}

export class SearchArticlesByTopicUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  public async execute(request: SearchArticlesRequest): Promise<SearchArticlesResponse> {
    const rawQuery = request.query ? request.query.trim() : '';
    const limit = Math.min(Math.max(request.limit || 20, 1), 100);
    const offset = Math.max(request.offset || 0, 0);

    const filter: SearchTopicFilter = {
      query: rawQuery,
      magazineId: request.magazineId ? Number(request.magazineId) : undefined,
      year: request.year ? Number(request.year) : undefined,
      limit,
      offset,
    };

    const searchResult = await this.articleRepository.searchByTopic(filter);

    // Map rich domain entities to data transfer objects (DTO)
    const articleDTOs = searchResult.articles.map(article => article.toDTO());

    // Extract unique topics present in the results
    const topicSet = new Set<string>();
    for (const item of articleDTOs) {
      topicSet.add(item.topic.formatted);
    }

    return {
      success: true,
      query: rawQuery,
      articles: articleDTOs,
      total: searchResult.totalCount,
      matchedTopics: Array.from(topicSet),
      isEmpty: articleDTOs.length === 0,
    };
  }
}
