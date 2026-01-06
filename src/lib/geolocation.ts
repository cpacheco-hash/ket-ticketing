/**
 * Geolocation utilities for KET
 * Handles user location detection and distance calculations
 */

export interface Location {
  lat: number
  lng: number
  city?: string
  country?: string
}

const LOCATION_STORAGE_KEY = 'ket_user_location'
const LOCATION_TTL = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Get user's current location using browser geolocation API
 * Falls back to IP-based geolocation if permission denied
 */
export async function getUserLocation(): Promise<Location | null> {
  // Check cache first
  const cached = getCachedLocation()
  if (cached) return cached

  try {
    // Try browser geolocation first (most accurate)
    const browserLocation = await getBrowserLocation()
    if (browserLocation) {
      cacheLocation(browserLocation)
      return browserLocation
    }
  } catch (error) {
    console.log('Browser geolocation not available, trying IP-based fallback')
  }

  // Fallback to IP-based geolocation
  try {
    const ipLocation = await getIPBasedLocation()
    if (ipLocation) {
      cacheLocation(ipLocation)
      return ipLocation
    }
  } catch (error) {
    console.error('IP-based geolocation failed:', error)
  }

  // Default to Santiago, Chile if all else fails
  return {
    lat: -33.4489,
    lng: -70.6693,
    city: 'Santiago',
    country: 'Chile',
  }
}

/**
 * Get location from browser geolocation API
 */
function getBrowserLocation(): Promise<Location | null> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        // Try to get city name from reverse geocoding
        try {
          const cityInfo = await reverseGeocode(location.lat, location.lng)
          location.city = cityInfo.city
          location.country = cityInfo.country
        } catch (error) {
          console.log('Reverse geocoding failed')
        }

        resolve(location)
      },
      (error) => {
        reject(error)
      },
      {
        timeout: 5000,
        maximumAge: 300000, // 5 minutes
      }
    )
  })
}

/**
 * Get location from IP address using ipapi.co
 */
async function getIPBasedLocation(): Promise<Location | null> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    if (!response.ok) throw new Error('IP geolocation failed')

    const data = await response.json()

    return {
      lat: data.latitude,
      lng: data.longitude,
      city: data.city,
      country: data.country_name,
    }
  } catch (error) {
    console.error('IP-based location failed:', error)
    return null
  }
}

/**
 * Reverse geocode coordinates to get city name
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */
async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ city?: string; country?: string }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'KET-App',
        },
      }
    )

    if (!response.ok) throw new Error('Reverse geocoding failed')

    const data = await response.json()

    return {
      city: data.address?.city || data.address?.town || data.address?.village,
      country: data.address?.country,
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    return {}
  }
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const R = 6371 // Earth's radius in kilometers

  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) *
      Math.cos(toRad(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  } else if (km < 10) {
    return `${km.toFixed(1)}km`
  } else {
    return `${Math.round(km)}km`
  }
}

/**
 * Cache location in localStorage
 */
function cacheLocation(location: Location): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify({
        location,
        timestamp: Date.now(),
      })
    )
  } catch (error) {
    console.error('Failed to cache location:', error)
  }
}

/**
 * Get cached location from localStorage
 */
function getCachedLocation(): Location | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(LOCATION_STORAGE_KEY)
    if (!cached) return null

    const { location, timestamp } = JSON.parse(cached)

    // Check if cache is still valid
    if (Date.now() - timestamp > LOCATION_TTL) {
      localStorage.removeItem(LOCATION_STORAGE_KEY)
      return null
    }

    return location
  } catch (error) {
    console.error('Failed to get cached location:', error)
    return null
  }
}

/**
 * Clear cached location
 */
export function clearCachedLocation(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(LOCATION_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear cached location:', error)
  }
}

/**
 * Get nearby events within a radius
 * This would typically call an API endpoint
 */
export async function getNearbyEvents(
  location: Location,
  radiusKm: number = 50
): Promise<any[]> {
  try {
    const response = await fetch(
      `/api/events/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radiusKm}`
    )

    if (!response.ok) throw new Error('Failed to fetch nearby events')

    return await response.json()
  } catch (error) {
    console.error('Failed to get nearby events:', error)
    return []
  }
}
