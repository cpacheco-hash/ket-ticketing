'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AppLayout, Header } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserCircleIcon } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: session?.user?.firstName || '',
    lastName: session?.user?.lastName || '',
    email: session?.user?.email || '',
  })

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await update()
        setIsEditing(false)
        alert('Perfil actualizado exitosamente')
      } else {
        alert('Error al actualizar perfil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
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
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground disabled:bg-muted disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground disabled:bg-muted disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground disabled:bg-muted disabled:opacity-70"
              />
            </div>

            <div className="pt-4 flex gap-3">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        firstName: session.user.firstName,
                        lastName: session.user.lastName,
                        email: session.user.email,
                      })
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </>
              )}
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
