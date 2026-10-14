import { z } from 'zod';

export const AUTHORIZED_ADMIN_EMAILS = [
  'jonnyjava.net@gmail.com',
] as const;

export type AuthorizedAdminEmail = (typeof AUTHORIZED_ADMIN_EMAILS)[number];

export const AdminUserSchema = z.object({
  uid: z.string().min(1, 'UID is required'),
  email: z.string().email('Invalid email address'),
  displayName: z.string().nullable().optional(),
  photoURL: z.string().nullable().optional(),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

export class UnauthorizedAdminError extends Error {
  constructor(email: string) {
    super(`Access denied. The account "${email}" is not authorized to access the admin area.`);
    this.name = 'UnauthorizedAdminError';
  }
}

export class UnauthenticatedAdminError extends Error {
  constructor() {
    super('Authentication required. Please sign in with your authorized Google account.');
    this.name = 'UnauthenticatedAdminError';
  }
}

/**
 * Checks whether the given email belongs to the authorized administrators list.
 * Handles case-insensitivity and whitespace trimming.
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (AUTHORIZED_ADMIN_EMAILS as readonly string[]).includes(normalized);
}
