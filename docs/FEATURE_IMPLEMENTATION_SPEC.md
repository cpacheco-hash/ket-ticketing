# KET App - Complete Feature Implementation Specification

**Version:** 1.0
**Date:** 2026-01-06
**Author:** Product Engineering Team
**Status:** Ready for Implementation

---

## Table of Contents

1. [Home Screen (Search-Focused)](#1-home-screen-search-focused)
2. [Authentication (Google + Spotify)](#2-authentication-google--spotify)
3. [Featured Events Carousel](#3-featured-events-carousel)
4. [Advanced Search System](#4-advanced-search-system)
5. [Artists - Music Playback](#5-artists---music-playback)
6. [Artist Profile & Follow System](#6-artist-profile--follow-system)
7. [Event View Enhancements](#7-event-view-enhancements)
8. [FAQ System](#8-faq-system)
9. [Create Event Flow](#9-create-event-flow)
10. [Technical Architecture Summary](#10-technical-architecture-summary)

---

## 1. Home Screen (Search-Focused)

### Objective
Redesign the home page (`src/app/page.tsx`) with absolute focus on search as the primary user action, following DICE-style discovery patterns.

### UI Architecture

#### 1.1 Visual Hierarchy
```
┌─────────────────────────────────────┐
│         HEADER (Fixed)              │
├─────────────────────────────────────┤
│                                     │
│    [SEARCH BAR - HERO SIZE]        │
│    "Busca tu próximo evento"       │
│                                     │
│         [Geolocation Chip]         │
│                                     │
├─────────────────────────────────────┤
│  Featured Events Carousel (H-Scroll)│
│  ▸ En tendencia esta semana        │
├─────────────────────────────────────┤
│  Quick Filters (Genres/Dates)      │
├─────────────────────────────────────┤
│  Upcoming Events Grid              │
├─────────────────────────────────────┤
│  Footer Content                    │
│  "¿Qué es KET?" (Low Emphasis)     │
└─────────────────────────────────────┘
```

#### 1.2 Component Structure

**File:** `src/app/page.tsx`
```typescript
export default function HomePage() {
  return (
    <AppLayout>
      <HeroSearch />
      <FeaturedCarousel />
      <QuickFilters />
      <UpcomingEvents />
      <AboutSection /> {/* Low visual weight */}
    </AppLayout>
  )
}
```

**New Component:** `src/components/home/HeroSearch.tsx`
```typescript
interface HeroSearchProps {
  initialLocation?: string
}

export function HeroSearch({ initialLocation }: HeroSearchProps) {
  // Features:
  // - Large, centered search input (min h-20)
  // - Geolocation auto-detection
  // - Instant search results dropdown
  // - Recent searches (localStorage)
  // - Voice search option (future)

  return (
    <section className="hero-search">
      <h1 className="text-6xl font-black text-center mb-8">
        Busca tu próximo evento
      </h1>

      <SearchInput
        size="hero"
        placeholder="Artista, evento, venue..."
        geolocation={true}
        autoFocus={true}
      />

      <LocationChip location={currentLocation} />
    </section>
  )
}
```

**New Component:** `src/components/home/SearchInput.tsx`
```typescript
interface SearchInputProps {
  size?: 'default' | 'hero'
  placeholder?: string
  geolocation?: boolean
  autoFocus?: boolean
}

// Implementation:
// - Debounced search (300ms)
// - Fuzzy matching on: event.title, artist.name, venue.name
// - Results dropdown with categories:
//   - Events (max 5)
//   - Artists (max 3)
//   - Venues (max 3)
// - Keyboard navigation (↑↓ Enter Esc)
// - Mobile-optimized (full-screen on focus)
```

#### 1.3 Geolocation System

**New Utility:** `src/lib/geolocation.ts`
```typescript
export async function getUserLocation(): Promise<Location> {
  // Browser Geolocation API
  // Fallback to IP geolocation (ipapi.co)
  // Cache in localStorage (24h TTL)
  // Return: { lat, lng, city, country }
}

export function calculateDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  // Haversine formula
  // Return distance in km
}

export async function getNearbyEvents(
  location: Location,
  radiusKm: number = 50
): Promise<Event[]> {
  // Query events within radius
  // Sort by distance ASC
}
```

#### 1.4 Data Requirements

**Existing Schema:** No changes required - uses existing Event, Artist, Venue models

**New API Endpoint:** `src/app/api/search/instant/route.ts`
```typescript
// GET /api/search/instant?q={query}&lat={lat}&lng={lng}
// Response:
{
  events: Event[],      // Max 5
  artists: Artist[],    // Max 3
  venues: Venue[],      // Max 3
  total: number
}
```

#### 1.5 Styling Guidelines

```css
/* Hero Search Specific Styles */
.hero-search {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 1rem;
}

.hero-search input {
  font-size: 1.5rem;
  height: 5rem;
  max-width: 800px;
  width: 100%;
  border: 2px solid white;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.hero-search input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
}
```

#### 1.6 Implementation Checklist

- [ ] Create `HeroSearch` component with geolocation
- [ ] Implement instant search API endpoint
- [ ] Build `SearchInput` component with dropdown
- [ ] Add geolocation utilities
- [ ] Implement recent searches (localStorage)
- [ ] Mobile-first responsive design
- [ ] Keyboard navigation
- [ ] Loading and error states
- [ ] Analytics tracking (search queries)

---

## 2. Authentication (Google + Spotify)

### Objective
Complete the authentication system by adding Spotify OAuth with explicit benefit communication, alongside existing Google OAuth.

### Current State
- ✅ NextAuth.js configured (`src/lib/auth.ts`)
- ✅ Google OAuth provider added (needs credentials)
- ❌ Spotify OAuth not implemented
- ✅ Login/Register pages exist

### 2.1 Spotify OAuth Integration

#### Step 1: Update NextAuth Configuration

**File:** `src/lib/auth.ts`
```typescript
import SpotifyProvider from "next-auth/providers/spotify"

// Spotify OAuth Scopes
const SPOTIFY_SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read',              // Top artists/tracks
  'user-follow-read',           // Followed artists
  'user-read-recently-played',  // Listening history
  'playlist-read-private',      // Private playlists
].join(' ')

export const authOptions: NextAuthOptions = {
  // ... existing config
  providers: [
    // ... existing providers
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: SPOTIFY_SCOPES,
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'spotify') {
        // Store Spotify data in User table
        await prisma.user.update({
          where: { email: user.email! },
          data: {
            spotifyConnected: true,
            spotifyId: profile?.id,
            spotifyAccessToken: account.access_token,
            spotifyRefreshToken: account.refresh_token,
          },
        })
      }
      return true
    },
    async jwt({ token, account }) {
      // Persist Spotify tokens in JWT
      if (account?.provider === 'spotify') {
        token.spotifyAccessToken = account.access_token
        token.spotifyRefreshToken = account.refresh_token
      }
      return token
    },
  },
}
```

#### Step 2: Update Login Page UI

**File:** `src/app/auth/login/page.tsx`
```typescript
export default function LoginPage() {
  return (
    <div className="auth-container">
      <h1>Inicia sesión en KET</h1>

      {/* Email/Password Login */}
      <CredentialsForm />

      <div className="divider">o continúa con</div>

      {/* OAuth Providers */}
      <div className="oauth-providers">

        {/* Google Button */}
        <Button
          onClick={() => signIn('google')}
          variant="outline"
          className="oauth-btn"
        >
          <GoogleIcon />
          Continuar con Google
        </Button>

        {/* Spotify Button with Benefits */}
        <SpotifyLoginButton />

      </div>
    </div>
  )
}
```

**New Component:** `src/components/auth/SpotifyLoginButton.tsx`
```typescript
export function SpotifyLoginButton() {
  const [showBenefits, setShowBenefits] = useState(false)

  return (
    <div className="spotify-auth">
      <Button
        onClick={() => signIn('spotify')}
        className="spotify-btn"
        onMouseEnter={() => setShowBenefits(true)}
        onMouseLeave={() => setShowBenefits(false)}
      >
        <SpotifyIcon />
        Continuar con Spotify
      </Button>

      {/* Benefits Tooltip/Card */}
      {showBenefits && (
        <div className="benefits-card">
          <h4>¿Por qué conectar Spotify?</h4>
          <ul>
            <li>
              <CheckIcon />
              Recomendaciones personalizadas según tus gustos musicales
            </li>
            <li>
              <CheckIcon />
              Descubre eventos de tus artistas favoritos
            </li>
            <li>
              <CheckIcon />
              Mejor matching entre tus preferencias y eventos
            </li>
            <li>
              <CheckIcon />
              Notificaciones cuando tus artistas anuncian conciertos
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
```

#### 2.2 Spotify Data Sync System

**New API Endpoint:** `src/app/api/sync/spotify/route.ts`
```typescript
// POST /api/sync/spotify
// Syncs user's Spotify data after OAuth

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.spotifyAccessToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Fetch from Spotify API
  const [topArtists, followedArtists, recentlyPlayed] = await Promise.all([
    getSpotifyTopArtists(session.user.spotifyAccessToken),
    getSpotifyFollowedArtists(session.user.spotifyAccessToken),
    getSpotifyRecentlyPlayed(session.user.spotifyAccessToken),
  ])

  // Match with KET artists database
  const matchedArtists = await matchSpotifyArtistsToKET(topArtists)

  // Auto-follow matched artists
  await autoFollowArtists(session.user.id, matchedArtists)

  // Store preferences for recommendations
  await updateUserMusicPreferences(session.user.id, {
    topGenres: extractGenres(topArtists),
    topArtistIds: matchedArtists.map(a => a.id),
    lastSyncedAt: new Date(),
  })

  return Response.json({
    matched: matchedArtists.length,
    followed: matchedArtists.length,
  })
}
```

**New Utility:** `src/lib/spotify.ts`
```typescript
export class SpotifyAPI {
  constructor(private accessToken: string) {}

  async getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    // GET https://api.spotify.com/v1/me/top/artists
    // Returns: Artist[]
  }

  async getFollowedArtists() {
    // GET https://api.spotify.com/v1/me/following?type=artist
    // Returns: Artist[]
  }

  async getRecentlyPlayed() {
    // GET https://api.spotify.com/v1/me/player/recently-played
    // Returns: Track[]
  }

  async refreshAccessToken(refreshToken: string) {
    // POST https://accounts.spotify.com/api/token
    // Returns: { access_token, refresh_token }
  }
}

export async function matchSpotifyArtistsToKET(
  spotifyArtists: SpotifyArtist[]
): Promise<Artist[]> {
  // Match by spotifyId first
  // Fallback to fuzzy name matching
  // Create missing artists automatically
}
```

#### 2.3 User Flow

```
1. User clicks "Continuar con Spotify"
   ↓
2. Redirect to Spotify OAuth consent screen
   (Shows requested scopes)
   ↓
3. User authorizes
   ↓
4. Redirect back to KET with auth code
   ↓
5. NextAuth exchanges code for tokens
   ↓
6. Store tokens in User table
   ↓
7. Auto-trigger /api/sync/spotify
   ↓
8. Show onboarding modal:
   "¡Conectado! Encontramos {N} artistas en común"
   [Ver mis artistas] [Continuar]
   ↓
9. Redirect to personalized home page
```

#### 2.4 Environment Variables

Add to `.env`:
```bash
# Spotify OAuth
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify
```

#### 2.5 Implementation Checklist

- [ ] Install `next-auth` Spotify provider (already in deps)
- [ ] Update `authOptions` with SpotifyProvider
- [ ] Create Spotify Developer App (get credentials)
- [ ] Implement `SpotifyLoginButton` component
- [ ] Build Spotify API utility class
- [ ] Create `/api/sync/spotify` endpoint
- [ ] Implement artist matching logic
- [ ] Add onboarding modal after Spotify connect
- [ ] Handle token refresh (background job)
- [ ] Add disconnect Spotify option in settings

---

## 3. Featured Events Carousel

### Objective
Implement a horizontal-scrolling carousel showing trending and recommended events, similar to DICE's discovery interface.

### 3.1 Component Architecture

**New Component:** `src/components/home/FeaturedCarousel.tsx`
```typescript
interface FeaturedCarouselProps {
  title?: string
  events?: Event[]
  variant?: 'trending' | 'recommended' | 'upcoming'
}

export function FeaturedCarousel({
  title = 'En tendencia esta semana',
  variant = 'trending'
}: FeaturedCarouselProps) {
  const { data: events, isLoading } = useFeaturedEvents(variant)

  return (
    <section className="featured-carousel">
      <div className="carousel-header">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="ghost">Ver todos →</Button>
      </div>

      <div className="carousel-track">
        {events?.map(event => (
          <EventCardLarge key={event.id} event={event} />
        ))}
      </div>

      {/* Navigation Arrows (Desktop) */}
      <CarouselControls />
    </section>
  )
}
```

**New Component:** `src/components/events/EventCardLarge.tsx`
```typescript
interface EventCardLargeProps {
  event: Event & {
    venue: Venue
    artist: Artist
  }
}

// Large card for carousel (inspired by DICE)
// Dimensions: 340px width x 480px height
// Features:
// - Full-bleed event image
// - Gradient overlay with event info
// - Artist avatar (circular, overlaid)
// - Date chip (top-left)
// - Price chip (bottom-right)
// - Hover: Scale + shadow effect
// - Click: Navigate to event page

export function EventCardLarge({ event }: EventCardLargeProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="event-card-large">
        {/* Background Image */}
        <Image
          src={event.images[0]}
          alt={event.title}
          fill
          className="object-cover"
        />

        {/* Gradient Overlay */}
        <div className="gradient-overlay" />

        {/* Content */}
        <div className="card-content">
          {/* Date Chip */}
          <DateChip date={event.date} />

          {/* Artist Avatar */}
          <ArtistAvatar artist={event.artist} />

          {/* Event Info */}
          <div className="event-info">
            <h3 className="font-bold text-xl">{event.title}</h3>
            <p className="text-sm text-gray-300">{event.venue.name}</p>
            <p className="text-sm text-gray-400">
              {format(event.date, 'dd MMM, HH:mm')}
            </p>
          </div>

          {/* Price Chip */}
          <PriceChip price={event.price} />
        </div>
      </div>
    </Link>
  )
}
```

### 3.2 Carousel Behavior

#### Desktop
- Horizontal scroll with mouse drag
- Arrow navigation buttons
- Snap to card edges
- Smooth scrolling animation
- Show 3.5 cards at a time (hint at more content)

#### Mobile
- Native touch scroll
- Snap to center
- Show 1.2 cards at a time
- Scroll indicators (dots)

### 3.3 Data Source & Algorithms

**New API Endpoint:** `src/app/api/events/featured/route.ts`
```typescript
// GET /api/events/featured?type={trending|recommended|upcoming}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'trending'
  const session = await getServerSession(authOptions)

  let events: Event[]

  switch (type) {
    case 'trending':
      events = await getTrendingEvents()
      break
    case 'recommended':
      events = await getRecommendedEvents(session?.user?.id)
      break
    case 'upcoming':
      events = await getUpcomingEvents()
      break
  }

  return Response.json(events)
}

async function getTrendingEvents(): Promise<Event[]> {
  // Algorithm:
  // Score = (orders_last_7_days * 10) + (views_last_7_days * 1)
  // Order by score DESC
  // Limit 20

  return prisma.event.findMany({
    where: {
      date: { gte: new Date() },
      status: 'ON_SALE',
    },
    include: {
      venue: true,
      artist: true,
      _count: {
        select: {
          orders: {
            where: {
              createdAt: { gte: subDays(new Date(), 7) }
            }
          }
        }
      }
    },
    orderBy: {
      // Need to add view tracking
      orders: { _count: 'desc' }
    },
    take: 20,
  })
}

async function getRecommendedEvents(userId?: string): Promise<Event[]> {
  if (!userId) return getTrendingEvents()

  // Recommendation Algorithm:
  // 1. Get user's followed artists
  // 2. Get user's music preferences (from Spotify)
  // 3. Find events matching:
  //    - Followed artists (weight: 100)
  //    - Similar genres (weight: 50)
  //    - Similar artists (Spotify API) (weight: 30)
  //    - Nearby location (weight: 20)
  // 4. Score and rank

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: {
        where: { followType: 'ARTIST' }
      }
    }
  })

  const followedArtistIds = user?.following.map(f => f.artistId).filter(Boolean) || []

  return prisma.event.findMany({
    where: {
      OR: [
        { artistId: { in: followedArtistIds } },
        // Add genre matching logic here
      ],
      date: { gte: new Date() },
      status: 'ON_SALE',
    },
    include: {
      venue: true,
      artist: true,
    },
    take: 20,
  })
}
```

### 3.4 Styling

```css
/* Carousel Container */
.featured-carousel {
  padding: 3rem 0;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding: 0 1rem;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

/* Event Card Large */
.event-card-large {
  position: relative;
  width: 340px;
  height: 480px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  scroll-snap-align: start;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card-large:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}
```

### 3.5 React Hook for Carousel

**New Hook:** `src/hooks/useFeaturedEvents.ts`
```typescript
export function useFeaturedEvents(type: 'trending' | 'recommended' | 'upcoming') {
  return useQuery({
    queryKey: ['featured-events', type],
    queryFn: () => fetch(`/api/events/featured?type=${type}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}
```

### 3.6 Implementation Checklist

- [ ] Create `FeaturedCarousel` component
- [ ] Create `EventCardLarge` component
- [ ] Implement `/api/events/featured` endpoint
- [ ] Build trending events algorithm
- [ ] Build recommendation algorithm
- [ ] Add carousel navigation (arrows, drag)
- [ ] Implement scroll snap behavior
- [ ] Add loading skeletons
- [ ] Mobile optimization
- [ ] Add analytics tracking (card views, clicks)

---

## 4. Advanced Search System

### Objective
Maintain search as the primary navigation method with powerful filtering capabilities, making it effortless to find and book events.

### Current State
- ✅ Basic search exists (`src/components/layout/SearchBar.tsx`)
- ✅ Filters implemented in Zustand store (`src/store/filters.ts`)
- ❌ Need to enhance UX and add more filters

### 4.1 Enhanced Search Architecture

**Update:** `src/components/layout/SearchBar.tsx`
```typescript
export function SearchBar() {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<SearchResults | null>(null)

  return (
    <div className="search-container">
      {/* Main Search Input */}
      <div className="search-input-wrapper">
        <SearchIcon />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Busca eventos, artistas, venues..."
        />
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge>{activeFiltersCount}</Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel (Collapsible) */}
      {showFilters && <FilterPanel />}

      {/* Instant Results Dropdown */}
      {results && <SearchResultsDropdown results={results} />}
    </div>
  )
}
```

### 4.2 Filter System

**Update:** `src/store/filters.ts`
```typescript
interface FilterState {
  // Existing filters
  genres: string[]
  dateRange: { start: Date | null; end: Date | null }
  priceRange: { min: number | null; max: number | null }

  // New filters
  venues: string[]
  artists: string[]
  cities: string[]
  hasDiscount: boolean
  availableTickets: boolean // Only show events with tickets
  dayOfWeek: string[] // ['friday', 'saturday', 'sunday']
  timeOfDay: 'any' | 'afternoon' | 'evening' | 'night'

  // Sorting
  sortBy: 'date' | 'price' | 'popularity' | 'distance'
  sortOrder: 'asc' | 'desc'

  // Actions
  setGenres: (genres: string[]) => void
  setDateRange: (range: DateRange) => void
  setPriceRange: (range: PriceRange) => void
  setVenues: (venues: string[]) => void
  // ... more setters
  clearFilters: () => void
  getActiveFilterCount: () => number
}
```

**New Component:** `src/components/search/FilterPanel.tsx`
```typescript
export function FilterPanel() {
  const filters = useFilterStore()

  return (
    <div className="filter-panel">
      {/* Date Filter */}
      <FilterSection title="Fecha">
        <QuickDateFilters /> {/* Hoy, Este fin de semana, Esta semana, etc. */}
        <DateRangePicker
          value={filters.dateRange}
          onChange={filters.setDateRange}
        />
        <DayOfWeekSelector
          value={filters.dayOfWeek}
          onChange={filters.setDayOfWeek}
        />
      </FilterSection>

      {/* Price Filter */}
      <FilterSection title="Precio">
        <PriceRangeSlider
          min={0}
          max={200000} // 200k CLP
          value={filters.priceRange}
          onChange={filters.setPriceRange}
        />
        <Checkbox
          checked={filters.hasDiscount}
          onChange={filters.setHasDiscount}
        >
          Solo con descuento
        </Checkbox>
      </FilterSection>

      {/* Location Filter */}
      <FilterSection title="Ubicación">
        <CitySelector
          value={filters.cities}
          onChange={filters.setCities}
        />
        <DistanceSlider /> {/* If geolocation enabled */}
      </FilterSection>

      {/* Genre Filter */}
      <FilterSection title="Género">
        <GenreChips
          value={filters.genres}
          onChange={filters.setGenres}
        />
      </FilterSection>

      {/* Venue Filter */}
      <FilterSection title="Venue">
        <VenueSelector
          value={filters.venues}
          onChange={filters.setVenues}
        />
      </FilterSection>

      {/* Artist Filter */}
      <FilterSection title="Artista">
        <ArtistSelector
          value={filters.artists}
          onChange={filters.setArtists}
        />
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Disponibilidad">
        <Checkbox
          checked={filters.availableTickets}
          onChange={filters.setAvailableTickets}
        >
          Solo eventos disponibles
        </Checkbox>
      </FilterSection>

      {/* Actions */}
      <div className="filter-actions">
        <Button variant="ghost" onClick={filters.clearFilters}>
          Limpiar filtros
        </Button>
        <Button onClick={() => applyFilters()}>
          Ver resultados ({resultCount})
        </Button>
      </div>
    </div>
  )
}
```

### 4.3 Search API Enhancement

**Update:** `src/app/api/events/route.ts`
```typescript
// GET /api/events?q=query&filters={...}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const filtersJSON = searchParams.get('filters')
  const filters = filtersJSON ? JSON.parse(filtersJSON) : {}

  // Build Prisma where clause
  const where: Prisma.EventWhereInput = {
    AND: [
      // Text search
      query ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { artist: { name: { contains: query, mode: 'insensitive' } } },
          { venue: { name: { contains: query, mode: 'insensitive' } } },
        ]
      } : {},

      // Filters
      filters.genres?.length > 0 ? {
        genres: { hasSome: filters.genres }
      } : {},

      filters.dateRange?.start ? {
        date: { gte: new Date(filters.dateRange.start) }
      } : {},

      filters.dateRange?.end ? {
        date: { lte: new Date(filters.dateRange.end) }
      } : {},

      filters.priceRange?.min !== null ? {
        price: { gte: filters.priceRange.min * 100 } // Convert to cents
      } : {},

      filters.priceRange?.max !== null ? {
        price: { lte: filters.priceRange.max * 100 }
      } : {},

      filters.venues?.length > 0 ? {
        venueId: { in: filters.venues }
      } : {},

      filters.artists?.length > 0 ? {
        artistId: { in: filters.artists }
      } : {},

      filters.hasDiscount ? {
        // Need to add discount logic
      } : {},

      filters.availableTickets ? {
        availableTickets: { gt: 0 }
      } : {},
    ]
  }

  // Sorting
  const orderBy = buildOrderBy(filters.sortBy, filters.sortOrder)

  const events = await prisma.event.findMany({
    where,
    orderBy,
    include: {
      venue: true,
      artist: true,
    },
    take: 50,
  })

  return Response.json(events)
}
```

### 4.4 UX Patterns

#### Search Behavior
1. **As you type:** Show instant results dropdown
2. **Enter:** Navigate to full search results page
3. **Filter button:** Open filter panel
4. **Clear:** Remove query and filters

#### Filter Panel
- **Desktop:** Side panel (persistent)
- **Mobile:** Bottom sheet (modal)
- **Active filters:** Show chips above results
- **Quick remove:** X button on each chip

#### Search Results Page
- **URL:** `/events?q=query&filters={...}`
- **Layout:** Sidebar (filters) + Grid (results)
- **Pagination:** Infinite scroll
- **Empty state:** "No encontramos eventos. Prueba con otros filtros."

### 4.5 Implementation Checklist

- [ ] Enhance `SearchBar` component
- [ ] Build `FilterPanel` component
- [ ] Create filter UI components (sliders, selectors, chips)
- [ ] Update filters Zustand store with new fields
- [ ] Enhance `/api/events` to support all filters
- [ ] Build search results page
- [ ] Add URL state management (filters in URL)
- [ ] Implement "Clear filters" functionality
- [ ] Add active filter chips display
- [ ] Mobile filter bottom sheet
- [ ] Analytics tracking (searches, filters used)

---

## 5. Artists - Music Playback

### Objective
Enable users to discover artists through direct music playback within the app, integrating Spotify and YouTube content.

### 5.1 Artist Page Enhancement

**Update:** `src/app/artists/[slug]/page.tsx`
```typescript
export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await getArtist(params.slug)

  return (
    <div className="artist-page">
      {/* Hero Section */}
      <ArtistHero artist={artist} />

      {/* Music Player Section */}
      <MusicPlayerSection artist={artist} />

      {/* Upcoming Events */}
      <ArtistEvents artistId={artist.id} />

      {/* About */}
      <ArtistBio artist={artist} />

      {/* Social Links */}
      <ArtistSocials artist={artist} />
    </div>
  )
}
```

### 5.2 Music Player Component

**New Component:** `src/components/artists/MusicPlayerSection.tsx`
```typescript
interface MusicPlayerSectionProps {
  artist: Artist
}

export function MusicPlayerSection({ artist }: MusicPlayerSectionProps) {
  const [activeTab, setActiveTab] = useState<'spotify' | 'youtube'>('spotify')
  const { data: topTrack } = useArtistTopTrack(artist.spotifyId)

  return (
    <section className="music-player-section">
      <h2 className="text-2xl font-bold mb-4">Escucha ahora</h2>

      {/* Tab Switcher */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab('spotify')}
          className={activeTab === 'spotify' ? 'active' : ''}
        >
          <SpotifyIcon /> Spotify
        </button>
        <button
          onClick={() => setActiveTab('youtube')}
          className={activeTab === 'youtube' ? 'active' : ''}
        >
          <YouTubeIcon /> YouTube
        </button>
      </div>

      {/* Player */}
      {activeTab === 'spotify' && (
        <SpotifyPlayer
          trackUri={topTrack?.uri}
          artistName={artist.name}
        />
      )}

      {activeTab === 'youtube' && (
        <YouTubePlayer
          artistName={artist.name}
        />
      )}
    </section>
  )
}
```

### 5.3 Spotify Player Integration

**New Component:** `src/components/players/SpotifyPlayer.tsx`
```typescript
interface SpotifyPlayerProps {
  trackUri?: string
  artistName: string
}

export function SpotifyPlayer({ trackUri, artistName }: SpotifyPlayerProps) {
  if (!trackUri) {
    return <SpotifyFallback artistName={artistName} />
  }

  // Option 1: Spotify Embed Player (No auth required)
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${extractTrackId(trackUri)}`}
      width="100%"
      height="380"
      frameBorder="0"
      allow="encrypted-media"
      title={`${artistName} on Spotify`}
    />
  )

  // Option 2: Spotify Web Playback SDK (Requires Premium + Auth)
  // More control but higher complexity
}

function SpotifyFallback({ artistName }: { artistName: string }) {
  return (
    <div className="spotify-fallback">
      <SpotifyIcon className="w-16 h-16 mb-4" />
      <p>Escucha a {artistName} en Spotify</p>
      <Button asChild>
        <a
          href={`https://open.spotify.com/search/${encodeURIComponent(artistName)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir Spotify
        </a>
      </Button>
    </div>
  )
}
```

### 5.4 YouTube Player Integration

**New Component:** `src/components/players/YouTubePlayer.tsx`
```typescript
interface YouTubePlayerProps {
  artistName: string
}

export function YouTubePlayer({ artistName }: YouTubePlayerProps) {
  const { data: video, isLoading } = useArtistYouTubeVideo(artistName)

  if (isLoading) return <PlayerSkeleton />

  if (!video) {
    return <YouTubeFallback artistName={artistName} />
  }

  // YouTube iframe embed
  return (
    <div className="youtube-player">
      <iframe
        width="100%"
        height="380"
        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1`}
        title={video.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <p className="text-sm text-gray-400 mt-2">{video.title}</p>
    </div>
  )
}
```

**New API Endpoint:** `src/app/api/artists/[id]/youtube/route.ts`
```typescript
// GET /api/artists/[id]/youtube
// Returns the most popular YouTube video for an artist

import { google } from 'googleapis'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const artist = await prisma.artist.findUnique({
    where: { id: params.id }
  })

  if (!artist) {
    return new Response('Artist not found', { status: 404 })
  }

  // YouTube Data API v3
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  })

  const response = await youtube.search.list({
    part: ['snippet'],
    q: `${artist.name} official`,
    type: ['video'],
    maxResults: 1,
    order: 'viewCount',
  })

  const video = response.data.items?.[0]

  if (!video) {
    return Response.json({ video: null })
  }

  return Response.json({
    id: video.id.videoId,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.high.url,
  })
}
```

### 5.5 Instagram Feed Integration

**New Component:** `src/components/artists/InstagramFeed.tsx`
```typescript
export function InstagramFeed({ instagramHandle }: { instagramHandle?: string }) {
  if (!instagramHandle) return null

  // Option 1: Instagram Embed API (Requires Instagram approval)
  // Option 2: Link to Instagram profile with preview

  return (
    <section className="instagram-feed">
      <h3 className="text-xl font-bold mb-4">Instagram</h3>
      <a
        href={`https://instagram.com/${instagramHandle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-link"
      >
        <InstagramIcon />
        @{instagramHandle}
      </a>
    </section>
  )
}
```

### 5.6 Data Model Updates

**Update Prisma Schema:** `prisma/schema.prisma`
```prisma
model Artist {
  // ... existing fields

  // External IDs
  spotifyId        String?  @unique
  youtubeChannelId String?
  instagramHandle  String?

  // Media
  topTrackUri      String?  // Spotify URI for most popular track
  youtubeVideoId   String?  // Cached YouTube video ID

  // Metadata
  monthlyListeners Int?     // From Spotify API
  verified         Boolean  @default(false)
}
```

### 5.7 Implementation Checklist

- [ ] Create `MusicPlayerSection` component
- [ ] Build `SpotifyPlayer` component (iframe embed)
- [ ] Build `YouTubePlayer` component
- [ ] Create `/api/artists/[id]/youtube` endpoint
- [ ] Add YouTube Data API integration
- [ ] Create `InstagramFeed` component
- [ ] Update Artist schema with external IDs
- [ ] Create hook `useArtistTopTrack` for Spotify API
- [ ] Add loading states and error handling
- [ ] Mobile-optimized player controls
- [ ] Add "Open in app" CTAs for Spotify/YouTube

---

## 6. Artist Profile & Follow System

### Objective
Build comprehensive artist profiles with follow functionality to enable personalized recommendations and notifications.

### 6.1 Artist Profile Architecture

**New/Update:** `src/app/artists/[slug]/page.tsx`
```typescript
export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    include: {
      events: {
        where: {
          date: { gte: new Date() },
          status: 'ON_SALE',
        },
        include: { venue: true },
        orderBy: { date: 'asc' },
      },
      _count: {
        select: {
          followers: true,
          events: true,
        },
      },
    },
  })

  if (!artist) notFound()

  return (
    <div className="artist-profile">
      <ArtistHero artist={artist} />
      <ArtistTabs artist={artist} />
    </div>
  )
}
```

**New Component:** `src/components/artists/ArtistHero.tsx`
```typescript
interface ArtistHeroProps {
  artist: Artist & {
    _count: { followers: number; events: number }
  }
}

