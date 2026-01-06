import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { FollowButton } from '@/components/artists/FollowButton'
import { MusicPlayerSection } from '@/components/artists/MusicPlayerSection'
import { EventCardLarge } from '@/components/home/EventCardLarge'
import { ShareWidget } from '@/components/events/ShareWidget'
import { Users, Calendar, Music } from 'lucide-react'
import { ArtistClientWrapper } from './ArtistClientWrapper'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
  })

  if (!artist) {
    return {
      title: 'Artista no encontrado | KET',
    }
  }

  return {
    title: `${artist.name} | KET`,
    description: artist.bio || `Encuentra eventos de ${artist.name} en KET`,
  }
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    include: {
      events: {
        where: {
          date: { gte: new Date() },
          status: 'ON_SALE',
        },
        include: {
          venue: true,
          artist: true,
        },
        orderBy: { date: 'asc' },
        take: 6,
      },
      _count: {
        select: {
          followers: true,
          events: true,
        },
      },
    },
  })

  if (!artist) {
    notFound()
  }

  return (
    <ArtistClientWrapper artistId={artist.id}>
      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-end">
          {/* Background Image with Blur */}
          {artist.image && (
            <div className="absolute inset-0">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover blur-xl opacity-20"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              {/* Artist Image */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <Music className="w-24 h-24 text-white/30" />
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="flex-1">
                <h1 className="text-5xl md:text-7xl font-black mb-4">{artist.name}</h1>

                {/* Genre Tags */}
                {artist.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {artist.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="font-bold text-white">
                      {artist._count.followers.toLocaleString()}
                    </span>
                    <span>seguidores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-bold text-white">
                      {artist._count.events}
                    </span>
                    <span>eventos próximos</span>
                  </div>
                </div>

                {/* Follow Button - Client Component */}
                <div id="follow-button-container" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              {artist.bio && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Sobre {artist.name}</h2>
                  <p className="text-gray-300 text-lg whitespace-pre-line">{artist.bio}</p>
                </section>
              )}

              {/* Music Player */}
              <MusicPlayerSection artist={artist} />

              {/* Upcoming Events */}
              {artist.events.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Próximos eventos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {artist.events.map((event) => (
                      <EventCardLarge key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              )}

              {artist.events.length === 0 && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No hay eventos próximos de {artist.name}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share */}
              <ShareWidget
                event={{
                  id: artist.id,
                  title: artist.name,
                  date: new Date(),
                  price: 0,
                  venue: { name: 'Artista', city: '' },
                  artist: { name: artist.name },
                }}
              />

              {/* External Links */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Enlaces</h3>
                <div className="space-y-3">
                  {artist.spotifyId && (
                    <a
                      href={`https://open.spotify.com/artist/${artist.spotifyId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      <span className="font-medium">Abrir en Spotify</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ArtistClientWrapper>
  )
}
