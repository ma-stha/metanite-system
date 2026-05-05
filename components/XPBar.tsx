interface XPBarProps {
  xp: number
  level: number
  xpPercent: number
  needed: number
}

function padLevel(level: number): string {
  return level.toString().padStart(2, '0')
}

export default function XPBar({ xp, level, xpPercent, needed }: XPBarProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 mb-8">

      {/* Top Row */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted uppercase tracking-widest">
            XP Progress
          </span>
          <span className="text-xs font-mono text-primary-light bg-background border border-border rounded-full px-2 py-0.5">
            LVL {padLevel(level)}
          </span>
        </div>
        <span className="text-xs font-mono text-muted">
          {xp} / {needed} XP
        </span>
      </div>

      {/* Bar */}
      <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative"
          style={{
            width: `${xpPercent}%`,
            background: 'linear-gradient(90deg, #7C3AED, #9F67FF)',
            boxShadow: xpPercent > 0 ? '0 0 12px rgba(124, 58, 237, 0.6)' : 'none',
          }}
        >
          {/* Shimmer effect */}
          {xpPercent > 10 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted font-mono">
          {needed - xp} XP to Level {padLevel(level + 1)}
        </span>
        <span className="text-xs font-mono text-primary-light font-bold">
          {xpPercent}%
        </span>
      </div>

    </div>
  )
}