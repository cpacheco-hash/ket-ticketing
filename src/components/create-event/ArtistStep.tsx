'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { artistStepSchema } from '@/lib/validations/create-event'
import { ChevronRight, ChevronLeft, Search, Plus, Music } from 'lucide-react'
import Image from 'next/image'

interface ArtistStepProps {
  data: Partial<any>
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

interface Artist {
  id: string
  name: string
  image: string | null
  genres: string[]
  slug: string
}

export function ArtistStep({ data, onUpdate, onNext, onBack }: ArtistStepProps) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoadingArtists, setIsLoadingArtists] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateArtist, setShowCreateArtist] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(artistStepSchema),
    defaultValues: {
      artistId: data.artistId || '',
    },
  })

  const selectedArtistId = watch('artistId')
  const selectedArtist = artists.find((a) => a.id === selectedArtistId)

  useEffect(() => {
    async function fetchArtists() {
      try {
        const response = await fetch('/api/artists')
        if (response.ok) {
          const data = await response.json()
          setArtists(data)
        }
      } catch (error) {
        console.error('Error fetching artists:', error)
      } finally {
        setIsLoadingArtists(false)
      }
    }
    fetchArtists()
  }, [])

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const onSubmit = (formData: any) => {
    onUpdate(formData)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Artista Principal</h2>
        <p className="text-gray-400">
          ¿Quién será el headliner del evento?
        </p>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar artista por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCreateArtist(!showCreateArtist)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear nuevo
          </Button>
        </div>

        {showCreateArtist && (
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              La creación de artistas inline estará disponible próximamente.
              Por ahora, contacta al administrador para agregar un nuevo artista.
            </p>
          </div>
        )}
      </div>

      {/* Artists Grid */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Selecciona un artista *
        </label>

        {isLoadingArtists ? (
          <div className="text-gray-400 text-sm">Cargando artistas...</div>
        ) : filteredArtists.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron artistas</p>
            {searchQuery && (
              <p className="text-sm mt-2">
                Intenta con otro término de búsqueda
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArtists.map((artist) => {
              const isSelected = artist.id === selectedArtistId
              return (
                <label
                  key={artist.id}
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
                    value={artist.id}
                    {...register('artistId')}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-4">
                    {/* Artist Image */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                      {artist.image ? (
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="h-8 w-8 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Artist Info */}
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{artist.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {artist.genres.slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        )}

        {errors.artistId && (
          <p className="text-sm text-red-500">{errors.artistId.message}</p>
        )}
      </div>

      {/* Selected Artist Summary */}
      {selectedArtist && (
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <h4 className="font-bold text-cyan-400 mb-2">Artista seleccionado</h4>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800">
              {selectedArtist.image ? (
                <Image
                  src={selectedArtist.image}
                  alt={selectedArtist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="h-6 w-6 text-gray-600" />
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-medium">{selectedArtist.name}</p>
              <p className="text-sm text-gray-300">
                {selectedArtist.genres.join(', ')}
              </p>
            </div>
          </div>
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
