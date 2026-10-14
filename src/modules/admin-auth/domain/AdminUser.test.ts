import { describe, it, expect } from 'vitest';
import {
  AdminUserSchema,
  isAuthorizedAdminEmail,
  UnauthorizedAdminError,
  UnauthenticatedAdminError,
  AUTHORIZED_ADMIN_EMAILS,
} from './AdminUser';

describe('AdminUser Domain Model', () => {
  describe('isAuthorizedAdminEmail', () => {
    it('returns true for authorized email exact match', () => {
      expect(isAuthorizedAdminEmail('jonnyjava.net@gmail.com')).toBe(true);
    });

    it('returns true for uppercase or mixed case authorized email', () => {
      expect(isAuthorizedAdminEmail('JONNYJAVA.NET@GMAIL.COM')).toBe(true);
      expect(isAuthorizedAdminEmail('JonnyJava.Net@gmail.com')).toBe(true);
    });

    it('returns true for email with surrounding whitespace', () => {
      expect(isAuthorizedAdminEmail('  jonnyjava.net@gmail.com  ')).toBe(true);
    });

    it('returns false for unauthorized email', () => {
      expect(isAuthorizedAdminEmail('intruder@gmail.com')).toBe(false);
      expect(isAuthorizedAdminEmail('jonnyjava@gmail.com')).toBe(false);
      expect(isAuthorizedAdminEmail('admin@travelmagazines.com')).toBe(false);
    });

    it('returns false for empty or null/undefined values', () => {
      expect(isAuthorizedAdminEmail('')).toBe(false);
      expect(isAuthorizedAdminEmail(null)).toBe(false);
      expect(isAuthorizedAdminEmail(undefined)).toBe(false);
    });
  });

  describe('AdminUserSchema', () => {
    it('validates a valid admin user record', () => {
      const valid = {
        uid: 'user_12345',
        email: 'jonnyjava.net@gmail.com',
        displayName: 'Jonny Java',
        photoURL: 'https://example.com/avatar.jpg',
      };
      const result = AdminUserSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects an invalid email format', () => {
      const invalid = {
        uid: 'user_123',
        email: 'not-an-email',
      };
      const result = AdminUserSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects empty uid', () => {
      const invalid = {
        uid: '',
        email: 'jonnyjava.net@gmail.com',
      };
      const result = AdminUserSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('Domain Errors', () => {
    it('constructs UnauthorizedAdminError with custom message', () => {
      const err = new UnauthorizedAdminError('other@gmail.com');
      expect(err.name).toBe('UnauthorizedAdminError');
      expect(err.message).toContain('other@gmail.com');
      expect(err.message).toContain('not authorized');
    });

    it('constructs UnauthenticatedAdminError with clear message', () => {
      const err = new UnauthenticatedAdminError();
      expect(err.name).toBe('UnauthenticatedAdminError');
      expect(err.message).toContain('Authentication required');
    });

    it('includes authorized admin emails list', () => {
      expect(AUTHORIZED_ADMIN_EMAILS).toContain('jonnyjava.net@gmail.com');
    });
  });
});
