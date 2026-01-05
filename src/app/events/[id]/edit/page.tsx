'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { AppLayout, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import Image from 'next/image'

export default function EditEventPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    venue: '',
    date: '',
    doors: '',
    price: '',
    totalTickets: '',
    description: '',
    genres: '',
    images: [] as string[]
  })

  useEffect(() => {
    if (session && params.id) {
      fetchEvent()
    }
  }, [session, params.id])

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}`)
      if (res.ok) {
        const event = await res.json()

        // Pre-fill form with event data
        setFormData({
          title: event.title || '',
          artist: event.artist?.name || '',
          venue: event.venue?.name || '',
          date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
          doors: event.doors ? new Date(event.doors).toISOString().slice(0, 16) : '',
          price: event.price ? (event.price / 100).toString() : '',
          totalTickets: event.totalTickets?.toString() || '',
          description: event.description || '',
          genres: event.genres?.join(', ') || '',
          images: event.images || []
        })
      } else {
        setError('No se pudo cargar el evento')
      }
    } catch (err) {
      console.error('Error fetching event:', err)
      setError('Error al cargar el evento')
    } finally {
      setFetching(false)
    }
  }

  if (!session) {
    router.push('/auth/login?callbackUrl=/events')
    return null
  }

  // Check if user is admin or organizer
  if (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="border-border bg-card p-8 max-w-md">
            <h2 className="text-2xl font-bold text-foreground mb-4">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-6">
              Solo los administradores y organizadores pueden editar eventos.
            </p>
            <Button onClick={() => router.push('/events')} className="w-full">
              Volver a Eventos
            </Button>
          </Card>
        </div>
      </AppLayout>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al subir la imagen')
      }

      const { url } = await response.json()

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }))
    } catch (err: any) {
      console.error('Error uploading image:', err)
      alert(err.message || 'Error al subir la imagen')
    } finally {
      setUploadingImage(false)
      // Reset input
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
          doors: new Date(formData.doors).toISOString(),
          price: parseInt(formData.price) * 100,
          totalTickets: parseInt(formData.totalTickets),
          genres: formData.genres.split(',').map(g => g.trim()),
          images: formData.images.filter(img => img.trim() !== ''),
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update event')
      }

      alert('Evento actualizado exitosamente')
      router.push(`/events/${params.id}`)
    } catch (err: any) {
      console.error('Error updating event:', err)
      setError(err.message || 'Error al actualizar el evento. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los cambios.')) {
      router.push(`/events/${params.id}`)
    }
  }

  if (fetching) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p className="text-gray-400">Cargando evento...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageHeader title="Editar Evento" />

      <div className="p-6 max-w-4xl">
        <Card className="border-border bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Información Básica</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Nombre del Evento *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Festival Sónar 2024"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="artist" className="block text-sm font-medium text-foreground mb-2">
                    Artista Principal *
                  </label>
                  <input
                    id="artist"
                    name="artist"
                    type="text"
                    value={formData.artist}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-muted-foreground opacity-70 cursor-not-allowed"
                    placeholder="Ej: The Weeknd"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">El artista no puede ser modificado</p>
                </div>

                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-foreground mb-2">
                    Lugar *
                  </label>
                  <input
                    id="venue"
                    name="venue"
                    type="text"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-muted-foreground opacity-70 cursor-not-allowed"
                    placeholder="Ej: Movistar Arena"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">El lugar no puede ser modificado</p>
                </div>

                <div>
                  <label htmlFor="genres" className="block text-sm font-medium text-foreground mb-2">
                    Género Musical *
                  </label>
                  <input
                    id="genres"
                    name="genres"
                    type="text"
                    value={formData.genres}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Electrónica, House"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Fecha y Hora</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                    Fecha del Evento *
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="doors" className="block text-sm font-medium text-foreground mb-2">
                    Apertura de Puertas *
                  </label>
                  <input
                    id="doors"
                    name="doors"
                    type="datetime-local"
                    value={formData.doors}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tickets & Pricing */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Tickets y Precios</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                    Precio (CLP) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: 45000"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="totalTickets" className="block text-sm font-medium text-foreground mb-2">
                    Cantidad Total de Tickets *
                  </label>
                  <input
                    id="totalTickets"
                    name="totalTickets"
                    type="number"
                    value={formData.totalTickets}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: 500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Descripción del Evento *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Describe el evento, artistas, actividades, etc."
                required
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Imágenes del Evento
              </label>
              <div className="space-y-4">
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                          <Image
                            src={imageUrl}
                            alt={`Imagen ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {imageUrl}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground mb-2">No hay imágenes agregadas</p>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload-edit"
                    accept="image/*"
                    onChange={handleAddImage}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <label htmlFor="image-upload-edit">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-border hover:bg-secondary cursor-pointer"
                      disabled={uploadingImage}
                      asChild
                    >
                      <span>
                        <Plus className="h-4 w-4 mr-2" />
                        {uploadingImage ? 'Subiendo imagen...' : 'Subir Imagen'}
                      </span>
                    </Button>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sube imágenes desde tu computador (JPG, PNG, WEBP - Máx 4.5MB)
                </p>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="border-border hover:bg-secondary"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
