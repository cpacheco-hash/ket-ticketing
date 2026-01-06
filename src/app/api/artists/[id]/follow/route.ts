import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * POST /api/artists/[id]/follow
 * Follow an artist
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: params.id },
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Check if already following
    const existing = await prisma.follow.findUnique({
      where: {
        userId_artistId: {
          userId: session.user.id,
          artistId: params.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Already following', follow: existing },
        { status: 200 }
      )
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        userId: session.user.id,
        artistId: params.id,
      },
    })

    return NextResponse.json({ follow }, { status: 201 })
  } catch (error) {
    console.error('Error following artist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/artists/[id]/follow
 * Unfollow an artist
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete follow relationship
    await prisma.follow.deleteMany({
      where: {
        userId: session.user.id,
        artistId: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unfollowing artist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/artists/[id]/follow
 * Check if user is following an artist
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ isFollowing: false })
    }

    const follow = await prisma.follow.findUnique({
      where: {
        userId_artistId: {
          userId: session.user.id,
          artistId: params.id,
        },
      },
    })

    return NextResponse.json({ isFollowing: !!follow })
  } catch (error) {
    console.error('Error checking follow status:', error)
    return NextResponse.json({ isFollowing: false })
  }
}
