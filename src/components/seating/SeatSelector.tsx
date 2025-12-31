'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SeatStatus = 'available' | 'selected' | 'occupied'

interface Seat {
  id: string
  row: number
  number: number
  status: SeatStatus
  price: number
}

interface SeatSelectorProps {
  rows: number
  seatsPerRow: number
  eventTitle: string
  eventDate: string
  onCheckout: (selectedSeats: Seat[]) => void
}

export function SeatSelector({
  rows = 10,
  seatsPerRow = 12,
  eventTitle,
  eventDate,
  onCheckout
}: SeatSelectorProps) {
  // Generate seats grid
  const [seats, setSeats] = useState<Seat[]>(() => {
    const initialSeats: Seat[] = []
    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        // Randomly mark some seats as occupied for demo
        const isOccupied = Math.random() > 0.7
        initialSeats.push({
          id: `${row}-${seat}`,
          row,
          number: seat,
          status: isOccupied ? 'occupied' : 'available',
          price: 25000 + (row * 1000) // Price varies by row
        })
      }
    }
    return initialSeats
  })

  const selectedSeats = seats.filter(s => s.status === 'selected')
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  const toggleSeat = (seatId: string) => {
    setSeats(prev => prev.map(seat => {
      if (seat.id === seatId && seat.status !== 'occupied') {
        return {
          ...seat,
          status: seat.status === 'available' ? 'selected' : 'available'
        }
      }
      return seat
    }))
  }

  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case 'available':
        return 'bg-secondary hover:bg-secondary/70 border-border'
      case 'selected':
        return 'bg-primary border-primary'
      case 'occupied':
        return 'bg-muted/30 border-muted cursor-not-allowed'
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr,350px] gap-6">
      {/* Seating Map */}
      <Card className="border-border bg-card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Selecciona tus Asientos</h2>
          <p className="text-sm text-muted-foreground">Haz clic en los asientos para seleccionarlos</p>
        </div>

        {/* Stage */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-t-full bg-primary/20 px-12 py-3 text-center">
            <span className="text-sm font-semibold text-primary">ESCENARIO</span>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="space-y-2">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  {/* Row Label */}
                  <div className="w-8 text-center text-sm font-medium text-muted-foreground">
                    {String.fromCharCode(65 + rowIndex)}
                  </div>

                  {/* Seats */}
                  <div className="flex gap-1">
                    {seats
                      .filter(seat => seat.row === rowIndex + 1)
                      .map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat.id)}
                          disabled={seat.status === 'occupied'}
                          className={cn(
                            'h-8 w-8 rounded border-2 transition-colors',
                            getSeatColor(seat.status)
                          )}
                          title={`Fila ${String.fromCharCode(65 + rowIndex)} - Asiento ${seat.number}`}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 bg-secondary border-border" />
            <span className="text-sm text-foreground">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 bg-primary border-primary" />
            <span className="text-sm text-foreground">Seleccionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded border-2 bg-muted/30 border-muted" />
            <span className="text-sm text-foreground">Ocupado</span>
          </div>
        </div>
      </Card>

      {/* Summary Panel */}
      <div className="space-y-4">
        <Card className="border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Resumen de Compra</h3>

          <div className="space-y-3 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Evento</p>
              <p className="font-semibold text-foreground">{eventTitle}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-semibold text-foreground">{eventDate}</p>
            </div>
          </div>

          {/* Selected Seats */}
          {selectedSeats.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Asientos Seleccionados</p>
                <div className="space-y-1">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        Fila {String.fromCharCode(64 + seat.row)} - Asiento {seat.number}
                      </span>
                      <span className="text-foreground font-medium">
                        ${seat.price.toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalPrice.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => onCheckout(selectedSeats)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              >
                Continuar al Pago
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Selecciona al menos un asiento para continuar
              </p>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="border-border bg-card/30 p-4">
          <p className="text-xs text-muted-foreground">
            Los asientos se reservarán por 15 minutos una vez que continúes al pago.
          </p>
        </Card>
      </div>
    </div>
  )
}
