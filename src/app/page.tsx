import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-6">
            KET
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl">
            Tu próximo evento te espera
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-xl">
            Descubre conciertos y eventos basados en tu música favorita.
            Sin sorpresas en el precio, sin reventa, solo buena música.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/events">
              <Button className="px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-base font-semibold">
                Explorar Eventos
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="px-8 py-4 border-primary text-primary hover:bg-primary/10 rounded-full text-base font-semibold">
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-semibold text-foreground mb-2">Descubrimiento Personalizado</h3>
              <p className="text-sm text-muted-foreground">
                Conecta Spotify y descubre eventos de tus artistas favoritos
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-3xl mb-3">💳</div>
              <h3 className="font-semibold text-foreground mb-2">Pagos Transparentes</h3>
              <p className="text-sm text-muted-foreground">
                Sin cargos ocultos. Paga directo desde tu banco con Fintoc
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-foreground mb-2">Anti-Fraude</h3>
              <p className="text-sm text-muted-foreground">
                QR dinámico y sistema de waitlist para evitar reventas
              </p>
            </div>
          </div>

          <div className="mt-12 text-muted-foreground text-sm">
            <p>MVP en desarrollo - Wireframes implementados</p>
          </div>
        </div>
      </div>
    </main>
  )
}
