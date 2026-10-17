import { Article } from '../domain/Article.ts';
import { MagazineIssue } from '../domain/MagazineIssue.ts';

export interface RawDatabaseArticleJoined {
  article: {
    id: number;
    magazineId: number;
    issueId: number;
    title: string;
    subtitle: string | null;
    author: string | null;
    startPage: number;
    endPage: number;
    synopsis: string;
    tags: string | null;
    featured: boolean | null;
    createdAt: Date | null;
  };
  issue: {
    id: number;
    magazineId: number;
    issueNumber: string;
    year: number;
    month: number | null;
    title: string | null;
    coverImageUrl: string | null;
  };
  magazine: {
    id: number;
    name: string;
    publisher: string | null;
    country: string | null;
  };
}

export class ArticleMapper {
  /**
   * Maps a relational database row with joins into a domain Article Aggregate Root.
   */
  public static toDomain(raw: RawDatabaseArticleJoined): Article {
    // 1. Build MagazineIssue Domain Entity
    const issue = MagazineIssue.create({
      id: raw.issue.id,
      magazineId: raw.magazine.id,
      magazineName: raw.magazine.name,
      issueNumber: raw.issue.issueNumber,
      year: raw.issue.year,
      month: raw.issue.month,
      title: raw.issue.title,
      coverImageUrl: raw.issue.coverImageUrl,
    });

    // 2. Parse tags
    const tagsArray = raw.article.tags
      ? raw.article.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    // 3. Build Article Aggregate Root
    return Article.create({
      id: raw.article.id,
      title: raw.article.title,
      subtitle: raw.article.subtitle,
      author: raw.article.author,
      startPage: raw.article.startPage,
      endPage: raw.article.endPage,
      issue,
      synopsis: raw.article.synopsis,
      tags: tagsArray,
      featured: raw.article.featured ?? false,
      createdAt: raw.article.createdAt,
    });
  }
}
