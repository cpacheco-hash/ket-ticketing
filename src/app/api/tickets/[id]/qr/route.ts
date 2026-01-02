import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateQRCode } from '@/lib/qr'

// GET /api/tickets/[id]/qr - Generate dynamic QR code
export async function GET(
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

    // Get ticket
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        event: true
      }
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Check if ticket is valid
    if (ticket.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: `Ticket is ${ticket.status.toLowerCase()}` },
        { status: 400 }
      )
    }

    // Generate QR code
    const qrCodeDataURL = await generateQRCode(
      ticket.id,
      ticket.eventId,
      ticket.userId,
      ticket.qrSecret
    )

    return NextResponse.json({
      qrCode: qrCodeDataURL,
      ticket: {
        id: ticket.id,
        status: ticket.status,
        event: {
          id: ticket.event.id,
          title: ticket.event.title,
          date: ticket.event.date
        }
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
