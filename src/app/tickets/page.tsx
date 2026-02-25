'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { AppLayout, PageHeader } from '@/components/layout'
import { TicketCard } from '@/components/tickets/TicketCard'
import { formatDateTime } from '@/lib/format'

interface Ticket {
  id: string
  status: 'ACTIVE' | 'USED' | 'CANCELLED' | 'TRANSFERRED' | 'REFUNDED'
  event: {
    title: string
    date: string
    venue: {
      name: string
    }
  }
  qrCode: string
}

// Check if event has passed
function isEventPast(eventDateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(eventDateStr)
  eventDate.setHours(0, 0, 0, 0)
  return eventDate < today
}

export default function TicketsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

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

  // Separate tickets into upcoming and past
  const upcomingTickets = tickets.filter(t => !isEventPast(t.event.date))
  const pastTickets = tickets.filter(t => isEventPast(t.event.date))

  const displayedTickets = activeTab === 'upcoming' ? upcomingTickets : pastTickets

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
      <PageHeader title="Mis Entradas" />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Proximos ({upcomingTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Pasados ({pastTickets.length})
          </button>
        </div>

        {/* Tickets Grid */}
        {displayedTickets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                id={ticket.id}
                eventTitle={ticket.event.title}
                eventDate={formatDateTime(ticket.event.date)}
                venue={ticket.event.venue.name}
                qrCode={ticket.qrCode}
                status={ticket.status}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              {activeTab === 'upcoming'
                ? 'No tienes entradas para eventos proximos'
                : 'No tienes entradas de eventos pasados'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => router.push('/events')}
                className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors"
              >
                Explorar eventos
              </button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
