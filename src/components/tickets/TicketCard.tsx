'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import Image from 'next/image'

interface TicketCardProps {
  id: string
  eventTitle: string
  eventDate: string
  venue: string
  qrCode: string
}

export function TicketCard({ eventTitle, eventDate, venue, qrCode }: TicketCardProps) {
  return (
    <Card className="border-2 border-primary/30 bg-card p-6 hover:border-primary transition-colors">
      {/* Event Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground mb-2">{eventTitle}</h3>
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

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48 bg-white rounded-lg p-3 flex items-center justify-center">
          {qrCode ? (
            <Image
              src={qrCode}
              alt="QR Code"
              width={180}
              height={180}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              QR
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10"
        >
          Ver Ticket
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Vender
        </Button>
      </div>
    </Card>
  )
}
