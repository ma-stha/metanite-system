interface HeaderProps {
  level: number
}

function padLevel(level: number): string {
  return level.toString().padStart(2, '0')
}

export default function Header({ level }: HeaderProps) {
  return (
    <header className="w-full border-b border-border bg-surface px-4 md:px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse-slow" />
          <span className="text-xs font-mono text-muted uppercase tracking-widest hidden sm:block">
            System Active
          </span>
        </div>

        {/* Center */}
        <h1 className="text-white font-bold text-base md:text-lg tracking-widest uppercase">
          Meta-Leveling
        </h1>

        {/* Right */}
        <div className="flex items-center gap-2 bg-background border border-border rounded-full px-3 py-1">
          <span className="text-xs text-muted font-mono">LVL</span>
          <span className="text-primary-light font-bold text-sm">
            {padLevel(level)}
          </span>
        </div>

      </div>
    </header>
  )
}