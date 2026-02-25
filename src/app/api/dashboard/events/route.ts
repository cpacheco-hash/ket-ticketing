import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/dashboard/events - Get events for the current organizer
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Fetch events organized by the user
    const events = await prisma.event.findMany({
      where: {
        organizerId: userId
      },
      include: {
        venue: true,
        _count: {
          select: {
            tickets: true,
            orders: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Calculate stats
    const now = new Date()
    const upcomingEvents = events.filter(e => new Date(e.date) > now)

    let totalTicketsSold = 0
    let totalRevenue = 0

    events.forEach(event => {
      const sold = event.totalTickets - event.availableTickets
      totalTicketsSold += sold
      if (!event.isFree) {
        totalRevenue += sold * event.price
      }
    })

    return NextResponse.json({
      events,
      stats: {
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        totalTicketsSold,
        totalRevenue
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
