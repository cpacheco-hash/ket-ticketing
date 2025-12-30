// Type definitions for KET

export type EventStatus = 'UPCOMING' | 'ON_SALE' | 'SOLD_OUT' | 'CANCELLED' | 'COMPLETED'
export type PaymentMethod = 'FINTOC' | 'CARD' | 'WALLET'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type TicketStatus = 'ACTIVE' | 'USED' | 'TRANSFERRED' | 'CANCELLED' | 'REFUNDED'

export interface Event {
  id: string
  title: string
  description: string
  slug: string
  date: Date
  doors: Date
  price: number
  currency: string
  totalTickets: number
  availableTickets: number
  images: string[]
  genres: string[]
  status: EventStatus
  venue: Venue
  artist: Artist
}

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  capacity: number
  lat?: number
  lng?: number
}

export interface Artist {
  id: string
  name: string
  genres: string[]
  image?: string
  spotifyId?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  spotifyConnected: boolean
  appleMusicConnected: boolean
}

export interface Ticket {
  id: string
  qrCode: string
  status: TicketStatus
  event: Event
  user: User
}
