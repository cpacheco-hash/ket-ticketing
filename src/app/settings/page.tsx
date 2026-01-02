'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppLayout, Header } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const handleChangePassword = () => {
    // TODO: Implement change password modal
    alert('Funcionalidad de cambio de contraseña próximamente')
  }

  const handleVerifyEmail = () => {
    // TODO: Implement email verification
    alert('Funcionalidad de verificación de email próximamente')
  }

  const handleDownloadData = () => {
    // TODO: Implement data download
    alert('Funcionalidad de descarga de datos próximamente')
  }

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // TODO: Implement account deletion
      alert('Funcionalidad de eliminación de cuenta próximamente')
    }
  }

  return (
    <AppLayout>
      <Header title="Configuración" />

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Account Settings */}
        <Card className="border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Cuenta</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleChangePassword}
              className="w-full border-border justify-start"
            >
              Cambiar contraseña
            </Button>
            <Button
              variant="outline"
              onClick={handleVerifyEmail}
              className="w-full border-border justify-start"
            >
              Verificar email
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Notificaciones</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-foreground">Emails de eventos</span>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Recordatorios de eventos</span>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground">Ofertas y promociones</span>
              <input type="checkbox" className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Privacidad</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleDownloadData}
              className="w-full border-border justify-start"
            >
              Descargar mis datos
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              className="w-full border-destructive text-destructive hover:bg-destructive/10 justify-start"
            >
              Eliminar cuenta
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Card className="border-border bg-card p-6">
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outline"
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
          >
            Cerrar Sesión
          </Button>
        </Card>
      </div>
    </AppLayout>
  )
}
