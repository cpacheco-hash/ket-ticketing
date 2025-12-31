import { AppLayout, Header } from '@/components/layout'
import { TicketCard } from '@/components/tickets/TicketCard'

// Mock data - TODO: Replace with real API data
const mockTickets = [
  {
    id: '1',
    eventTitle: 'Festival Sónar 2024',
    eventDate: 'Sábado 15 Jun 2024, 20:00',
    venue: 'Parque Bicentenario',
    qrCode: ''
  },
  {
    id: '2',
    eventTitle: 'Festival Sónar 2024',
    eventDate: 'Sábado 15 Jun 2024, 20:00',
    venue: 'Parque Bicentenario',
    qrCode: ''
  },
  {
    id: '3',
    eventTitle: 'Festival Sónar 2024',
    eventDate: 'Sábado 15 Jun 2024, 20:00',
    venue: 'Parque Bicentenario',
    qrCode: ''
  },
  {
    id: '4',
    eventTitle: 'Festival Sónar 2024',
    eventDate: 'Sábado 15 Jun 2024, 20:00',
    venue: 'Parque Bicentenario',
    qrCode: ''
  },
  {
    id: '5',
    eventTitle: 'Festival Sónar 2024',
    eventDate: 'Sábado 15 Jun 2024, 20:00',
    venue: 'Parque Bicentenario',
    qrCode: ''
  },
  {
    id: '6',
    eventTitle: 'Festival Sónar 2024',
    eventDate: 'Sábado 15 Jun 2024, 20:00',
    venue: 'Parque Bicentenario',
    qrCode: ''
  }
]

export default function TicketsPage() {
  return (
    <AppLayout>
      <Header
        title="Mis Entradas"
        action={{
          label: 'Comprar Entradas',
          onClick: () => console.log('Buy tickets')
        }}
      />

      <div className="p-6">
        {/* Tickets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTickets.map((ticket) => (
            <TicketCard key={ticket.id} {...ticket} />
          ))}
        </div>

        {/* Empty State */}
        {mockTickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              No tienes entradas aún
            </p>
            <button className="text-primary hover:underline">
              Explora eventos disponibles
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
