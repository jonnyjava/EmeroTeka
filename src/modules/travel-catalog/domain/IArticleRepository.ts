import { Article } from './Article.ts';

export interface SearchArticlesFilter {
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
  issuesCount: number;
  articlesCount: number;
}

export interface IArticleRepository {
  /**
   * Search articles by destination, location, title, or keywords
   */
  searchArticles(filter: SearchArticlesFilter): Promise<SearchResult>;

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
   * Retrieve distinct indexed destinations in the catalogue
   */
  getPopularDestinations(): Promise<string[]>;
}
