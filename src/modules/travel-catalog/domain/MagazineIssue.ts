/**
 * Entity: MagazineIssue
 *
 * Represents an issue or edition of a travel publication.
 * Encapsulates the journal name, volume, number, year, and metadata.
 */
export interface MagazineIssueProps {
  id: number;
  magazineId: number;
  magazineName: string;
  issueNumber: string;
  year: number;
  month?: string | null;
  volume?: string | null;
  title?: string | null;
  coverImageUrl?: string | null;
}

export class MagazineIssue {
  private readonly _id: number;
  private readonly _magazineId: number;
  private readonly _magazineName: string;
  private readonly _issueNumber: string;
  private readonly _year: number;
  private readonly _month?: string;
  private readonly _volume?: string;
  private readonly _title?: string;
  private readonly _coverImageUrl?: string;

  private constructor(props: MagazineIssueProps) {
    this._id = props.id;
    this._magazineId = props.magazineId;
    this._magazineName = props.magazineName.trim();
    this._issueNumber = props.issueNumber.trim();
    this._year = props.year;
    this._month = props.month?.trim() || undefined;
    this._volume = props.volume?.trim() || undefined;
    this._title = props.title?.trim() || undefined;
    this._coverImageUrl = props.coverImageUrl?.trim() || undefined;
  }

  public static create(props: MagazineIssueProps): MagazineIssue {
    if (!props.magazineName || props.magazineName.trim().length === 0) {
      throw new Error('MagazineIssue invariant violation: magazineName cannot be empty.');
    }
    if (!props.issueNumber || props.issueNumber.trim().length === 0) {
      throw new Error('MagazineIssue invariant violation: issueNumber cannot be empty.');
    }
    const currentYear = new Date().getFullYear();
    if (props.year < 1850 || props.year > currentYear + 1) {
      throw new Error(`MagazineIssue invariant violation: year must be between 1850 and ${currentYear + 1}.`);
    }

    return new MagazineIssue(props);
  }

  public get id(): number {
    return this._id;
  }

  public get magazineId(): number {
    return this._magazineId;
  }

  public get magazineName(): string {
    return this._magazineName;
  }

  public get issueNumber(): string {
    return this._issueNumber;
  }

  public get year(): number {
    return this._year;
  }

  public get month(): string | undefined {
    return this._month;
  }

  public get volume(): string | undefined {
    return this._volume;
  }

  public get title(): string | undefined {
    return this._title;
  }

  public get coverImageUrl(): string | undefined {
    return this._coverImageUrl;
  }

  /**
   * Generates a bibliographic reference for citation (e.g. "National Geographic · Vol. 186, Nº 4 (Octubre 1994)").
   */
  public getFullCitation(): string {
    const details: string[] = [];
    if (this._volume) details.push(this._volume);
    details.push(`Nº ${this._issueNumber}`);
    const timeStr = this._month ? `${this._month} ${this._year}` : `${this._year}`;
    return `${this._magazineName} · ${details.join(', ')} (${timeStr})`;
  }

  public toJSON() {
    return {
      id: this._id,
      magazineId: this._magazineId,
      magazineName: this._magazineName,
      issueNumber: this._issueNumber,
      year: this._year,
      month: this._month,
      volume: this._volume,
      title: this._title,
      coverImageUrl: this._coverImageUrl,
      fullCitation: this.getFullCitation(),
    };
  }
}
