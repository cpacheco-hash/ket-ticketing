// Calendar file generation utilities for MVP

interface CalendarEvent {
  title: string
  description: string
  location: string
  startDate: Date
  endDate?: Date
  duration?: number // in minutes
}

// Format date to ICS format (YYYYMMDDTHHMMSSZ)
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

// Generate ICS file content
export function generateICSContent(event: CalendarEvent): string {
  const startDate = new Date(event.startDate)
  const endDate = event.endDate
    ? new Date(event.endDate)
    : new Date(startDate.getTime() + (event.duration || 120) * 60000)

  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@ket.cl`

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KET//Event Calendar//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${escapeICSText(event.title)}
DESCRIPTION:${escapeICSText(event.description)}
LOCATION:${escapeICSText(event.location)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

  return icsContent
}

// Escape special characters in ICS text
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

// Download ICS file
export function downloadICSFile(event: CalendarEvent): void {
  const icsContent = generateICSContent(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

// Generate Google Calendar URL
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const startDate = new Date(event.startDate)
  const endDate = event.endDate
    ? new Date(event.endDate)
    : new Date(startDate.getTime() + (event.duration || 120) * 60000)

  const formatGoogleDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: event.description,
    location: event.location,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Generate Google Maps directions URL
export function getGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}
