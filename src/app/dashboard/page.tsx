'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDate, formatPrice } from '@/lib/format'
import {
  Calendar,
  Users,
  Ticket,
  TrendingUp,
  Plus,
  Eye,
  QrCode,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface DashboardEvent {
  id: string
  title: string
  date: string
  status: string
  totalTickets: number
  availableTickets: number
  isFree: boolean
  price: number
  venue: {
    name: string
  }
  _count?: {
    tickets: number
    orders: number
  }
}

interface DashboardStats {
  totalEvents: number
  upcomingEvents: number
  totalTicketsSold: number
  totalRevenue: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Bienvenido, {session?.user?.name?.split(' ')[0] || 'Organizador'}
        </h1>
        <p className="text-gray-400">
          Gestiona tus eventos y revisa las metricas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              <p className="text-xs text-gray-400">Eventos Totales</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.upcomingEvents}</p>
              <p className="text-xs text-gray-400">Proximos</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Ticket className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalTicketsSold}</p>
              <p className="text-xs text-gray-400">Inscritos</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Users className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats.totalRevenue > 0 ? formatPrice(stats.totalRevenue / 100) : '$0'}
              </p>
              <p className="text-xs text-gray-400">Recaudado</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Button
          onClick={() => router.push('/create/multi-step')}
          className="bg-white text-black hover:bg-gray-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Evento
        </Button>
      </div>

      {/* Events List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Mis Eventos</h2>

        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const ticketsSold = event.totalTickets - event.availableTickets
              const isUpcoming = new Date(event.date) > new Date()
              const isToday = new Date(event.date).toDateString() === new Date().toDateString()

              return (
                <Card
                  key={event.id}
                  className="bg-white/5 border-white/10 p-4 hover:border-white/20 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-lg">{event.title}</h3>
                        {isToday && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                            HOY
                          </span>
                        )}
                        {event.isFree && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            GRATIS
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {formatDate(event.date)} - {event.venue.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-400">
                          <Users className="h-4 w-4 inline mr-1" />
                          {ticketsSold} / {event.totalTickets} inscritos
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/events/${event.id}`}>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                      <Link href={`/dashboard/events/${event.id}/attendees`}>
                        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                          <Users className="h-4 w-4 mr-1" />
                          Inscritos
                        </Button>
                      </Link>
                      {isToday && (
                        <Link href={`/dashboard/events/${event.id}/checkin`}>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <QrCode className="h-4 w-4 mr-1" />
                            Check-in
                          </Button>
                        </Link>
                      )}
                      {!isUpcoming && (
                        <Link href={`/dashboard/events/${event.id}/results`}>
                          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Resultados
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="bg-white/5 border-white/10 p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No tienes eventos</h3>
            <p className="text-gray-400 mb-4">Crea tu primer evento para comenzar</p>
            <Button
              onClick={() => router.push('/create/multi-step')}
              className="bg-white text-black hover:bg-gray-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Evento
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
