import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '@/src/lib/firebase';
import { RawAuthUser } from '../application/VerifyAdminAuthorizationUseCase';
import { IAdminAuthService } from './IAdminAuthService';
export type { IAdminAuthService };

function mapFirebaseUser(user: User | null): RawAuthUser | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export class FirebaseAuthService implements IAdminAuthService {
  async signInWithGoogle(): Promise<RawAuthUser> {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const mapped = mapFirebaseUser(result.user);
    if (!mapped) {
      throw new Error('Authentication failed: no user record returned from Google sign-in.');
    }
    return mapped;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  onAuthStateChanged(callback: (user: RawAuthUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (user) => {
      callback(mapFirebaseUser(user));
    });
  }

  getCurrentUser(): RawAuthUser | null {
    return mapFirebaseUser(auth.currentUser);
  }
}

export const firebaseAuthService = new FirebaseAuthService();
