import { AppLayout, Header } from '@/components/layout'
import { EventCard } from '@/components/events/EventCard'

// Mock data - TODO: Replace with real API data
const mockEvents = [
  {
    id: '1',
    title: 'Festival Sónar 2024',
    artist: 'Múltiples artistas',
    venue: 'Parque Bicentenario',
    date: 'Sábado 15 Jun 2024',
    image: '',
    price: 45000
  },
  {
    id: '2',
    title: 'Primavera Sound 2025',
    artist: 'Lineup por confirmar',
    venue: 'Parque Cerrillos',
    date: 'Viernes 7 Nov 2025',
    image: '',
    price: 85000
  },
  {
    id: '3',
    title: 'Concierto Íntimo',
    artist: 'Artista local',
    venue: 'Club Chocolate',
    date: 'Jueves 20 Ene 2025',
    image: '',
    price: 12000
  }
]

export default function EventsPage() {
  return (
    <AppLayout>
      <Header
        title="Próximos Eventos"
        action={{
          label: 'Crear Nuevo Concierto',
          onClick: () => console.log('Create event')
        }}
      />

      <div className="p-6">
        {/* Stats Section */}
        <div className="mb-6 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Ventas Totales</h2>
          <p className="text-3xl font-bold text-primary">$1.3299,04</p>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {/* Empty State */}
        {mockEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              No hay eventos disponibles
            </p>
            <button className="text-primary hover:underline">
              Conecta tu Spotify para ver recomendaciones personalizadas
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
