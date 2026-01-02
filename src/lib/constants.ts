// Application Constants

export const APP_NAME = 'KET'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Pricing
export const PLATFORM_FEE_PERCENTAGE = 0.05 // 5%
export const PLATFORM_FEE_FIXED = 500 // CLP $500

// Tickets
export const QR_CODE_ROTATION_MINUTES = 15
export const QR_CODE_SIZE = 256
export const TICKET_RESERVATION_MINUTES = 15

// Waitlist
export const WAITLIST_PURCHASE_WINDOW_MINUTES = 15

// Cancellation
export const MIN_CANCELLATION_HOURS = 24

// Pagination
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// Upload
export const MAX_IMAGE_SIZE_MB = 5
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Event Status
export const EVENT_STATUS = {
  UPCOMING: 'UPCOMING',
  ON_SALE: 'ON_SALE',
  SOLD_OUT: 'SOLD_OUT',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
} as const

// Ticket Status
export const TICKET_STATUS = {
  ACTIVE: 'ACTIVE',
  USED: 'USED',
  TRANSFERRED: 'TRANSFERRED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
} as const

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const

// Payment Methods
export const PAYMENT_METHODS = {
  FINTOC: 'FINTOC',
  CARD: 'CARD',
  WALLET: 'WALLET'
} as const

// Transfer Status
export const TRANSFER_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
} as const

// Waitlist Status
export const WAITLIST_STATUS = {
  WAITING: 'WAITING',
  NOTIFIED: 'NOTIFIED',
  PURCHASED: 'PURCHASED',
  EXPIRED: 'EXPIRED',
  REMOVED: 'REMOVED'
} as const
