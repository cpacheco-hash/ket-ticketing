'use client'

interface SpotifyPlayerProps {
  spotifyId?: string | null
  artistName: string
  type?: 'artist' | 'track'
}

export function SpotifyPlayer({ spotifyId, artistName, type = 'artist' }: SpotifyPlayerProps) {
  if (!spotifyId) {
    return <SpotifyFallback artistName={artistName} />
  }

  // Spotify Embed Player (No auth required)
  const embedUrl =
    type === 'artist'
      ? `https://open.spotify.com/embed/artist/${spotifyId}?utm_source=generator&theme=0`
      : `https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`

  return (
    <div className="spotify-player">
      <iframe
        src={embedUrl}
        width="100%"
        height="380"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={`${artistName} on Spotify`}
        className="rounded-xl"
      />
    </div>
  )
}

function SpotifyFallback({ artistName }: { artistName: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
      <svg
        className="w-16 h-16 mb-4 mx-auto text-green-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      <p className="text-gray-400 mb-4">Escucha a {artistName} en Spotify</p>
      <a
        href={`https://open.spotify.com/search/${encodeURIComponent(artistName)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors"
      >
        Abrir Spotify
      </a>
    </div>
  )
}
