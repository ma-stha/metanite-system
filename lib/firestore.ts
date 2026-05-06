import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { UserData, Goal } from '@/types'

export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (snap.exists()) return snap.data() as UserData
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

export async function createUserData(
  uid: string,
  email: string,
  displayName: string
): Promise<UserData> {
  const newUser: UserData = {
    uid,
    email,
    displayName,
    globalXP: 0,
    globalLevel: 1,
    streak: 0,
    lastCompletedDate: '',
    goals: [],
    onboarded: false,
    createdAt: new Date().toISOString(),
  }
  await setDoc(doc(db, 'users', uid), newUser)
  return newUser
}

export async function updateUserData(
  uid: string,
  data: Partial<UserData>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), data as any)
  } catch (error) {
    console.error('Error updating user data:', error)
  }
}