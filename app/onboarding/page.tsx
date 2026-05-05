'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { updateUserData } from '@/lib/firestore'

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [goal, setGoal] = useState('')
  const [deadline, setDeadline] = useState('')
  const [tasks, setTasks] = useState(['', '', ''])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function updateTask(index: number, value: string) {
    const updated = [...tasks]
    updated[index] = value
    setTasks(updated)
  }

  async function handleSubmit() {
    // Validate
    if (!goal.trim()) {
      setError('Please enter your main goal.')
      return
    }
    if (!deadline) {
      setError('Please set a deadline.')
      return
    }
    if (tasks.some(t => !t.trim())) {
      setError('Please fill in all 3 daily missions.')
      return
    }
    if (!user) return

    setSaving(true)
    setError('')

    const customQuests = tasks.map((title, i) => ({
      id: i + 1,
      title: title.trim(),
      xp: i === 0 ? 40 : 30,
      completed: false,
    }))

    await updateUserData(user.uid, {
      goal: goal.trim(),
      deadline,
      quests: customQuests,
      onboarded: true,
    } as any)

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
              First Time Setup
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Define Your{' '}
            <span className="text-primary-light">Mission.</span>
          </h1>
          <p className="text-muted">
            Set your goal, your deadline, and 3 daily tasks. 
            The system will track your progress automatically.
          </p>
        </div>

        <div className="flex flex-col gap-5">

          {/* Goal */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <label className="text-xs font-mono text-muted uppercase tracking-widest block mb-3">
              Main Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Launch my marketing agency"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Deadline */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <label className="text-xs font-mono text-muted uppercase tracking-widest block mb-3">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Daily Tasks */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <label className="text-xs font-mono text-muted uppercase tracking-widest block mb-3">
              Daily Missions (3 tasks you'll do every day)
            </label>
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
                      i === 0
                        ? 'Most important task (+40 XP)'
                        : i === 1
                        ? 'Second task (+30 XP)'
                        : 'Third task (+30 XP)'
                    }
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm font-mono text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-200 hover:shadow-glow-purple uppercase tracking-widest text-sm"
          >
            {saving ? 'Initializing...' : 'Begin Mission →'}
          </button>

        </div>
      </div>
    </main>
  )
}