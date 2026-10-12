/**
 * Value Object: Topic
 *
 * Encapsulates the subject matter, theme, or topic of an article
 * (e.g., specific destination/subject, thematic category, or subtopic).
 * Implements business invariants and value equality without external dependencies.
 */
export interface TopicProps {
  name: string;
  category?: string | null;
  subtopic?: string | null;
}

export class Topic {
  private readonly _name: string;
  private readonly _category?: string;
  private readonly _subtopic?: string;

  private constructor(props: TopicProps) {
    this._name = props.name.trim();
    this._category = props.category?.trim() || undefined;
    this._subtopic = props.subtopic?.trim() || undefined;
  }

  /**
   * Factory method with domain invariant validations.
   */
  public static create(props: TopicProps): Topic {
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Topic invariant violation: Topic name must be at least 2 characters long.');
    }

    return new Topic(props);
  }

  public get name(): string {
    return this._name;
  }

  public get category(): string | undefined {
    return this._category;
  }

  public get subtopic(): string | undefined {
    return this._subtopic;
  }

  /**
   * Value equality check.
   */
  public equals(other?: Topic | null): boolean {
    if (!other) return false;
    return (
      this.normalize(this._name) === this.normalize(other.name) &&
      this.normalize(this._category || '') === this.normalize(other.category || '') &&
      this.normalize(this._subtopic || '') === this.normalize(other.subtopic || '')
    );
  }

  /**
   * Returns a formatted topic string (e.g. "Petra · Ma'an · Jordania" or "Kioto · Japón").
   */
  public toFormattedString(): string {
    const parts: string[] = [this._name];
    if (this._subtopic && this._subtopic !== this._name) parts.push(this._subtopic);
    if (this._category && this._category !== this._name) parts.push(this._category);
    return parts.join(' · ');
  }

  /**
   * Generates a normalized search token string for indexing.
   */
  public getSearchIndexToken(): string {
    const tokens = [this._name, this._subtopic, this._category]
      .filter(Boolean)
      .map(part => this.normalize(part as string));
    return tokens.join(' ');
  }

  /**
   * Checks if this topic matches a user query (case- and accent-insensitive).
   */
  public matches(query: string): boolean {
    if (!query || !query.trim()) return false;
    const cleanQuery = this.normalize(query.trim());
    return this.getSearchIndexToken().includes(cleanQuery);
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  public toJSON() {
    return {
      name: this._name,
      category: this._category,
      subtopic: this._subtopic,
      formatted: this.toFormattedString(),
    };
  }
}
