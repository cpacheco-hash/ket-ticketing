'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout'
import { EventCard } from '@/components/events/EventCard'
import { formatDate } from '@/lib/format'

interface Event {
  id: string
  title: string
  date: string
  price: number
  images: string[]
  venue: {
    name: string
  }
  artist: {
    name: string
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
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

  const filters = ['All', 'Music', 'Arts', 'Comedy', 'Film']

  return (
    <AppLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="mb-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">
            Don&apos;t Miss
            <br />
            <span
              className="text-transparent stroke-white stroke-2"
              style={{
                WebkitTextStroke: '2px white',
                WebkitTextFillColor: 'transparent',
              }}
            >
              The Moment
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-medium">
            Discover the best gigs, clubs, and festivals happening in your city.
            No booking fees, ever.
          </p>
        </div>

        {/* Filters / Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/20 pb-6">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 md:mb-0">
            Trending Now
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-transparent text-white border border-white/30 hover:border-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
              <p className="text-gray-400">Loading events...</p>
            </div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                artist={event.artist.name}
                venue={event.venue.name}
                date={formatDate(event.date)}
                image={event.images[0] || ''}
                price={event.price / 100}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">No events yet</h3>
            <p className="text-gray-400 mb-8">
              Check back soon or connect your Spotify for personalized recommendations
            </p>
          </div>
        )}

        {/* Footer CTA */}
        {events.length > 0 && (
          <div className="mt-32 text-center border-t border-white/20 pt-20 pb-10">
            <h3 className="text-4xl md:text-5xl font-black uppercase mb-8">
              Want to see more?
            </h3>
            <button className="px-12 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest">
              View All Events
            </button>
          </div>
        )}
      </main>
    </AppLayout>
  )
}
