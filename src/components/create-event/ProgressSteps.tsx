'use client'

import { Check } from 'lucide-react'

interface Step {
  id: number
  name: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isUpcoming = step.id > currentStep

          return (
            <li key={step.id} className="flex-1 relative">
              <div className="flex items-center">
                {/* Step Circle */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                      transition-all duration-200
                      ${
                        isCompleted
                          ? 'bg-cyan-500 text-black'
                          : isCurrent
                          ? 'bg-white text-black ring-4 ring-cyan-500/30'
                          : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                </div>

                {/* Step Label */}
                <div className="ml-3 flex-1">
                  <p
                    className={`
                      text-sm font-medium
                      ${
                        isCurrent
                          ? 'text-white'
                          : isCompleted
                          ? 'text-cyan-400'
                          : 'text-gray-500'
                      }
                    `}
                  >
                    {step.name}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`
                        h-0.5 w-full transition-colors duration-200
                        ${isCompleted ? 'bg-cyan-500' : 'bg-gray-800'}
                      `}
                    />
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
