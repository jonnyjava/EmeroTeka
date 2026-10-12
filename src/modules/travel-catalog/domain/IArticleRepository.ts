import { Article } from './Article.ts';
import { Topic } from './Topic.ts';

export interface SearchTopicFilter {
  query: string;
  magazineId?: number;
  year?: number;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  articles: Article[];
  totalCount: number;
}

export interface MagazineSummary {
  id: number;
  name: string;
  publisher?: string;
  country?: string;
  description?: string;
  coverImageUrl?: string;
  issuesCount: number;
  articlesCount: number;
}

export interface IArticleRepository {
  /**
   * Search articles by topic (theme, subject, category, or keywords)
   */
  searchByTopic(filter: SearchTopicFilter): Promise<SearchResult>;

  /**
   * Fetch an article by its unique ID
   */
  findById(id: number): Promise<Article | null>;

  /**
   * Fetch featured or highlight articles
   */
  findFeatured(limit?: number): Promise<Article[]>;

  /**
   * List all magazines with their issue & article counts
   */
  getMagazines(): Promise<MagazineSummary[]>;

  /**
   * Retrieve distinct indexed topics in the catalogue
   */
  getPopularTopics(): Promise<Topic[]>;
}
