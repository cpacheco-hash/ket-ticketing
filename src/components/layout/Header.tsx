'use client'

import Link from 'next/link'
import { SearchBar } from './SearchBar'
import { Menu, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/events"
              className="text-3xl font-black text-white tracking-tighter hover:opacity-80 transition-opacity"
            >
              KET
            </Link>
          </div>

          {/* Search - Hidden on mobile, visible on md+ */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <SearchBar />
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { label: 'Eventos', href: '/events' },
                { label: 'Mis Tickets', href: '/tickets' },
                { label: 'Crear', href: '/create' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-bold text-white hover:text-gray-300 transition-colors uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Sign out"
                >
                  <User className="w-6 h-6" />
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm uppercase tracking-wide hover:bg-gray-200 transition-colors"
                >
                  Ingresar
                </Link>
              )}
              <button
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Visible only on small screens */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
