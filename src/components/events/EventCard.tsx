'use client'

import { useRouter } from 'next/navigation'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
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
    <div className="group flex flex-col w-full bg-black cursor-pointer" onClick={() => router.push(`/events/${id}`)}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl mb-6 bg-gray-900">
        {image ? (
          <Image
            src={image}
            alt={`${title} - ${artist}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Sin imagen
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute top-4 right-4 bg-white text-black font-bold px-3 py-1 rounded-full text-sm">
          ${price.toLocaleString('es-CL')}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow space-y-3">
        <h3 className="text-3xl font-bold text-white leading-tight group-hover:underline decoration-2 underline-offset-4">
          {title}
        </h3>

        <p className="text-lg text-gray-400 font-medium">
          {artist}
        </p>

        <div className="flex flex-col space-y-1 text-gray-400">
          <div className="flex items-center text-sm font-medium">
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm font-medium">
            <MapPinIcon className="w-4 h-4 mr-2" />
            <span>{venue}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/events/${id}`)
            }}
            className="w-full py-3 bg-white text-black font-bold rounded-full text-sm uppercase tracking-wide hover:bg-gray-200 transition-colors duration-200"
          >
            Obtener Tickets
          </button>
        </div>
      </div>
    </div>
  )
}