export function ArtistHero({ artist }: ArtistHeroProps) {
  const session = useSession()
  const { isFollowing, toggleFollow } = useFollowArtist(artist.id)

  return (
    <section className="artist-hero">
      {/* Background Image with Blur */}
      <div className="hero-bg">
        <Image
          src={artist.image || '/default-artist.jpg'}
          alt={artist.name}
          fill
          className="object-cover blur-xl opacity-30"
        />
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Artist Image */}
        <div className="artist-avatar">
          <Image
            src={artist.image || '/default-artist.jpg'}
            alt={artist.name}
            width={200}
            height={200}
            className="rounded-full"
          />
          {artist.verified && (
            <VerifiedBadge className="absolute bottom-0 right-0" />
          )}
        </div>

        {/* Artist Info */}
        <div className="artist-info">
          <h1 className="text-6xl font-black mb-2">{artist.name}</h1>

          {/* Genre Tags */}
          <div className="genres">
            {artist.genres.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="stats">
            <StatItem
              icon={<UsersIcon />}
              label="seguidores"
              value={formatNumber(artist._count.followers)}
            />
            {artist.monthlyListeners && (
              <StatItem
                icon={<HeadphonesIcon />}
                label="oyentes mensuales"
                value={formatNumber(artist.monthlyListeners)}
              />
            )}
            <StatItem
              icon={<CalendarIcon />}
              label="eventos próximos"
              value={artist._count.events}
            />
          </div>

          {/* Actions */}
          <div className="actions">
            <FollowButton
              isFollowing={isFollowing}
              onClick={toggleFollow}
              disabled={!session}
            />
            <ShareButton artist={artist} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <SpotifyIcon /> Abrir en Spotify
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <InstagramIcon /> Ver Instagram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  )
}
```

### 6.2 Follow System Backend

**Update Prisma Schema:** `prisma/schema.prisma`
```prisma
model Follow {
  id         String     @id @default(cuid())
  userId     String
  followType FollowType

  // Polymorphic relations
  artistId   String?
  venueId    String?

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  artist     Artist?    @relation("ArtistFollowers", fields: [artistId], references: [id], onDelete: Cascade)
  venue      Venue?     @relation("VenueFollowers", fields: [venueId], references: [id], onDelete: Cascade)

  createdAt  DateTime   @default(now())

  @@unique([userId, artistId])
  @@unique([userId, venueId])
  @@index([userId])
  @@index([artistId])
}

