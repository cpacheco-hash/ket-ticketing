'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, MapPin, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/format'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SearchInputProps {
  size?: 'default' | 'hero'
  placeholder?: string
  geolocation?: boolean
  autoFocus?: boolean
  onResultClick?: () => void
}

interface SearchResult {
  events: any[]
  artists: any[]
  venues: any[]
  total: number
}

export function SearchInput({
  size = 'default',
  placeholder = 'Artista, evento, venue...',
  geolocation = false,
  autoFocus = false,
  onResultClick,
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Get user location if geolocation enabled
  useEffect(() => {
    if (geolocation && typeof window !== 'undefined') {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          console.log('Geolocation permission denied')
        }
      )
    }
  }, [geolocation])

  // Handle search with debounce
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults(null)
        setShowResults(false)
        return
      }

      setIsLoading(true)

      try {
        let url = `/api/search/instant?q=${encodeURIComponent(searchQuery)}`

        if (userLocation) {
          url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`
        }

        const response = await fetch(url)
        const data = await response.json()

        setResults(data)
        setShowResults(true)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Search failed:', error)
        setResults(null)
      } finally {
        setIsLoading(false)
      }
    },
    [userLocation]
  )

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results || results.total === 0) return

    const totalResults = results.events.length + results.artists.length + results.venues.length

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Escape') {
      setShowResults(false)
      inputRef.current?.blur()
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      // Navigate to selected item
      const allItems = [
        ...results.events.map((e) => ({ type: 'event', id: e.id })),
        ...results.artists.map((a) => ({ type: 'artist', slug: a.slug })),
        ...results.venues.map((v) => ({ type: 'venue', slug: v.slug })),
      ]

      const selected = allItems[selectedIndex]
      if (selected) {
        if (selected.type === 'event') {
          window.location.href = `/events/${selected.id}`
        } else if (selected.type === 'artist') {
          window.location.href = `/artists/${selected.slug}`
        } else if (selected.type === 'venue') {
          window.location.href = `/venues/${selected.slug}`
        }
      }
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults(null)
    setShowResults(false)
    inputRef.current?.focus()
  }

  const sizeClasses = {
    default: 'h-12 text-base',
    hero: 'h-20 text-xl md:text-2xl',
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 md:h-6 md:w-6 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results && results.total > 0) {
              setShowResults(true)
            }
          }}
          className={`
            block w-full pl-12 md:pl-16 pr-12 md:pr-14
            ${sizeClasses[size]}
            bg-black/80 backdrop-blur-sm
            border-2 border-white/30
            rounded-full
            text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white
            transition-all duration-200
            font-medium
          `}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 md:pr-6 flex items-center hover:opacity-70 transition-opacity"
          >
            <X className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && results && results.total > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 bg-black border-2 border-white/20 rounded-2xl shadow-2xl max-h-[500px] overflow-y-auto"
        >
          {/* Events */}
          {results.events.length > 0 && (
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
                Eventos
              </h3>
              {results.events.map((event, index) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  onClick={() => {
                    setShowResults(false)
                    onResultClick?.()
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    hover:bg-white/10 transition-colors
                    ${selectedIndex === index ? 'bg-white/10' : ''}
                  `}
                >
                  {event.images?.[0] ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={event.images[0]}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Search className="h-6 w-6 text-gray-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{event.title}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {event.artist?.name} • {event.venue?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.date), "d 'de' MMM, HH:mm", { locale: es })}
                      {(event as any).distance && ` • ${((event as any).distance).toFixed(1)}km`}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">
                      {formatCurrency(event.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Artists */}
          {results.artists.length > 0 && (
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
                Artistas
              </h3>
              {results.artists.map((artist, index) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.slug}`}
                  onClick={() => {
                    setShowResults(false)
                    onResultClick?.()
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    hover:bg-white/10 transition-colors
                    ${selectedIndex === results.events.length + index ? 'bg-white/10' : ''}
                  `}
                >
                  {artist.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-gray-500">
                        {artist.name[0]}
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-bold text-white">{artist.name}</p>
                    <p className="text-sm text-gray-400">
                      {artist._count.events} eventos próximos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Venues */}
          {results.venues.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">
                Venues
              </h3>
              {results.venues.map((venue, index) => (
                <Link
                  key={venue.id}
                  href={`/venues/${venue.slug}`}
                  onClick={() => {
                    setShowResults(false)
                    onResultClick?.()
                  }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    hover:bg-white/10 transition-colors
                    ${
                      selectedIndex === results.events.length + results.artists.length + index
                        ? 'bg-white/10'
                        : ''
                    }
                  `}
                >
                  <MapPin className="h-10 w-10 text-gray-500 flex-shrink-0" />

                  <div className="flex-1">
                    <p className="font-bold text-white">{venue.name}</p>
                    <p className="text-sm text-gray-400">{venue.city}</p>
                    <p className="text-xs text-gray-500">
                      {venue._count.events} eventos próximos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {showResults && results && results.total === 0 && query.length >= 2 && !isLoading && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 bg-black border-2 border-white/20 rounded-2xl shadow-2xl p-6 text-center"
        >
          <p className="text-gray-400">
            No encontramos resultados para &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  )
}
