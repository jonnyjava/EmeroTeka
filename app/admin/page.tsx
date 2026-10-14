import type { Metadata } from 'next';
import { AdminRouteGuard } from '@/src/modules/admin-auth/presentation/AdminRouteGuard';

export const metadata: Metadata = {
  title: 'Administración · Catálogo de Revistas',
  description: 'Área restringida de administración.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminRouteGuard />;
}
