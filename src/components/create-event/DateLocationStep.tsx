'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { ChevronRight, ChevronLeft, Calendar, MapPin, Plus } from 'lucide-react'

// Simplified schema for client-side (dates as strings)
const dateLocationClientSchema = z.object({
  date: z.string().min(1, 'La fecha del evento es requerida'),
  doors: z.string().min(1, 'La hora de apertura es requerida'),
  venueId: z.string().min(1, 'Selecciona un venue'),
})

type DateLocationClientInput = z.infer<typeof dateLocationClientSchema>

interface DateLocationStepProps {
  data: Partial<any>
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

interface Venue {
  id: string
  name: string
  address: string
  city: string
  capacity: number
}

export function DateLocationStep({ data, onUpdate, onNext, onBack }: DateLocationStepProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoadingVenues, setIsLoadingVenues] = useState(true)
  const [showCreateVenue, setShowCreateVenue] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DateLocationClientInput>({
    resolver: zodResolver(dateLocationClientSchema),
    defaultValues: {
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
      doors: data.doors ? new Date(data.doors).toISOString().slice(0, 16) : '',
      venueId: data.venueId || '',
    },
  })

  const selectedVenueId = watch('venueId')
  const selectedVenue = venues.find((v) => v.id === selectedVenueId)

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch('/api/venues')
        if (response.ok) {
          const data = await response.json()
          setVenues(data)
        }
      } catch (error) {
        console.error('Error fetching venues:', error)
      } finally {
        setIsLoadingVenues(false)
      }
    }
    fetchVenues()
  }, [])

  const onSubmit = (formData: DateLocationClientInput) => {
    const updatedData = {
      date: new Date(formData.date),
      doors: new Date(formData.doors),
      venueId: formData.venueId,
    }
    onUpdate(updatedData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Fecha y Ubicación</h2>
        <p className="text-gray-400">
          ¿Cuándo y dónde será tu evento?
        </p>
      </div>

      {/* Event Date */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-300">
          <Calendar className="inline h-4 w-4 mr-2" />
          Fecha del evento *
        </label>
        <Input
          id="date"
          type="date"
          {...register('date')}
          min={new Date().toISOString().split('T')[0]}
          className={`
            bg-gray-900 border-gray-700 text-white
            focus:border-cyan-500 focus:ring-cyan-500
            ${errors.date ? 'border-red-500' : ''}
          `}
        />
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Doors Time */}
      <div className="space-y-2">
        <label htmlFor="doors" className="block text-sm font-medium text-gray-300">
          Apertura de puertas *
        </label>
        <Input
          id="doors"
          type="datetime-local"
          {...register('doors')}
          className={`
            bg-gray-900 border-gray-700 text-white
            focus:border-cyan-500 focus:ring-cyan-500
            ${errors.doors ? 'border-red-500' : ''}
          `}
        />
        {errors.doors && (
          <p className="text-sm text-red-500">{errors.doors.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Hora en que los asistentes pueden ingresar al venue
        </p>
      </div>

      {/* Venue Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">
            <MapPin className="inline h-4 w-4 mr-2" />
            Venue *
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCreateVenue(!showCreateVenue)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-1" />
            Crear nuevo
          </Button>
        </div>

        {isLoadingVenues ? (
          <div className="text-gray-400 text-sm">Cargando venues...</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {venues.map((venue) => {
              const isSelected = venue.id === selectedVenueId
              return (
                <label
                  key={venue.id}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer
                    transition-all duration-200
                    ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                    }
                  `}
                >
                  <input
                    type="radio"
                    value={venue.id}
                    {...register('venueId')}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white">{venue.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {venue.address}, {venue.city}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Capacidad: {venue.capacity.toLocaleString()} personas
                      </p>
                    </div>
                    {isSelected && (
                      <div className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        )}

        {errors.venueId && (
          <p className="text-sm text-red-500">{errors.venueId.message}</p>
        )}

        {showCreateVenue && (
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              La creación de venues inline estará disponible próximamente.
              Por ahora, contacta al administrador para agregar un nuevo venue.
            </p>
          </div>
        )}
      </div>

      {/* Selected Venue Summary */}
      {selectedVenue && (
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <h4 className="font-bold text-cyan-400 mb-2">Venue seleccionado</h4>
          <p className="text-white font-medium">{selectedVenue.name}</p>
          <p className="text-sm text-gray-300">{selectedVenue.address}, {selectedVenue.city}</p>
        </div>
      )}

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
