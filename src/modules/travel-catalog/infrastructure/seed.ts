/**
 * Database Seeding Script
 *
 * Populates Cloud SQL with historical travel magazines, issues, and indexed articles.
 * Can be run programmatically or via npm script.
 */
import { db } from '../../../db/index.ts';
import { magazines, magazineIssues, articles } from '../../../db/schema.ts';

export async function runCatalogSeed() {
  console.log('Seeding travel magazine catalog...');

  // Magazines
  const magsData = [
    {
      id: 1,
      name: 'National Geographic',
      publisher: 'National Geographic Society',
      country: 'Estados Unidos',
      issn: '0027-9358',
      description: 'La publicación geográfica y de exploración más icónica del mundo, documentando expediciones científicas y maravillas arqueológicas desde 1888.',
      coverImageUrl: '/images/mag_nat_geo_1791410371610.jpg',
    },
    {
      id: 2,
      name: 'Condé Nast Traveler',
      publisher: 'Condé Nast',
      country: 'Estados Unidos',
      issn: '0894-7279',
      description: 'Referente mundial en viajes de lujo, escapadas arquitectónicas, costas mediterráneas y gastronomía refinada.',
      coverImageUrl: '/images/mag_conde_nast_1791410382501.jpg',
    },
    {
      id: 3,
      name: 'Geo Magazine',
      publisher: 'Gruner + Jahr',
      country: 'Alemania / España',
      issn: '0342-8311',
      description: 'Revista pionera en gran reportaje fotográfico, etnográfico, naturaleza salvaje y expediciones a regiones extremas.',
      coverImageUrl: '/images/mag_geo_arctic_1791410392589.jpg',
    },
    {
      id: 4,
      name: 'Altaïr',
      publisher: 'Altaïr Viatges',
      country: 'España',
      issn: '1134-4539',
      description: 'Publicación cultural y etnográfica de viajes de autor, crónicas literarias y rutas de profundización histórica.',
      coverImageUrl: '/images/mag_altair_silkroad_1791410402139.jpg',
    },
    {
      id: 5,
      name: 'Viajar',
      publisher: 'Prensa Ibérica',
      country: 'España',
      issn: '1131-7299',
      description: 'La primera revista española de viajes, especializada en rutas patrimoniales, ciudades históricas y escapadas europeas.',
      coverImageUrl: '/images/mag_conde_nast_1791410382501.jpg',
    },
    {
      id: 6,
      name: 'Lonely Planet Magazine',
      publisher: 'Lonely Planet Global',
      country: 'Reino Unido',
      issn: '1758-6518',
      description: 'Guía de aventura contemporánea con itinerarios de senderismo, parques nacionales y experiencias locales inmersivas.',
      coverImageUrl: '/images/mag_geo_arctic_1791410392589.jpg',
    },
  ];

  for (const mag of magsData) {
    await db
      .insert(magazines)
      .values(mag)
      .onConflictDoUpdate({ target: magazines.id, set: mag });
  }

  console.log('Magazines seeded successfully.');
}
