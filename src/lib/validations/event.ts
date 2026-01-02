import { z } from 'zod'

export const createEventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),

  venueId: z.string().cuid('ID de venue inválido'),
  artistId: z.string().cuid('ID de artista inválido'),

  date: z.string().datetime('Fecha inválida').or(z.date()),
  doors: z.string().datetime('Fecha inválida').or(z.date()),

  price: z.number().int().positive('El precio debe ser positivo'),
  currency: z.string().default('CLP'),

  totalTickets: z.number().int().positive('Debe haber al menos 1 ticket'),
  availableTickets: z.number().int().nonnegative('Tickets disponibles debe ser 0 o mayor'),

  images: z.array(z.string().url()).min(1, 'Debe haber al menos una imagen'),
  genres: z.array(z.string()).min(1, 'Debe haber al menos un género'),

  status: z.enum(['UPCOMING', 'ON_SALE', 'SOLD_OUT', 'CANCELLED', 'COMPLETED']).default('UPCOMING')
})

export const updateEventSchema = createEventSchema.partial()

export const searchEventsSchema = z.object({
  query: z.string().optional(),
  genreFilter: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  priceMin: z.number().nonnegative().optional(),
  priceMax: z.number().positive().optional(),
  venueId: z.string().cuid().optional(),
  artistId: z.string().cuid().optional(),
  status: z.enum(['UPCOMING', 'ON_SALE', 'SOLD_OUT', 'CANCELLED', 'COMPLETED']).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type SearchEventsInput = z.infer<typeof searchEventsSchema>
