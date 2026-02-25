'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppLayout } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2Icon, CalendarPlus, MapPin, Share2 } from 'lucide-react'
import { downloadICSFile, getGoogleCalendarUrl, getGoogleMapsUrl } from '@/lib/calendar'

interface EventInfo {
  title: string
  date: string
  venue: string
  address: string
}

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null)

  useEffect(() => {
    // Try to get event info from sessionStorage (set during checkout)
    const storedEvent = sessionStorage.getItem('lastPurchasedEvent')
    if (storedEvent) {
      setEventInfo(JSON.parse(storedEvent))
    }
  }, [])

  const handleAddToCalendar = () => {
    if (!eventInfo) return

    downloadICSFile({
      title: eventInfo.title,
      description: `Evento en ${eventInfo.venue}. Tickets comprados en KET.`,
      location: eventInfo.address || eventInfo.venue,
      startDate: new Date(eventInfo.date),
      duration: 120
    })
  }

  const handleGoogleCalendar = () => {
    if (!eventInfo) return

    const url = getGoogleCalendarUrl({
      title: eventInfo.title,
      description: `Evento en ${eventInfo.venue}. Tickets comprados en KET.`,
      location: eventInfo.address || eventInfo.venue,
      startDate: new Date(eventInfo.date),
      duration: 120
    })
    window.open(url, '_blank')
  }

  const handleDirections = () => {
    if (!eventInfo) return
    const url = getGoogleMapsUrl(eventInfo.address || eventInfo.venue)
    window.open(url, '_blank')
  }

  const handleShare = async () => {
    if (!eventInfo) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Voy a ${eventInfo.title}`,
          text: `Te invito a ${eventInfo.title} en ${eventInfo.venue}`,
          url: window.location.origin
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="max-w-2xl w-full border-border bg-card p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2Icon className="h-24 w-24 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Listo, estas inscrito!
          </h1>

          {eventInfo && (
            <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-1">{eventInfo.title}</h2>
              <p className="text-muted-foreground">{eventInfo.venue}</p>
            </div>
          )}

          <p className="text-lg text-muted-foreground mb-8">
            Tu inscripcion ha sido confirmada. Recibiras un email de confirmacion
            con los detalles de tu ticket.
          </p>

          {/* Action Buttons */}
          {eventInfo && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                onClick={handleAddToCalendar}
                variant="outline"
                className="flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <CalendarPlus className="h-4 w-4" />
                Agregar a Calendario
              </Button>
              <Button
                onClick={handleDirections}
                variant="outline"
                className="flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <MapPin className="h-4 w-4" />
                Como Llegar
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => router.push('/tickets')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
            >
              Ver Mis Tickets
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex items-center justify-center gap-2 border-border hover:bg-secondary"
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
              <Button
                onClick={() => router.push('/events')}
                variant="outline"
                className="border-border hover:bg-secondary"
              >
                Explorar Mas
              </Button>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Tu codigo QR estara disponible el dia del evento en la seccion &quot;Mis Entradas&quot;.
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
