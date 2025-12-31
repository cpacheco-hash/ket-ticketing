'use client'

import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {action && (
          <Button onClick={action.onClick} className="bg-primary hover:bg-primary/90">
            {action.label}
          </Button>
        )}
      </div>
    </header>
  )
}
