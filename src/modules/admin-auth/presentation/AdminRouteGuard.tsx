'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminAuth } from './useAdminAuth';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboard } from '@/src/modules/admin-management/presentation/AdminDashboard';

export function AdminRouteGuard() {
  const { authState, isSigningIn, actionError, signInWithGoogle, signOut } = useAdminAuth();

  if (authState.status === 'loading') {
    return (
      <div
        data-testid="admin-loading-screen"
        className="min-h-screen bg-[#0E152E] flex flex-col items-center justify-center text-[#F7F9FC]"
      >
        <Loader2 className="w-8 h-8 text-[#D2A446] animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-[#9BB0D9]">
          Verificando credenciales...
        </p>
      </div>
    );
  }

  if (authState.status === 'authorized') {
    return <AdminDashboard user={authState.user} onSignOut={signOut} />;
  }

  const isUnauthorized = authState.status === 'unauthorized';
  const attemptedEmail = isUnauthorized ? authState.attemptedEmail : undefined;
  const unauthorizedReason = isUnauthorized ? authState.reason : undefined;

  return (
    <AdminLoginPage
      isUnauthorized={isUnauthorized}
      attemptedEmail={attemptedEmail}
      unauthorizedReason={unauthorizedReason}
      isSigningIn={isSigningIn}
      actionError={actionError}
      onSignInWithGoogle={signInWithGoogle}
      onSignOut={signOut}
    />
  );
}
