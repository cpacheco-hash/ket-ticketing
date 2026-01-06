import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

/**
 * GET /api/search/instant
 * Instant search endpoint for events, artists, and venues
 * Returns categorized results for autocomplete/dropdown
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (!query || query.length < 2) {
      return NextResponse.json({
        events: [],
        artists: [],
        venues: [],
        total: 0,
      })
    }

    const searchQuery = query.trim()

    // Search in parallel for better performance
    const [events, artists, venues] = await Promise.all([
      // Search Events
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
          ],
          date: { gte: new Date() }, // Only upcoming events
          status: 'ON_SALE',
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              lat: true,
              lng: true,
            },
          },
          artist: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        take: 5,
        orderBy: { date: 'asc' },
      }),

      // Search Artists
      prisma.artist.findMany({
        where: {
          name: { contains: searchQuery, mode: 'insensitive' },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          genres: true,
          _count: {
            select: {
              events: {
                where: {
                  date: { gte: new Date() },
                  status: 'ON_SALE',
                },
              },
            },
          },
        },
        take: 3,
        orderBy: { name: 'asc' },
      }),

      // Search Venues
      prisma.venue.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { city: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          address: true,
          lat: true,
          lng: true,
          _count: {
            select: {
              events: {
                where: {
                  date: { gte: new Date() },
                  status: 'ON_SALE',
                },
              },
            },
          },
        },
        take: 3,
        orderBy: { name: 'asc' },
      }),
    ])

    // Calculate distances if location provided
    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)

      events.forEach((event) => {
        if (event.venue.lat && event.venue.lng) {
          const distance = calculateDistance(
            { lat: userLat, lng: userLng },
            { lat: event.venue.lat, lng: event.venue.lng }
          )
          ;(event as any).distance = distance
        }
      })

      // Sort by distance if we have location
      events.sort((a: any, b: any) => {
        if (a.distance && b.distance) {
          return a.distance - b.distance
        }
        return 0
      })
    }

    const total = events.length + artists.length + venues.length

    return NextResponse.json({
      events,
      artists,
      venues,
      total,
    })
  } catch (error) {
    console.error('Instant search error:', error)
    return NextResponse.json(
      { error: 'Search failed', events: [], artists: [], venues: [], total: 0 },
      { status: 500 }
    )
  }
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 6371 // Earth's radius in kilometers

  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
