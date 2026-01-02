'use client'

import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2Icon } from 'lucide-react'

export default function ConfirmationPage() {
  const router = useRouter()

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="max-w-2xl w-full border-border bg-card p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2Icon className="h-24 w-24 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            ¡Compra Exitosa!
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            Tu compra ha sido procesada exitosamente. Recibirás un email de confirmación
            con tus tickets en los próximos minutos.
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => router.push('/tickets')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
            >
              Ver Mis Tickets
            </Button>

            <Button
              onClick={() => router.push('/events')}
              variant="outline"
              className="w-full border-border hover:bg-secondary"
            >
              Explorar Más Eventos
            </Button>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Tus QR codes se activarán el día del evento.
              Podrás verlos en la sección &quot;Mis Entradas&quot;.
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
