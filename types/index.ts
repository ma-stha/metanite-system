export interface Achievement {
  id: string
  title: string
  xp: number
  unlocked: boolean
  unlockedAt?: string
  deadline?: string
}

export interface DailyTask {
  id: string
  title: string
  xp: number
  completed: boolean
}

export interface Goal {
  id: string
  title: string
  category: string
  color: 'purple' | 'blue' | 'green'
  dailyTasks: DailyTask[]
  achievements: Achievement[]
  completed: boolean
  createdAt: string
}

export interface UserData {
  uid: string
  email: string
  displayName: string
  globalXP: number
  globalLevel: number
  streak: number
  lastCompletedDate: string
  goals: Goal[]
  onboarded: boolean
  createdAt: string
}