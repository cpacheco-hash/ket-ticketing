import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/artists - List all artists
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 100

    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } }
      ]
    }

    const artists = await prisma.artist.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        genres: true,
        bio: true,
        spotifyId: true,
        _count: {
          select: {
            events: true,
            followers: true,
          }
        }
      },
      orderBy: {
        name: 'asc'
      },
      take: limit
    })

    return NextResponse.json(artists)
  } catch (error) {
    console.error('Error fetching artists:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
