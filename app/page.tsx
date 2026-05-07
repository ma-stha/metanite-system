'use client'

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const features = [
  { tag: "GOALS", title: "Set Up To 3 Active Goals", description: "Focus is the mechanic. You can only run 3 goals at once — so you pick what actually matters. Each goal gets its own daily tasks, XP track, and color.", icon: "🎯" },
  { tag: "XP SYSTEM", title: "Earn XP, Level Up", description: "Complete daily tasks and achievements to earn XP. Every level requires more than the last. Watch your global level climb as you put in real work.", icon: "⚡" },
  { tag: "STREAKS", title: "Streak Tracking", description: "Show up every day. Your streak counter records consecutive days of completing tasks. Miss a day and it resets — brutal, but honest.", icon: "🔥" },
  { tag: "ACHIEVEMENTS", title: "Mini Achievements", description: "Each goal has milestone achievements with deadlines and XP rewards. Unlock them by doing the work — not by tapping a button.", icon: "🏆" },
  { tag: "DAILY RESET", title: "Tasks Reset Every Day", description: "Daily tasks auto-reset at midnight. Every day is a fresh chance to earn XP and extend your streak. No backlog, no excuses.", icon: "🔄" },
  { tag: "FREE", title: "No Cost. No Ads.", description: "Meta-Leveling is free to use. Sign in with Google, your progress syncs to the cloud. That's it.", icon: "✨" },
];

const steps = [
  { number: "01", title: "Sign In With Google", description: "One click. No password. Your data syncs instantly." },
  { number: "02", title: "Create Your Goals", description: "Pick up to 3 goals. Name them, choose a category, add 3 daily tasks each." },
  { number: "03", title: "Complete Tasks Daily", description: "Check off your tasks each day. Earn XP, grow your streak, unlock achievements." },
  { number: "04", title: "Level Up", description: "Watch your real-life character level climb as you put in consistent work." },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If already logged in, skip landing page and go straight to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Don't render landing page while checking auth state
  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-mono overflow-x-hidden">
      <style>{`
        .glow-btn:hover { box-shadow: 0 0 24px rgba(139,92,246,0.45); }
        .glow-btn-lg:hover { box-shadow: 0 0 32px rgba(139,92,246,0.5); }
        .card:hover { background: rgba(109,40,217,0.08); }
        .tag-badge { color: rgba(167,139,250,0.5); border-color: rgba(139,92,246,0.2); }
        .card:hover .tag-badge { color: rgba(196,181,253,0.8); border-color: rgba(139,92,246,0.5); }
        .step-num { color: rgba(139,92,246,0.12); }
        .card:hover .step-num { color: rgba(139,92,246,0.3); }
      `}</style>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs tracking-[0.2em] text-white/40 uppercase">System Online</span>
        </div>
        <span className="text-xs tracking-[0.15em] text-white/30 uppercase">Meta-Leveling V2.0</span>
        <Link href="/login" className="text-xs tracking-[0.15em] uppercase border px-4 py-2 transition-all duration-200 text-white/60 border-white/10 hover:text-violet-300 hover:border-violet-500/60">
          Sign In →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-28 md:pt-36 md:pb-40">
        <span className="text-xs tracking-[0.3em] uppercase text-violet-400/60 border border-violet-500/20 px-4 py-2 mb-6">
          Real Life · RPG Mechanics
        </span>
        <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-none tracking-tight uppercase" style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
          META-<br />LEVELING
        </h1>
        <p className="mt-8 text-sm text-white/40 tracking-widest uppercase max-w-md leading-loose">
          Your real life is the game.<br />Your goals are the quests.<br />You are the character.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/login" className="glow-btn bg-violet-600 hover:bg-violet-500 text-white text-xs tracking-[0.2em] uppercase font-bold px-8 py-4 transition-all duration-200 hover:scale-[1.02]">
            Start Your Journey →
          </Link>
          <a href="#how-it-works" className="text-xs tracking-[0.2em] uppercase text-white/40 hover:text-violet-300 transition-all duration-200 border border-white/10 hover:border-violet-500/40 px-8 py-4">
            How It Works
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 flex items-center gap-4">
            <span className="text-[10px] tracking-[0.3em] text-violet-400/50 uppercase">— How It Works</span>
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
            {steps.map((step) => (
              <div key={step.number} className="card bg-[#0a0a0a] p-8 transition-colors duration-300">
                <div className="step-num text-5xl font-black mb-6 leading-none transition-colors duration-300">{step.number}</div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-3">{step.title}</h3>
                <p className="text-xs text-white/35 leading-loose">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 flex items-center gap-4">
            <span className="text-[10px] tracking-[0.3em] text-violet-400/50 uppercase">— System Features</span>
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
            {features.map((feature) => (
              <div key={feature.tag} className="card bg-[#0a0a0a] p-8 transition-colors duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <span className="tag-badge text-[9px] tracking-[0.3em] uppercase border px-2 py-1 transition-all duration-300">{feature.tag}</span>
                  <span className="text-xl opacity-30 group-hover:opacity-60 transition-opacity">{feature.icon}</span>
                </div>
                <h3 className="text-sm font-bold tracking-wide uppercase text-white mb-3">{feature.title}</h3>
                <p className="text-xs text-white/35 leading-loose">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative z-10 px-6 md:px-12 py-24 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 flex items-center gap-4">
            <span className="text-[10px] tracking-[0.3em] text-violet-400/50 uppercase">— About</span>
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
          </div>
          <div className="space-y-6 text-sm text-white/40 leading-loose">
            <p>Meta-Leveling started as a simple question: what if your daily habits worked like an RPG? Most productivity apps are just lists. They don't give you a reason to come back tomorrow.</p>
            <p>Every task you complete earns XP. Every day you show up extends your streak. Every goal you finish is an achievement you can look back on. The mechanics are real — not cosmetic.</p>
            <p>It's free. It's synced to your Google account. Designed to make consistent effort feel as satisfying as it actually is.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 py-32 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-violet-400/40 mb-8">Ready to start?</p>
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight mb-12" style={{ fontFamily: "'Arial Black', Arial, sans-serif" }}>
            Begin Your<br />Journey
          </h2>
          <Link href="/login" className="glow-btn-lg inline-block bg-violet-600 hover:bg-violet-500 text-white text-xs tracking-[0.2em] uppercase font-bold px-12 py-5 transition-all duration-200 hover:scale-[1.02]">
            Sign In With Google →
          </Link>
          <p className="mt-6 text-[10px] tracking-widest text-white/20 uppercase">No password needed · Free forever · Progress saved automatically</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">Meta-Leveling V2.0</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">All Systems Operational</span>
        </div>
      </footer>
    </main>
  );
}