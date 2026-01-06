'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Plus, Loader2, X } from 'lucide-react'

interface FollowButtonProps {
  artistId: string
  isFollowing: boolean
  onToggle: () => Promise<void>
  disabled?: boolean
}

export function FollowButton({ artistId, isFollowing, onToggle, disabled }: FollowButtonProps) {
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    try {
      await onToggle()
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
      className={`
        min-w-[140px]
        ${isFollowing
          ? 'border-white/30 hover:border-red-500 hover:text-red-500 group'
          : 'bg-white text-black hover:bg-gray-200'
        }
      `}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isFollowing ? (
        <>
          <Check className="h-5 w-5 mr-2 group-hover:hidden" />
          <span className="group-hover:hidden">Siguiendo</span>
          <X className="h-5 w-5 mr-2 hidden group-hover:block" />
          <span className="hidden group-hover:block">Dejar de seguir</span>
        </>
      ) : (
        <>
          <Plus className="h-5 w-5 mr-2" />
          Seguir
        </>
      )}
    </Button>
  )
}
