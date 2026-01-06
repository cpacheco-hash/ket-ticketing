import { z } from 'zod'

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  genres: z.array(z.string()).min(1, 'Selecciona al menos un género'),
})

// Step 2: Date & Location
export const dateLocationSchema = z.object({
  date: z.date().refine((date) => date > new Date(), {
    message: 'La fecha debe ser futura',
  }),
  doors: z.date(),
  venueId: z.string().min(1, 'Selecciona un venue'),
})

// Step 3: Artist (optional if creating new)
export const artistStepSchema = z.object({
  artistId: z.string().min(1, 'Selecciona o crea un artista'),
})

// Step 4: Pricing
export const pricingSchema = z.object({
  price: z.number().min(0, 'El precio debe ser positivo'),
  totalTickets: z.number().min(1, 'Debe haber al menos 1 entrada'),
})

// Step 5: Images
export const imagesSchema = z.object({
  images: z.array(z.string().url()).min(1, 'Sube al menos una imagen'),
})

// Complete Event Schema
export const createEventSchema = basicInfoSchema
  .merge(dateLocationSchema)
  .merge(pricingSchema)
  .merge(imagesSchema)
  .extend({
    artistId: z.string(),
  })

export type CreateEventInput = z.infer<typeof createEventSchema>
export type BasicInfoInput = z.infer<typeof basicInfoSchema>
export type DateLocationInput = z.infer<typeof dateLocationSchema>
export type PricingInput = z.infer<typeof pricingSchema>
export type ImagesInput = z.infer<typeof imagesSchema>

// Create Artist Schema (inline)
export const createArtistSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  bio: z.string().optional(),
  genres: z.array(z.string()).min(1, 'Selecciona al menos un género'),
  spotifyId: z.string().optional(),
  image: z.string().url().optional(),
})

export type CreateArtistInput = z.infer<typeof createArtistSchema>

// Create Venue Schema (inline)
export const createVenueSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad es requerida'),
  capacity: z.number().min(1, 'La capacidad debe ser al menos 1'),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export type CreateVenueInput = z.infer<typeof createVenueSchema>
