/**
 * Value Object: Location
 *
 * Encapsulates the geographic destination of an article (city, region, country).
 * Implements business invariants and value equality without external dependencies.
 */
export interface LocationProps {
  city?: string | null;
  region?: string | null;
  country: string;
}

export class Location {
  private readonly _city?: string;
  private readonly _region?: string;
  private readonly _country: string;

  private constructor(props: LocationProps) {
    this._city = props.city?.trim() || undefined;
    this._region = props.region?.trim() || undefined;
    this._country = props.country.trim();
  }

  /**
   * Factory method with domain invariant validations.
   */
  public static create(props: LocationProps): Location {
    if (!props.country || props.country.trim().length < 2) {
      throw new Error('Location invariant violation: Country name must be at least 2 characters long.');
    }

    return new Location(props);
  }

  public get city(): string | undefined {
    return this._city;
  }

  public get region(): string | undefined {
    return this._region;
  }

  public get country(): string {
    return this._country;
  }

  /**
   * Value equality check.
   */
  public equals(other?: Location | null): boolean {
    if (!other) return false;
    return (
      this.normalize(this._country) === this.normalize(other.country) &&
      this.normalize(this._region || '') === this.normalize(other.region || '') &&
      this.normalize(this._city || '') === this.normalize(other.city || '')
    );
  }

  /**
   * Returns a formatted location string (e.g. "Petra, Ma'an, Jordania" or "Kioto, Japón").
   */
  public toFormattedString(): string {
    const parts: string[] = [];
    if (this._city) parts.push(this._city);
    if (this._region && this._region !== this._city) parts.push(this._region);
    parts.push(this._country);
    return parts.join(', ');
  }

  /**
   * Generates a normalized search token string for indexing.
   */
  public getSearchIndexToken(): string {
    const tokens = [this._city, this._region, this._country]
      .filter(Boolean)
      .map(part => this.normalize(part as string));
    return tokens.join(' ');
  }

  /**
   * Checks if this location matches a user query (case- and accent-insensitive).
   */
  public matches(query: string): boolean {
    if (!query || !query.trim()) return false;
    const cleanQuery = this.normalize(query.trim());
    const searchable = this.getSearchIndexToken();
    return searchable.includes(cleanQuery);
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
      city: this._city,
      region: this._region,
      country: this._country,
      formatted: this.toFormattedString(),
    };
  }
}