enum FollowType {
  ARTIST
  VENUE
}
```

**New API Endpoint:** `src/app/api/artists/[id]/follow/route.ts`
```typescript
// POST /api/artists/[id]/follow - Follow an artist
// DELETE /api/artists/[id]/follow - Unfollow an artist

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Check if artist exists
  const artist = await prisma.artist.findUnique({
    where: { id: params.id }
  })

  if (!artist) {
    return new Response('Artist not found', { status: 404 })
  }

  // Create follow relationship
  const follow = await prisma.follow.create({
    data: {
      userId: session.user.id,
      artistId: params.id,
      followType: 'ARTIST',
    },
  })

  // Trigger notification subscription (future)
  // await subscribeToArtistNotifications(session.user.id, params.id)

  return Response.json(follow)
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  await prisma.follow.deleteMany({
    where: {
      userId: session.user.id,
      artistId: params.id,
    },
  })

  return Response.json({ success: true })
}
```

**New API Endpoint:** `src/app/api/user/following/route.ts`
```typescript
// GET /api/user/following?type={artist|venue}
// Returns all entities the user is following

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') as FollowType | null

  const following = await prisma.follow.findMany({
    where: {
      userId: session.user.id,
      ...(type && { followType: type }),
    },
    include: {
      artist: {
        include: {
          events: {
            where: {
              date: { gte: new Date() },
              status: 'ON_SALE',
            },
            take: 3,
          },
        },
      },
      venue: true,
    },
  })

  return Response.json(following)
}
```

### 6.3 Follow Button Component

**New Component:** `src/components/artists/FollowButton.tsx`
```typescript
interface FollowButtonProps {
  isFollowing: boolean
  onClick: () => void
  disabled?: boolean
}

