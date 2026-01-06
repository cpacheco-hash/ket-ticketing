import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/discount-codes/validate
 * Validates a discount code and returns discount details
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, eventId } = body

    if (!code) {
      return NextResponse.json(
        { message: 'Código requerido' },
        { status: 400 }
      )
    }

    // Find discount code
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!discountCode) {
      return NextResponse.json(
        { message: 'Código no válido' },
        { status: 404 }
      )
    }

    // Validate active
    if (!discountCode.active) {
      return NextResponse.json(
        { message: 'Código desactivado' },
        { status: 400 }
      )
    }

    // Validate date range
    const now = new Date()
    if (now < discountCode.validFrom) {
      return NextResponse.json(
        { message: 'Código aún no válido' },
        { status: 400 }
      )
    }

    if (now > discountCode.validUntil) {
      return NextResponse.json(
        { message: 'Código expirado' },
        { status: 400 }
      )
    }

    // Validate event
    if (discountCode.eventId && discountCode.eventId !== eventId) {
      return NextResponse.json(
        { message: 'Código no válido para este evento' },
        { status: 400 }
      )
    }

    // Validate max uses
    if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
      return NextResponse.json(
        { message: 'Código alcanzó el límite de usos' },
        { status: 400 }
      )
    }

    // Return valid discount
    return NextResponse.json({
      id: discountCode.id,
      code: discountCode.code,
      type: discountCode.type,
      value: discountCode.value,
    })
  } catch (error) {
    console.error('Error validating discount code:', error)
    return NextResponse.json(
      { message: 'Error al validar código' },
      { status: 500 }
    )
  }
}
