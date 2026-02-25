'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppLayout } from '@/components/layout'
import { EventCard } from '@/components/events/EventCard'
import { formatDate } from '@/lib/format'
import { EVENT_CATEGORY_LABELS } from '@/lib/constants'

interface Event {
  id: string
  title: string
  date: string
  price: number
  images: string[]
  category?: string
  isFree?: boolean
  venue: {
    name: string
  }
  artist?: {
    name: string
  }
}

const categoryFilters = [
  { key: 'Todos', value: null },
  { key: 'Cultural', value: 'CULTURAL' },
  { key: 'Musica Emergente', value: 'MUSICA_EMERGENTE' },
  { key: 'Charlas', value: 'CHARLAS' },
  { key: 'Experiencias', value: 'EXPERIENCIAS' },
  { key: 'Barrial', value: 'BARRIAL' },
]

const quickFilters = [
  { key: 'Hoy', value: 'today' },
  { key: 'Esta Semana', value: 'this_week' },
  { key: 'Gratis', value: 'free' },
]

export default function EventsPage() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(
    searchParams.get('category') || null
  )
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(
    searchParams.get('filter') || null
  )

  useEffect(() => {
    fetchEvents()
  }, [activeCategory, activeQuickFilter])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory) params.set('category', activeCategory)
      if (activeQuickFilter) params.set('filter', activeQuickFilter)

      const url = `/api/events${params.toString() ? `?${params.toString()}` : ''}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = (value: string | null) => {
    setActiveCategory(value)
    setActiveQuickFilter(null)
  }

  const handleQuickFilter = (value: string) => {
    if (activeQuickFilter === value) {
      setActiveQuickFilter(null)
    } else {
      setActiveQuickFilter(value)
      setActiveCategory(null)
    }
  }

  return (
    <AppLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
            Descubre
            <br />
            <span
              className="text-transparent stroke-white stroke-2"
              style={{
                WebkitTextStroke: '2px white',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Eventos
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-medium">
            Eventos culturales, musica emergente, charlas y experiencias en tu ciudad.
          </p>
        </div>

        {/* Quick Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleQuickFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeQuickFilter === filter.value
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              {filter.key}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/20 pb-6">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 md:mb-0">
            {activeCategory ? EVENT_CATEGORY_LABELS[activeCategory] || 'Eventos' : 'Todos los Eventos'}
          </h2>
          <div className="flex space-x-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categoryFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleCategoryFilter(filter.value)}
                className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                  activeCategory === filter.value
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white border border-white/30 hover:border-white'
                }`}
              >
                {filter.key}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p className="text-gray-400">Cargando eventos...</p>
            </div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                artist={event.artist?.name || 'Varios'}
                venue={event.venue.name}
                date={formatDate(event.date)}
                image={event.images[0] || ''}
                price={event.isFree ? 0 : event.price / 100}
                isFree={event.isFree}
                category={event.category}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">No hay eventos</h3>
            <p className="text-gray-400 mb-8">
              No encontramos eventos con estos filtros. Prueba con otra categoria.
            </p>
            <button
              onClick={() => { setActiveCategory(null); setActiveQuickFilter(null); }}
              className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
            >
              Ver todos los eventos
            </button>
          </div>
        )}

        {/* Footer CTA */}
        {events.length > 0 && events.length >= 20 && (
          <div className="mt-32 text-center border-t border-white/20 pt-20 pb-10">
            <h3 className="text-4xl md:text-5xl font-black uppercase mb-8">
              Hay mas por descubrir
            </h3>
            <button className="px-12 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest">
              Cargar Mas Eventos
            </button>
          </div>
        )}
      </main>
    </AppLayout>
  )
}
