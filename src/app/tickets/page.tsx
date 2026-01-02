'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AppLayout, Header } from '@/components/layout'
import { TicketCard } from '@/components/tickets/TicketCard'
import { formatDateTime } from '@/lib/format'

interface Ticket {
  id: string
  event: {
    title: string
    date: string
    venue: {
      name: string
    }
  }
  qrCode: string
}

export default function TicketsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchTickets()
    }
  }, [status, router])

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets')
      if (res.ok) {
        const data = await res.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando tickets...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Header
        title="Mis Entradas"
        action={{
          label: 'Comprar Entradas',
          onClick: () => router.push('/events')
        }}
      />

      <div className="p-6">
        {tickets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                id={ticket.id}
                eventTitle={ticket.event.title}
                eventDate={formatDateTime(ticket.event.date)}
                venue={ticket.event.venue.name}
                qrCode={ticket.qrCode}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              No tienes entradas aún
            </p>
            <button
              onClick={() => router.push('/events')}
              className="text-primary hover:underline"
            >
              Explora eventos disponibles
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
