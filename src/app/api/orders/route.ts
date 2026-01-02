import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createOrderSchema } from '@/lib/validations/payment'
import { z } from 'zod'
import { PLATFORM_FEE_PERCENTAGE, PLATFORM_FEE_FIXED } from '@/lib/constants'

// POST /api/orders - Create new order
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
    const validated = createOrderSchema.parse(body)

    // Get event
    const event = await prisma.event.findUnique({
      where: { id: validated.eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check availability
    if (event.availableTickets < validated.quantity) {
      return NextResponse.json(
        { error: 'Not enough tickets available' },
        { status: 400 }
      )
    }

    // Calculate total
    const subtotal = event.price * validated.quantity
    const platformFee = Math.ceil(subtotal * PLATFORM_FEE_PERCENTAGE) + PLATFORM_FEE_FIXED
    const total = subtotal + platformFee

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        eventId: validated.eventId,
        quantity: validated.quantity,
        unitPrice: event.price,
        total,
        currency: event.currency,
        paymentMethod: validated.paymentMethod,
        paymentStatus: 'PENDING'
      },
      include: {
        event: {
          include: {
            venue: true,
            artist: true
          }
        }
      }
    })

    // Reserve tickets (decrease available count)
    await prisma.event.update({
      where: { id: validated.eventId },
      data: {
        availableTickets: {
          decrement: validated.quantity
        }
      }
    })

    return NextResponse.json({
      order,
      pricing: {
        subtotal,
        platformFee,
        total
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        event: {
          include: {
            venue: true,
            artist: true
          }
        },
        payment: true,
        tickets: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
