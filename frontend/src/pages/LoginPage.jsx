// src/pages/LoginPage.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithGoogle } from '../lib/firebase'
import { Zap, Sparkles, Wand2, Shield, Globe, Cpu, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const FEATURES = [
  { icon: Sparkles, label: 'Blog Posts', desc: 'Long-form narratives' },
  { icon: Globe, label: 'Social', desc: 'Platform-native copy' },
  { icon: Wand2, label: 'Marketing', desc: 'High-conversion ads' },
  { icon: Cpu, label: 'Tech Docs', desc: 'Code & documentation' },
]

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Login Error:', err)
      const msg = err.code === 'auth/popup-closed-by-user'
        ? 'Login cancelled.'
        : 'Sign-in failed. Please check your console/Firebase settings.'
      toast.error(msg)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 text-white font-body selection:bg-ember-500/30 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-ember-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-frost-500/10 rounded-full blur-[120px]"
        />

        {/* Dynamic Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen flex flex-col pt-12">
        {/* Navbar */}
        <header className="flex justify-between items-center mb-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-frost-500 flex items-center justify-center shadow-lg shadow-ember-500/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter italic">FORGE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-display font-black uppercase tracking-[0.3em] text-white/40">
            <span className="hover:text-white transition-colors cursor-pointer">Technology</span>
            <span className="hover:text-white transition-colors cursor-pointer">Llama 3.3</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center pb-20">
          {/* Left Column: Hero */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-ember-500"></span>
                </span>
                <span className="text-[10px] font-display font-black uppercase tracking-widest text-white/60">Powered by Groq Intelligence</span>
              </div>
              <h1 className="font-display text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                GENERATE <br />
                <span className="gradient-text italic">PURE ENERGY</span>
              </h1>
              <p className="text-white/40 font-body text-xl max-w-lg leading-relaxed">
                Forge high-performance content, documentation, and copy with the world's fastest AI engine.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handleLogin}
                disabled={loading}
                className="group relative flex items-center justify-center gap-4 bg-white text-ink-950 px-10 py-5 rounded-2xl font-display font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
              >
                {loading ? (
                  <div className="w-5 h-5 border-4 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                ) : (
                  <>
                    Continue with Google
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* Right Column: Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            {/* Decorative glow behind grid */}
            <div className="absolute inset-0 bg-gradient-to-br from-ember-500/20 to-frost-500/20 blur-[100px] opacity-30 pointer-events-none" />

            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                className="glass group p-8 rounded-3xl border-white/5 hover:border-white/20 transition-all cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:bg-white/10 transition-all shadow-inner">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-lg uppercase tracking-tight mb-1">{feature.label}</h3>
                <p className="text-white/30 text-xs font-body uppercase tracking-widest">{feature.desc}</p>
              </motion.div>
            ))}

            {/* Login Stats Mocks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="sm:col-span-2 glass p-6 rounded-3xl border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-sage-500/20 flex items-center justify-center text-sage-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white/80 font-display font-black text-sm uppercase tracking-wider">Enterprise Security</p>
                  <p className="text-white/20 text-[10px] font-body uppercase tracking-widest">End-to-end encryption</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-frost-400 font-display font-black text-xl tabular-nums">1.2s</p>
                <p className="text-white/20 text-[10px] font-body uppercase tracking-widest text-right">Avg Response Time</p>
              </div>
            </motion.div>
          </div>
        </main>

        <footer className="py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sage-500 shadow-[0_0_10px_rgba(77,255,122,0.5)]" />
            <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-white/20">Operational — No latency issues detected</span>
          </div>
          <p className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-white/20">
            © 2026 FORGE STUDIO. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    </div>
  )
}
