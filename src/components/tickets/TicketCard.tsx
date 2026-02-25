'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, MapPinIcon, LockIcon, CheckCircle, XCircle, Clock } from 'lucide-react'
import Image from 'next/image'

interface TicketCardProps {
  id: string
  eventTitle: string
  eventDate: string
  venue: string
  qrCode: string
  status?: 'ACTIVE' | 'USED' | 'CANCELLED' | 'TRANSFERRED' | 'REFUNDED'
}

// Check if event is today
function isEventToday(eventDateStr: string): boolean {
  const today = new Date()
  const eventDate = new Date(eventDateStr)
  return (
    today.getFullYear() === eventDate.getFullYear() &&
    today.getMonth() === eventDate.getMonth() &&
    today.getDate() === eventDate.getDate()
  )
}

// Calculate days until event
function getDaysUntilEvent(eventDateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(eventDateStr)
  eventDate.setHours(0, 0, 0, 0)
  const diffTime = eventDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Check if event has passed
function isEventPast(eventDateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(eventDateStr)
  eventDate.setHours(0, 0, 0, 0)
  return eventDate < today
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    ACTIVE: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <CheckCircle className="h-3 w-3" />, label: 'Activo' },
    USED: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <CheckCircle className="h-3 w-3" />, label: 'Usado' },
    CANCELLED: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <XCircle className="h-3 w-3" />, label: 'Cancelado' },
    TRANSFERRED: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <Clock className="h-3 w-3" />, label: 'Transferido' },
    REFUNDED: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <Clock className="h-3 w-3" />, label: 'Reembolsado' },
  }

  const { color, icon, label } = config[status] || config.ACTIVE

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
      {icon}
      {label}
    </div>
  )
}

export function TicketCard({ id, eventTitle, eventDate, venue, qrCode, status = 'ACTIVE' }: TicketCardProps) {
  const router = useRouter()
  const showQR = isEventToday(eventDate) && status === 'ACTIVE'
  const daysUntil = getDaysUntilEvent(eventDate)
  const isPast = isEventPast(eventDate)

  return (
    <Card className={`border-2 bg-card p-6 transition-colors ${
      status === 'ACTIVE' ? 'border-primary/30 hover:border-primary' : 'border-gray-700/30'
    }`}>
      {/* Event Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-foreground">{eventTitle}</h3>
          <StatusBadge status={isPast && status === 'ACTIVE' ? 'USED' : status} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            <span>{venue}</span>
          </div>
        </div>
      </div>

      {/* QR Code - Only visible on event day */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48 bg-white rounded-lg p-3 flex items-center justify-center">
          {showQR && qrCode ? (
            <Image
              src={qrCode}
              alt="QR Code"
              width={180}
              height={180}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-center p-4">
              <LockIcon className="h-8 w-8 mb-2 text-gray-400" />
              {isPast ? (
                <p className="text-xs">Evento finalizado</p>
              ) : status !== 'ACTIVE' ? (
                <p className="text-xs">Ticket no disponible</p>
              ) : (
                <>
                  <p className="text-xs font-medium">QR disponible el dia del evento</p>
                  {daysUntil > 0 && (
                    <p className="text-xs mt-1 text-gray-400">
                      Faltan {daysUntil} {daysUntil === 1 ? 'dia' : 'dias'}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
          onClick={() => router.push(`/tickets/${id}`)}
        >
          Ver Ticket
        </Button>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => router.push(`/tickets/${id}/transfer`)}
          disabled={status !== 'ACTIVE' || isPast}
        >
          Transferir
        </Button>
      </div>
    </Card>
  )
}
