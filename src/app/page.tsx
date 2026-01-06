import Link from 'next/link'
import { HeroSearch } from '@/components/home/HeroSearch'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Hero Search Section */}
      <HeroSearch />

      {/* Featured Events Carousel */}
      <FeaturedCarousel
        title="En tendencia esta semana"
        variant="trending"
      />

      {/* Recommended Events (shown if user is logged in with Spotify) */}
      <FeaturedCarousel
        title="Recomendados para ti"
        variant="recommended"
      />

      {/* Feature Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-colors bg-black">
            <div className="text-5xl mb-4">🎵</div>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              Personalizado
            </h3>
            <p className="text-gray-400 font-medium">
              Conecta Spotify y descubre eventos de tus artistas favoritos
            </p>
          </div>
          <div className="p-8 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-colors bg-black">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              Transparente
            </h3>
            <p className="text-gray-400 font-medium">
              Paga directo desde tu banco con Fintoc. Todo en KET.
            </p>
          </div>
          <div className="p-8 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-colors bg-black">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
              Seguro
            </h3>
            <p className="text-gray-400 font-medium">
              Códigos QR dinámicos y sistema de lista de espera anti-reventa
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center text-gray-500 text-sm uppercase tracking-widest">
          <p>Plataforma de Tickets Para Fans</p>
        </div>
      </div>
    </main>
  )
}
