'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout, Header } from '@/components/layout'
import { EventCard } from '@/components/events/EventCard'
import { formatDate } from '@/lib/format'

interface Event {
  id: string
  title: string
  date: string
  price: number
  images: string[]
  venue: {
    name: string
  }
  artist: {
    name: string
  }
}

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <Header
        title="Próximos Eventos"
        action={{
          label: 'Crear Nuevo Concierto',
          onClick: () => router.push('/create')
        }}
      />

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando eventos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  artist={event.artist.name}
                  venue={event.venue.name}
                  date={formatDate(event.date)}
                  image={event.images[0] || ''}
                  price={event.price / 100}
                />
              ))}
            </div>

            {/* Empty State */}
            {events.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg text-muted-foreground mb-4">
                  No hay eventos disponibles
                </p>
                <button className="text-primary hover:underline">
                  Conecta tu Spotify para ver recomendaciones personalizadas
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
