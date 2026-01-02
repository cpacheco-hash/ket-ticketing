import { z } from 'zod'

export const transferTicketSchema = z.object({
  toUserId: z.string().cuid('ID de usuario inválido').or(
    z.string().email('Email inválido')
  )
})

export const createTicketsSchema = z.object({
  orderId: z.string().cuid('ID de orden inválido'),
  eventId: z.string().cuid('ID de evento inválido'),
  quantity: z.number().int().positive().max(10, 'Máximo 10 tickets por orden')
})

export const validateQRSchema = z.object({
  qrCode: z.string().min(1, 'QR code requerido'),
  eventId: z.string().cuid('ID de evento inválido')
})

export type TransferTicketInput = z.infer<typeof transferTicketSchema>
export type CreateTicketsInput = z.infer<typeof createTicketsSchema>
export type ValidateQRInput = z.infer<typeof validateQRSchema>
