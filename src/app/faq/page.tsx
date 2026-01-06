import { prisma } from '@/lib/db'
import { FAQCategory } from './FAQCategory'
import { FAQSearch } from './FAQSearch'

export const metadata = {
  title: 'Preguntas Frecuentes | KET',
  description: 'Encuentra respuestas a las preguntas más comunes sobre KET',
}

export default async function FAQPage() {
  // Get all published global FAQs
  const faqs = await prisma.fAQ.findMany({
    where: {
      published: true,
      eventId: null, // Global FAQs only
    },
    orderBy: [
      { category: 'asc' },
      { order: 'asc' },
    ],
  })

  // Group by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, typeof faqs>)

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-gray-400">
            Encuentra respuestas a las preguntas más comunes sobre KET
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <FAQSearch faqs={faqs} />
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {Object.entries(faqsByCategory).map(([category, items]) => (
            <FAQCategory
              key={category}
              category={category as any}
              faqs={items}
            />
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center bg-white/5 border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="text-gray-400 mb-6">
            Nuestro equipo de soporte está aquí para ayudarte
          </p>
          <a
            href="mailto:soporte@ket.cl"
            className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
          >
            Contactar Soporte
          </a>
        </div>
      </div>
    </main>
  )
}
