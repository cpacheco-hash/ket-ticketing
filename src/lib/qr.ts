import QRCode from 'qrcode'
import { createHmac, randomBytes } from 'crypto'
import { QR_CODE_SIZE, QR_CODE_ROTATION_MINUTES } from './constants'

interface QRData {
  ticketId: string
  eventId: string
  userId: string
  timestamp: number
  nonce: string
}

/**
 * Generate HMAC signature for QR code data
 */
function generateSignature(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('hex')
}

/**
 * Generate QR code data with signature
 */
export function generateQRData(
  ticketId: string,
  eventId: string,
  userId: string,
  secret: string
): string {
  const qrData: QRData = {
    ticketId,
    eventId,
    userId,
    timestamp: Date.now(),
    nonce: randomBytes(16).toString('hex')
  }

  const dataString = JSON.stringify(qrData)
  const signature = generateSignature(dataString, secret)

  return JSON.stringify({
    data: qrData,
    signature
  })
}

/**
 * Validate QR code signature and freshness
 */
export function validateQRData(
  qrString: string,
  secret: string
): { valid: boolean; data?: QRData; error?: string } {
  try {
    const { data, signature } = JSON.parse(qrString)

    // Verify signature
    const dataString = JSON.stringify(data)
    const expectedSignature = generateSignature(dataString, secret)

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Firma inválida' }
    }

    // Check timestamp (QR should be fresh - within rotation window)
    const now = Date.now()
    const age = (now - data.timestamp) / 1000 / 60 // minutes

    if (age > QR_CODE_ROTATION_MINUTES) {
      return { valid: false, error: 'QR code expirado' }
    }

    return { valid: true, data }
  } catch (error) {
    return { valid: false, error: 'QR code inválido' }
  }
}

/**
 * Generate QR code image (data URL)
 */
export async function generateQRCode(
  ticketId: string,
  eventId: string,
  userId: string,
  secret: string
): Promise<string> {
  const qrData = generateQRData(ticketId, eventId, userId, secret)

  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: QR_CODE_SIZE,
      margin: 2,
      color: {
        dark: '#0A1929',  // Dark color
        light: '#FFFFFF'  // Light color
      },
      errorCorrectionLevel: 'H' // High error correction
    })

    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate QR code as SVG string
 */
export async function generateQRCodeSVG(
  ticketId: string,
  eventId: string,
  userId: string,
  secret: string
): Promise<string> {
  const qrData = generateQRData(ticketId, eventId, userId, secret)

  try {
    const qrCodeSVG = await QRCode.toString(qrData, {
      type: 'svg',
      width: QR_CODE_SIZE,
      margin: 2,
      color: {
        dark: '#0A1929',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })

    return qrCodeSVG
  } catch (error) {
    console.error('Error generating QR code SVG:', error)
    throw new Error('Failed to generate QR code SVG')
  }
}

/**
 * Check if QR code needs rotation based on timestamp
 */
export function shouldRotateQR(lastRotation: Date): boolean {
  const now = new Date()
  const diff = (now.getTime() - lastRotation.getTime()) / 1000 / 60 // minutes
  return diff >= QR_CODE_ROTATION_MINUTES
}
