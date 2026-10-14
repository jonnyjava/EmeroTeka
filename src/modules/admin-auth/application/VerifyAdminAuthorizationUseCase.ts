import {
  AdminUser,
  AdminUserSchema,
  isAuthorizedAdminEmail,
} from '../domain/AdminUser';

export type AdminAuthCheckResult =
  | {
      status: 'authorized';
      user: AdminUser;
    }
  | {
      status: 'unauthorized';
      attemptedEmail: string;
      reason: string;
    }
  | {
      status: 'unauthenticated';
      reason: string;
    };

export interface RawAuthUser {
  uid?: string | null;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export class VerifyAdminAuthorizationUseCase {
  /**
   * Executes verification on a raw user session object.
   * Returns a strongly-typed discrimination of authorization status.
   */
  execute(rawUser: RawAuthUser | null | undefined): AdminAuthCheckResult {
    if (!rawUser || !rawUser.uid) {
      return {
        status: 'unauthenticated',
        reason: 'No authenticated session found.',
      };
    }

    if (!rawUser.email) {
      return {
        status: 'unauthorized',
        attemptedEmail: 'unknown',
        reason: 'Authenticated user does not have an associated email address.',
      };
    }

    if (!isAuthorizedAdminEmail(rawUser.email)) {
      return {
        status: 'unauthorized',
        attemptedEmail: rawUser.email,
        reason: `Account "${rawUser.email}" is not on the administrator allowlist.`,
      };
    }

    const parseResult = AdminUserSchema.safeParse({
      uid: rawUser.uid,
      email: rawUser.email,
      displayName: rawUser.displayName ?? null,
      photoURL: rawUser.photoURL ?? null,
    });

    if (!parseResult.success) {
      return {
        status: 'unauthorized',
        attemptedEmail: rawUser.email,
        reason: 'User profile format is invalid.',
      };
    }

    return {
      status: 'authorized',
      user: parseResult.data,
    };
  }
}
