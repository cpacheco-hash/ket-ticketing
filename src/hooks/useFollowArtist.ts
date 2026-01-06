'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function useFollowArtist(artistId: string) {
  const { data: session } = useSession()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if following on mount
  useEffect(() => {
    async function checkFollowStatus() {
      if (!session?.user?.id) {
        setIsFollowing(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/artists/${artistId}/follow`)
        const data = await response.json()
        setIsFollowing(data.isFollowing)
      } catch (error) {
        console.error('Error checking follow status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkFollowStatus()
  }, [artistId, session?.user?.id])

  const toggleFollow = async () => {
    if (!session?.user?.id) {
      // Redirect to login
      window.location.href = '/auth/login?callbackUrl=' + window.location.pathname
      return
    }

    const method = isFollowing ? 'DELETE' : 'POST'

    try {
      const response = await fetch(`/api/artists/${artistId}/follow`, {
        method,
      })

      if (response.ok) {
        setIsFollowing(!isFollowing)
      } else {
        throw new Error('Failed to toggle follow')
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      throw error
    }
  }

  return {
    isFollowing,
    isLoading,
    toggleFollow,
  }
}
