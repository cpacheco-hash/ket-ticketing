import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

// GET /api/tickets - Get user's tickets
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          include: {
            venue: true,
            artist: true
          }
        },
        order: {
          select: {
            id: true,
            total: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tickets - Create tickets from order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId, eventId, quantity } = await request.json()

    // Validate order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        paymentStatus: 'COMPLETED'
      },
      include: { event: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or not completed' },
        { status: 404 }
      )
    }

    // Create tickets
    const tickets = await Promise.all(
      Array.from({ length: quantity }).map(async () => {
        const qrSecret = randomBytes(32).toString('hex')

        return prisma.ticket.create({
          data: {
            orderId,
            userId: session.user.id,
            eventId,
            qrCode: randomBytes(16).toString('hex'), // Temporary, will be generated dynamically
            qrSecret,
            status: 'ACTIVE'
          }
        })
      })
    )

    return NextResponse.json({ tickets }, { status: 201 })
  } catch (error) {
    console.error('Error creating tickets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
