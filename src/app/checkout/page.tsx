'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AppLayout, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { formatPrice, formatEventDate } from '@/lib/format'
import { CreditCardIcon, Banknote, Trash2, Plus, Minus } from 'lucide-react'
import { PLATFORM_FEE_PERCENTAGE, PLATFORM_FEE_FIXED } from '@/lib/constants'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, clearCart, getTotalPrice, removeItem, updateQuantity } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<'FINTOC' | 'CARD' | null>(null)
  const [loading, setLoading] = useState(false)

  if (!session) {
    router.push('/auth/login?callbackUrl=/checkout')
    return null
  }

  if (items.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-muted-foreground mb-4">
              Agrega algunos tickets para continuar
            </p>
            <Button onClick={() => router.push('/events')}>
              Ver eventos
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  const subtotal = getTotalPrice()
  const platformFee = Math.ceil(subtotal * PLATFORM_FEE_PERCENTAGE) + PLATFORM_FEE_FIXED
  const total = subtotal + platformFee

  const handleCheckout = async () => {
    if (!paymentMethod) return

    setLoading(true)

    try {
      // Create order for each item
      for (const item of items) {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: item.eventId,
            quantity: item.quantity,
            paymentMethod
          })
        })

        if (!response.ok) {
          throw new Error('Failed to create order')
        }

        const { order } = await response.json()
        console.log('Order created:', order.id)
      }

      // Clear cart
      clearCart()

      // Redirect to confirmation
      router.push('/checkout/confirmation')
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error al procesar el pago. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <PageHeader title="Checkout" />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Resumen de Compra
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.eventId}
                    className="p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.eventTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatEventDate(item.eventDate)}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.venue}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.eventId)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar del carrito"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">Cantidad:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.eventId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-lg font-bold text-foreground w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.eventId, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          x {formatPrice(item.unitPrice / 100)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground text-lg">
                          {formatPrice((item.unitPrice * item.quantity) / 100)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Método de Pago
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('FINTOC')}
                  className={`w-full p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'FINTOC'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Banknote className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-foreground">Fintoc</h3>
                      <p className="text-sm text-muted-foreground">
                        Pago directo desde tu banco (A2A)
                      </p>
                    </div>
                    {paymentMethod === 'FINTOC' && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('CARD')}
                  className={`w-full p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'CARD'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCardIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-foreground">
                        Tarjeta de Crédito/Débito
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                    {paymentMethod === 'CARD' && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </Card>
          </div>

          {/* Total & Checkout */}
          <div>
            <Card className="border-2 border-primary/20 bg-card p-6 sticky top-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Total</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal / 100)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Comisión de servicio</span>
                  <span className="text-foreground">{formatPrice(platformFee)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-primary text-2xl">
                      {formatPrice(total / 100)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={!paymentMethod || loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
              >
                {loading ? 'Procesando...' : 'Proceder al Pago'}
              </Button>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Al continuar, aceptas los términos y condiciones
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
