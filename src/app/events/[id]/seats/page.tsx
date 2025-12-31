'use client'

import { AppLayout, Header } from '@/components/layout'
import { SeatSelector } from '@/components/seating/SeatSelector'
import { useRouter } from 'next/navigation'

export default function EventSeatsPage() {
  const router = useRouter()

  const handleCheckout = (selectedSeats: any[]) => {
    console.log('Selected seats:', selectedSeats)
    // TODO: Navigate to checkout
    router.push('/checkout')
  }

  return (
    <AppLayout>
      <Header title="Selección de Asientos" />

      <div className="p-6">
        <SeatSelector
          rows={10}
          seatsPerRow={12}
          eventTitle="Festival Sónar 2024"
          eventDate="Sábado 15 Jun 2024, 20:00"
          onCheckout={handleCheckout}
        />
      </div>
    </AppLayout>
  )
}
