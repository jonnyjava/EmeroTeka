import { and, count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/src/db/index';
import { articles, magazineIssues, magazines } from '@/src/db/schema';
import {
  MagazineAdminDTO,
  MagazineInput,
} from '../domain/MagazineAdminEntity';
import {
  ArticleAdminDTO,
  ArticleInput,
  buildLocationSearchIndex,
  MagazineIssueOptionDTO,
} from '../domain/ArticleAdminEntity';
import { IAdminManagementRepository } from './IAdminManagementRepository';

export class PostgresAdminManagementRepository implements IAdminManagementRepository {
  // ===================== MAGAZINES =====================

  async listMagazines(search?: string): Promise<MagazineAdminDTO[]> {
    const conditions = [];
    if (search && search.trim()) {
      const pattern = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(magazines.name, pattern),
          ilike(magazines.publisher, pattern),
          ilike(magazines.country, pattern),
          ilike(magazines.issn, pattern)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        id: magazines.id,
        name: magazines.name,
        publisher: magazines.publisher,
        country: magazines.country,
        issn: magazines.issn,
        description: magazines.description,
        coverImageUrl: magazines.coverImageUrl,
        createdAt: magazines.createdAt,
      })
      .from(magazines)
      .where(whereClause)
      .orderBy(magazines.name);

    // Fetch counts for issues & articles per magazine
    const issueCounts = await db
      .select({
        magazineId: magazineIssues.magazineId,
        count: count(magazineIssues.id),
      })
      .from(magazineIssues)
      .groupBy(magazineIssues.magazineId);

    const articleCounts = await db
      .select({
        magazineId: articles.magazineId,
        count: count(articles.id),
      })
      .from(articles)
      .groupBy(articles.magazineId);

    const issueMap = new Map(issueCounts.map((r) => [r.magazineId, Number(r.count)]));
    const articleMap = new Map(articleCounts.map((r) => [r.magazineId, Number(r.count)]));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      publisher: r.publisher,
      country: r.country,
      issn: r.issn,
      description: r.description,
      coverImageUrl: r.coverImageUrl,
      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      issuesCount: issueMap.get(r.id) || 0,
      articlesCount: articleMap.get(r.id) || 0,
    }));
  }

  async getMagazineById(id: number): Promise<MagazineAdminDTO | null> {
    const rows = await db
      .select()
      .from(magazines)
      .where(eq(magazines.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      name: r.name,
      publisher: r.publisher,
      country: r.country,
      issn: r.issn,
      description: r.description,
      coverImageUrl: r.coverImageUrl,
      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
    };
  }

  async createMagazine(input: MagazineInput): Promise<MagazineAdminDTO> {
    const [inserted] = await db
      .insert(magazines)
      .values({
        name: input.name.trim(),
        publisher: input.publisher?.trim() || null,
        country: input.country?.trim() || null,
        issn: input.issn?.trim() || null,
        description: input.description?.trim() || null,
        coverImageUrl: input.coverImageUrl?.trim() || null,
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      publisher: inserted.publisher,
      country: inserted.country,
      issn: inserted.issn,
      description: inserted.description,
      coverImageUrl: inserted.coverImageUrl,
      createdAt: inserted.createdAt ? inserted.createdAt.toISOString() : null,
      issuesCount: 0,
      articlesCount: 0,
    };
  }

  async updateMagazine(id: number, input: MagazineInput): Promise<MagazineAdminDTO> {
    const [updated] = await db
      .update(magazines)
      .set({
        name: input.name.trim(),
        publisher: input.publisher?.trim() || null,
        country: input.country?.trim() || null,
        issn: input.issn?.trim() || null,
        description: input.description?.trim() || null,
        coverImageUrl: input.coverImageUrl?.trim() || null,
      })
      .where(eq(magazines.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Magazine with ID ${id} not found.`);
    }

    return {
      id: updated.id,
      name: updated.name,
      publisher: updated.publisher,
      country: updated.country,
      issn: updated.issn,
      description: updated.description,
      coverImageUrl: updated.coverImageUrl,
      createdAt: updated.createdAt ? updated.createdAt.toISOString() : null,
    };
  }

  async deleteMagazine(id: number): Promise<boolean> {
    const deleted = await db
      .delete(magazines)
      .where(eq(magazines.id, id))
      .returning({ id: magazines.id });

    return deleted.length > 0;
  }

  // ===================== ARTICLES =====================

  async listArticles(filter?: { search?: string; magazineId?: number }): Promise<ArticleAdminDTO[]> {
    const conditions = [];

    if (filter?.search && filter.search.trim()) {
      const pattern = `%${filter.search.trim()}%`;
      conditions.push(
        or(
          ilike(articles.title, pattern),
          ilike(articles.author, pattern),
          ilike(articles.country, pattern),
          ilike(articles.city, pattern),
          ilike(articles.region, pattern),
          ilike(articles.locationSearchIndex, pattern)
        )
      );
    }

    if (filter?.magazineId) {
      conditions.push(eq(articles.magazineId, filter.magazineId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        article: articles,
        magazine: magazines,
        issue: magazineIssues,
      })
      .from(articles)
      .innerJoin(magazines, eq(articles.magazineId, magazines.id))
      .innerJoin(magazineIssues, eq(articles.issueId, magazineIssues.id))
      .where(whereClause)
      .orderBy(desc(articles.id));

    return rows.map(({ article, magazine, issue }) => ({
      id: article.id,
      magazineId: article.magazineId,
      magazineName: magazine.name,
      issueId: article.issueId,
      issueNumber: issue.issueNumber,
      issueYear: issue.year,
      issueMonth: issue.month,
      title: article.title,
      subtitle: article.subtitle,
      author: article.author,
      photographer: article.photographer,
      startPage: article.startPage,
      endPage: article.endPage,
      city: article.city,
      region: article.region,
      country: article.country,
      locationSearchIndex: article.locationSearchIndex,
      synopsis: article.synopsis,
      tags: article.tags,
      featured: Boolean(article.featured),
      coverImageUrl: article.coverImageUrl,
      createdAt: article.createdAt ? article.createdAt.toISOString() : null,
    }));
  }

  async getArticleById(id: number): Promise<ArticleAdminDTO | null> {
    const rows = await db
      .select({
        article: articles,
        magazine: magazines,
        issue: magazineIssues,
      })
      .from(articles)
      .innerJoin(magazines, eq(articles.magazineId, magazines.id))
      .innerJoin(magazineIssues, eq(articles.issueId, magazineIssues.id))
      .where(eq(articles.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const { article, magazine, issue } = rows[0];

    return {
      id: article.id,
      magazineId: article.magazineId,
      magazineName: magazine.name,
      issueId: article.issueId,
      issueNumber: issue.issueNumber,
      issueYear: issue.year,
      issueMonth: issue.month,
      title: article.title,
      subtitle: article.subtitle,
      author: article.author,
      photographer: article.photographer,
      startPage: article.startPage,
      endPage: article.endPage,
      city: article.city,
      region: article.region,
      country: article.country,
      locationSearchIndex: article.locationSearchIndex,
      synopsis: article.synopsis,
      tags: article.tags,
      featured: Boolean(article.featured),
      coverImageUrl: article.coverImageUrl,
      createdAt: article.createdAt ? article.createdAt.toISOString() : null,
    };
  }

  async createArticle(input: ArticleInput): Promise<ArticleAdminDTO> {
    const locationIndex = buildLocationSearchIndex(input.city, input.region, input.country);

    const [inserted] = await db
      .insert(articles)
      .values({
        magazineId: input.magazineId,
        issueId: input.issueId,
        title: input.title.trim(),
        subtitle: input.subtitle?.trim() || null,
        author: input.author?.trim() || null,
        photographer: input.photographer?.trim() || null,
        startPage: input.startPage,
        endPage: input.endPage,
        city: input.city?.trim() || null,
        region: input.region?.trim() || null,
        country: input.country.trim(),
        locationSearchIndex: locationIndex,
        synopsis: input.synopsis.trim(),
        tags: input.tags?.trim() || null,
        featured: Boolean(input.featured),
        coverImageUrl: input.coverImageUrl?.trim() || null,
      })
      .returning();

    // Fetch joined details
    const detail = await this.getArticleById(inserted.id);
    if (!detail) {
      throw new Error('Failed to retrieve newly created article.');
    }
    return detail;
  }

  async updateArticle(id: number, input: ArticleInput): Promise<ArticleAdminDTO> {
    const locationIndex = buildLocationSearchIndex(input.city, input.region, input.country);

    const [updated] = await db
      .update(articles)
      .set({
        magazineId: input.magazineId,
        issueId: input.issueId,
        title: input.title.trim(),
        subtitle: input.subtitle?.trim() || null,
        author: input.author?.trim() || null,
        photographer: input.photographer?.trim() || null,
        startPage: input.startPage,
        endPage: input.endPage,
        city: input.city?.trim() || null,
        region: input.region?.trim() || null,
        country: input.country.trim(),
        locationSearchIndex: locationIndex,
        synopsis: input.synopsis.trim(),
        tags: input.tags?.trim() || null,
        featured: Boolean(input.featured),
        coverImageUrl: input.coverImageUrl?.trim() || null,
      })
      .where(eq(articles.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Article with ID ${id} not found.`);
    }

    const detail = await this.getArticleById(updated.id);
    if (!detail) {
      throw new Error('Failed to retrieve updated article.');
    }
    return detail;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const deleted = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning({ id: articles.id });

    return deleted.length > 0;
  }

  // ===================== ISSUE SELECTOR OPTIONS =====================

  async getMagazineIssuesOptions(): Promise<MagazineIssueOptionDTO[]> {
    const rows = await db
      .select({
        id: magazineIssues.id,
        magazineId: magazineIssues.magazineId,
        magazineName: magazines.name,
        issueNumber: magazineIssues.issueNumber,
        year: magazineIssues.year,
        month: magazineIssues.month,
      })
      .from(magazineIssues)
      .innerJoin(magazines, eq(magazineIssues.magazineId, magazines.id))
      .orderBy(magazines.name, desc(magazineIssues.year));

    return rows.map((r) => ({
      id: r.id,
      magazineId: r.magazineId,
      magazineName: r.magazineName,
      issueNumber: r.issueNumber,
      year: r.year,
      month: r.month,
      label: `${r.magazineName} — Nº ${r.issueNumber} (${r.year}${r.month ? ` - ${r.month}` : ''})`,
    }));
  }
}
