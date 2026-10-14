import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FirebaseAuthService } from './FirebaseAuthService';
import * as firebaseAuth from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock('@/src/lib/firebase', () => ({
  auth: { currentUser: null },
  googleAuthProvider: {},
}));

describe('FirebaseAuthService', () => {
  let service: FirebaseAuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FirebaseAuthService();
  });

  it('signs in with Google popup and maps user properties', async () => {
    const mockUser = {
      uid: 'uid_123',
      email: 'jonnyjava.net@gmail.com',
      displayName: 'Jonny',
      photoURL: 'https://example.com/avatar.png',
    };

    vi.mocked(firebaseAuth.signInWithPopup).mockResolvedValueOnce({
      user: mockUser,
    } as unknown as firebaseAuth.UserCredential);

    const result = await service.signInWithGoogle();
    expect(result).toEqual({
      uid: 'uid_123',
      email: 'jonnyjava.net@gmail.com',
      displayName: 'Jonny',
      photoURL: 'https://example.com/avatar.png',
    });
  });

  it('signs out using Firebase Auth SDK', async () => {
    vi.mocked(firebaseAuth.signOut).mockResolvedValueOnce();
    await service.signOut();
    expect(firebaseAuth.signOut).toHaveBeenCalled();
  });

  it('registers onAuthStateChanged listener and propagates mapped user', () => {
    let capturedCallback: (user: unknown) => void = () => {};
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementationOnce((_auth, callback) => {
      capturedCallback = callback as (user: unknown) => void;
      return () => {};
    });

    const receivedUsers: unknown[] = [];
    service.onAuthStateChanged((user) => {
      receivedUsers.push(user);
    });

    capturedCallback({
      uid: 'u1',
      email: 'jonnyjava.net@gmail.com',
      displayName: 'Jonny',
      photoURL: null,
    });

    expect(receivedUsers).toHaveLength(1);
    expect(receivedUsers[0]).toEqual({
      uid: 'u1',
      email: 'jonnyjava.net@gmail.com',
      displayName: 'Jonny',
      photoURL: null,
    });
  });
});
