/**
 * Spotify API utility class for KET
 * Handles interactions with Spotify Web API
 */

interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  images: { url: string }[]
  popularity: number
}

interface SpotifyTrack {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: { images: { url: string }[] }
}

export class SpotifyAPI {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  /**
   * Get user's top artists
   */
  async getTopArtists(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20
  ): Promise<SpotifyArtist[]> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.items
    } catch (error) {
      console.error('Error fetching top artists:', error)
      return []
    }
  }

  /**
   * Get artists the user follows
   */
  async getFollowedArtists(): Promise<SpotifyArtist[]> {
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.artists.items
    } catch (error) {
      console.error('Error fetching followed artists:', error)
      return []
    }
  }

  /**
   * Get recently played tracks
   */
  async getRecentlyPlayed(limit: number = 50): Promise<SpotifyTrack[]> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.items.map((item: any) => item.track)
    } catch (error) {
      console.error('Error fetching recently played:', error)
      return []
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<any> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`)
      }

      const data = await response.json()
      return data.access_token
    } catch (error) {
      console.error('Error refreshing access token:', error)
      return null
    }
  }
}

/**
 * Match Spotify artists to KET artists database
 * Returns list of matched artists
 */
export async function matchSpotifyArtistsToKET(
  spotifyArtists: SpotifyArtist[]
): Promise<any[]> {
  try {
    const response = await fetch('/api/artists/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spotifyArtists }),
    })

    if (!response.ok) {
      throw new Error('Failed to match artists')
    }

    return await response.json()
  } catch (error) {
    console.error('Error matching artists:', error)
    return []
  }
}

/**
 * Extract unique genres from artists
 */
export function extractGenres(artists: SpotifyArtist[]): string[] {
  const genreSet = new Set<string>()

  artists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      genreSet.add(genre)
    })
  })

  return Array.from(genreSet)
}

/**
 * Get top genres sorted by frequency
 */
export function getTopGenres(artists: SpotifyArtist[], limit: number = 10): string[] {
  const genreCounts: Record<string, number> = {}

  artists.forEach((artist) => {
    artist.genres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1
    })
  })

  return Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([genre]) => genre)
}
