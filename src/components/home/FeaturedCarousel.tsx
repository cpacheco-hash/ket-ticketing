'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { EventCardLarge } from './EventCardLarge'
import Link from 'next/link'

interface FeaturedCarouselProps {
  title?: string
  variant?: 'trending' | 'recommended' | 'upcoming'
}

export function FeaturedCarousel({
  title = 'Eventos destacados',
  variant = 'trending',
}: FeaturedCarouselProps) {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/events/featured?type=${variant}`)

        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }

        const data = await response.json()
        setEvents(data)
      } catch (err) {
        console.error('Error fetching featured events:', err)
        setError('Error al cargar eventos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [variant])

  // Don't render if no events
  if (!isLoading && events.length === 0) {
    return null
  }

  const scrollLeft = () => {
    const container = document.getElementById(`carousel-${variant}`)
    if (container) {
      container.scrollBy({ left: -360, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById(`carousel-${variant}`)
    if (container) {
      container.scrollBy({ left: 360, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-12 md:py-16 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            {title}
          </h2>
          <Link
            href={`/events?featured=${variant}`}
            className="text-sm font-bold text-white/70 hover:text-white transition-colors uppercase tracking-wide"
          >
            Ver todos →
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Navigation Arrows (Desktop) */}
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center bg-black/80 backdrop-blur-sm border-2 border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={scrollRight}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center bg-black/80 backdrop-blur-sm border-2 border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Carousel Track */}
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center py-32 text-gray-400">
              <p>{error}</p>
            </div>
          ) : (
            <div
              id={`carousel-${variant}`}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {events.map((event) => (
                <div key={event.id} className="snap-start">
                  <EventCardLarge event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
