'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface SpotifyLoginButtonProps {
  disabled?: boolean
}

export function SpotifyLoginButton({ disabled }: SpotifyLoginButtonProps) {
  const [showBenefits, setShowBenefits] = useState(false)

  const handleSignIn = () => {
    signIn('spotify', { callbackUrl: '/events' })
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={handleSignIn}
        onMouseEnter={() => setShowBenefits(true)}
        onMouseLeave={() => setShowBenefits(false)}
        disabled={disabled}
        className="w-full border-border hover:bg-secondary relative overflow-hidden group"
      >
        {/* Spotify Icon */}
        <svg
          className="mr-2 h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
        Continuar con Spotify
      </Button>

      {/* Benefits Tooltip */}
      {showBenefits && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-black border-2 border-white/20 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-sm font-bold text-white mb-3">
            ¿Por qué conectar Spotify?
          </h4>
          <ul className="space-y-2">
            <BenefitItem>
              Recomendaciones personalizadas según tus gustos musicales
            </BenefitItem>
            <BenefitItem>
              Descubre eventos de tus artistas favoritos
            </BenefitItem>
            <BenefitItem>
              Mejor matching entre tus preferencias y eventos
            </BenefitItem>
            <BenefitItem>
              Notificaciones cuando tus artistas anuncian conciertos
            </BenefitItem>
          </ul>

          {/* Arrow pointing up */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-t-2 border-l-2 border-white/20 rotate-45" />
        </div>
      )}
    </div>
  )
}

function BenefitItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-300">
      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
      <span>{children}</span>
    </li>
  )
}
