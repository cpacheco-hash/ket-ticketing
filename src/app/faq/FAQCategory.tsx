'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQCategoryProps {
  category: 'TICKETS' | 'PAYMENT' | 'ACCESS' | 'CHANGES' | 'TRANSFERS' | 'GENERAL'
  faqs: Array<{
    id: string
    question: string
    answer: string
  }>
}

const categoryLabels: Record<FAQCategoryProps['category'], string> = {
  TICKETS: '🎫 Entradas',
  PAYMENT: '💳 Pagos y reembolsos',
  ACCESS: '🚪 Acceso al evento',
  CHANGES: '🔄 Cambios y cancelaciones',
  TRANSFERS: '🔀 Transferencia de entradas',
  GENERAL: '❓ General',
}

export function FAQCategory({ category, faqs }: FAQCategoryProps) {
  return (
    <section className="faq-category">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-tight">
        {categoryLabels[category]}
      </h2>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
      >
        <span className="font-bold text-lg pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-white/10 bg-black/40">
          <div
            className="prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  )
}
