'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BasicInfoStep } from '@/components/create-event/BasicInfoStep'
import { DateLocationStep } from '@/components/create-event/DateLocationStep'
import { ArtistStep } from '@/components/create-event/ArtistStep'
import { PricingStep } from '@/components/create-event/PricingStep'
import { ImagesStep } from '@/components/create-event/ImagesStep'
import { ReviewStep } from '@/components/create-event/ReviewStep'
import { ProgressSteps } from '@/components/create-event/ProgressSteps'
import type { CreateEventInput } from '@/lib/validations/create-event'

export default function CreateEventMultiStepPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CreateEventInput>>({})

  if (!session) {
    router.push('/auth/login?callbackUrl=/create/multi-step')
    return null
  }

  if (session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-black mb-4">Acceso Denegado</h2>
          <p className="text-gray-400 mb-6">
            Solo los administradores y organizadores pueden crear eventos.
          </p>
          <button
            onClick={() => router.push('/events')}
            className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200"
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 1, name: 'Información básica', component: BasicInfoStep },
    { id: 2, name: 'Fecha y ubicación', component: DateLocationStep },
    { id: 3, name: 'Artista', component: ArtistStep },
    { id: 4, name: 'Precios', component: PricingStep },
    { id: 5, name: 'Imágenes', component: ImagesStep },
    { id: 6, name: 'Revisión', component: ReviewStep },
  ]

  const CurrentStepComponent = steps[currentStep - 1].component

  const handleNext = (data: Partial<CreateEventInput>) => {
    setFormData({ ...formData, ...data })
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <main className="min-h-screen bg-black text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Crear Evento</h1>
          <p className="text-gray-400">Completa los siguientes pasos para publicar tu evento</p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps steps={steps} currentStep={currentStep} />

        {/* Current Step */}
        <div className="mt-8">
          <CurrentStepComponent
            data={formData}
            onUpdate={setFormData}
            onNext={() => handleNext(formData)}
            onBack={handleBack}
          />
        </div>
      </div>
    </main>
  )
}
