import { create } from 'zustand'

type QuickFilter = 'today' | 'this_week' | 'free' | 'nearby' | null

interface FiltersStore {
  query: string
  genres: string[]
  category: string | null
  quickFilter: QuickFilter
  isFree: boolean | null
  dateFrom: string | null
  dateTo: string | null
  priceMin: number | null
  priceMax: number | null
  venueId: string | null
  artistId: string | null

  setQuery: (query: string) => void
  setGenres: (genres: string[]) => void
  setCategory: (category: string | null) => void
  setQuickFilter: (filter: QuickFilter) => void
  setIsFree: (isFree: boolean | null) => void
  setDateFrom: (date: string | null) => void
  setDateTo: (date: string | null) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setVenueId: (id: string | null) => void
  setArtistId: (id: string | null) => void
  clearFilters: () => void
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  query: '',
  genres: [],
  category: null,
  quickFilter: null,
  isFree: null,
  dateFrom: null,
  dateTo: null,
  priceMin: null,
  priceMax: null,
  venueId: null,
  artistId: null,

  setQuery: (query) => set({ query }),
  setGenres: (genres) => set({ genres }),
  setCategory: (category) => set({ category, quickFilter: null }),
  setQuickFilter: (quickFilter) => set({ quickFilter, category: null }),
  setIsFree: (isFree) => set({ isFree }),
  setDateFrom: (date) => set({ dateFrom: date }),
  setDateTo: (date) => set({ dateTo: date }),
  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  setVenueId: (id) => set({ venueId: id }),
  setArtistId: (id) => set({ artistId: id }),

  clearFilters: () =>
    set({
      query: '',
      genres: [],
      category: null,
      quickFilter: null,
      isFree: null,
      dateFrom: null,
      dateTo: null,
      priceMin: null,
      priceMax: null,
      venueId: null,
      artistId: null
    })
}))
