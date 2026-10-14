import { z } from 'zod';

export const ArticleInputSchema = z
  .object({
    magazineId: z.number().int().positive('Debes seleccionar una revista'),
    issueId: z.number().int().positive('Debes seleccionar una edición / issue'),
    title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres'),
    subtitle: z.string().trim().nullable().optional(),
    author: z.string().trim().nullable().optional(),
    photographer: z.string().trim().nullable().optional(),
    startPage: z.number().int().positive('La página de inicio debe ser mayor a 0'),
    endPage: z.number().int().positive('La página final debe ser mayor a 0'),
    city: z.string().trim().nullable().optional(),
    region: z.string().trim().nullable().optional(),
    country: z.string().trim().min(2, 'El país es obligatorio'),
    synopsis: z.string().trim().min(10, 'La sinopsis debe tener al menos 10 caracteres'),
    tags: z.string().trim().nullable().optional(),
    featured: z.boolean().default(false),
    coverImageUrl: z.string().trim().nullable().optional(),
  })
  .refine((data) => data.endPage >= data.startPage, {
    message: 'La página final no puede ser menor que la página de inicio',
    path: ['endPage'],
  });

export type ArticleInput = z.infer<typeof ArticleInputSchema>;

export interface ArticleAdminDTO {
  id: number;
  magazineId: number;
  magazineName: string;
  issueId: number;
  issueNumber: string;
  issueYear: number;
  issueMonth?: string | null;
  title: string;
  subtitle?: string | null;
  author?: string | null;
  photographer?: string | null;
  startPage: number;
  endPage: number;
  city?: string | null;
  region?: string | null;
  country: string;
  locationSearchIndex: string;
  synopsis: string;
  tags?: string | null;
  featured: boolean;
  coverImageUrl?: string | null;
  createdAt?: string | null;
}

export interface MagazineIssueOptionDTO {
  id: number;
  magazineId: number;
  magazineName: string;
  issueNumber: string;
  year: number;
  month?: string | null;
  label: string;
}

/**
 * Builds the composite search index string for indexing and searching.
 */
export function buildLocationSearchIndex(
  city?: string | null,
  region?: string | null,
  country?: string | null
): string {
  const parts = [city, region, country]
    .map((p) => p?.trim())
    .filter((p): p is string => Boolean(p && p.length > 0));

  return parts.join(', ');
}
