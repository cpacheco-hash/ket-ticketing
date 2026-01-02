import { z } from 'zod'

export const createOrderSchema = z.object({
  eventId: z.string().cuid('ID de evento inválido'),
  quantity: z.number().int().positive().max(10, 'Máximo 10 tickets por orden'),
  paymentMethod: z.enum(['FINTOC', 'CARD', 'WALLET'], {
    errorMap: () => ({ message: 'Método de pago inválido' })
  })
})

export const processPaymentSchema = z.object({
  orderId: z.string().cuid('ID de orden inválido'),
  paymentMethod: z.enum(['FINTOC', 'CARD', 'WALLET']),
  // Fintoc specific
  institutionId: z.string().optional(),
  // Card specific
  cardToken: z.string().optional(),
  // Wallet specific
  useWalletBalance: z.boolean().optional()
})

export const fintocWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    id: z.string(),
    object: z.string(),
    amount: z.number(),
    currency: z.string(),
    status: z.enum(['pending', 'succeeded', 'failed']),
    metadata: z.record(z.string())
  })
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>
export type FintocWebhookInput = z.infer<typeof fintocWebhookSchema>
