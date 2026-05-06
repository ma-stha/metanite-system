'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { getUserData, createUserData, updateUserData } from '@/lib/firestore'
import { UserData, Goal, Achievement, DailyTask } from '@/types'
import Header from '@/components/Header'
import XPBar from '@/components/XPBar'
import GoalCard from '@/components/GoalCard'
import LevelUpModal from '@/components/LevelUpModal'

function xpForNextLevel(level: number): number {
  return level * 100
}

function padLevel(level: number): string {
  return level.toString().padStart(2, '0')
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

const GOAL_COLORS: ('purple' | 'blue' | 'green')[] = ['purple', 'blue', 'green']
const CATEGORIES = ['Career', 'Health', 'Business', 'Education', 'Finance', 'Personal']

export default function Home() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(1)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalCategory, setNewGoalCategory] = useState('Career')
  const [newGoalTasks, setNewGoalTasks] = useState(['', '', ''])

  // --- REDIRECT IF NOT LOGGED IN ---
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  // --- LOAD USER DATA ---
  useEffect(() => {
    async function loadData() {
      if (!user) return

      let data = await getUserData(user.uid)

      if (!data) {
        data = await createUserData(
          user.uid,
          user.email ?? '',
          user.displayName ?? ''
        )
        router.push('/onboarding')
        return
      }

      if (!data.onboarded || !data.goals) {
        router.push('/onboarding')
        return
      }

      // Reset daily tasks if new day
      const today = getTodayString()
      if (data.lastCompletedDate !== today) {
        const resetGoals = data.goals.map(g => ({
          ...g,
          dailyTasks: g.dailyTasks.map(t => ({ ...t, completed: false }))
        }))
        data = { ...data, goals: resetGoals }
      }

      // Check streak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      if (
        data.lastCompletedDate !== today &&
        data.lastCompletedDate !== yesterdayStr
      ) {
        data = { ...data, streak: 0 }
      }

      setUserData(data)
      setDataLoading(false)
    }

    loadData()
  }, [user, router])

  // --- PROCESS XP + LEVEL UP ---
  function processXP(current: UserData, amount: number): UserData {
    const newXPRaw = current.globalXP + amount
    const needed = xpForNextLevel(current.globalLevel)

    if (newXPRaw >= needed) {
      const newLvl = current.globalLevel + 1
      setNewLevel(newLvl)
      setShowLevelUp(true)
      return { ...current, globalXP: newXPRaw - needed, globalLevel: newLvl }
    }
    return { ...current, globalXP: newXPRaw }
  }

  // --- COMPLETE TASK ---
  async function handleCompleteTask(goalId: string, taskId: string) {
    if (!userData || !user) return

    const goal = userData.goals.find(g => g.id === goalId)
    const task = goal?.dailyTasks.find(t => t.id === taskId)
    if (!task || task.completed) return

    let updated = { ...userData }

    // Mark task complete
    updated.goals = updated.goals.map(g =>
      g.id === goalId
        ? {
            ...g,
            dailyTasks: g.dailyTasks.map(t =>
              t.id === taskId ? { ...t, completed: true } : t
            )
          }
        : g
    )

    // Add XP
    updated = processXP(updated, task.xp)

    // Check streak — all tasks in ALL goals done?
    const today = getTodayString()
    const allDone = updated.goals.every(g =>
      g.dailyTasks.every(t => t.completed)
    )
    if (allDone && updated.lastCompletedDate !== today) {
      updated.streak = (userData.streak ?? 0) + 1
      updated.lastCompletedDate = today
    }

    setUserData(updated)
    await updateUserData(user.uid, {
      globalXP: updated.globalXP,
      globalLevel: updated.globalLevel,
      goals: updated.goals,
      streak: updated.streak,
      lastCompletedDate: updated.lastCompletedDate,
    })
  }

  // --- ADD ACHIEVEMENT ---
  async function handleAddAchievement(
    goalId: string,
    title: string,
    xp: number,
    deadline?: string
  ) {
    if (!userData || !user) return

    const newAchievement: Achievement = {
      id: `ach-${Date.now()}`,
      title,
      xp,
      unlocked: false,
      ...(deadline ? { deadline } : {}),
    }

    const updated = {
      ...userData,
      goals: userData.goals.map(g =>
        g.id === goalId
          ? { ...g, achievements: [...g.achievements, newAchievement] }
          : g
      )
    }

    setUserData(updated)
    await updateUserData(user.uid, { goals: updated.goals })
  }

  // --- UNLOCK ACHIEVEMENT ---
  async function handleUnlockAchievement(goalId: string, achievementId: string) {
    if (!userData || !user) return

    const goal = userData.goals.find(g => g.id === goalId)
    const achievement = goal?.achievements.find(a => a.id === achievementId)
    if (!achievement || achievement.unlocked) return

    let updated = { ...userData }

    // Unlock achievement + check if goal complete
    updated.goals = updated.goals.map(g =>
      g.id === goalId
        ? {
            ...g,
            achievements: g.achievements.map(a =>
              a.id === achievementId
                ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
                : a
            ),
            completed: g.achievements.every(a =>
              a.id === achievementId ? true : a.unlocked
            )
          }
        : g
    )

    // Big XP bonus
    updated = processXP(updated, achievement.xp)

    setUserData(updated)
    await updateUserData(user.uid, {
      globalXP: updated.globalXP,
      globalLevel: updated.globalLevel,
      goals: updated.goals,
    })
  }

  // --- ADD NEW GOAL ---
  async function handleAddGoal() {
    if (!userData || !user) return
    if (!newGoalTitle.trim() || newGoalTasks.some(t => !t.trim())) return
    if ((userData.goals ?? []).length >= 3) return

    const dailyTasks: DailyTask[] = newGoalTasks.map((t, i) => ({
      id: `task-${Date.now()}-${i}`,
      title: t.trim(),
      xp: i === 0 ? 40 : 30,
      completed: false,
    }))

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoalTitle.trim(),
      category: newGoalCategory,
      color: GOAL_COLORS[(userData.goals ?? []).length],
      dailyTasks,
      achievements: [],
      completed: false,
      createdAt: new Date().toISOString(),
    }

    const updated = {
      ...userData,
      goals: [...(userData.goals ?? []), newGoal]
    }

    setUserData(updated)
    await updateUserData(user.uid, { goals: updated.goals })

    // Reset form
    setNewGoalTitle('')
    setNewGoalCategory('Career')
    setNewGoalTasks(['', '', ''])
    setShowAddGoal(false)
  }

  // --- LOADING STATE ---
  if (loading || dataLoading || !userData) {
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

  const needed = xpForNextLevel(userData.globalLevel)
  const xpPercent = Math.round((userData.globalXP / needed) * 100)
  const canAddGoal = (userData.goals ?? []).length < 3

  return (
    <main className="min-h-screen bg-background">

      {/* Level Up Modal */}
      {showLevelUp && (
        <LevelUpModal
          level={newLevel}
          onClose={() => setShowLevelUp(false)}
        />
      )}

      <Header level={userData.globalLevel} />

      <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">

        {/* Top Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-muted uppercase tracking-widest">
              Welcome back, {user?.displayName?.split(' ')[0]}
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
        <h2 className="text-4xl font-bold text-white mb-8">
          Welcome,{' '}
          <span className="text-primary-light">
            {user?.displayName?.split(' ')[0]}.
          </span>
        </h2>

        {/* Global Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Global XP
            </p>
            <p className="text-3xl font-bold text-white">{userData.globalXP}</p>
            <p className="text-xs text-muted mt-1">/ {needed} to level up</p>
          </div>

          <div className="bg-surface border border-primary rounded-2xl p-5 shadow-glow-sm">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Level
            </p>
            <p className="text-3xl font-bold text-primary-light">
              {padLevel(userData.globalLevel)}
            </p>
            <p className="text-xs text-muted mt-1">Global Rank</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-2">
              Streak
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-white">{userData.streak}</p>
              {userData.streak >= 3 && <span>🔥</span>}
            </div>
            <p className="text-xs text-muted mt-1">
              {userData.streak === 0
                ? 'Start today!'
                : userData.streak === 1
                ? 'day active'
                : 'days active'}
            </p>
          </div>

        </div>

        {/* Global XP Bar */}
        <XPBar
          xp={userData.globalXP}
          level={userData.globalLevel}
          xpPercent={xpPercent}
          needed={needed}
        />

        {/* Goals Grid — adapts 1, 2, or 3 columns */}
        <div className={`grid gap-4 mb-6 ${
          (userData.goals ?? []).length === 1
            ? 'grid-cols-1 max-w-2xl'
            : (userData.goals ?? []).length === 2
            ? 'grid-cols-2'
            : 'grid-cols-3'
        }`}>
          {(userData.goals ?? []).map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onCompleteTask={handleCompleteTask}
              onAddAchievement={handleAddAchievement}
              onUnlockAchievement={handleUnlockAchievement}
              onUpdateTasks={() => {}}
              isOnly={(userData.goals ?? []).length === 1}
            />
          ))}
        </div>

        {/* Add Goal Button */}
        {canAddGoal && !showAddGoal && (
          <button
            onClick={() => setShowAddGoal(true)}
            className="w-full border border-dashed border-border hover:border-primary text-muted hover:text-white text-sm font-mono py-4 rounded-2xl transition-all duration-200"
          >
            + Add Another Goal ({(userData.goals ?? []).length}/3)
          </button>
        )}

        {/* Add Goal Form */}
        {showAddGoal && (
          <div className="bg-surface border border-border rounded-2xl p-6 animate-fade-in">

            <p className="text-xs font-mono text-muted uppercase tracking-widest mb-5">
              New Goal
            </p>

            <div className="flex flex-col gap-4">

              {/* Title */}
              <input
                type="text"
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                placeholder="Goal title..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary"
              />

              {/* Category */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setNewGoalCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      newGoalCategory === cat
                        ? 'bg-primary text-white'
                        : 'bg-background border border-border text-muted hover:border-primary hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Daily Tasks */}
              {newGoalTasks.map((task, i) => (
                <input
                  key={i}
                  type="text"
                  value={task}
                  onChange={e => {
                    const updated = [...newGoalTasks]
                    updated[i] = e.target.value
                    setNewGoalTasks(updated)
                  }}
                  placeholder={
                    i === 0
                      ? 'Primary daily task (+40 XP)...'
                      : `Daily task ${i + 1} (+30 XP)...`
                  }
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary text-sm"
                />
              ))}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl transition-all text-sm uppercase tracking-widest"
                >
                  Add Goal →
                </button>
                <button
                  onClick={() => {
                    setShowAddGoal(false)
                    setNewGoalTitle('')
                    setNewGoalTasks(['', '', ''])
                  }}
                  className="flex-1 bg-background border border-border text-muted hover:text-white font-bold py-3 rounded-xl transition-all text-sm"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  )
}