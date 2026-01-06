import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCurrency } from '@/lib/format'

interface EventCardLargeProps {
  event: {
    id: string
    title: string
    date: Date | string
    price: number
    images: string[]
    venue: {
      name: string
      city: string
    }
    artist: {
      name: string
      image?: string | null
    }
  }
}

export function EventCardLarge({ event }: EventCardLargeProps) {
  const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date

  return (
    <Link href={`/events/${event.id}`} className="event-card-large group">
      <div className="relative w-[340px] h-[480px] rounded-xl overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        {/* Background Image */}
        <div className="absolute inset-0">
          {event.images[0] ? (
            <Image
              src={event.images[0]}
              alt={event.title}
              fill
              className="object-cover"
              sizes="340px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Date Chip */}
          <div className="flex justify-between items-start">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2">
              <div className="text-center">
                <div className="text-2xl font-black leading-none">
                  {format(eventDate, 'd')}
                </div>
                <div className="text-xs font-bold uppercase tracking-wide">
                  {format(eventDate, 'MMM', { locale: es })}
                </div>
              </div>
            </div>

            {/* Artist Avatar */}
            {event.artist.image && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                <Image
                  src={event.artist.image}
                  alt={event.artist.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black line-clamp-2 leading-tight">
              {event.title}
            </h3>

            <p className="text-sm font-bold text-gray-300">
              {event.artist.name}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-[150px]">{event.venue.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(eventDate, 'HH:mm')}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-2 border-t border-white/20">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Desde</span>
              <span className="text-2xl font-black">{formatCurrency(event.price)}</span>
            </div>
          </div>
        </div>

        {/* Hover Shadow Effect */}
        <div className="absolute inset-0 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  )
}
