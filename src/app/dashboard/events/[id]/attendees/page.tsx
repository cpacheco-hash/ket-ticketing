'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  ArrowLeft,
  Download,
  QrCode
} from 'lucide-react'
import Link from 'next/link'

interface Attendee {
  id: string
  status: string
  checkedInAt: string | null
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

interface EventInfo {
  id: string
  title: string
  date: string
  totalTickets: number
  availableTickets: number
}

export default function AttendeesPage() {
  const params = useParams()
  const router = useRouter()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [event, setEvent] = useState<EventInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAttendees()
  }, [params.id])

  const fetchAttendees = async () => {
    try {
      const res = await fetch(`/api/dashboard/events/${params.id}/attendees`)
      if (res.ok) {
        const data = await res.json()
        setAttendees(data.attendees || [])
        setEvent(data.event || null)
      }
    } catch (error) {
      console.error('Error fetching attendees:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAttendees = attendees.filter(a => {
    const fullName = `${a.user.firstName} ${a.user.lastName}`.toLowerCase()
    const email = a.user.email.toLowerCase()
    const query = searchQuery.toLowerCase()
    return fullName.includes(query) || email.includes(query)
  })

  const checkedInCount = attendees.filter(a => a.checkedInAt).length
  const pendingCount = attendees.filter(a => !a.checkedInAt && a.status === 'ACTIVE').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Lista de Inscritos
        </h1>
        {event && (
          <p className="text-gray-400">{event.title}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-xl font-bold text-white">{attendees.length}</p>
              <p className="text-xs text-gray-400">Total Inscritos</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-xl font-bold text-white">{checkedInCount}</p>
              <p className="text-xs text-gray-400">Check-in</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-xl font-bold text-white">{pendingCount}</p>
              <p className="text-xs text-gray-400">Pendientes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <Link href={`/dashboard/events/${params.id}/checkin`}>
          <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
            <QrCode className="h-4 w-4 mr-2" />
            Iniciar Check-in
          </Button>
        </Link>
      </div>

      {/* Attendees List */}
      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Check-in
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-white/5">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-white font-medium">
                      {attendee.user.firstName} {attendee.user.lastName}
                    </p>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-gray-400 text-sm">{attendee.user.email}</p>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      attendee.status === 'ACTIVE'
                        ? 'bg-green-500/20 text-green-400'
                        : attendee.status === 'USED'
                        ? 'bg-gray-500/20 text-gray-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {attendee.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {attendee.checkedInAt ? (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(attendee.checkedInAt).toLocaleTimeString('es-CL', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchQuery ? 'No se encontraron resultados' : 'No hay inscritos aun'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
