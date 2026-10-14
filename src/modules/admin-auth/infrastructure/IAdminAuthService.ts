import { RawAuthUser } from '../application/VerifyAdminAuthorizationUseCase';

export interface IAdminAuthService {
  signInWithGoogle(): Promise<RawAuthUser>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: RawAuthUser | null) => void): () => void;
  getCurrentUser(): RawAuthUser | null;
}
