'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, ChevronDown } from 'lucide-react'

interface FAQSearchProps {
  faqs: Array<{
    id: string
    question: string
    answer: string
    category: string
  }>
}

export function FAQSearch({ faqs }: FAQSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof faqs>([])
  const [openResultId, setOpenResultId] = useState<string | null>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (!query.trim()) {
        setResults([])
        return
      }

      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase())
      )

      setResults(filtered)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, faqs])

  return (
    <div className="faq-search">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Busca tu pregunta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-16 pl-16 pr-6 bg-white/5 border-2 border-white/20 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white"
        />
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-400 font-medium">
            {results.length} resultado{results.length !== 1 ? 's' : ''}
          </p>

          {results.map((faq) => (
            <div
              key={faq.id}
              className="border border-white/20 rounded-lg overflow-hidden bg-white/5"
            >
              <button
                onClick={() =>
                  setOpenResultId(openResultId === faq.id ? null : faq.id)
                }
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/10 transition-colors"
              >
                <div className="pr-4">
                  <span className="font-bold text-lg block mb-1">
                    {faq.question}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {getCategoryLabel(faq.category)}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-transform ${
                    openResultId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openResultId === faq.id && (
                <div className="px-6 py-4 border-t border-white/10 bg-black/40">
                  <div
                    className="prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {query.trim() && results.length === 0 && (
        <div className="mt-4 text-center text-gray-400 py-8">
          <p>No encontramos resultados para &quot;{query}&quot;</p>
          <p className="text-sm mt-2">Intenta con otras palabras clave</p>
        </div>
      )}
    </div>
  )
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    TICKETS: 'Entradas',
    PAYMENT: 'Pagos',
    ACCESS: 'Acceso',
    CHANGES: 'Cambios',
    TRANSFERS: 'Transferencias',
    GENERAL: 'General',
  }
  return labels[category] || category
}
