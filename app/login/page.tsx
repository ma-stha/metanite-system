'use client'

import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  // If already logged in → go to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">

        {/* Logo Area */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-muted uppercase tracking-widest">
              System Online
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-widest uppercase mb-3">
  Meta-Leveling
</h1>
          <p className="text-muted text-sm">
            Your real-life leveling system. Sign in to begin.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface border border-border rounded-2xl p-8">

          <p className="text-xs font-mono text-muted uppercase tracking-widest text-center mb-8">
            Identify Yourself
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-6 rounded-xl transition-all duration-200 mb-4"
          >
            {/* Google Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-xs text-muted text-center mt-6">
            Your progress is saved to your account. <br />
            No password needed.
          </p>

        </div>

        {/* Bottom tag */}
       <p className="text-center text-xs text-muted font-mono mt-8 uppercase tracking-widest">
  Meta-Leveling v2.0
</p>

      </div>
    </main>
  )
}