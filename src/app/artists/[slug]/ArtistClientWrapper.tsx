'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FollowButton } from '@/components/artists/FollowButton'
import { useFollowArtist } from '@/hooks/useFollowArtist'

export function ArtistClientWrapper({
  artistId,
  children,
}: {
  artistId: string
  children: React.ReactNode
}) {
  const { isFollowing, isLoading, toggleFollow } = useFollowArtist(artistId)

  useEffect(() => {
    const container = document.getElementById('follow-button-container')
    if (!container) return

    const button = (
      <FollowButton
        artistId={artistId}
        isFollowing={isFollowing}
        onToggle={toggleFollow}
        disabled={isLoading}
      />
    )

    const portal = createPortal(button, container)
    return () => {
      // Cleanup handled by React
    }
  }, [artistId, isFollowing, isLoading, toggleFollow])

  return <>{children}</>
}
