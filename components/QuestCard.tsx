interface QuestCardProps {
  quest: {
    id: string | number
    title: string
    xp: number
    completed: boolean
  }
  onComplete: (id: string | number) => void
}

export default function QuestCard({ quest, onComplete }: QuestCardProps) {
  return (
    <div
      className={`
        flex items-center justify-between p-5 rounded-2xl border transition-all duration-300
        ${quest.completed
          ? 'bg-surface border-success opacity-60'
          : 'bg-surface border-border hover:border-primary'}
      `}
    >
      {/* Left — Status + Title */}
      <div className="flex items-center gap-4">

        {/* Completion Circle */}
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
            ${quest.completed
              ? 'bg-success border-success'
              : 'border-muted'}
          `}
        >
          {quest.completed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Title */}
        <div>
          <p className={`font-medium ${quest.completed ? 'line-through text-muted' : 'text-white'}`}>
            {quest.title}
          </p>
          <p className="text-xs text-muted mt-0.5 font-mono">
            +{quest.xp} XP reward
          </p>
        </div>

      </div>

      {/* Right — Button */}
      {!quest.completed ? (
        <button
          onClick={() => onComplete(quest.id)}
          className="bg-primary hover:bg-primary-light text-white text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-glow-purple flex-shrink-0"
        >
          Complete
        </button>
      ) : (
        <span className="text-success text-sm font-mono font-bold flex-shrink-0">
          DONE ✓
        </span>
      )}

    </div>
  )
}