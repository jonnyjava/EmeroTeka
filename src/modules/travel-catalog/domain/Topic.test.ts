import { describe, it, expect } from 'vitest';
import { Topic } from './Topic.ts';

describe('Topic Value Object', () => {
  describe('Creation and Invariants', () => {
    it('creates a valid Topic with name only', () => {
      const topic = Topic.create({ name: 'Roma' });
      expect(topic.name).toBe('Roma');
      expect(topic.category).toBeUndefined();
      expect(topic.subtopic).toBeUndefined();
    });

    it('creates a valid Topic with category and subtopic', () => {
      const topic = Topic.create({
        name: 'Kioto',
        category: 'Japón',
        subtopic: 'Kansai',
      });
      expect(topic.name).toBe('Kioto');
      expect(topic.category).toBe('Japón');
      expect(topic.subtopic).toBe('Kansai');
    });

    it('trims whitespace and ignores empty string category and subtopic', () => {
      const topic = Topic.create({
        name: '  Tokio  ',
        category: '   ',
        subtopic: '   ',
      });
      expect(topic.name).toBe('Tokio');
      expect(topic.category).toBeUndefined();
      expect(topic.subtopic).toBeUndefined();
    });

    it('throws error when name is empty, undefined, or less than 2 characters', () => {
      expect(() => Topic.create({ name: '' })).toThrow(
        'Topic invariant violation: Topic name must be at least 2 characters long.'
      );
      expect(() => Topic.create({ name: ' ' })).toThrow(
        'Topic invariant violation: Topic name must be at least 2 characters long.'
      );
      expect(() => Topic.create({ name: 'A' })).toThrow(
        'Topic invariant violation: Topic name must be at least 2 characters long.'
      );
      expect(() => Topic.create({ name: undefined as unknown as string })).toThrow(
        'Topic invariant violation: Topic name must be at least 2 characters long.'
      );
    });
  });

  describe('Equality (equals)', () => {
    it('returns false when other is null or undefined', () => {
      const topic = Topic.create({ name: 'Madrid' });
      expect(topic.equals(undefined)).toBe(false);
      expect(topic.equals(null)).toBe(false);
    });

    it('returns true for equivalent topics with different casing or accents', () => {
      const t1 = Topic.create({ name: 'Perú', category: 'América del Sur', subtopic: 'Andes' });
      const t2 = Topic.create({ name: 'peru', category: 'america del sur', subtopic: 'andes' });
      expect(t1.equals(t2)).toBe(true);
    });

    it('returns false when name differs', () => {
      const t1 = Topic.create({ name: 'París', category: 'Francia' });
      const t2 = Topic.create({ name: 'Lyon', category: 'Francia' });
      expect(t1.equals(t2)).toBe(false);
    });

    it('returns false when names match but category differs', () => {
      const t1 = Topic.create({ name: 'París', category: 'Francia' });
      const t2 = Topic.create({ name: 'París', category: 'Texas' });
      expect(t1.equals(t2)).toBe(false);
    });

    it('returns false when names and category match but subtopic differs', () => {
      const t1 = Topic.create({ name: 'París', category: 'Francia', subtopic: 'Rive Gauche' });
      const t2 = Topic.create({ name: 'París', category: 'Francia', subtopic: 'Montmartre' });
      expect(t1.equals(t2)).toBe(false);
    });

    it('returns false when category is undefined on one and defined on the other', () => {
      const t1 = Topic.create({ name: 'París', category: 'Francia' });
      const t2 = Topic.create({ name: 'París' });
      expect(t1.equals(t2)).toBe(false);
      expect(t2.equals(t1)).toBe(false);
    });

    it('returns false when subtopic is undefined on one and defined on the other', () => {
      const t1 = Topic.create({ name: 'París', category: 'Francia', subtopic: 'Centro' });
      const t2 = Topic.create({ name: 'París', category: 'Francia' });
      expect(t1.equals(t2)).toBe(false);
      expect(t2.equals(t1)).toBe(false);
    });
  });

  describe('Formatting (toFormattedString)', () => {
    it('formats topic with only name', () => {
      const topic = Topic.create({ name: 'Islandia' });
      expect(topic.toFormattedString()).toBe('Islandia');
    });

    it('formats topic with name, subtopic, and category', () => {
      const topic = Topic.create({
        name: 'Petra',
        subtopic: "Ma'an",
        category: 'Jordania',
      });
      expect(topic.toFormattedString()).toBe("Petra · Ma'an · Jordania");
    });

    it('does not duplicate subtopic or category when they equal the name', () => {
      const topic = Topic.create({
        name: 'Marruecos',
        subtopic: 'Marruecos',
        category: 'Marruecos',
      });
      expect(topic.toFormattedString()).toBe('Marruecos');
    });
  });

  describe('Search Matching (matches & getSearchIndexToken)', () => {
    it('matches query ignoring casing and accents', () => {
      const topic = Topic.create({
        name: 'Córdoba',
        subtopic: 'Andalucía',
        category: 'España',
      });
      expect(topic.matches('cordoba')).toBe(true);
      expect(topic.matches('CORDOBA')).toBe(true);
      expect(topic.matches('andalucia')).toBe(true);
      expect(topic.matches('espana')).toBe(true);
      expect(topic.matches('España')).toBe(true);
    });

    it('returns false for empty or non-matching query', () => {
      const topic = Topic.create({ name: 'Florencia', category: 'Italia' });
      expect(topic.matches('')).toBe(false);
      expect(topic.matches('   ')).toBe(false);
      expect(topic.matches('Berlin')).toBe(false);
    });

    it('produces expected search index token', () => {
      const topic = Topic.create({
        name: 'São Paulo',
        category: 'Brasil',
      });
      expect(topic.getSearchIndexToken()).toBe('sao paulo brasil');
    });
  });

  describe('Serialization (toJSON)', () => {
    it('serializes topic to JSON object', () => {
      const topic = Topic.create({
        name: 'Sevilla',
        category: 'España',
        subtopic: 'Andalucía',
      });
      expect(topic.toJSON()).toEqual({
        name: 'Sevilla',
        category: 'España',
        subtopic: 'Andalucía',
        formatted: 'Sevilla · Andalucía · España',
      });
    });
  });
});