export function FollowButton({ isFollowing, onClick, disabled }: FollowButtonProps) {
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    try {
      await onClick()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending}
      variant={isFollowing ? 'outline' : 'default'}
      size="lg"
      className="follow-button"
    >
      {isPending ? (
        <Spinner className="w-4 h-4" />
      ) : isFollowing ? (
        <>
          <CheckIcon /> Siguiendo
        </>
      ) : (
        <>
          <PlusIcon /> Seguir
        </>
      )}
    </Button>
  )
}
```

### 6.4 Custom Hook for Follow Logic

**New Hook:** `src/hooks/useFollowArtist.ts`
```typescript
export function useFollowArtist(artistId: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  // Check if following
  const { data: isFollowing = false } = useQuery({
    queryKey: ['following', 'artist', artistId],
    queryFn: async () => {
      if (!session?.user?.id) return false

      const res = await fetch(`/api/artists/${artistId}/follow`)
      if (res.status === 404) return false
      return res.ok
    },
    enabled: !!session?.user?.id,
  })

  // Toggle follow mutation
  const toggleFollow = useMutation({
    mutationFn: async () => {
      const method = isFollowing ? 'DELETE' : 'POST'
      const res = await fetch(`/api/artists/${artistId}/follow`, { method })
      if (!res.ok) throw new Error('Failed to toggle follow')
      return res.json()
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['following'] })
      queryClient.invalidateQueries({ queryKey: ['artist', artistId] })
    },
  })

  return {
    isFollowing,
    toggleFollow: toggleFollow.mutate,
    isLoading: toggleFollow.isPending,
  }
}
```

### 6.5 Artist Bio Section

**New Component:** `src/components/artists/ArtistBio.tsx`
```typescript
interface ArtistBioProps {
  artist: Artist
}

