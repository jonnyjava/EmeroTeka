'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { AdminUser } from '../domain/AdminUser';
import {
  VerifyAdminAuthorizationUseCase,
  RawAuthUser,
} from '../application/VerifyAdminAuthorizationUseCase';
import { IAdminAuthService } from '../infrastructure/IAdminAuthService';
import { firebaseAuthService } from '../infrastructure/FirebaseAuthService';

export type AdminAuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated'; error?: string | null }
  | {
      status: 'unauthorized';
      attemptedEmail: string;
      reason: string;
    }
  | {
      status: 'authorized';
      user: AdminUser;
    };

export function useAdminAuth(authService: IAdminAuthService = firebaseAuthService) {
  const [authState, setAuthState] = useState<AdminAuthState>({ status: 'loading' });
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const verifyUseCase = useMemo(() => new VerifyAdminAuthorizationUseCase(), []);

  const evaluateUser = useCallback(
    (rawUser: RawAuthUser | null) => {
      const evaluation = verifyUseCase.execute(rawUser);

      if (evaluation.status === 'authorized') {
        setAuthState({
          status: 'authorized',
          user: evaluation.user,
        });
      } else if (evaluation.status === 'unauthorized') {
        setAuthState({
          status: 'unauthorized',
          attemptedEmail: evaluation.attemptedEmail,
          reason: evaluation.reason,
        });
      } else {
        setAuthState({ status: 'unauthenticated', error: null });
      }
    },
    [verifyUseCase]
  );

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((rawUser) => {
      evaluateUser(rawUser);
    });

    return () => {
      unsubscribe();
    };
  }, [authService, evaluateUser]);

  const signInWithGoogle = useCallback(async () => {
    setIsSigningIn(true);
    setActionError(null);
    try {
      const rawUser = await authService.signInWithGoogle();
      evaluateUser(rawUser);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google authentication failed';
      setActionError(message);
    } finally {
      setIsSigningIn(false);
    }
  }, [authService, evaluateUser]);

  const signOut = useCallback(async () => {
    setActionError(null);
    try {
      await authService.signOut();
      setAuthState({ status: 'unauthenticated' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setActionError(message);
    }
  }, [authService]);

  return {
    authState,
    isSigningIn,
    actionError,
    signInWithGoogle,
    signOut,
  };
}
