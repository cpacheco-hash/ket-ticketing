'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppLayout, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CreateEventPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    genres: ''
  })

  if (!session) {
    router.push('/auth/login?callbackUrl=/create')
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
              Solo los administradores y organizadores pueden crear eventos.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: new Date(formData.date).toISOString(),
          doorsOpen: new Date(formData.doors).toISOString(),
          price: parseInt(formData.price) * 100, // Convert to cents
          totalTickets: parseInt(formData.totalTickets),
          artist: {
            name: formData.artist,
            genres: formData.genres.split(',').map(g => g.trim()),
          },
          venue: {
            name: formData.venue,
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const { event } = await response.json()

      alert('Evento creado exitosamente')
      router.push(`/events/${event.id}`)
    } catch (err) {
      console.error('Error creating event:', err)
      setError('Error al crear el evento. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los cambios.')) {
      router.push('/events')
    }
  }

  return (
    <AppLayout>
      <PageHeader title="Nuevo Concierto" />

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
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: The Weeknd"
                    required
                  />
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
                    className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Movistar Arena"
                    required
                  />
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
                {loading ? 'Creando...' : 'Crear Evento'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-border bg-card/30 p-4">
          <h4 className="mb-2 font-semibold text-foreground">Información para Productores</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Los eventos creados estarán sujetos a revisión antes de publicarse</li>
            <li>• Comisión por ticket: 5% + CLP $500 (transparente, sin costos ocultos)</li>
            <li>• Pagos procesados con Fintoc para mayor seguridad</li>
            <li>• Acceso al panel de analytics en tiempo real</li>
          </ul>
        </Card>
      </div>
    </AppLayout>
  )
}