export function ArtistBio({ artist }: ArtistBioProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!artist.bio) return null

  const shouldTruncate = artist.bio.length > 300
  const displayBio = shouldTruncate && !isExpanded
    ? artist.bio.slice(0, 300) + '...'
    : artist.bio

  return (
    <section className="artist-bio">
      <h2 className="text-2xl font-bold mb-4">Sobre {artist.name}</h2>
      <p className="text-gray-300 whitespace-pre-line">
        {displayBio}
      </p>
      {shouldTruncate && (
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2"
        >
          {isExpanded ? 'Ver menos' : 'Ver más'}
        </Button>
      )}
    </section>
  )
}
```

### 6.6 Recommendation Engine Integration

When a user follows an artist:
1. Store the follow relationship
2. Update user's music preferences
3. Trigger recommendation recalculation
4. Subscribe to artist event notifications

**New Utility:** `src/lib/recommendations.ts`
```typescript
export async function updateRecommendations(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: {
        where: { followType: 'ARTIST' },
        include: { artist: true },
      },
    },
  })

  if (!user) return

  // Extract genres from followed artists
  const genres = user.following
    .flatMap(f => f.artist?.genres || [])
    .reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  // Store preferences (could be a separate UserPreferences table)
  // This feeds into the recommendation algorithm
}
```

### 6.7 Implementation Checklist

- [ ] Update `Artist` schema with social fields
- [ ] Create `Follow` model in Prisma
- [ ] Build `ArtistHero` component
- [ ] Create `FollowButton` component
- [ ] Implement `/api/artists/[id]/follow` endpoints
- [ ] Create `useFollowArtist` hook
- [ ] Build `ArtistBio` component
- [ ] Create `/api/user/following` endpoint
- [ ] Implement recommendation updates on follow
- [ ] Add notification system (future)
- [ ] Build "Following" page for user profile
- [ ] Analytics tracking (follows, unfollows)

---

## 7. Event View Enhancements

### Objective
Transform the event detail page into a conversion-optimized page with maps, social sharing, and discount code functionality.

### Current State
- ✅ Basic event page exists (`src/app/events/[id]/page.tsx`)
- ❌ No map integration
- ❌ No sharing functionality
- ❌ No discount code system

### 7.1 Event Page Architecture

**Update:** `src/app/events/[id]/page.tsx`
```typescript
export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      venue: true,
      artist: true,
      _count: {
        select: {
          orders: true,
          tickets: true,
        },
      },
    },
  })

  if (!event) notFound()

  return (
    <div className="event-page">
      {/* Hero Section */}
      <EventHero event={event} />

      {/* Main Content */}
      <div className="event-content-grid">
        {/* Left Column - Details */}
        <div className="event-details">
          <EventInfo event={event} />
          <EventDescription description={event.description} />
          <ArtistSection artist={event.artist} />
          <VenueSection venue={event.venue} />
          <FAQSection eventId={event.id} />
        </div>

        {/* Right Column - Booking Widget (Sticky) */}
        <div className="booking-sidebar">
          <BookingWidget event={event} />
          <ShareWidget event={event} />
        </div>
      </div>
    </div>
  )
}
```

### 7.2 Google Maps Integration

**New Component:** `src/components/events/VenueSection.tsx`
```typescript
interface VenueSectionProps {
  venue: Venue
}

export function VenueSection({ venue }: VenueSectionProps) {
  return (
    <section className="venue-section">
      <h2 className="text-2xl font-bold mb-4">Ubicación</h2>

      {/* Venue Info Card */}
      <div className="venue-card">
        <h3 className="font-bold text-lg">{venue.name}</h3>
        <p className="text-gray-400">{venue.address}</p>
        <p className="text-gray-400">{venue.city}</p>

        {/* Directions Link */}
        <Button asChild variant="outline" className="mt-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <NavigationIcon /> Cómo llegar
          </a>
        </Button>
      </div>

      {/* Embedded Map */}
      <VenueMap venue={venue} />
    </section>
  )
}
```

**New Component:** `src/components/maps/VenueMap.tsx`
```typescript
'use client'

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'

interface VenueMapProps {
  venue: Venue
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
}

export function VenueMap({ venue }: VenueMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  if (loadError) {
    return <MapError />
  }

  if (!isLoaded) {
    return <MapSkeleton />
  }

  const center = {
    lat: venue.lat,
    lng: venue.lng,
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={15}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        styles: darkMapStyles, // Custom dark theme
      }}
    >
      <Marker
        position={center}
        title={venue.name}
        icon={{
          url: '/marker-icon.svg',
          scaledSize: new google.maps.Size(40, 40),
        }}
      />
    </GoogleMap>
  )
}

// Dark map styling for consistency
const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  // ... more dark theme styles
]
```

**Dependencies:** Add to `package.json`
```json
{
  "dependencies": {
    "@react-google-maps/api": "^2.19.0"
  }
}
```

**Environment Variable:**
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 7.3 WhatsApp Sharing

**New Component:** `src/components/events/ShareWidget.tsx`
```typescript
interface ShareWidgetProps {
  event: Event & { venue: Venue; artist: Artist }
}

export function ShareWidget({ event }: ShareWidgetProps) {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}`

  const shareToWhatsApp = () => {
    const message = generateWhatsAppMessage(event)
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const shareToTwitter = () => {
    const text = `🎵 ${event.title} - ${event.artist.name}\n📍 ${event.venue.name}\n📅 ${format(event.date, 'dd MMM yyyy')}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank')
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    toast.success('Link copiado al portapapeles')
  }

  return (
    <div className="share-widget">
      <h3 className="font-bold mb-3">Compartir evento</h3>

      <div className="share-buttons">
        <Button
          onClick={shareToWhatsApp}
          className="share-btn whatsapp"
        >
          <WhatsAppIcon /> WhatsApp
        </Button>

        <Button
          onClick={shareToTwitter}
          variant="outline"
          className="share-btn twitter"
        >
          <TwitterIcon /> Twitter
        </Button>

        <Button
          onClick={copyLink}
          variant="outline"
          className="share-btn"
        >
          <LinkIcon /> Copiar link
        </Button>
      </div>
    </div>
  )
}

function generateWhatsAppMessage(event: Event & { venue: Venue; artist: Artist }): string {
  return `
🎵 *${event.title}*

Artista: ${event.artist.name}
📍 ${event.venue.name}, ${event.venue.city}
📅 ${format(event.date, "EEEE, dd 'de' MMMM 'a las' HH:mm", { locale: es })}
💰 Desde ${formatCurrency(event.price)}

¡Compra tu entrada!
${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}
  `.trim()
}
```

### 7.4 Discount Code System

**Update Prisma Schema:** `prisma/schema.prisma`
```prisma
model DiscountCode {
  id          String          @id @default(cuid())
  code        String          @unique
  eventId     String?         // null = applies to all events

  type        DiscountType
  value       Int             // Percentage (0-100) or fixed amount in cents

  maxUses     Int?            // null = unlimited
  usedCount   Int             @default(0)

  validFrom   DateTime
  validUntil  DateTime

  minPurchase Int?            // Minimum order amount in cents

  active      Boolean         @default(true)

  event       Event?          @relation(fields: [eventId], references: [id])
  orders      Order[]

  createdAt   DateTime        @default(now())

  @@index([code])
  @@index([eventId])
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

// Add to Order model
model Order {
  // ... existing fields
  discountCodeId String?
  discountCode   DiscountCode? @relation(fields: [discountCodeId], references: [id])
  discountAmount Int           @default(0) // Amount saved in cents
}
```

**New Component:** `src/components/checkout/DiscountCodeInput.tsx`
```typescript
interface DiscountCodeInputProps {
  eventId: string
  onApply: (discount: AppliedDiscount) => void
}

export function DiscountCodeInput({ eventId, onApply }: DiscountCodeInputProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [applied, setApplied] = useState<AppliedDiscount | null>(null)

  const applyCode = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch('/api/discount-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, eventId }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }

      return res.json()
    },
    onSuccess: (discount) => {
      setApplied(discount)
      setError(null)
      onApply(discount)
      toast.success(`Código aplicado: ${discount.discountAmount} de descuento`)
    },
    onError: (error: Error) => {
      setError(error.message)
      setApplied(null)
    },
  })

  return (
    <div className="discount-code-input">
      <Label htmlFor="discount-code">Código de descuento</Label>

      {!applied ? (
        <div className="input-group">
          <Input
            id="discount-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="INGRESA TU CÓDIGO"
            disabled={applyCode.isPending}
          />
          <Button
            onClick={() => applyCode.mutate(code)}
            disabled={!code || applyCode.isPending}
          >
            Aplicar
          </Button>
        </div>
      ) : (
        <div className="applied-code">
          <CheckCircleIcon className="text-green-500" />
          <span className="font-bold">{applied.code}</span>
          <span className="text-sm text-gray-400">
            -{formatCurrency(applied.discountAmount)} descuento
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setApplied(null)
              setCode('')
              onApply(null)
            }}
          >
            Quitar
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}
```

**New API Endpoint:** `src/app/api/discount-codes/validate/route.ts`
```typescript
// POST /api/discount-codes/validate
// Validates a discount code and returns discount details

export async function POST(req: Request) {
  const { code, eventId } = await req.json()

  // Find discount code
  const discountCode = await prisma.discountCode.findUnique({
    where: { code: code.toUpperCase() },
  })

  if (!discountCode) {
    return Response.json(
      { message: 'Código no válido' },
      { status: 404 }
    )
  }

  // Validate
  const now = new Date()

  if (!discountCode.active) {
    return Response.json(
      { message: 'Código desactivado' },
      { status: 400 }
    )
  }

  if (now < discountCode.validFrom || now > discountCode.validUntil) {
    return Response.json(
      { message: 'Código expirado o no válido aún' },
      { status: 400 }
    )
  }

  if (discountCode.eventId && discountCode.eventId !== eventId) {
    return Response.json(
      { message: 'Código no válido para este evento' },
      { status: 400 }
    )
  }

  if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
    return Response.json(
      { message: 'Código alcanzó el límite de usos' },
      { status: 400 }
    )
  }

  // Return valid discount
  return Response.json({
    id: discountCode.id,
    code: discountCode.code,
    type: discountCode.type,
    value: discountCode.value,
  })
}
```

**Update Checkout Logic:** `src/app/checkout/page.tsx`
```typescript
// Calculate discount amount
function calculateDiscount(
  subtotal: number,
  discount: AppliedDiscount | null
): number {
  if (!discount) return 0

  if (discount.type === 'PERCENTAGE') {
    return Math.round(subtotal * (discount.value / 100))
  } else {
    return discount.value // Fixed amount in cents
  }
}

