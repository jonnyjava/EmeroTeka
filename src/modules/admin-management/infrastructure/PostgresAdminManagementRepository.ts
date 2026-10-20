import { and, count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/src/db/index';
import { articles, magazineIssues, magazines, tags } from '@/src/db/schema';
import {
  MagazineAdminDTO,
  MagazineInput,
} from '../domain/MagazineAdminEntity';
import {
  MagazineIssueAdminDTO,
  MagazineIssueInput,
} from '../domain/MagazineIssueAdminEntity';
import {
  ArticleAdminDTO,
  ArticleInput,
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
          ilike(magazines.country, pattern)
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
      })
      .returning();

    return {
      id: inserted.id,
      name: inserted.name,
      publisher: inserted.publisher,
      country: inserted.country,
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

  // ===================== MAGAZINE ISSUES =====================

  async listMagazineIssues(filter?: { search?: string; magazineId?: number }): Promise<MagazineIssueAdminDTO[]> {
    const conditions = [];

    if (filter?.search && filter.search.trim()) {
      const pattern = `%${filter.search.trim()}%`;
      conditions.push(
        or(
          ilike(magazineIssues.issueNumber, pattern),
          ilike(magazineIssues.title, pattern),
          ilike(magazineIssues.month, pattern),
          ilike(magazines.name, pattern)
        )
      );
    }

    if (filter?.magazineId) {
      conditions.push(eq(magazineIssues.magazineId, filter.magazineId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        issue: magazineIssues,
        magazine: magazines,
      })
      .from(magazineIssues)
      .innerJoin(magazines, eq(magazineIssues.magazineId, magazines.id))
      .where(whereClause)
      .orderBy(desc(magazineIssues.year), desc(magazineIssues.id));

    const articleCounts = await db
      .select({
        issueId: articles.issueId,
        count: count(articles.id),
      })
      .from(articles)
      .groupBy(articles.issueId);

    const articleMap = new Map(articleCounts.map((r) => [r.issueId, Number(r.count)]));

    return rows.map(({ issue, magazine }) => ({
      id: issue.id,
      magazineId: issue.magazineId,
      magazineName: magazine.name,
      issueNumber: issue.issueNumber,
      year: issue.year,
      month: issue.month !== null && issue.month !== undefined ? Number(issue.month) : null,
      title: issue.title,
      coverImageUrl: issue.coverImageUrl,
      createdAt: issue.createdAt ? issue.createdAt.toISOString() : null,
      articlesCount: articleMap.get(issue.id) || 0,
    }));
  }

  async getMagazineIssueById(id: number): Promise<MagazineIssueAdminDTO | null> {
    const rows = await db
      .select({
        issue: magazineIssues,
        magazine: magazines,
      })
      .from(magazineIssues)
      .innerJoin(magazines, eq(magazineIssues.magazineId, magazines.id))
      .where(eq(magazineIssues.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const { issue, magazine } = rows[0];

    const articleCounts = await db
      .select({ count: count(articles.id) })
      .from(articles)
      .where(eq(articles.issueId, issue.id));

    return {
      id: issue.id,
      magazineId: issue.magazineId,
      magazineName: magazine.name,
      issueNumber: issue.issueNumber,
      year: issue.year,
      month: issue.month !== null && issue.month !== undefined ? Number(issue.month) : null,
      title: issue.title,
      coverImageUrl: issue.coverImageUrl,
      createdAt: issue.createdAt ? issue.createdAt.toISOString() : null,
      articlesCount: Number(articleCounts[0]?.count || 0),
    };
  }

  async createMagazineIssue(input: MagazineIssueInput): Promise<MagazineIssueAdminDTO> {
    const [inserted] = await db
      .insert(magazineIssues)
      .values({
        magazineId: input.magazineId,
        issueNumber: input.issueNumber.trim(),
        year: input.year,
        month: input.month ?? null,
        title: input.title?.trim() || null,
        coverImageUrl: input.coverImageUrl?.trim() || null,
      })
      .returning();

    const detail = await this.getMagazineIssueById(inserted.id);
    if (!detail) {
      throw new Error('Failed to retrieve newly created magazine issue.');
    }
    return detail;
  }

  async updateMagazineIssue(id: number, input: MagazineIssueInput): Promise<MagazineIssueAdminDTO> {
    const [updated] = await db
      .update(magazineIssues)
      .set({
        magazineId: input.magazineId,
        issueNumber: input.issueNumber.trim(),
        year: input.year,
        month: input.month ?? null,
        title: input.title?.trim() || null,
        coverImageUrl: input.coverImageUrl?.trim() || null,
      })
      .where(eq(magazineIssues.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Magazine issue with ID ${id} not found.`);
    }

    const detail = await this.getMagazineIssueById(updated.id);
    if (!detail) {
      throw new Error('Failed to retrieve updated magazine issue.');
    }
    return detail;
  }

  async deleteMagazineIssue(id: number): Promise<boolean> {
    const deleted = await db
      .delete(magazineIssues)
      .where(eq(magazineIssues.id, id))
      .returning({ id: magazineIssues.id });

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
          ilike(articles.subtitle, pattern),
          ilike(articles.author, pattern),
          ilike(articles.synopsis, pattern),
          ilike(articles.tags, pattern)
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
      startPage: article.startPage,
      endPage: article.endPage,
      synopsis: article.synopsis,
      tags: article.tags,
      featured: Boolean(article.featured),
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
      startPage: article.startPage,
      endPage: article.endPage,
      synopsis: article.synopsis,
      tags: article.tags,
      featured: Boolean(article.featured),
      createdAt: article.createdAt ? article.createdAt.toISOString() : null,
    };
  }

  private async ensureTagsExist(tagsStr?: string | null): Promise<void> {
    if (!tagsStr || !tagsStr.trim()) return;
    const tagNames = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
    for (const name of tagNames) {
      try {
        await db
          .insert(tags)
          .values({ name })
          .onConflictDoNothing();
      } catch (err) {
        // ignore duplicate key or handle gracefully
      }
    }
  }

  async createArticle(input: ArticleInput): Promise<ArticleAdminDTO> {
    await this.ensureTagsExist(input.tags);

    const [inserted] = await db
      .insert(articles)
      .values({
        magazineId: input.magazineId,
        issueId: input.issueId,
        title: input.title.trim(),
        subtitle: input.subtitle?.trim() || null,
        author: input.author?.trim() || null,
        startPage: input.startPage,
        endPage: input.endPage,
        synopsis: input.synopsis.trim(),
        tags: input.tags?.trim() || null,
        featured: Boolean(input.featured),
      })
      .returning();

    const detail = await this.getArticleById(inserted.id);
    if (!detail) {
      throw new Error('Failed to retrieve newly created article.');
    }
    return detail;
  }

  async updateArticle(id: number, input: ArticleInput): Promise<ArticleAdminDTO> {
    await this.ensureTagsExist(input.tags);

    const [updated] = await db
      .update(articles)
      .set({
        magazineId: input.magazineId,
        issueId: input.issueId,
        title: input.title.trim(),
        subtitle: input.subtitle?.trim() || null,
        author: input.author?.trim() || null,
        startPage: input.startPage,
        endPage: input.endPage,
        synopsis: input.synopsis.trim(),
        tags: input.tags?.trim() || null,
        featured: Boolean(input.featured),
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

  // ===================== TAGS =====================

  async listTags(): Promise<string[]> {
    const rows = await db.select({ name: tags.name }).from(tags).orderBy(tags.name);
    return rows.map((r) => r.name);
  }
}
