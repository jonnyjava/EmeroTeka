import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../../../db/index.ts';
import { articles, magazineIssues, magazines } from '../../../db/schema.ts';
import {
  IArticleRepository,
  MagazineSummary,
  SearchLocationFilter,
  SearchResult,
} from '../domain/IArticleRepository.ts';
import { Article } from '../domain/Article.ts';
import { Location } from '../domain/Location.ts';
import { ArticleMapper } from './ArticleMapper.ts';

export class PostgresArticleRepository implements IArticleRepository {
  /**
   * Search articles by destination location (city, region, country, or keyword)
   */
  public async searchByLocation(filter: SearchLocationFilter): Promise<SearchResult> {
    try {
      const conditions = [];

      if (filter.query && filter.query.trim()) {
        const cleanQuery = filter.query.trim();
        const searchPattern = `%${cleanQuery}%`;

        conditions.push(
          or(
            ilike(articles.city, searchPattern),
            ilike(articles.region, searchPattern),
            ilike(articles.country, searchPattern),
            ilike(articles.locationSearchIndex, searchPattern),
            ilike(articles.title, searchPattern),
            ilike(articles.tags, searchPattern)
          )
        );
      }

      if (filter.magazineId) {
        conditions.push(eq(articles.magazineId, filter.magazineId));
      }

      if (filter.year) {
        conditions.push(eq(magazineIssues.year, filter.year));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Query matched articles with joined issue and magazine
      const rows = await db
        .select({
          article: articles,
          issue: magazineIssues,
          magazine: magazines,
        })
        .from(articles)
        .innerJoin(magazineIssues, eq(articles.issueId, magazineIssues.id))
        .innerJoin(magazines, eq(articles.magazineId, magazines.id))
        .where(whereClause)
        .orderBy(desc(magazineIssues.year), articles.startPage)
        .limit(filter.limit || 20)
        .offset(filter.offset || 0);

      // Total count query for pagination
      const countRes = await db
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(articles)
        .innerJoin(magazineIssues, eq(articles.issueId, magazineIssues.id))
        .where(whereClause);

      const totalCount = countRes[0]?.count ?? 0;
      const domainArticles = rows.map(row => ArticleMapper.toDomain(row));

      return {
        articles: domainArticles,
        totalCount,
      };
    } catch (error) {
      console.error('Error executing searchByLocation in PostgresArticleRepository:', error);
      throw new Error('No se pudo completar la búsqueda en el catálogo de revistas.', { cause: error });
    }
  }

  /**
   * Find a single article by ID
   */
  public async findById(id: number): Promise<Article | null> {
    try {
      const rows = await db
        .select({
          article: articles,
          issue: magazineIssues,
          magazine: magazines,
        })
        .from(articles)
        .innerJoin(magazineIssues, eq(articles.issueId, magazineIssues.id))
        .innerJoin(magazines, eq(articles.magazineId, magazines.id))
        .where(eq(articles.id, id))
        .limit(1);

      if (rows.length === 0) return null;
      return ArticleMapper.toDomain(rows[0]);
    } catch (error) {
      console.error(`Error finding article by id ${id}:`, error);
      throw new Error(`Error al recuperar el artículo con identificador ${id}.`, { cause: error });
    }
  }

  /**
   * Find featured articles for showcase
   */
  public async findFeatured(limit = 8): Promise<Article[]> {
    try {
      const rows = await db
        .select({
          article: articles,
          issue: magazineIssues,
          magazine: magazines,
        })
        .from(articles)
        .innerJoin(magazineIssues, eq(articles.issueId, magazineIssues.id))
        .innerJoin(magazines, eq(articles.magazineId, magazines.id))
        .orderBy(desc(articles.featured), desc(magazineIssues.year))
        .limit(limit);

      return rows.map(row => ArticleMapper.toDomain(row));
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      throw new Error('Error al cargar artículos destacados de la base de datos.', { cause: error });
    }
  }

  /**
   * Get all magazines with summary metrics
   */
  public async getMagazines(): Promise<MagazineSummary[]> {
    try {
      const allMagazines = await db.select().from(magazines).orderBy(magazines.name);

      const summaries: MagazineSummary[] = [];

      for (const mag of allMagazines) {
        const issuesCountRes = await db
          .select({ count: sql<number>`cast(count(*) as int)` })
          .from(magazineIssues)
          .where(eq(magazineIssues.magazineId, mag.id));

        const articlesCountRes = await db
          .select({ count: sql<number>`cast(count(*) as int)` })
          .from(articles)
          .where(eq(articles.magazineId, mag.id));

        summaries.push({
          id: mag.id,
          name: mag.name,
          publisher: mag.publisher ?? undefined,
          country: mag.country ?? undefined,
          description: mag.description ?? undefined,
          coverImageUrl: mag.coverImageUrl ?? undefined,
          issuesCount: issuesCountRes[0]?.count ?? 0,
          articlesCount: articlesCountRes[0]?.count ?? 0,
        });
      }

      return summaries;
    } catch (error) {
      console.error('Error fetching magazine summaries:', error);
      throw new Error('Error al consultar el catálogo de revistas.', { cause: error });
    }
  }

  /**
   * Distinct popular destination locations
   */
  public async getPopularLocations(): Promise<Location[]> {
    try {
      const distinctRows = await db
        .selectDistinct({
          city: articles.city,
          region: articles.region,
          country: articles.country,
        })
        .from(articles)
        .orderBy(articles.country, articles.city)
        .limit(20);

      return distinctRows.map(row =>
        Location.create({
          city: row.city,
          region: row.region,
          country: row.country,
        })
      );
    } catch (error) {
      console.error('Error fetching popular locations:', error);
      throw new Error('Error al consultar las localidades del catálogo.', { cause: error });
    }
  }
}
