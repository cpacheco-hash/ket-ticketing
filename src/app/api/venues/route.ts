import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/venues - List all venues
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const city = searchParams.get('city')
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 100

    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    const venues = await prisma.venue.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        city: true,
        capacity: true,
        lat: true,
        lng: true,
        _count: {
          select: {
            events: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      },
      take: limit
    })

    return NextResponse.json(venues)
  } catch (error) {
    console.error('Error fetching venues:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
