import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createEventSchema, searchEventsSchema } from '@/lib/validations/event'
import { z } from 'zod'

// GET /api/events - List events with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const params = {
      query: searchParams.get('query') || undefined,
      genreFilter: searchParams.get('genres')?.split(',') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
      priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
      venueId: searchParams.get('venueId') || undefined,
      artistId: searchParams.get('artistId') || undefined,
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20
    }

    // Validate input
    const validated = searchEventsSchema.parse(params)

    // Build where clause
    const where: any = {}

    if (validated.query) {
      where.OR = [
        { title: { contains: validated.query, mode: 'insensitive' } },
        { description: { contains: validated.query, mode: 'insensitive' } }
      ]
    }

    if (validated.genreFilter && validated.genreFilter.length > 0) {
      where.genres = { hasSome: validated.genreFilter }
    }

    if (validated.dateFrom || validated.dateTo) {
      where.date = {}
      if (validated.dateFrom) where.date.gte = new Date(validated.dateFrom)
      if (validated.dateTo) where.date.lte = new Date(validated.dateTo)
    }

    if (validated.priceMin !== undefined || validated.priceMax !== undefined) {
      where.price = {}
      if (validated.priceMin) where.price.gte = validated.priceMin * 100 // Convert to cents
      if (validated.priceMax) where.price.lte = validated.priceMax * 100
    }

    if (validated.venueId) where.venueId = validated.venueId
    if (validated.artistId) where.artistId = validated.artistId
    if (validated.status) where.status = validated.status

    // Fetch events
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          venue: true,
          artist: true
        },
        skip: (validated.page - 1) * validated.limit,
        take: validated.limit,
        orderBy: { date: 'asc' }
      }),
      prisma.event.count({ where })
    ])

    return NextResponse.json({
      events,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total,
        totalPages: Math.ceil(total / validated.limit)
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Helper function to generate slug
    const generateSlug = (text: string) => {
      return text.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Create or find artist
    let artist
    if (body.artist?.name) {
      const artistSlug = generateSlug(body.artist.name)

      // Try to find existing artist by slug
      artist = await prisma.artist.findUnique({
        where: { slug: artistSlug }
      })

      // If not found, create new artist
      if (!artist) {
        artist = await prisma.artist.create({
          data: {
            name: body.artist.name,
            slug: artistSlug,
            bio: body.artist.bio || '',
            genres: body.artist.genres || [],
            spotifyId: body.artist.spotifyId || null,
          }
        })
      }
    }

    // Create or find venue
    let venue
    if (body.venue?.name) {
      const venueSlug = generateSlug(body.venue.name)

      // Try to find existing venue by slug
      venue = await prisma.venue.findUnique({
        where: { slug: venueSlug }
      })

      // If not found, create new venue
      if (!venue) {
        venue = await prisma.venue.create({
          data: {
            name: body.venue.name,
            slug: venueSlug,
            address: body.venue.address || '',
            city: body.venue.city || 'Santiago',
            capacity: body.venue.capacity || 1000,
          }
        })
      }
    }

    // Validate artist and venue exist
    if (!artist || !venue) {
      return NextResponse.json(
        { error: 'Artista y venue son requeridos' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = generateSlug(body.title)

    // Create event
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description || '',
        slug: slug,
        artistId: artist.id,
        venueId: venue.id,
        date: new Date(body.date),
        doors: new Date(body.doorsOpen || body.date),
        price: body.price,
        currency: body.currency || 'CLP',
        totalTickets: body.totalTickets,
        availableTickets: body.totalTickets,
        images: body.images || [],
        genres: body.artist?.genres || [],
        status: 'ON_SALE'
      },
      include: {
        venue: true,
        artist: true
      }
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Error al crear evento', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
