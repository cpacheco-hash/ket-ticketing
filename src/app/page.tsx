export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            KET
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            Tu próximo evento te espera
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-xl">
            Descubre conciertos y eventos basados en tu música favorita.
            Sin sorpresas en el precio, sin reventa, solo buena música.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors">
              Explorar Eventos
            </button>
            <button className="px-8 py-4 bg-purple-500/20 text-white font-semibold rounded-full border-2 border-white hover:bg-purple-500/30 transition-colors">
              Conectar Spotify
            </button>
          </div>

          <div className="mt-16 text-white/60 text-sm">
            <p>MVP en desarrollo - Fase 0</p>
            <p className="mt-2">🎵 Descubrimiento Personalizado • 💳 Pagos Transparentes • 🔒 Anti-Fraude</p>
          </div>
        </div>
      </div>
    </main>
  )
}
