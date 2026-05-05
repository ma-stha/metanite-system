'use client'

import { useEffect } from 'react'

interface LevelUpModalProps {
  level: number
  onClose: () => void
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Initiate',
  2: 'Apprentice',
  3: 'Operative',
  4: 'Specialist',
  5: 'Elite',
  6: 'Veteran',
  7: 'Expert',
  8: 'Master',
  9: 'Legend',
  10: 'Transcendent',
}

function padLevel(level: number): string {
  return level.toString().padStart(2, '0')
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface border border-primary rounded-3xl p-10 max-w-sm w-full text-center shadow-glow-purple animate-fade-in">

        {/* Glow Ring */}
        <div className="w-24 h-24 rounded-full border-2 border-primary mx-auto mb-6 flex items-center justify-center shadow-glow-purple">
          <span className="text-4xl font-bold text-primary-light">
            {padLevel(level)}
          </span>
        </div>

        {/* Text */}
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
          Level Up
        </p>
        <h2 className="text-3xl font-bold text-white mb-2">
          {LEVEL_NAMES[level] ?? 'Ascended'}
        </h2>
        <p className="text-muted text-sm mb-8">
          You have evolved. Keep pushing your limits.
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-light"
              style={{ opacity: 0.4 + i * 0.3 }}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-glow-purple uppercase tracking-widest text-sm"
        >
          Continue →
        </button>

        <p className="text-xs text-muted font-mono mt-4">
          Auto-closing in 4s
        </p>

      </div>
    </div>
  )
}