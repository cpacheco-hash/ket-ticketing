'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Calendar, MapPin, DollarSign, Music, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ReviewStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext?: () => void
  onBack: () => void
}

export function ReviewStep({ data, onBack }: ReviewStepProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          genres: data.genres,
          date: data.date,
          doors: data.doors,
          venueId: data.venueId,
          artistId: data.artistId,
          price: data.price,
          totalTickets: data.totalTickets,
          images: data.images,
          status: 'DRAFT', // Create as draft first
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear el evento')
      }

      const event = await response.json()
      setSuccess(true)

      // Redirect to event page after 2 seconds
      setTimeout(() => {
        router.push(`/events/${event.id}`)
      }, 2000)
    } catch (err: any) {
      console.error('Error creating event:', err)
      setError(err.message || 'Error al crear el evento')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-cyan-500" />
        </div>
        <div>
          <h2 className="text-3xl font-black mb-2 text-white">¡Evento Creado!</h2>
          <p className="text-gray-400">
            Tu evento ha sido creado exitosamente. Redirigiendo...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Revisión Final</h2>
        <p className="text-gray-400">
          Revisa todos los detalles antes de publicar tu evento
        </p>
      </div>

      {/* Event Preview Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        {/* Images */}
        {data.images && data.images.length > 0 && (
          <div className="relative aspect-[21/9] bg-gray-800">
            <Image
              src={data.images[0]}
              alt={data.title}
              fill
              className="object-cover"
            />
            {data.images.length > 1 && (
              <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                +{data.images.length - 1} más
              </div>
            )}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h3 className="text-2xl font-black text-white mb-3">{data.title}</h3>
            <p className="text-gray-300 leading-relaxed">{data.description}</p>
          </div>

          {/* Genres */}
          {data.genres && data.genres.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Music className="h-4 w-4 text-gray-400" />
              {data.genres.map((genre: string) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Date & Time */}
          {data.date && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-cyan-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">
                  {format(new Date(data.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                </p>
                {data.doors && (
                  <p className="text-sm text-gray-400">
                    Puertas: {format(new Date(data.doors), "HH:mm", { locale: es })}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Venue */}
          {data.venueId && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-cyan-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">Venue ID: {data.venueId}</p>
                <p className="text-sm text-gray-400">
                  Los detalles del venue se cargarán desde la base de datos
                </p>
              </div>
            </div>
          )}

          {/* Artist */}
          {data.artistId && (
            <div className="flex items-start gap-3">
              <Music className="h-5 w-5 text-cyan-500 mt-0.5" />
              <div>
                <p className="text-white font-medium">Artist ID: {data.artistId}</p>
                <p className="text-sm text-gray-400">
                  Los detalles del artista se cargarán desde la base de datos
                </p>
              </div>
            </div>
          )}

          {/* Pricing */}
          {data.price !== undefined && data.totalTickets && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-cyan-500" />
                  <span className="text-white font-bold">Precio</span>
                </div>
                <span className="text-2xl font-black text-white">
                  ${data.price.toLocaleString('es-CL')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Entradas disponibles</span>
                <span className="text-white font-medium">{data.totalTickets.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">Ingresos estimados</span>
                <span className="text-cyan-400 font-bold">
                  ${(data.price * data.totalTickets).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Sections */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onBack()}
          className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-left"
        >
          <h4 className="font-bold text-white mb-1">Información básica</h4>
          <p className="text-xs text-gray-500">Editar título y descripción</p>
        </button>
        <button
          type="button"
          onClick={() => onBack()}
          className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-left"
        >
          <h4 className="font-bold text-white mb-1">Fecha y ubicación</h4>
          <p className="text-xs text-gray-500">Editar fecha y venue</p>
        </button>
        <button
          type="button"
          onClick={() => onBack()}
          className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-left"
        >
          <h4 className="font-bold text-white mb-1">Artista</h4>
          <p className="text-xs text-gray-500">Cambiar artista</p>
        </button>
        <button
          type="button"
          onClick={() => onBack()}
          className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-left"
        >
          <h4 className="font-bold text-white mb-1">Precios</h4>
          <p className="text-xs text-gray-500">Ajustar precio y capacidad</p>
        </button>
        <button
          type="button"
          onClick={() => onBack()}
          className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-left"
        >
          <h4 className="font-bold text-white mb-1">Imágenes</h4>
          <p className="text-xs text-gray-500">Agregar más imágenes</p>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Important Note */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <h4 className="font-bold text-yellow-400 mb-2">Nota importante</h4>
        <p className="text-sm text-gray-300">
          Tu evento se creará como <strong>BORRADOR</strong> inicialmente.
          Podrás revisarlo y publicarlo desde el panel de administración.
          Una vez publicado, los usuarios podrán comprar entradas.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-gray-800">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isSubmitting}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Anterior
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creando evento...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Crear Evento
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
