'use client'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-lg text-gray-400 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
