import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Catálogo de Revistas de Viajes',
  description: 'Catálogo histórico y buscador especializado de artículos en revistas de viajes por localidad, país y región.',
  openGraph: {
    title: 'Catálogo de Revistas de Viajes',
    description: 'Catálogo histórico y buscador especializado de artículos en revistas de viajes por localidad, país y región.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo de Revistas de Viajes',
    description: 'Catálogo histórico y buscador especializado de artículos en revistas de viajes por localidad, país y región.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
