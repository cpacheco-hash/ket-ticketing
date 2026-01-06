import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Format price in Chilean Pesos
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(amount)
}

/**
 * Format currency (alias for formatPrice)
 */
export function formatCurrency(amount: number): string {
  return formatPrice(amount)
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr, { locale: es })
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'PPP p', { locale: es })
}

/**
 * Format time only
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'p', { locale: es })
}

/**
 * Format relative time (e.g., "hace 2 horas")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: es })
}

/**
 * Format event date range
 */
export function formatEventDate(date: Date | string, doors?: Date | string): string {
  const eventDate = typeof date === 'string' ? new Date(date) : date
  const doorsDate = doors ? (typeof doors === 'string' ? new Date(doors) : doors) : null

  const dateStr = format(eventDate, 'EEEE d MMMM yyyy', { locale: es })
  const timeStr = format(eventDate, 'HH:mm', { locale: es })

  if (doorsDate) {
    const doorsTime = format(doorsDate, 'HH:mm', { locale: es })
    return `${dateStr} - Puertas: ${doorsTime} | Evento: ${timeStr}`
  }

  return `${dateStr} - ${timeStr}`
}

/**
 * Check if event is happening soon (within 24 hours)
 */
export function isEventSoon(date: Date | string): boolean {
  const eventDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = eventDate.getTime() - now.getTime()
  const hours = diff / (1000 * 60 * 60)
  return hours > 0 && hours <= 24
}

/**
 * Check if event has passed
 */
export function isEventPast(date: Date | string): boolean {
  const eventDate = typeof date === 'string' ? new Date(date) : date
  return isPast(eventDate)
}

/**
 * Check if date is in the future
 */
export function isDateFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return isFuture(dateObj)
}

/**
 * Format phone number (Chilean format)
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Format as +56 9 1234 5678
  if (cleaned.startsWith('56')) {
    const number = cleaned.substring(2)
    return `+56 ${number.substring(0, 1)} ${number.substring(1, 5)} ${number.substring(5)}`
  }

  if (cleaned.startsWith('9') && cleaned.length === 9) {
    return `+56 ${cleaned.substring(0, 1)} ${cleaned.substring(1, 5)} ${cleaned.substring(5)}`
  }

  return phone
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Format capacity (e.g., "150 / 200")
 */
export function formatCapacity(available: number, total: number): string {
  return `${available} / ${total}`
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
