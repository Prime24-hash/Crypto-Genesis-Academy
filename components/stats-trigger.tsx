'use client'

import { BarChart3 } from 'lucide-react'

interface StatsTriggerProps {
  onOpen: () => void
}

export function StatsTrigger({ onOpen }: StatsTriggerProps) {
  return (
    <button
      onClick={onOpen}
      className="p-2 rounded-lg hover:bg-secondary/30 transition-all text-foreground hover:text-primary"
      aria-label="Developer statistics"
      title="Developer Stats"
    >
      <BarChart3 size={20} />
    </button>
  )
}
