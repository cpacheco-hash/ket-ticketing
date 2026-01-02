import { create } from 'zustand'

interface FiltersStore {
  query: string
  genres: string[]
  dateFrom: string | null
  dateTo: string | null
  priceMin: number | null
  priceMax: number | null
  venueId: string | null
  artistId: string | null

  setQuery: (query: string) => void
  setGenres: (genres: string[]) => void
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
  dateFrom: null,
  dateTo: null,
  priceMin: null,
  priceMax: null,
  venueId: null,
  artistId: null,

  setQuery: (query) => set({ query }),
  setGenres: (genres) => set({ genres }),
  setDateFrom: (date) => set({ dateFrom: date }),
  setDateTo: (date) => set({ dateTo: date }),
  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  setVenueId: (id) => set({ venueId: id }),
  setArtistId: (id) => set({ artistId: id }),

  clearFilters: () =>
    set({
      query: '',
      genres: [],
      dateFrom: null,
      dateTo: null,
      priceMin: null,
      priceMax: null,
      venueId: null,
      artistId: null
    })
}))
