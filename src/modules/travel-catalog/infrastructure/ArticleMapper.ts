import { Article } from '../domain/Article.ts';
import { Location } from '../domain/Location.ts';
import { MagazineIssue } from '../domain/MagazineIssue.ts';

export interface RawDatabaseArticleJoined {
  article: {
    id: number;
    magazineId: number;
    issueId: number;
    title: string;
    subtitle: string | null;
    author: string | null;
    photographer: string | null;
    startPage: number;
    endPage: number;
    city: string | null;
    region: string | null;
    country: string;
    locationSearchIndex: string;
    synopsis: string;
    tags: string | null;
    featured: boolean | null;
    coverImageUrl: string | null;
    createdAt: Date | null;
  };
  issue: {
    id: number;
    magazineId: number;
    issueNumber: string;
    year: number;
    month: string | null;
    volume: string | null;
    title: string | null;
    coverImageUrl: string | null;
  };
  magazine: {
    id: number;
    name: string;
    publisher: string | null;
    country: string | null;
    description: string | null;
    coverImageUrl: string | null;
  };
}

export class ArticleMapper {
  /**
   * Maps a relational database row with joins into a domain Article Aggregate Root.
   */
  public static toDomain(raw: RawDatabaseArticleJoined): Article {
    // 1. Build Location Value Object
    const location = Location.create({
      city: raw.article.city,
      region: raw.article.region,
      country: raw.article.country,
    });

    // 2. Build MagazineIssue Domain Entity
    const issue = MagazineIssue.create({
      id: raw.issue.id,
      magazineId: raw.magazine.id,
      magazineName: raw.magazine.name,
      issueNumber: raw.issue.issueNumber,
      year: raw.issue.year,
      month: raw.issue.month,
      volume: raw.issue.volume,
      title: raw.issue.title,
      coverImageUrl: raw.issue.coverImageUrl || raw.magazine.coverImageUrl,
    });

    // 3. Parse tags
    const tagsArray = raw.article.tags
      ? raw.article.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    // 4. Build Article Aggregate Root
    return Article.create({
      id: raw.article.id,
      title: raw.article.title,
      subtitle: raw.article.subtitle,
      author: raw.article.author,
      photographer: raw.article.photographer,
      startPage: raw.article.startPage,
      endPage: raw.article.endPage,
      location,
      issue,
      synopsis: raw.article.synopsis,
      tags: tagsArray,
      featured: raw.article.featured ?? false,
      coverImageUrl: raw.article.coverImageUrl || raw.issue.coverImageUrl || raw.magazine.coverImageUrl,
      createdAt: raw.article.createdAt,
    });
  }
}
