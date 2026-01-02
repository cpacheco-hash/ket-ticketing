'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout, Header } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from 'lucide-react'
import { formatPrice, formatEventDate } from '@/lib/format'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'

interface Event {
  id: string
  title: string
  description: string
  date: string
  doors: string
  price: number
  totalTickets: number
  availableTickets: number
  images: string[]
  genres: string[]
  venue: {
    name: string
    address: string
    city: string
  }
  artist: {
    name: string
    bio?: string
  }
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCartStore()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setEvent(data)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyTickets = () => {
    if (!event) return

    addItem({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: new Date(event.date),
      venue: event.venue.name,
      quantity,
      unitPrice: event.price
    })

    router.push('/checkout')
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando evento...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!event) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Evento no encontrado</h2>
            <p className="text-muted-foreground mb-4">El evento que buscas no existe</p>
            <Button onClick={() => router.push('/events')}>
              Volver a eventos
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  const ticketsLeft = event.availableTickets
  const isSoldOut = ticketsLeft === 0
  const isLowStock = ticketsLeft < 50 && ticketsLeft > 0

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Hero Image */}
        <div className="relative h-96 w-full bg-muted">
          {event.images[0] ? (
            <Image
              src={event.images[0]}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground">Sin imagen</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {event.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                {event.title}
              </h1>

              <div className="flex flex-col gap-3 text-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <span>{formatEventDate(event.date, event.doors)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-primary" />
                  <span>{event.venue.name} - {event.venue.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5 text-primary" />
                  <span>{ticketsLeft.toLocaleString()} tickets disponibles</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Acerca del Evento
              </h2>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </Card>

            {/* Artist Info */}
            <Card className="border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Artista
              </h2>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {event.artist.name}
              </h3>
              {event.artist.bio && (
                <p className="text-muted-foreground">{event.artist.bio}</p>
              )}
            </Card>

            {/* Venue Info */}
            <Card className="border-border bg-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Ubicación
              </h2>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {event.venue.name}
              </h3>
              <p className="text-muted-foreground">{event.venue.address}</p>
            </Card>
          </div>

          {/* Sidebar - Purchase Card */}
          <div>
            <Card className="border-2 border-primary/20 bg-card p-6 sticky top-6">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Precio por ticket</p>
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(event.price / 100)}
                </p>
              </div>

              {isLowStock && !isSoldOut && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">
                    ¡Solo quedan {ticketsLeft} tickets!
                  </p>
                </div>
              )}

              {!isSoldOut ? (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cantidad
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="text-xl font-bold text-foreground w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        disabled={quantity >= 10 || quantity >= ticketsLeft}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Máximo 10 tickets por compra
                    </p>
                  </div>

                  <div className="mb-6 p-4 rounded-lg bg-muted/50">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">
                        {formatPrice((event.price / 100) * quantity)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Comisión de servicio</span>
                      <span className="text-foreground">
                        {formatPrice(Math.ceil((event.price / 100) * quantity * 0.05) + 500)}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-primary text-xl">
                          {formatPrice((event.price / 100) * quantity + Math.ceil((event.price / 100) * quantity * 0.05) + 500)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleBuyTickets}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
                  >
                    Comprar Tickets
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
                    <p className="font-semibold text-destructive">Entradas Agotadas</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    Unirse a Waitlist
                  </Button>
                </>
              )}

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Pagos 100% seguros con Fintoc
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
