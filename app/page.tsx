'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { getUserData, createUserData, updateUserData } from '@/lib/firestore'
import Header from '@/components/Header'
import QuestCard from '@/components/QuestCard'
import XPBar from '@/components/XPBar'
import LevelUpModal from '@/components/LevelUpModal'

interface Quest {
  id: number
  title: string
  xp: number
  completed: boolean
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

function xpForNextLevel(level: number): number {
  return level * 100
}

function padLevel(level: number): string {
  return level.toString().padStart(2, '0')
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function getDaysRemaining(deadline: string): number {
  const today = new Date()
  const end = new Date(deadline)
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function Home() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [quests, setQuests] = useState<Quest[]>([])
  const [lastCompletedDate, setLastCompletedDate] = useState('')
  const [dataLoading, setDataLoading] = useState(true)
  const [goal, setGoal] = useState('')
  const [deadline, setDeadline] = useState('')
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(1)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function loadData() {
      if (!user) return

      let data = await getUserData(user.uid)

      if (!data) {
        data = await createUserData(
          user.uid,
          user.email ?? '',
          user.displayName ?? 'Operative'
        )
        router.push('/onboarding')
        return
      }

      if (!data.onboarded) {
        router.push('/onboarding')
        return
      }

      const today = getTodayString()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      let currentStreak = data.streak
      let currentQuests = data.quests

      if (
        data.lastCompletedDate !== today &&
        data.lastCompletedDate !== yesterdayStr
      ) {
        currentStreak = 0
      }

      if (data.lastCompletedDate !== today) {
        currentQuests = data.quests.map(q => ({ ...q, completed: false }))
      }

      setXp(data.xp)
      setLevel(data.level)
      setStreak(currentStreak)
      setLastCompletedDate(data.lastCompletedDate)
      setQuests(currentQuests)
      setGoal(data.goal ?? '')
      setDeadline(data.deadline ?? '')
      setDataLoading(false)
    }

    loadData()
  }, [user, router])

  async function completeQuest(id: number) {
    if (!user) return
    const quest = quests.find(q => q.id === id)
    if (!quest || quest.completed) return

    const updatedQuests = quests.map(q =>
      q.id === id ? { ...q, completed: true } : q
    )
    setQuests(updatedQuests)

    const newXPRaw = xp + quest.xp
    const needed = xpForNextLevel(level)
    let newXP = newXPRaw
    let newLevel = level

    if (newXPRaw >= needed) {
      newLevel = level + 1
      newXP = newXPRaw - needed
      setLevel(newLevel)
      setNewLevel(newLevel)
      setShowLevelUp(true)
    }
    setXp(newXP)

    const allDone = updatedQuests.every(q => q.completed)
    let newStreak = streak
    let newLastDate = lastCompletedDate
    const today = getTodayString()

    if (allDone && lastCompletedDate !== today) {
      newStreak = streak + 1
      newLastDate = today
      setStreak(newStreak)
      setLastCompletedDate(today)
    }

    await updateUserData(user.uid, {
      xp: newXP,
      level: newLevel,
      streak: newStreak,
      lastCompletedDate: newLastDate,
      quests: updatedQuests,
    })
  }

  const needed = xpForNextLevel(level)
  const xpPercent = Math.round((xp / needed) * 100)
  const completedCount = quests.filter(q => q.completed).length
  const daysLeft = deadline ? getDaysRemaining(deadline) : null

  if (loading || dataLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted text-xs font-mono uppercase tracking-widest">
            Loading System...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">

      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal
          level={newLevel}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      <Header level={level} />

      <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in">

        {/* Top Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-muted uppercase tracking-widest">
              Welcome back, {user?.displayName?.split(' ')[0] ?? 'Operative'}
            </span>
          </div>
          <button
            onClick={logout}
            className="text-xs font-mono text-muted hover:text-white transition-colors uppercase tracking-widest"
          >
            Logout →
          </button>
        </div>

        {/* Title */}
        <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
          Welcome,{' '}
          <span className="text-primary-light">
            {user?.displayName?.split(' ')[0] ?? 'Operative'}.
          </span>
        </h2>

        {/* Goal Banner */}
        {goal && (
          <div className="flex items-center justify-between bg-surface border border-border rounded-2xl px-5 py-4 mb-8">
            <div>
              <p className="text-xs font-mono text-muted uppercase tracking-widest mb-1">
                Active Mission
              </p>
              <p className="text-white font-medium">{goal}</p>
            </div>
            {daysLeft !== null && (
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-xs font-mono text-muted uppercase tracking-widest mb-1">
                  Deadline
                </p>
                <p className={`font-bold text-sm font-mono ${
                  daysLeft < 7 ? 'text-red-400' :
                  daysLeft < 30 ? 'text-yellow-400' :
                  'text-success'
                }`}>
                  {daysLeft > 0 ? `${daysLeft}d remaining` : 'Deadline passed'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">

          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Total XP
            </p>
            <p className="text-3xl font-bold text-white">{xp}</p>
            <p className="text-xs text-muted mt-1">/ {needed} to level up</p>
          </div>

          <div className="bg-surface border border-primary rounded-2xl p-5 shadow-glow-sm">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Level
            </p>
            <p className="text-3xl font-bold text-primary-light">{padLevel(level)}</p>
            <p className="text-xs text-muted mt-1">{LEVEL_NAMES[level] ?? 'Ascended'}</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Streak
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-white">{streak}</p>
              {streak >= 3 && <span className="text-lg">🔥</span>}
            </div>
            <p className="text-xs text-muted mt-1">
              {streak === 0
                ? 'Start your streak!'
                : streak === 1
                ? 'day active'
                : 'days active'}
            </p>
          </div>

        </div>

        {/* XP Bar */}
        <XPBar xp={xp} level={level} xpPercent={xpPercent} needed={needed} />

        {/* Daily Missions */}
        <div className="bg-surface border border-border rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-mono text-muted uppercase tracking-widest">
              Daily Missions
            </p>
            <span className="text-xs font-mono text-muted">
              {completedCount}/{quests.length} complete
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {quests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={completeQuest}
              />
            ))}
          </div>

          {completedCount === quests.length && quests.length > 0 && (
            <div className="mt-6 p-4 bg-background border border-success rounded-xl text-center">
              <p className="text-success font-bold font-mono tracking-widest text-sm">
                ✓ ALL MISSIONS COMPLETE — STREAK: {streak} DAY{streak !== 1 ? 'S' : ''}
              </p>
              <p className="text-muted text-xs mt-1">
                Come back tomorrow to keep your streak alive 🔥
              </p>
            </div>
          )}

        </div>

      </div>
    </main>
  )
}