'use client'

import { AppLayout, Header } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCardIcon, BanknotesIcon, PlusIcon, TrashIcon } from 'lucide-react'

// Mock data - TODO: Replace with real API data
const mockPaymentMethods = [
  {
    id: '1',
    type: 'fintoc',
    name: 'Fintoc',
    description: 'Pago directo desde tu banco',
    icon: BanknotesIcon,
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    name: 'Tarjeta terminada en 4242',
    description: 'Expira 12/25',
    icon: CreditCardIcon,
    isDefault: false
  }
]

function BanknotesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function PaymentPage() {
  return (
    <AppLayout>
      <Header
        title="Medios de Pago"
        action={{
          label: 'Añadir Nuevo Método de Pago',
          onClick: () => console.log('Add payment method')
        }}
      />

      <div className="p-6 max-w-3xl">
        {/* Payment Methods List */}
        <div className="space-y-4 mb-6">
          {mockPaymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <Card
                key={method.id}
                className="border-border bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{method.name}</h3>
                        {method.isDefault && (
                          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                            Predeterminado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-secondary"
                      >
                        Establecer predeterminado
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Add New Payment Method Card */}
        <Card className="border-2 border-dashed border-border bg-card/50 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <PlusIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Agregar método de pago
            </h3>
            <p className="mb-6 text-sm text-muted-foreground max-w-md">
              Conecta tu cuenta bancaria con Fintoc o agrega una tarjeta de crédito/débito
            </p>
            <div className="flex gap-3">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Conectar con Fintoc
              </Button>
              <Button variant="outline" className="border-border hover:bg-secondary">
                Agregar Tarjeta
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Section */}
        <div className="mt-6 rounded-lg border border-border bg-card/30 p-4">
          <h4 className="mb-2 font-semibold text-foreground">Pagos seguros</h4>
          <p className="text-sm text-muted-foreground">
            Todos los pagos están encriptados y protegidos. Usamos Fintoc para pagos directos
            desde tu banco (A2A) con comisiones transparentes y sin sorpresas.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
