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
            Your Next
            <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: '2px white',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Moment
            </span>
            {' '}Awaits
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl font-medium">
            Discover concerts and events based on your favorite music.
            No hidden fees, no resale, just good music.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/events">
              <button className="px-12 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest">
                Explore Events
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-12 py-4 bg-transparent text-white border-2 border-white text-lg font-bold rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                Sign In
              </button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
            <div className="p-8 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-colors bg-black">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
                Personalized
              </h3>
              <p className="text-gray-400 font-medium">
                Connect Spotify and discover events from your favorite artists
              </p>
            </div>
            <div className="p-8 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-colors bg-black">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
                Transparent
              </h3>
              <p className="text-gray-400 font-medium">
                No hidden fees. Pay directly from your bank with Fintoc
              </p>
            </div>
            <div className="p-8 rounded-2xl border-2 border-white/20 hover:border-white/40 transition-colors bg-black">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
                Secure
              </h3>
              <p className="text-gray-400 font-medium">
                Dynamic QR codes and waitlist system to prevent scalping
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-20 text-gray-500 text-sm uppercase tracking-widest">
            <p>Fan-First Ticketing Platform</p>
          </div>
        </div>
      </div>
    </main>
  )
}
