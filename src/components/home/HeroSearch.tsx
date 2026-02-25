'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { SearchInput } from './SearchInput'
import { getUserLocation, type Location } from '@/lib/geolocation'

interface HeroSearchProps {
  initialLocation?: string
}

export function HeroSearch({ initialLocation }: HeroSearchProps) {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)

  useEffect(() => {
    async function loadLocation() {
      try {
        const userLocation = await getUserLocation()
        setLocation(userLocation)
      } catch (error) {
        console.error('Failed to get location:', error)
      } finally {
        setIsLoadingLocation(false)
      }
    }

    loadLocation()
  }, [])

  return (
    <section className="hero-search py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase mb-6 leading-tight">
            Busca tu
            <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: '2px white',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Proximo Evento
            </span>
          </h1>

          {/* Search Input */}
          <div className="max-w-3xl mx-auto mb-6">
            <SearchInput
              size="hero"
              placeholder="Busca eventos, artistas, venues..."
              geolocation={true}
              autoFocus={false}
            />
          </div>

          {/* Location Indicator */}
          {!isLoadingLocation && location && (
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm md:text-base">
              <MapPin className="h-4 w-4" />
              <span>
                {location.city ? `Eventos cerca de ${location.city}` : 'Eventos cercanos'}
              </span>
            </div>
          )}

          {/* Quick Filters - MVP */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            <QuickFilterChip href="/events?filter=today">Hoy</QuickFilterChip>
            <QuickFilterChip href="/events?filter=this_week">Esta Semana</QuickFilterChip>
            <QuickFilterChip href="/events?filter=free">Gratis</QuickFilterChip>
          </div>

          {/* Category Filters - MVP */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <QuickFilterChip href="/events?category=CULTURAL" variant="category">Cultural</QuickFilterChip>
            <QuickFilterChip href="/events?category=MUSICA_EMERGENTE" variant="category">Musica Emergente</QuickFilterChip>
            <QuickFilterChip href="/events?category=CHARLAS" variant="category">Charlas</QuickFilterChip>
            <QuickFilterChip href="/events?category=EXPERIENCIAS" variant="category">Experiencias</QuickFilterChip>
            <QuickFilterChip href="/events?category=BARRIAL" variant="category">Barrial</QuickFilterChip>
          </div>
        </div>
      </div>
    </section>
  )
}

function QuickFilterChip({
  href,
  children,
  variant = 'default'
}: {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'category'
}) {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-colors"
  const variantClasses = variant === 'category'
    ? "bg-transparent hover:bg-white/10 border border-white/30 hover:border-white/50"
    : "bg-white/10 hover:bg-white/20 border border-white/20"

  return (
    <a href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </a>
  )
}
