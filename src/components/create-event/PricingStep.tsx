'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { pricingSchema, type PricingInput } from '@/lib/validations/create-event'
import { ChevronRight, ChevronLeft, DollarSign, Ticket } from 'lucide-react'

interface PricingStepProps {
  data: Partial<PricingInput>
  onUpdate: (data: Partial<PricingInput>) => void
  onNext: () => void
  onBack: () => void
}

export function PricingStep({ data, onUpdate, onNext, onBack }: PricingStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PricingInput>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      price: data.price || 0,
      totalTickets: data.totalTickets || 100,
    },
  })

  const price = watch('price')
  const totalTickets = watch('totalTickets')

  const onSubmit = (formData: PricingInput) => {
    onUpdate(formData)
    onNext()
  }

  // Calculate estimated revenue
  const estimatedRevenue = price * totalTickets
  const platformFee = Math.round(estimatedRevenue * 0.10) // 10% platform fee
  const netRevenue = estimatedRevenue - platformFee

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Precios y Capacidad</h2>
        <p className="text-gray-400">
          Define el precio de las entradas y cuántas estarán disponibles
        </p>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label htmlFor="price" className="block text-sm font-medium text-gray-300">
          <DollarSign className="inline h-4 w-4 mr-2" />
          Precio por entrada *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>
          <Input
            id="price"
            type="number"
            step="1"
            min="0"
            {...register('price', { valueAsNumber: true })}
            placeholder="15000"
            className={`
              pl-8 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500
              focus:border-cyan-500 focus:ring-cyan-500
              ${errors.price ? 'border-red-500' : ''}
            `}
          />
        </div>
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Precio en pesos chilenos (CLP)
        </p>
      </div>

      {/* Total Tickets */}
      <div className="space-y-2">
        <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-300">
          <Ticket className="inline h-4 w-4 mr-2" />
          Cantidad de entradas disponibles *
        </label>
        <Input
          id="totalTickets"
          type="number"
          step="1"
          min="1"
          {...register('totalTickets', { valueAsNumber: true })}
          placeholder="100"
          className={`
            bg-gray-900 border-gray-700 text-white placeholder:text-gray-500
            focus:border-cyan-500 focus:ring-cyan-500
            ${errors.totalTickets ? 'border-red-500' : ''}
          `}
        />
        {errors.totalTickets && (
          <p className="text-sm text-red-500">{errors.totalTickets.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Asegúrate de no exceder la capacidad del venue
        </p>
      </div>

      {/* Revenue Projection */}
      {price > 0 && totalTickets > 0 && (
        <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-lg space-y-4">
          <h3 className="font-bold text-cyan-400 text-lg">Proyección de Ingresos</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Ingresos brutos</span>
              <span className="text-white font-bold text-xl">
                ${estimatedRevenue.toLocaleString('es-CL')}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Comisión plataforma (10%)</span>
              <span className="text-gray-400">
                -${platformFee.toLocaleString('es-CL')}
              </span>
            </div>

            <div className="pt-3 border-t border-cyan-500/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">Ingresos netos estimados</span>
                <span className="text-cyan-400 font-black text-2xl">
                  ${netRevenue.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 pt-2">
            * Esta es una estimación basada en el precio y cantidad de entradas.
            Los ingresos finales pueden variar según descuentos, reembolsos y ventas reales.
          </p>
        </div>
      )}

      {/* Pricing Tips */}
      <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
        <h4 className="font-bold text-white mb-3">Consejos de precio</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>Investiga eventos similares en tu ciudad para establecer un precio competitivo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>Considera ofrecer early bird pricing con códigos de descuento</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>Revisa la capacidad real del venue antes de fijar la cantidad de entradas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>Los precios incluyen comisión de plataforma (10%) y procesamiento de pagos</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-gray-800">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Anterior
        </Button>
        <Button
          type="submit"
          size="lg"
          className="bg-white text-black hover:bg-gray-200 font-bold"
        >
          Continuar
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}
