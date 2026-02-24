// src/pages/SettingsPage.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Key, User, Shield, Info, ExternalLink, Activity, Database } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const user = useAuth()
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '')
  const [saving, setSaving] = useState(false)

  const handleSaveKey = () => {
    setSaving(true)
    if (apiKey.trim()) {
      localStorage.setItem('groq_api_key', apiKey.trim())
      toast.success('API key saved locally!')
    } else {
      localStorage.removeItem('groq_api_key')
      toast.success('API key cleared')
    }
    setSaving(false)
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto space-y-10 pb-20">
        <header className="mb-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-4xl font-bold tracking-tight mb-2"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 font-body text-sm"
          >
            Configure your workspace and AI preferences.
          </motion.p>
        </header>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 relative overflow-hidden group border-white/5"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <User className="w-24 h-24" />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <User className="w-4 h-4 text-white/40" />
            </div>
            <h2 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-white/40">Profile</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 px-2">
            <div className="relative">
              <img
                src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                alt="avatar"
                className="w-24 h-24 rounded-[32px] ring-4 ring-white/5 object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-sage-500 w-6 h-6 rounded-full border-4 border-ink-950" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-display font-bold text-2xl mb-1">{user?.displayName}</p>
              <p className="text-white/40 text-sm font-body mb-3 font-medium">{user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase font-bold tracking-widest text-white/30 border border-white/5">
                  UID: {user?.uid?.slice(0, 10)}…
                </span>
                <span className="px-3 py-1 bg-frost-500/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-frost-400 border border-frost-500/20">
                  Standard Tier
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8 border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Key className="w-4 h-4 text-white/40" />
              </div>
              <h2 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-white/40">Groq API Key</h2>
            </div>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-frost-400 hover:text-frost-300 transition-colors"
            >
              Get Key <ExternalLink className="w-3 h-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="space-y-6">
            <div className="bg-frost-500/5 p-4 rounded-2xl border border-frost-500/10 flex gap-4">
              <Info className="w-5 h-5 text-frost-400 shrink-0 mt-0.5" />
              <p className="text-frost-100/60 text-xs leading-relaxed font-body">
                Your key is stored <strong>locally only</strong>. It is never transmitted to our backend or any third party other than Groq.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                className="input-field flex-1 bg-ink-950/50 border-white/5 focus:bg-ink-950 text-base"
                placeholder="gsk_…"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <button
                onClick={handleSaveKey}
                disabled={saving}
                className="btn-primary py-3 px-8 shadow-lg shadow-ember-500/20 active:scale-95 disabled:opacity-50 transition-all font-display uppercase tracking-widest text-xs font-bold"
              >
                {saving ? 'Saving…' : 'Update Key'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats (Mock) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-3xl p-6 border-white/5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-sage-500/10 flex items-center justify-center text-sage-400 border border-sage-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-0.5">Stability</p>
              <p className="text-white font-display font-bold text-lg leading-none">99.9% UP</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-3xl p-6 border-white/5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-frost-500/10 flex items-center justify-center text-frost-400 border border-frost-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-0.5">Persistence</p>
              <p className="text-white font-display font-bold text-lg leading-none">Local/Cloud</p>
            </div>
          </motion.div>
        </div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-3xl p-8 border-white/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white/40" />
            </div>
            <h2 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-white/40">Infrastructure</h2>
          </div>
          <p className="text-white/40 text-sm font-body leading-relaxed pr-8">
            Forge utilizes <strong className="text-white/70">Google OAuth2</strong> for identity verification and <strong className="text-white/70">Firestore</strong> for real-time data persistence. Your generation history is encrypted and isolated to your account.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
