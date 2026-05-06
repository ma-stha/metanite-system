'use client'

import { useState } from 'react'
import { Goal } from '@/types'
import QuestCard from './QuestCard'

interface GoalCardProps {
  goal: Goal
  onCompleteTask: (goalId: string, taskId: string) => void
  onAddAchievement: (goalId: string, title: string, xp: number, deadline?: string) => void
  onUnlockAchievement: (goalId: string, achievementId: string) => void
  onUpdateTasks: (goalId: string) => void
  isOnly: boolean
}

export default function GoalCard({
  goal,
  onCompleteTask,
  onAddAchievement,
  onUnlockAchievement,
  onUpdateTasks,
  isOnly,
}: GoalCardProps) {
  const [showAddAchievement, setShowAddAchievement] = useState(false)
  const [achievementTitle, setAchievementTitle] = useState('')
  const [achievementXP, setAchievementXP] = useState(100)
  const [achievementDeadline, setAchievementDeadline] = useState('')

  const completedTasks = goal.dailyTasks.filter(t => t.completed).length
  const totalTasks = goal.dailyTasks.length
  const unlockedAchievements = goal.achievements.filter(a => a.unlocked).length
  const totalAchievements = goal.achievements.length
  const allTasksDone = completedTasks === totalTasks

  function handleAddAchievement() {
    if (!achievementTitle.trim()) return
    onAddAchievement(goal.id, achievementTitle.trim(), achievementXP, achievementDeadline)
    setAchievementTitle('')
    setAchievementXP(100)
    setAchievementDeadline('')
    setShowAddAchievement(false)
  }

  const colorMap = {
    purple: {
      border: 'border-primary',
      glow: 'shadow-glow-sm',
      text: 'text-primary-light',
      bg: 'bg-primary',
    },
    blue: {
      border: 'border-blue-500',
      glow: 'shadow-blue-500/20',
      text: 'text-blue-400',
      bg: 'bg-blue-500',
    },
    green: {
      border: 'border-success',
      glow: 'shadow-glow-green',
      text: 'text-success',
      bg: 'bg-success',
    },
  }

  const colors = colorMap[goal.color]

  return (
    <div className={`bg-surface border ${colors.border} rounded-2xl p-5 flex flex-col gap-4 ${colors.glow}`}>

      {/* Goal Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-mono uppercase tracking-widest ${colors.text}`}>
            {goal.category}
          </span>
          {goal.completed && (
            <span className="text-xs font-mono text-success bg-success/10 border border-success/30 rounded-full px-2 py-0.5">
              COMPLETE ✓
            </span>
          )}
        </div>
        <h3 className="text-white font-bold text-lg leading-tight">{goal.title}</h3>
      </div>

      {/* Task Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted font-mono mb-1.5">
          <span>Daily Tasks</span>
          <span>{completedTasks}/{totalTasks}</span>
        </div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="flex flex-col gap-2">
        {goal.dailyTasks.map(task => (
          <QuestCard
            key={task.id}
            quest={task}
            onComplete={() => onCompleteTask(goal.id, task.id)}
          />
        ))}
      </div>

      {/* All Tasks Done Banner */}
      {allTasksDone && (
        <div className="p-3 bg-background border border-success/40 rounded-xl text-center">
          <p className="text-success text-xs font-mono font-bold tracking-widest">
            ✓ ALL TASKS DONE TODAY
          </p>
        </div>
      )}

      {/* Achievements Section */}
      {goal.achievements.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-muted uppercase tracking-widest">
              Achievements
            </span>
            <span className="text-xs font-mono text-muted">
              {unlockedAchievements}/{totalAchievements}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {goal.achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  achievement.unlocked
                    ? 'bg-success/10 border-success/30'
                    : 'bg-background border-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {achievement.unlocked ? '🏆' : '🔒'}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${
                      achievement.unlocked ? 'text-success' : 'text-muted'
                    }`}>
                      {achievement.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted font-mono">
                        +{achievement.xp} XP
                      </p>
                      {achievement.deadline && !achievement.unlocked && (
                        <p className={`text-xs font-mono ${
                          new Date(achievement.deadline) < new Date()
                            ? 'text-red-400'
                            : new Date(achievement.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? 'text-yellow-400'
                            : 'text-muted'
                        }`}>
                          · by {new Date(achievement.deadline).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      )}
                      {achievement.unlocked && achievement.unlockedAt && (
                        <p className="text-xs font-mono text-success">
                          · done {new Date(achievement.unlockedAt).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {!achievement.unlocked && (
                  <button
                    onClick={() => onUnlockAchievement(goal.id, achievement.id)}
                    className="text-xs bg-primary/20 hover:bg-primary text-primary-light hover:text-white border border-primary/40 hover:border-primary px-3 py-1.5 rounded-lg transition-all font-mono flex-shrink-0"
                  >
                    Unlock
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Achievement */}
        <div>
          {!showAddAchievement ? (
            <button
              onClick={() => setShowAddAchievement(true)}
              className="w-full text-xs font-mono text-muted hover:text-white border border-dashed border-border hover:border-primary rounded-xl py-2.5 transition-all"
            >
              + Add Mini Achievement
            </button>
          ) : (
            <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-3">
              <p className="text-xs font-mono text-muted uppercase tracking-widest">
                New Achievement
              </p>

              {/* Title */}
              <input
                type="text"
                value={achievementTitle}
                onChange={e => setAchievementTitle(e.target.value)}
                placeholder="e.g. Land first client"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-sm placeholder-muted focus:outline-none focus:border-primary"
              />

              {/* XP */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted font-mono">XP Reward:</span>
                <select
                  value={achievementXP}
                  onChange={e => setAchievementXP(Number(e.target.value))}
                  className="bg-surface border border-border rounded-lg px-2 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-primary"
                >
                  <option value={50}>50 XP</option>
                  <option value={100}>100 XP</option>
                  <option value={150}>150 XP</option>
                  <option value={200}>200 XP</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted font-mono">
                  Target Date (optional)
                </span>
                <input
                  type="date"
                  value={achievementDeadline}
                  onChange={e => setAchievementDeadline(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddAchievement}
                  className="flex-1 bg-primary hover:bg-primary-light text-white text-xs font-bold py-2 rounded-lg transition-all"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddAchievement(false)
                    setAchievementTitle('')
                    setAchievementDeadline('')
                  }}
                  className="flex-1 bg-background border border-border text-muted hover:text-white text-xs font-bold py-2 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      

    </div>
  )
}