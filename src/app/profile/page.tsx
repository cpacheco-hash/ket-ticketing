'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppLayout, Header } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserCircleIcon } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/auth/login')
    return null
  }

  return (
    <AppLayout>
      <Header title="Mi Perfil" />

      <div className="p-6 max-w-3xl mx-auto">
        <Card className="border-border bg-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
              <UserCircleIcon className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {session.user.firstName} {session.user.lastName}
              </h2>
              <p className="text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={session.user.firstName}
                disabled
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={session.user.lastName}
                disabled
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={session.user.email}
                disabled
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground"
              />
            </div>

            <div className="pt-4">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-6 mt-6">
          <h3 className="font-semibold text-foreground mb-4">Integraciones</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full border-border">
              Conectar Spotify
            </Button>
            <Button variant="outline" className="w-full border-border">
              Conectar Apple Music
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
