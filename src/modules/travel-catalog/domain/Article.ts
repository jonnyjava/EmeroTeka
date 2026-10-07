import { Location } from './Location.ts';
import { MagazineIssue } from './MagazineIssue.ts';

/**
 * Domain Aggregate Root / Entity: Article
 *
 * Represents an indexed travel journal article with strict domain invariants,
 * page range validations, and association with a Location Value Object and
 * a MagazineIssue Entity.
 */
export interface ArticleProps {
  id: number;
  title: string;
  subtitle?: string | null;
  author?: string | null;
  photographer?: string | null;
  startPage: number;
  endPage: number;
  location: Location;
  issue: MagazineIssue;
  synopsis: string;
  tags?: string[] | null;
  featured?: boolean;
  coverImageUrl?: string | null;
  createdAt?: Date | null;
}

export interface ArticleDTO {
  id: number;
  title: string;
  subtitle?: string;
  author?: string;
  photographer?: string;
  startPage: number;
  endPage: number;
  pageCount: number;
  pageCitation: string;
  location: {
    city?: string;
    region?: string;
    country: string;
    formatted: string;
  };
  magazine: {
    id: number;
    name: string;
    issueNumber: string;
    year: number;
    month?: string;
    fullCitation: string;
    coverImageUrl?: string;
  };
  synopsis: string;
  tags: string[];
  featured: boolean;
  coverImageUrl?: string;
  catalogReference: string;
}

export class Article {
  private readonly _id: number;
  private readonly _title: string;
  private readonly _subtitle?: string;
  private readonly _author?: string;
  private readonly _photographer?: string;
  private readonly _startPage: number;
  private readonly _endPage: number;
  private readonly _location: Location;
  private readonly _issue: MagazineIssue;
  private readonly _synopsis: string;
  private readonly _tags: readonly string[];
  private readonly _featured: boolean;
  private readonly _coverImageUrl?: string;
  private readonly _createdAt?: Date;

  private constructor(props: ArticleProps) {
    this._id = props.id;
    this._title = props.title.trim();
    this._subtitle = props.subtitle?.trim() || undefined;
    this._author = props.author?.trim() || undefined;
    this._photographer = props.photographer?.trim() || undefined;
    this._startPage = props.startPage;
    this._endPage = props.endPage;
    this._location = props.location;
    this._issue = props.issue;
    this._synopsis = props.synopsis.trim();
    this._tags = Object.freeze(props.tags ? [...props.tags] : []);
    this._featured = Boolean(props.featured);
    this._coverImageUrl = props.coverImageUrl?.trim() || undefined;
    this._createdAt = props.createdAt || undefined;
  }

  /**
   * Factory method with Domain Invariant Validations
   */
  public static create(props: ArticleProps): Article {
    if (!props.title || props.title.trim().length < 3) {
      throw new Error('Article invariant violation: Title must be at least 3 characters long.');
    }
    if (!Number.isInteger(props.startPage) || props.startPage < 1) {
      throw new Error('Article invariant violation: startPage must be a positive integer greater than or equal to 1.');
    }
    if (!Number.isInteger(props.endPage) || props.endPage < props.startPage) {
      throw new Error('Article invariant violation: endPage must be greater than or equal to startPage.');
    }
    if (!props.location || !(props.location instanceof Location)) {
      throw new Error('Article invariant violation: Article must have a valid Location Value Object.');
    }
    if (!props.issue || !(props.issue instanceof MagazineIssue)) {
      throw new Error('Article invariant violation: Article must be associated with a valid MagazineIssue Entity.');
    }
    if (!props.synopsis || props.synopsis.trim().length < 10) {
      throw new Error('Article invariant violation: Synopsis must be at least 10 characters long.');
    }

    return new Article(props);
  }

  public get id(): number {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get subtitle(): string | undefined {
    return this._subtitle;
  }

  public get author(): string | undefined {
    return this._author;
  }

  public get photographer(): string | undefined {
    return this._photographer;
  }

  public get startPage(): number {
    return this._startPage;
  }

  public get endPage(): number {
    return this._endPage;
  }

  public get location(): Location {
    return this._location;
  }

  public get issue(): MagazineIssue {
    return this._issue;
  }

  public get synopsis(): string {
    return this._synopsis;
  }

  public get tags(): readonly string[] {
    return this._tags;
  }

  public get featured(): boolean {
    return this._featured;
  }

  public get coverImageUrl(): string | undefined {
    return this._coverImageUrl;
  }

  public get createdAt(): Date | undefined {
    return this._createdAt;
  }

  /**
   * Total number of pages occupied by this article in the magazine
   */
  public getPageCount(): number {
    return this._endPage - this._startPage + 1;
  }

  /**
   * Bibliographic page citation format (e.g., "pp. 42–58" or "p. 15")
   */
  public getPageCitation(): string {
    if (this._startPage === this._endPage) {
      return `p. ${this._startPage}`;
    }
    return `pp. ${this._startPage}–${this._endPage}`;
  }

  /**
   * Complete reference for travel catalogue indexing
   */
  public getCatalogReference(): string {
    const issueRef = this._issue.getFullCitation();
    const pages = this.getPageCitation();
    return `${issueRef} · ${pages}`;
  }

  /**
   * Checks if this article's location matches the given search string
   */
  public matchesLocation(searchQuery: string): boolean {
    return this._location.matches(searchQuery);
  }

  /**
   * Export to serializable DTO
   */
  public toDTO(): ArticleDTO {
    return {
      id: this._id,
      title: this._title,
      subtitle: this._subtitle,
      author: this._author,
      photographer: this._photographer,
      startPage: this._startPage,
      endPage: this._endPage,
      pageCount: this.getPageCount(),
      pageCitation: this.getPageCitation(),
      location: this._location.toJSON(),
      magazine: {
        id: this._issue.magazineId,
        name: this._issue.magazineName,
        issueNumber: this._issue.issueNumber,
        year: this._issue.year,
        month: this._issue.month,
        fullCitation: this._issue.getFullCitation(),
        coverImageUrl: this._issue.coverImageUrl,
      },
      synopsis: this._synopsis,
      tags: [...this._tags],
      featured: this._featured,
      coverImageUrl: this._coverImageUrl || this._issue.coverImageUrl,
      catalogReference: this.getCatalogReference(),
    };
  }
}
