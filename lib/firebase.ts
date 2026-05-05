import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBoxivEHS0fqKpShAhrYKbNrhsKnHNz53Y",
  authDomain: "metanite-system.firebaseapp.com",
  projectId: "metanite-system",
  storageBucket: "metanite-system.firebasestorage.app",
  messagingSenderId: "983330126982",
  appId: "1:983330126982:web:6f740697866ab01baf6507"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()