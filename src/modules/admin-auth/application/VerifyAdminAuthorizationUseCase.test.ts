import { describe, it, expect } from 'vitest';
import { VerifyAdminAuthorizationUseCase } from './VerifyAdminAuthorizationUseCase';

describe('VerifyAdminAuthorizationUseCase', () => {
  const useCase = new VerifyAdminAuthorizationUseCase();

  it('returns unauthenticated when user is null or undefined', () => {
    expect(useCase.execute(null)).toEqual({
      status: 'unauthenticated',
      reason: 'No authenticated session found.',
    });
    expect(useCase.execute(undefined)).toEqual({
      status: 'unauthenticated',
      reason: 'No authenticated session found.',
    });
  });

  it('returns unauthenticated when uid is missing or empty', () => {
    expect(useCase.execute({ uid: '' })).toEqual({
      status: 'unauthenticated',
      reason: 'No authenticated session found.',
    });
  });

  it('returns unauthorized when email is missing', () => {
    const result = useCase.execute({ uid: 'usr_1', email: null });
    expect(result.status).toBe('unauthorized');
    if (result.status === 'unauthorized') {
      expect(result.attemptedEmail).toBe('unknown');
    }
  });

  it('returns unauthorized when email is not on allowlist', () => {
    const result = useCase.execute({
      uid: 'usr_unauth',
      email: 'hacker@example.com',
      displayName: 'Unauthorized User',
    });
    expect(result.status).toBe('unauthorized');
    if (result.status === 'unauthorized') {
      expect(result.attemptedEmail).toBe('hacker@example.com');
      expect(result.reason).toContain('not on the administrator allowlist');
    }
  });

  it('returns authorized when email matches authorized admin (jonnyjava.net@gmail.com)', () => {
    const result = useCase.execute({
      uid: 'admin_uid_777',
      email: 'jonnyjava.net@gmail.com',
      displayName: 'Jonny Admin',
      photoURL: 'https://lh3.googleusercontent.com/photo.jpg',
    });

    expect(result.status).toBe('authorized');
    if (result.status === 'authorized') {
      expect(result.user.uid).toBe('admin_uid_777');
      expect(result.user.email).toBe('jonnyjava.net@gmail.com');
      expect(result.user.displayName).toBe('Jonny Admin');
      expect(result.user.photoURL).toBe('https://lh3.googleusercontent.com/photo.jpg');
    }
  });

  it('returns authorized even with uppercase email', () => {
    const result = useCase.execute({
      uid: 'admin_uid_888',
      email: 'JONNYJAVA.NET@GMAIL.COM',
      displayName: 'Jonny',
    });

    expect(result.status).toBe('authorized');
    if (result.status === 'authorized') {
      expect(result.user.email).toBe('JONNYJAVA.NET@GMAIL.COM');
    }
  });
});