// In checkout component
const subtotal = cart.total
const discountAmount = calculateDiscount(subtotal, appliedDiscount)
const total = subtotal - discountAmount + fees
```

### 7.5 Implementation Checklist

- [ ] Install `@react-google-maps/api`
- [ ] Create Google Maps API key
- [ ] Build `VenueMap` component
- [ ] Update `VenueSection` with map integration
- [ ] Create `ShareWidget` component
- [ ] Implement WhatsApp share functionality
- [ ] Add Twitter/social share options
- [ ] Create `DiscountCode` model in Prisma
- [ ] Build `DiscountCodeInput` component
- [ ] Create `/api/discount-codes/validate` endpoint
- [ ] Update checkout flow to apply discounts
- [ ] Admin panel for managing discount codes (future)
- [ ] Analytics tracking (shares, discount code usage)

---

## 8. FAQ System

### Objective
Implement a comprehensive FAQ section accessible from event pages and main menu, covering tickets, payments, access, changes, and cancellations.

### 8.1 FAQ Data Architecture

**New Prisma Model:** `prisma/schema.prisma`
```prisma
model FAQ {
  id          String      @id @default(cuid())
  question    String
  answer      String      @db.Text
  category    FAQCategory
  order       Int         @default(0)
  eventId     String?     // null = global FAQ

  event       Event?      @relation(fields: [eventId], references: [id])

  published   Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([category])
  @@index([eventId])
  @@index([published])
}

enum FAQCategory {
  TICKETS      // Compra de entradas
  PAYMENT      // Pagos y reembolsos
  ACCESS       // Acceso al evento
  CHANGES      // Cambios y cancelaciones
  TRANSFERS    // Transferencia de entradas
  GENERAL      // Preguntas generales
}
```

### 8.2 FAQ Page Component

**New Page:** `src/app/faq/page.tsx`
```typescript
export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: {
      published: true,
      eventId: null, // Global FAQs only
    },
    orderBy: [
      { category: 'asc' },
      { order: 'asc' },
    ],
  })

  const faqsByCategory = groupBy(faqs, 'category')

  return (
    <div className="faq-page">
      <PageHeader
        title="Preguntas Frecuentes"
        description="Encuentra respuestas a las preguntas más comunes sobre KET"
      />

      {/* Search */}
      <FAQSearch faqs={faqs} />

      {/* Categories */}
      <div className="faq-categories">
        {Object.entries(faqsByCategory).map(([category, items]) => (
          <FAQCategory
            key={category}
            category={category as FAQCategory}
            faqs={items}
          />
        ))}
      </div>

      {/* Contact CTA */}
      <ContactSupport />
    </div>
  )
}
```

**New Component:** `src/components/faq/FAQCategory.tsx`
```typescript
interface FAQCategoryProps {
  category: FAQCategory
  faqs: FAQ[]
}

const categoryLabels: Record<FAQCategory, string> = {
  TICKETS: '🎫 Entradas',
  PAYMENT: '💳 Pagos y reembolsos',
  ACCESS: '🚪 Acceso al evento',
  CHANGES: '🔄 Cambios y cancelaciones',
  TRANSFERS: '🔀 Transferencia de entradas',
  GENERAL: '❓ General',
}

