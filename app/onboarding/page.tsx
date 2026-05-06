'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { updateUserData } from '@/lib/firestore'
import { Goal, DailyTask } from '@/types'

const CATEGORIES = [
  'Career', 'Health', 'Business', 'Education', 'Finance', 'Personal'
]

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Career')
  const [tasks, setTasks] = useState(['', '', ''])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function updateTask(index: number, value: string) {
    const updated = [...tasks]
    updated[index] = value
    setTasks(updated)
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setError('Please enter your goal.')
      return
    }
    if (tasks.some(t => !t.trim())) {
      setError('Please fill in all 3 daily tasks.')
      return
    }
    if (!user) return

    setSaving(true)
    setError('')

    const dailyTasks: DailyTask[] = tasks.map((t, i) => ({
      id: `task-${i + 1}`,
      title: t.trim(),
      xp: i === 0 ? 40 : 30,
      completed: false,
    }))

    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category,
      color: 'purple',
      dailyTasks,
      achievements: [],
      completed: false,
      createdAt: new Date().toISOString(),
    }

    await updateUserData(user.uid, {
      goals: [goal],
      onboarded: true,
    })

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-muted uppercase tracking-widest">
              First Mission — Setup
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Set Your First{' '}
            <span className="text-primary-light">Goal.</span>
          </h1>
          <p className="text-muted text-sm">
            Start with one goal. You can add more later — up to 3 at once.
          </p>
        </div>

        <div className="flex flex-col gap-5">

          {/* Goal Title */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <label className="text-xs font-mono text-muted uppercase tracking-widest block mb-3">
              Goal Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Launch my marketing agency"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Category */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <label className="text-xs font-mono text-muted uppercase tracking-widest block mb-3">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    category === cat
                      ? 'bg-primary text-white shadow-glow-sm'
                      : 'bg-background border border-border text-muted hover:border-primary hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <label className="text-xs font-mono text-muted uppercase tracking-widest block mb-1">
              Daily Tasks
            </label>
            <p className="text-xs text-muted mb-4">
              3 things you'll do every single day toward this goal.
            </p>
            <div className="flex flex-col gap-3">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-muted font-mono">{i + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={task}
                    onChange={e => updateTask(i, e.target.value)}
                    placeholder={
                      i === 0 ? 'Primary task (+40 XP)' :
                      i === 1 ? 'Second task (+30 XP)' :
                      'Third task (+30 XP)'
                    }
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm font-mono text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-glow-purple uppercase tracking-widest text-sm"
          >
            {saving ? 'Initializing...' : 'Begin →'}
          </button>

        </div>
      </div>
    </main>
  )
}