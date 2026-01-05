import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Logo / Title */}
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter uppercase mb-8">
            KET
          </h1>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-6 leading-tight">
            Tu Próximo
            <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: '2px white',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Evento
            </span>
            {' '}Te Espera
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl font-medium">
            Olvídate de los PDFs y fotos con KET, todo lo relacionado con tu evento en un solo lugar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/events">
              <button className="px-12 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest">
                Explorar Eventos
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-12 py-4 bg-transparent text-white border-2 border-white text-lg font-bold rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                Iniciar Sesión
              </button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
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
          <div className="mt-20 text-gray-500 text-sm uppercase tracking-widest">
            <p>Plataforma de Tickets Para Fans</p>
          </div>
        </div>
      </div>
    </main>
  )
}
