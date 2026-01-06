'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, X, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

interface DiscountCodeInputProps {
  eventId: string
  subtotal: number
  onApply: (discount: AppliedDiscount | null) => void
}

export interface AppliedDiscount {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  discountAmount: number
}

export function DiscountCodeInput({ eventId, subtotal, onApply }: DiscountCodeInputProps) {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<AppliedDiscount | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/discount-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), eventId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Código inválido')
        setApplied(null)
        onApply(null)
        return
      }

      // Calculate discount amount
      let discountAmount = 0
      if (data.type === 'PERCENTAGE') {
        discountAmount = Math.round((subtotal * data.value) / 100)
      } else {
        discountAmount = data.value
      }

      // Don't allow discount to exceed subtotal
      if (discountAmount > subtotal) {
        discountAmount = subtotal
      }

      const discount: AppliedDiscount = {
        id: data.id,
        code: data.code,
        type: data.type,
        value: data.value,
        discountAmount,
      }

      setApplied(discount)
      setError(null)
      onApply(discount)
    } catch (err) {
      setError('Error al validar el código')
      setApplied(null)
      onApply(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    setApplied(null)
    setCode('')
    setError(null)
    onApply(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  return (
    <div className="space-y-3">
      <label htmlFor="discount-code" className="block text-sm font-bold text-white">
        Código de descuento
      </label>

      {!applied ? (
        <>
          <div className="flex gap-2">
            <input
              id="discount-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="INGRESA TU CÓDIGO"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-black border-2 border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white uppercase font-mono disabled:opacity-50"
              maxLength={20}
            />
            <Button
              onClick={handleApply}
              disabled={!code.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Aplicar'
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <X className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </>
      ) : (
        <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-white font-mono">{applied.code}</p>
                <p className="text-sm text-gray-400">
                  {applied.type === 'PERCENTAGE'
                    ? `${applied.value}% de descuento`
                    : `${formatCurrency(applied.value)} de descuento`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-green-500">
                -{formatCurrency(applied.discountAmount)}
              </span>
              <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Quitar código"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
