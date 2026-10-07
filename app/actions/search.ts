'use server';

import { PostgresArticleRepository } from '@/src/modules/travel-catalog/infrastructure/PostgresArticleRepository.ts';
import {
  SearchArticlesByLocationUseCase,
  SearchArticlesResponse,
} from '@/src/modules/travel-catalog/application/SearchArticlesByLocationUseCase.ts';
import {
  GetCatalogOverviewUseCase,
  CatalogOverviewResponse,
} from '@/src/modules/travel-catalog/application/GetCatalogOverviewUseCase.ts';
import { ArticleDTO } from '@/src/modules/travel-catalog/domain/Article.ts';

/**
 * Composition Root for Travel Catalog Domain
 *
 * Assembles the infrastructure layer (PostgreSQL / Cloud SQL) and application use cases
 * to expose server actions directly to presentation components.
 */

// Singleton instances for Server Actions composition
const postgresArticleRepository = new PostgresArticleRepository();
const searchArticlesUseCase = new SearchArticlesByLocationUseCase(postgresArticleRepository);
const catalogOverviewUseCase = new GetCatalogOverviewUseCase(postgresArticleRepository);

export interface SearchActionParams {
  query: string;
  magazineId?: number;
  year?: number;
}

/**
 * Server Action: Search articles by location (city, region, country, or keyword)
 */
export async function searchArticlesAction(
  params: SearchActionParams
): Promise<SearchArticlesResponse> {
  try {
    return await searchArticlesUseCase.execute({
      query: params.query || '',
      magazineId: params.magazineId,
      year: params.year,
      limit: 30,
    });
  } catch (error) {
    console.error('Failed to execute searchArticlesAction:', error);
    return {
      success: false,
      query: params.query,
      articles: [],
      total: 0,
      matchedLocations: [],
      isEmpty: true,
    };
  }
}

/**
 * Server Action: Load initial catalog overview (magazines list, featured articles, popular destinations)
 */
export async function getCatalogOverviewAction(): Promise<CatalogOverviewResponse> {
  try {
    return await catalogOverviewUseCase.execute();
  } catch (error) {
    console.error('Failed to execute getCatalogOverviewAction:', error);
    return {
      magazines: [],
      featuredArticles: [],
      popularDestinations: [],
    };
  }
}

/**
 * Server Action: Get single article details
 */
export async function getArticleDetailAction(id: number): Promise<ArticleDTO | null> {
  try {
    const article = await postgresArticleRepository.findById(id);
    return article ? article.toDTO() : null;
  } catch (error) {
    console.error(`Failed to execute getArticleDetailAction for id ${id}:`, error);
    return null;
  }
}
