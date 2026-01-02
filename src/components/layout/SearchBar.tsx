'use client'

import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className = '' }: SearchBarProps) {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-white" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-3 bg-black border-2 border-white rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 font-medium"
        placeholder="Search events, artists, venues..."
        aria-label="Search events"
      />
    </div>
  )
}
