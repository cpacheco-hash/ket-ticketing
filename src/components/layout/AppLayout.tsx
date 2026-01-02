'use client'

import { ReactNode } from 'react'
import { Header } from './Header'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Header />
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}