export function FAQCategory({ category, faqs }: FAQCategoryProps) {
  return (
    <section className="faq-category">
      <h2 className="text-2xl font-bold mb-6">
        {categoryLabels[category]}
      </h2>

      <Accordion type="single" collapsible className="faq-accordion">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <div
                className="faq-answer"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
```

### 8.3 Event-Specific FAQ

**New Component:** `src/components/events/FAQSection.tsx`
```typescript
interface FAQSectionProps {
  eventId: string
}

export async function FAQSection({ eventId }: FAQSectionProps) {
  const faqs = await prisma.fAQ.findMany({
    where: {
      OR: [
        { eventId },
        { eventId: null }, // Include global FAQs
      ],
      published: true,
    },
    orderBy: { order: 'asc' },
    take: 5, // Show top 5 on event page
  })

  if (faqs.length === 0) return null

  return (
    <section className="event-faq-section">
      <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>

      <Accordion type="single" collapsible>
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>
              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button asChild variant="outline" className="mt-4">
        <Link href="/faq">
          Ver todas las preguntas →
        </Link>
      </Button>
    </section>
  )
}
```

### 8.4 FAQ Search

**New Component:** `src/components/faq/FAQSearch.tsx`
```typescript
'use client'

export function FAQSearch({ faqs }: { faqs: FAQ[] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FAQ[]>([])

  const handleSearch = useMemo(() => {
    return debounce((q: string) => {
      if (!q) {
        setResults([])
        return
      }

      const filtered = faqs.filter(faq =>
        faq.question.toLowerCase().includes(q.toLowerCase()) ||
        faq.answer.toLowerCase().includes(q.toLowerCase())
      )

      setResults(filtered)
    }, 300)
  }, [faqs])

  useEffect(() => {
    handleSearch(query)
  }, [query, handleSearch])

  return (
    <div className="faq-search">
      <div className="search-input">
        <SearchIcon />
        <Input
          type="text"
          placeholder="Busca tu pregunta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {results.length > 0 && (
        <div className="search-results">
          <p className="text-sm text-gray-400 mb-2">
            {results.length} resultados
          </p>
          <Accordion type="single" collapsible>
            {results.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  )
}
```

### 8.5 Sample FAQ Content

**Seed Data:** `prisma/seed-faq.ts`
```typescript
const faqData: Prisma.FAQCreateInput[] = [
  // TICKETS
  {
    category: 'TICKETS',
    question: '¿Cómo compro una entrada?',
    answer: `
      <p>Comprar entradas en KET es muy fácil:</p>
      <ol>
        <li>Busca el evento que quieres asistir</li>
        <li>Selecciona la cantidad de entradas</li>
        <li>Completa tus datos de pago</li>
        <li>Recibe tu entrada con código QR por email</li>
      </ol>
      <p>Tus entradas también estarán disponibles en la sección "Mis Entradas" de tu perfil.</p>
    `,
    order: 1,
  },
  {
    category: 'TICKETS',
    question: '¿Puedo cancelar mi compra?',
    answer: `
      <p>Las entradas pueden ser canceladas hasta 48 horas antes del evento.</p>
      <p>El reembolso se procesará en un plazo de 5-7 días hábiles al método de pago original.</p>
      <p>Para cancelar, ve a "Mis Entradas" y selecciona "Solicitar reembolso".</p>
    `,
    order: 2,
  },

  // PAYMENT
  {
    category: 'PAYMENT',
    question: '¿Qué métodos de pago aceptan?',
    answer: `
      <p>Aceptamos los siguientes métodos de pago:</p>
      <ul>
        <li><strong>Transferencia bancaria</strong> (Fintoc) - Sin cargos extra</li>
        <li><strong>Tarjetas de crédito/débito</strong> (Visa, Mastercard, Amex)</li>
        <li><strong>Billetera KET</strong> - Carga saldo y obtén descuentos</li>
      </ul>
    `,
    order: 1,
  },
  {
    category: 'PAYMENT',
    question: '¿Cuáles son los costos de servicio?',
    answer: `
      <p>KET cobra una tarifa de servicio del <strong>5% + $500 CLP</strong> por transacción.</p>
      <p>Este cargo se muestra claramente antes de confirmar tu compra.</p>
    `,
    order: 2,
  },

  // ACCESS
  {
    category: 'ACCESS',
    question: '¿Cómo accedo al evento con mi entrada?',
    answer: `
      <p>Tu entrada incluye un <strong>código QR dinámico</strong> que se actualiza cada 15 minutos por seguridad.</p>
      <ol>
        <li>Abre la app de KET o tu email de confirmación</li>
        <li>Ve a "Mis Entradas"</li>
        <li>Muestra el código QR en la entrada del evento</li>
        <li>El personal escaneará tu código</li>
      </ol>
      <p><strong>Importante:</strong> No compartas capturas de pantalla de tu QR - no funcionarán.</p>
    `,
    order: 1,
  },

  // TRANSFERS
  {
    category: 'TRANSFERS',
    question: '¿Puedo transferir mi entrada a otra persona?',
    answer: `
      <p>Sí, puedes transferir tu entrada de forma segura:</p>
      <ol>
        <li>Ve a "Mis Entradas"</li>
        <li>Selecciona la entrada que quieres transferir</li>
        <li>Ingresa el email del destinatario</li>
        <li>Confirma la transferencia</li>
      </ol>
      <p>El destinatario recibirá un email y podrá aceptar la transferencia. Una vez aceptada, la entrada se transferirá automáticamente a su cuenta.</p>
    `,
    order: 1,
  },

  // CHANGES
  {
    category: 'CHANGES',
    question: '¿Qué pasa si el evento se cancela o reprograma?',
    answer: `
      <p>Si un evento es cancelado:</p>
      <ul>
        <li>Te notificaremos inmediatamente por email y notificación push</li>
        <li>Recibirás un reembolso completo (incluye tarifa de servicio)</li>
        <li>El reembolso se procesa en 5-7 días hábiles</li>
      </ul>
      <p>Si un evento es reprogramado:</p>
      <ul>
        <li>Tu entrada será válida para la nueva fecha automáticamente</li>
        <li>Si no puedes asistir a la nueva fecha, puedes solicitar reembolso</li>
      </ul>
    `,
    order: 1,
  },
]
```

### 8.6 Navigation Integration

**Update Header:** Add FAQ link to main navigation
```typescript
// src/components/layout/Header.tsx
<nav>
  <Link href="/events">Eventos</Link>
  <Link href="/artists">Artistas</Link>
  <Link href="/faq">Ayuda</Link>
</nav>
```

**Update Footer:** Add FAQ section
```typescript
// src/components/layout/Footer.tsx
<div className="footer-section">
  <h4>Ayuda</h4>
  <Link href="/faq">Preguntas Frecuentes</Link>
  <Link href="/contact">Contacto</Link>
  <Link href="/terms">Términos y Condiciones</Link>
</div>
```

### 8.7 Implementation Checklist

- [ ] Create `FAQ` model in Prisma
- [ ] Build FAQ seed data file
- [ ] Create `/faq` page
- [ ] Build `FAQCategory` component
- [ ] Create `FAQSearch` component
- [ ] Build `FAQSection` for event pages
- [ ] Add FAQ links to Header and Footer
- [ ] Create admin panel for managing FAQs (future)
- [ ] Implement FAQ analytics (most viewed questions)
- [ ] Add "Was this helpful?" feedback system

---

## 9. Create Event Flow

### Objective
Streamline the event creation process for organizers with a comprehensive, validated form covering all event details.

### Current State
- ✅ Basic create page exists (`src/app/create/page.tsx`)
- ❌ Needs multi-step form
- ❌ Needs validation and better UX
- ❌ Missing image upload
- ❌ Missing artist/venue creation flow

### 9.1 Multi-Step Form Architecture

**Update:** `src/app/create/page.tsx`
```typescript
'use client'

export default function CreateEventPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CreateEventInput>>({})

  const steps = [
    { id: 1, name: 'Información básica', component: BasicInfoStep },
    { id: 2, name: 'Fecha y ubicación', component: DateLocationStep },
    { id: 3, name: 'Artista', component: ArtistStep },
    { id: 4, name: 'Precios', component: PricingStep },
    { id: 5, name: 'Imágenes', component: ImagesStep },
    { id: 6, name: 'Revisión', component: ReviewStep },
  ]

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="create-event-page">
      {/* Progress Indicator */}
      <ProgressSteps steps={steps} currentStep={currentStep} />

      {/* Form Step */}
      <CurrentStepComponent
        data={formData}
        onUpdate={setFormData}
        onNext={() => setCurrentStep(currentStep + 1)}
        onBack={() => setCurrentStep(currentStep - 1)}
      />
    </div>
  )
}
```

### 9.2 Form Steps

#### Step 1: Basic Info

**New Component:** `src/components/create-event/BasicInfoStep.tsx`
```typescript
interface BasicInfoStepProps {
  data: Partial<CreateEventInput>
  onUpdate: (data: Partial<CreateEventInput>) => void
  onNext: () => void
}

export function BasicInfoStep({ data, onUpdate, onNext }: BasicInfoStepProps) {
  const form = useForm<BasicInfoSchema>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: data,
  })

  const handleSubmit = form.handleSubmit((values) => {
    onUpdate({ ...data, ...values })
    onNext()
  })

  return (
    <form onSubmit={handleSubmit} className="step-form">
      <h2 className="text-3xl font-bold mb-6">Información básica</h2>

      {/* Event Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título del evento</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Ej: Festival de Rock 2026"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe el evento, lineup, y detalles importantes..."
                rows={6}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Genres */}
      <FormField
        control={form.control}
        name="genres"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Géneros musicales</FormLabel>
            <FormControl>
              <GenreSelector
                value={field.value || []}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <StepActions>
        <Button type="submit">Continuar →</Button>
      </StepActions>
    </form>
  )
}
```

#### Step 2: Date & Location

**New Component:** `src/components/create-event/DateLocationStep.tsx`
```typescript
export function DateLocationStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const form = useForm<DateLocationSchema>({
    resolver: zodResolver(dateLocationSchema),
    defaultValues: data,
  })

  return (
    <form onSubmit={form.handleSubmit((values) => {
      onUpdate({ ...data, ...values })
      onNext()
    })}>
      <h2 className="text-3xl font-bold mb-6">Fecha y ubicación</h2>

      {/* Event Date */}
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha y hora del evento</FormLabel>
            <FormControl>
              <DateTimePicker
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Doors Time */}
      <FormField
        control={form.control}
        name="doors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hora de apertura de puertas</FormLabel>
            <FormControl>
              <TimePicker
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Venue Selection */}
      <FormField
        control={form.control}
        name="venueId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue</FormLabel>
            <FormControl>
              <VenueSelector
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              ¿No encuentras el venue?{' '}
              <button
                type="button"
                onClick={() => openVenueDialog()}
                className="text-primary underline"
              >
                Créalo aquí
              </button>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <StepActions>
        <Button type="button" variant="outline" onClick={onBack}>
          ← Atrás
        </Button>
        <Button type="submit">Continuar →</Button>
      </StepActions>
    </form>
  )
}
```

#### Step 3: Artist

**New Component:** `src/components/create-event/ArtistStep.tsx`
```typescript
export function ArtistStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [createMode, setCreateMode] = useState(false)

  return (
    <div className="step-form">
      <h2 className="text-3xl font-bold mb-6">Artista</h2>

      {!createMode ? (
        <>
          {/* Search Existing Artist */}
          <ArtistSelector
            value={data.artistId}
            onChange={(artistId) => onUpdate({ ...data, artistId })}
          />

          <Button
            variant="outline"
            onClick={() => setCreateMode(true)}
            className="mt-4"
          >
            + Crear nuevo artista
          </Button>
        </>
      ) : (
        <CreateArtistForm
          onCreated={(artist) => {
            onUpdate({ ...data, artistId: artist.id })
            setCreateMode(false)
          }}
          onCancel={() => setCreateMode(false)}
        />
      )}

      <StepActions className="mt-8">
        <Button variant="outline" onClick={onBack}>← Atrás</Button>
        <Button onClick={onNext} disabled={!data.artistId}>
          Continuar →
        </Button>
      </StepActions>
    </div>
  )
}
```

**New Component:** `src/components/create-event/CreateArtistForm.tsx`
```typescript
export function CreateArtistForm({ onCreated, onCancel }: CreateArtistFormProps) {
  const form = useForm<CreateArtistInput>({
    resolver: zodResolver(createArtistSchema),
  })

  const createArtist = useMutation({
    mutationFn: async (values: CreateArtistInput) => {
      const res = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      return res.json()
    },
    onSuccess: onCreated,
  })

  return (
    <form onSubmit={form.handleSubmit((values) => createArtist.mutate(values))}>
      {/* Artist Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del artista</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej: Los Bunkers" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Bio */}
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Biografía</FormLabel>
            <FormControl>
              <Textarea {...field} rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Genres */}
      <FormField
        control={form.control}
        name="genres"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Géneros</FormLabel>
            <FormControl>
              <GenreSelector value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Spotify ID (Optional) */}
      <FormField
        control={form.control}
        name="spotifyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spotify ID (opcional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="ej: 4nDoRrQiYLoBzwC5BhVJzF" />
            </FormControl>
            <FormDescription>
              Encuentra el ID en la URL de Spotify del artista
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-2 mt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={createArtist.isPending}>
          {createArtist.isPending ? 'Creando...' : 'Crear artista'}
        </Button>
      </div>
    </form>
  )
}
```

#### Step 4: Pricing

**New Component:** `src/components/create-event/PricingStep.tsx`
```typescript
export function PricingStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const form = useForm<PricingSchema>({
    resolver: zodResolver(pricingSchema),
    defaultValues: data,
  })

  return (
    <form onSubmit={form.handleSubmit((values) => {
      onUpdate({ ...data, ...values })
      onNext()
    })}>
      <h2 className="text-3xl font-bold mb-6">Precios y capacidad</h2>

      {/* Ticket Price */}
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Precio por entrada (CLP)</FormLabel>
            <FormControl>
              <CurrencyInput
                value={field.value}
                onChange={field.onChange}
                currency="CLP"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Total Tickets */}
      <FormField
        control={form.control}
        name="totalTickets"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad total de entradas</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Optional: Create Discount Code */}
      <div className="discount-code-section">
        <h3 className="font-bold mb-2">Código de descuento (opcional)</h3>
        <DiscountCodeCreator
          onCreated={(code) => onUpdate({ ...data, discountCode: code })}
        />
      </div>

      <StepActions>
        <Button type="button" variant="outline" onClick={onBack}>
          ← Atrás
        </Button>
        <Button type="submit">Continuar →</Button>
      </StepActions>
    </form>
  )
}
```

#### Step 5: Images

**New Component:** `src/components/create-event/ImagesStep.tsx`
```typescript
export function ImagesStep({ data, onUpdate, onNext, onBack }: StepProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(data.images || [])

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const { url } = await res.json()
      setImages([...images, url])
    } finally {
      setUploading(false)
    }
  }

  const handleContinue = () => {
    onUpdate({ ...data, images })
    onNext()
  }

  return (
    <div className="step-form">
      <h2 className="text-3xl font-bold mb-6">Imágenes del evento</h2>

      <p className="text-gray-400 mb-6">
        Sube al menos una imagen. La primera imagen será la imagen principal del evento.
      </p>

      {/* Image Upload */}
      <ImageUploader
        images={images}
        onUpload={uploadImage}
        onRemove={(url) => setImages(images.filter(img => img !== url))}
        onReorder={setImages}
        maxImages={5}
        uploading={uploading}
      />

      <StepActions>
        <Button variant="outline" onClick={onBack}>← Atrás</Button>
        <Button onClick={handleContinue} disabled={images.length === 0}>
          Continuar →
        </Button>
      </StepActions>
    </div>
  )
}
```

#### Step 6: Review & Submit

**New Component:** `src/components/create-event/ReviewStep.tsx`
```typescript
export function ReviewStep({ data, onUpdate, onBack }: StepProps) {
  const router = useRouter()

  const createEvent = useMutation({
    mutationFn: async (eventData: CreateEventInput) => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })
      return res.json()
    },
    onSuccess: (event) => {
      toast.success('Evento creado exitosamente')
      router.push(`/events/${event.id}`)
    },
    onError: () => {
      toast.error('Error al crear el evento')
    },
  })

  return (
    <div className="review-step">
      <h2 className="text-3xl font-bold mb-6">Revisa tu evento</h2>

      {/* Preview Card */}
      <EventPreviewCard data={data} />

      {/* Details Summary */}
      <div className="details-summary">
        <SummarySection title="Información básica">
          <SummaryItem label="Título" value={data.title} />
          <SummaryItem label="Descripción" value={data.description} />
          <SummaryItem label="Géneros" value={data.genres?.join(', ')} />
        </SummarySection>

        <SummarySection title="Fecha y ubicación">
          <SummaryItem
            label="Fecha"
            value={format(data.date, "dd 'de' MMMM 'de' yyyy, HH:mm")}
          />
          <SummaryItem label="Puertas" value={format(data.doors, 'HH:mm')} />
          <SummaryItem label="Venue" value={data.venue?.name} />
        </SummarySection>

        <SummarySection title="Precios">
          <SummaryItem label="Precio" value={formatCurrency(data.price)} />
          <SummaryItem label="Capacidad" value={data.totalTickets} />
        </SummarySection>
      </div>

      {/* Terms Acceptance */}
      <div className="terms-acceptance">
        <Checkbox id="terms" required />
        <label htmlFor="terms">
          Acepto los{' '}
          <Link href="/organizer-terms" className="text-primary underline">
            términos y condiciones para organizadores
          </Link>
        </label>
      </div>

      <StepActions>
        <Button variant="outline" onClick={onBack}>← Atrás</Button>
        <Button
          onClick={() => createEvent.mutate(data as CreateEventInput)}
          disabled={createEvent.isPending}
        >
          {createEvent.isPending ? 'Publicando...' : 'Publicar evento'}
        </Button>
      </StepActions>
    </div>
  )
}
```

### 9.3 Validation Schemas

**New File:** `src/lib/validations/create-event.ts`
```typescript
import { z } from 'zod'

