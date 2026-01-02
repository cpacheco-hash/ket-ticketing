import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { transferTicketSchema } from '@/lib/validations/ticket'
import { z } from 'zod'

// POST /api/tickets/[id]/transfer - Transfer ticket to another user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = transferTicketSchema.parse(body)

    // Get ticket
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        status: 'ACTIVE'
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found or cannot be transferred' },
        { status: 404 }
      )
    }

    // Find recipient user
    let toUser
    if (validated.toUserId.includes('@')) {
      // It's an email
      toUser = await prisma.user.findUnique({
        where: { email: validated.toUserId }
      })
    } else {
      // It's a user ID
      toUser = await prisma.user.findUnique({
        where: { id: validated.toUserId }
      })
    }

    if (!toUser) {
      return NextResponse.json(
        { error: 'Recipient user not found' },
        { status: 404 }
      )
    }

    // Create transfer
    const transfer = await prisma.transfer.create({
      data: {
        ticketId: ticket.id,
        fromUserId: session.user.id,
        toUserId: toUser.id,
        status: 'PENDING'
      }
    })

    // Update ticket status
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'TRANSFERRED' }
    })

    return NextResponse.json({
      transfer,
      message: 'Transfer initiated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error transferring ticket:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
