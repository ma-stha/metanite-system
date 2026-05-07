import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata = {
  title: 'Meta-Leveling — Your Real-Life Leveling System',
  description: 'Turn your goals into a game. Track daily tasks, earn XP, level up your real life.',
  metadataBase: new URL('https://metaleveling.online'),
  openGraph: {
    title: 'Meta-Leveling',
    description: 'Turn your goals into a game.',
    url: 'https://metaleveling.online',
    siteName: 'Meta-Leveling',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