export const basicInfoSchema = z.object({
  title: z.string().min(5, 'Título debe tener al menos 5 caracteres'),
  description: z.string().min(50, 'Descripción debe tener al menos 50 caracteres'),
  genres: z.array(z.string()).min(1, 'Selecciona al menos un género'),
})

export const dateLocationSchema = z.object({
  date: z.date().min(new Date(), 'Fecha debe ser futura'),
  doors: z.date(),
  venueId: z.string(),
})

export const pricingSchema = z.object({
  price: z.number().min(0, 'Precio debe ser positivo'),
  totalTickets: z.number().min(1, 'Debe haber al menos 1 entrada'),
})

export const createEventSchema = basicInfoSchema
  .merge(dateLocationSchema)
  .merge(pricingSchema)
  .extend({
    artistId: z.string(),
    images: z.array(z.string()).min(1, 'Sube al menos una imagen'),
  })

export type CreateEventInput = z.infer<typeof createEventSchema>
```

### 9.4 Implementation Checklist

- [ ] Build multi-step form container
- [ ] Create `ProgressSteps` component
- [ ] Build `BasicInfoStep` component
- [ ] Build `DateLocationStep` component
- [ ] Build `ArtistStep` component
- [ ] Create `CreateArtistForm` component
- [ ] Build `PricingStep` component
- [ ] Build `ImagesStep` component with upload
- [ ] Create `ReviewStep` component
- [ ] Implement validation schemas
- [ ] Add form state persistence (localStorage)
- [ ] Create success page after event creation
- [ ] Add draft save functionality
- [ ] Organizer dashboard to manage created events

---

## 10. Technical Architecture Summary

### 10.1 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework with SSR/RSC |
| **Language** | TypeScript | Type safety |
| **Styling** | TailwindCSS + shadcn/ui | UI components |
| **State** | Zustand | Client state management |
| **Forms** | React Hook Form + Zod | Form handling & validation |
| **Database** | PostgreSQL + Prisma | Data persistence |
| **Auth** | NextAuth.js | Authentication |
| **Storage** | Vercel Blob | Image uploads |
| **Maps** | Google Maps API | Location services |
| **Music** | Spotify API, YouTube API | Music integration |
| **Payments** | Fintoc, Stripe | Payment processing |

### 10.2 New Dependencies Required

Add to `package.json`:
```json
{
  "dependencies": {
    "@react-google-maps/api": "^2.19.0",
    "@tanstack/react-query": "^5.0.0",
    "googleapis": "^128.0.0",
    "date-fns": "^3.6.0" // Already installed
  }
}
```

### 10.3 Environment Variables

Add to `.env`:
```bash
# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# YouTube
YOUTUBE_API_KEY=

# Spotify (already in .env.example)
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify
```

### 10.4 Database Migrations

Run after schema updates:
```bash
npx prisma db push
# OR for production:
npx prisma migrate dev --name add_features
```

### 10.5 File Structure Summary

```
src/
├── app/
│   ├── page.tsx                    # ✏️ UPDATE: Hero search
│   ├── events/
│   │   ├── page.tsx               # ✏️ UPDATE: Featured carousel
│   │   └── [id]/page.tsx          # ✏️ UPDATE: Maps, sharing, FAQ
│   ├── artists/
│   │   └── [slug]/page.tsx        # ✏️ UPDATE: Music player, follow
│   ├── create/page.tsx            # ✏️ UPDATE: Multi-step form
│   ├── faq/page.tsx               # ✨ NEW
│   └── api/
│       ├── search/instant/        # ✨ NEW
│       ├── events/featured/       # ✨ NEW
│       ├── artists/
│       │   ├── [id]/
│       │   │   ├── follow/        # ✨ NEW
│       │   │   └── youtube/       # ✨ NEW
│       ├── sync/spotify/          # ✨ NEW
│       ├── discount-codes/        # ✨ NEW
│       └── user/following/        # ✨ NEW
├── components/
│   ├── home/
│   │   ├── HeroSearch.tsx         # ✨ NEW
│   │   ├── FeaturedCarousel.tsx   # ✨ NEW
│   │   └── SearchInput.tsx        # ✨ NEW
│   ├── artists/
│   │   ├── ArtistHero.tsx         # ✨ NEW
│   │   ├── FollowButton.tsx       # ✨ NEW
│   │   ├── MusicPlayerSection.tsx # ✨ NEW
│   │   └── ArtistBio.tsx          # ✨ NEW
│   ├── players/
│   │   ├── SpotifyPlayer.tsx      # ✨ NEW
│   │   └── YouTubePlayer.tsx      # ✨ NEW
│   ├── events/
│   │   ├── EventCardLarge.tsx     # ✨ NEW
│   │   ├── ShareWidget.tsx        # ✨ NEW
│   │   ├── VenueSection.tsx       # ✨ NEW
│   │   └── FAQSection.tsx         # ✨ NEW
│   ├── maps/
│   │   └── VenueMap.tsx           # ✨ NEW
│   ├── search/
│   │   └── FilterPanel.tsx        # ✨ NEW
│   ├── faq/
│   │   ├── FAQCategory.tsx        # ✨ NEW
│   │   └── FAQSearch.tsx          # ✨ NEW
│   ├── checkout/
│   │   └── DiscountCodeInput.tsx  # ✨ NEW
│   └── create-event/
│       ├── BasicInfoStep.tsx      # ✨ NEW
│       ├── DateLocationStep.tsx   # ✨ NEW
│       ├── ArtistStep.tsx         # ✨ NEW
│       ├── PricingStep.tsx        # ✨ NEW
│       ├── ImagesStep.tsx         # ✨ NEW
│       └── ReviewStep.tsx         # ✨ NEW
├── lib/
│   ├── spotify.ts                 # ✨ NEW
│   ├── geolocation.ts             # ✨ NEW
│   └── recommendations.ts         # ✨ NEW
├── hooks/
│   ├── useFeaturedEvents.ts       # ✨ NEW
│   └── useFollowArtist.ts         # ✨ NEW
└── store/
    └── filters.ts                 # ✏️ UPDATE
```

### 10.6 Implementation Priority

Recommended order:

**Phase 1 - Core Discovery (Weeks 1-2)**
1. Home screen redesign (Hero Search)
2. Featured Events carousel
3. Advanced search enhancements

**Phase 2 - Social & Music (Weeks 3-4)**
4. Spotify OAuth integration
5. Artist profiles & follow system
6. Music playback (Spotify/YouTube embeds)

**Phase 3 - Conversion (Weeks 5-6)**
7. Google Maps integration
8. Share functionality (WhatsApp, social)
9. Discount code system

**Phase 4 - Support & Creation (Weeks 7-8)**
10. FAQ system
11. Multi-step event creation flow

### 10.7 Key Performance Metrics

Track these metrics post-implementation:

| Metric | Target | Tool |
|--------|--------|------|
| Search usage | >70% of sessions | Mixpanel |
| Spotify connection rate | >30% of signups | Analytics |
| Follow conversion | >50% of artist views | Analytics |
| Share rate | >15% of event views | Analytics |
| Discount code usage | >20% of checkouts | Database |
| FAQ self-service rate | >60% of support queries | Support metrics |
| Event creation completion | >80% of starts | Funnel analysis |

---

## End of Specification

This document provides a complete technical specification for implementing all 9 feature sections of the KET app. Each section includes:

- UI/UX architecture
- Component specifications
- Data models
- API endpoints
- Implementation checklists
- Code examples

**Next Steps:**
1. Review and approve this specification
2. Set up required external services (Google Maps, YouTube, Spotify apps)
3. Begin implementation following the priority order
4. Conduct user testing after each phase
5. Iterate based on metrics and feedback

**Questions or clarifications:** Contact the engineering team.
