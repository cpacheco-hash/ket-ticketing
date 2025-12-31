'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  TicketIcon,
  ShoppingBagIcon,
  PlusCircleIcon,
  CogIcon,
  UserCircleIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    name: 'Mis Entradas',
    href: '/tickets',
    icon: TicketIcon,
  },
  {
    name: 'Comprar',
    href: '/events',
    icon: ShoppingBagIcon,
  },
  {
    name: 'Vender/Crear',
    href: '/create',
    icon: PlusCircleIcon,
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: CogIcon,
  },
  {
    name: 'Perfil',
    href: '/profile',
    icon: UserCircleIcon,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">KET</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <UserCircleIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-foreground">Usuario</p>
            <p className="text-xs text-muted-foreground">user@ket.cl</p>
          </div>
        </div>
      </div>
    </div>
  )
}
