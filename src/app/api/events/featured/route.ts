import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { subDays } from 'date-fns'

export const dynamic = 'force-dynamic'

/**
 * GET /api/events/featured
 * Returns featured events based on type: trending, recommended, or upcoming
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'trending'
    const session = await getServerSession(authOptions)

    let events: any[]

    switch (type) {
      case 'trending':
        events = await getTrendingEvents()
        break
      case 'recommended':
        events = await getRecommendedEvents(session?.user?.id)
        break
      case 'upcoming':
        events = await getUpcomingEvents()
        break
      default:
        events = await getTrendingEvents()
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching featured events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

/**
 * Get trending events based on recent orders and activity
 */
async function getTrendingEvents() {
  const sevenDaysAgo = subDays(new Date(), 7)

  // Get events with order counts from last 7 days
  const events = await prisma.event.findMany({
    where: {
      date: { gte: new Date() },
      status: 'ON_SALE',
      availableTickets: { gt: 0 },
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
      _count: {
        select: {
          orders: {
            where: {
              createdAt: { gte: sevenDaysAgo },
              paymentStatus: { in: ['COMPLETED', 'PENDING'] },
            },
          },
        },
      },
    },
    take: 50,
  })

  // Sort by recent order count (trending score)
  const sorted = events.sort((a, b) => {
    const scoreA = a._count.orders * 10
    const scoreB = b._count.orders * 10
    return scoreB - scoreA
  })

  return sorted.slice(0, 20).map(event => ({
    ...event,
    _count: undefined, // Remove count from response
  }))
}

/**
 * Get personalized recommended events
 */
async function getRecommendedEvents(userId?: string) {
  if (!userId) {
    // If not logged in, return trending events
    return getTrendingEvents()
  }

  try {
    // Get user's followed artists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        following: {
          where: { followType: 'ARTIST' },
          select: { artistId: true },
        },
      },
    })

    const followedArtistIds = user?.following
      .map(f => f.artistId)
      .filter((id): id is string => id !== null) || []

    // If user has followed artists, prioritize their events
    if (followedArtistIds.length > 0) {
      const events = await prisma.event.findMany({
        where: {
          OR: [
            // Events from followed artists
            {
              artistId: { in: followedArtistIds },
              date: { gte: new Date() },
              status: 'ON_SALE',
            },
          ],
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
        orderBy: { date: 'asc' },
        take: 20,
      })

      if (events.length > 0) {
        return events
      }
    }

    // Fallback to trending events
    return getTrendingEvents()
  } catch (error) {
    console.error('Error getting recommended events:', error)
    return getTrendingEvents()
  }
}

/**
 * Get upcoming events (chronologically)
 */
async function getUpcomingEvents() {
  const events = await prisma.event.findMany({
    where: {
      date: { gte: new Date() },
      status: 'ON_SALE',
      availableTickets: { gt: 0 },
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
    orderBy: { date: 'asc' },
    take: 20,
  })

  return events
}
