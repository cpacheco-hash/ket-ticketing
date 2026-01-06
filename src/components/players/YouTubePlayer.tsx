'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface YouTubePlayerProps {
  artistName: string
}

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
}

export function YouTubePlayer({ artistName }: YouTubePlayerProps) {
  const [video, setVideo] = useState<YouTubeVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchVideo() {
      try {
        // For now, we'll use a simple search URL instead of API
        // In production, you'd want to use YouTube Data API
        setIsLoading(false)

        // Fallback to YouTube search
        setError(true)
      } catch (err) {
        console.error('Error fetching YouTube video:', err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideo()
  }, [artistName])

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex items-center justify-center h-[380px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !video) {
    return <YouTubeFallback artistName={artistName} />
  }

  return (
    <div className="youtube-player">
      <iframe
        width="100%"
        height="380"
        src={`https://www.youtube.com/embed/${video.id}?autoplay=0`}
        title={video.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-xl"
      />
      <p className="text-sm text-gray-400 mt-2 truncate">{video.title}</p>
    </div>
  )
}

function YouTubeFallback({ artistName }: { artistName: string }) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    artistName + ' official'
  )}`

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
      <svg
        className="w-16 h-16 mb-4 mx-auto text-red-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
      <p className="text-gray-400 mb-4">Ver videos de {artistName} en YouTube</p>
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors"
      >
        Abrir YouTube
      </a>
    </div>
  )
}
