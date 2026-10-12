import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Libre_Caslon_Text, Cinzel, Bitter } from 'next/font/google';
import './globals.css';

const natGeoSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const natGeoSerif = Libre_Caslon_Text({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const natGeoDisplay = Cinzel({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const natGeoSlab = Bitter({
  subsets: ['latin'],
  variable: '--font-slab',
  display: 'swap',
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${natGeoSans.variable} ${natGeoSerif.variable} ${natGeoDisplay.variable} ${natGeoSlab.variable}`}
    >
      <body
        className="bg-[#F7F9FC] text-[#1B275E] font-sans antialiased selection:bg-[#2A3E92] selection:text-white min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
