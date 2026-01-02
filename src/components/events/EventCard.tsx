'use client'

import { useRouter } from 'next/navigation'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface EventCardProps {
  id: string
  title: string
  artist: string
  venue: string
  date: string
  image: string
  price: number
}

export function EventCard({ id, title, artist, venue, date, image, price }: EventCardProps) {
  const router = useRouter()

  return (
    <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-colors cursor-pointer" onClick={() => router.push(`/events/${id}`)}>
      {/* Event Image */}
      <div className="relative h-48 w-full bg-muted">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{artist}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPinIcon className="h-4 w-4 text-primary" />
            <span>{venue}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Desde</p>
            <p className="text-xl font-bold text-primary">
              ${price.toLocaleString('es-CL')}
            </p>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/events/${id}`)
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Ver Detalles
          </Button>
        </div>
      </div>
    </Card>
  )
}
