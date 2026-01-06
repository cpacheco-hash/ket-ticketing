'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { basicInfoSchema, type BasicInfoInput } from '@/lib/validations/create-event'
import { ChevronRight, Music } from 'lucide-react'

interface BasicInfoStepProps {
  data: Partial<BasicInfoInput>
  onUpdate: (data: Partial<BasicInfoInput>) => void
  onNext: () => void
  onBack?: () => void
}

const GENRE_OPTIONS = [
  'Rock',
  'Pop',
  'Hip Hop',
  'Electronic',
  'Jazz',
  'Reggaeton',
  'Cumbia',
  'Metal',
  'Indie',
  'Salsa',
  'Techno',
  'House',
  'R&B',
  'Soul',
  'Punk',
  'Reggae',
  'Folk',
  'Classical',
]

export function BasicInfoStep({ data, onUpdate, onNext }: BasicInfoStepProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(data.genres || [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoInput>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: data.title || '',
      description: data.description || '',
      genres: data.genres || [],
    },
  })

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre)
      } else {
        return [...prev, genre]
      }
    })
  }

  const onSubmit = (formData: BasicInfoInput) => {
    const updatedData = {
      ...formData,
      genres: selectedGenres,
    }
    onUpdate(updatedData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Información Básica</h2>
        <p className="text-gray-400">
          Cuéntanos sobre tu evento. Sé descriptivo y atractivo.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Título del evento *
        </label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Ej: Radiohead en vivo - Tour 2026"
          className={`
            bg-gray-900 border-gray-700 text-white placeholder:text-gray-500
            focus:border-cyan-500 focus:ring-cyan-500
            ${errors.title ? 'border-red-500' : ''}
          `}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Descripción *
        </label>
        <Textarea
          id="description"
          {...register('description')}
          rows={6}
          placeholder="Describe el evento, artistas invitados, setlist esperado, experiencias especiales..."
          className={`
            bg-gray-900 border-gray-700 text-white placeholder:text-gray-500
            focus:border-cyan-500 focus:ring-cyan-500
            ${errors.description ? 'border-red-500' : ''}
          `}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Mínimo 50 caracteres para una buena descripción
        </p>
      </div>

      {/* Genres */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Géneros musicales *
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((genre) => {
            const isSelected = selectedGenres.includes(genre)
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-cyan-500 text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <Music className="inline h-4 w-4 mr-1" />
                {genre}
              </button>
            )
          })}
        </div>
        {selectedGenres.length === 0 && (
          <p className="text-sm text-gray-500">
            Selecciona al menos un género musical
          </p>
        )}
        {selectedGenres.length > 0 && (
          <p className="text-sm text-cyan-400">
            {selectedGenres.length} género{selectedGenres.length > 1 ? 's' : ''} seleccionado{selectedGenres.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-6 border-t border-gray-800">
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
