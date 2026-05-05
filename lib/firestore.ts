import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export interface UserData {
  uid: string
  email: string
  displayName: string
  xp: number
  level: number
  streak: number
  lastCompletedDate: string
  goal?: string
  deadline?: string
  onboarded?: boolean
  quests: {
    id: number
    title: string
    xp: number
    completed: boolean
  }[]
  createdAt: string
}

const DEFAULT_QUESTS = [
  { id: 1, title: 'Complete your most important task', xp: 40, completed: false },
  { id: 2, title: 'Exercise for 30 minutes', xp: 30, completed: false },
  { id: 3, title: 'Learn something new for 20 minutes', xp: 30, completed: false },
]

// --- GET USER DATA ---
export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return snap.data() as UserData
    }
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

// --- CREATE NEW USER ---
export async function createUserData(
  uid: string,
  email: string,
  displayName: string
): Promise<UserData> {
  const newUser: UserData = {
    uid,
    email,
    displayName,
    xp: 0,
    level: 1,
    streak: 0,
    lastCompletedDate: '',
    quests: DEFAULT_QUESTS,
    createdAt: new Date().toISOString(),
  }

  await setDoc(doc(db, 'users', uid), newUser)
  return newUser
}

// --- UPDATE USER DATA ---
export async function updateUserData(
  uid: string,
  data: Partial<UserData>
): Promise<void> {
  try {
    const ref = doc(db, 'users', uid)
    await updateDoc(ref, data)
  } catch (error) {
    console.error('Error updating user data:', error)
  }
}

// --- RESET DAILY QUESTS ---
export async function resetDailyQuests(uid: string): Promise<void> {
  await updateUserData(uid, { quests: DEFAULT_QUESTS })
}