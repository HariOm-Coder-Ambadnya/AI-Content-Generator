// src/pages/SettingsPage.jsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Key, User, Shield, Info, ExternalLink, Activity, Database, Lock, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function SettingsPage() {
  const user = useAuth()
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '')
  const [saving, setSaving] = useState(false)
  const containerRef = useRef(null)

  useGSAP(() => {
     gsap.from('.settings-card', {
       y: 20,
       opacity: 0,
       stagger: 0.1,
       duration: 0.8,
       ease: 'power3.out'
     })
  }, { scope: containerRef })

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
    <div ref={containerRef} className="max-w-4xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="settings-card space-y-4">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          Workspace <span className="text-accent underline decoration-accent/10">Settings</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Manage your account preferences, security settings, and AI engine configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card */}
        <div className="settings-card lg:col-span-2 bg-white rounded-3xl border border-border p-8 shadow-md space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <User className="w-32 h-32" />
          </div>
          
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-muted text-muted-foreground">
               <User className="w-4 h-4" />
             </div>
             <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Identity Profile</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <img
                src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                alt="avatar"
                className="w-24 h-24 rounded-3xl ring-4 ring-muted object-cover shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-display font-bold text-3xl text-foreground mb-1">{user?.displayName}</p>
              <p className="text-muted-foreground font-medium mb-4">{user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 bg-muted rounded-full text-[10px] uppercase font-black tracking-widest text-muted-foreground border border-border">
                  UID: {user?.uid?.slice(0, 8)}…
                </span>
                <span className="px-3 py-1 bg-accent/5 rounded-full text-[10px] uppercase font-black tracking-widest text-accent border border-accent/10">
                  V2 Pro Tier
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Stats */}
        <div className="settings-card space-y-4">
           <div className="bg-white border border-border rounded-2xl p-6 shadow-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/5 text-accent flex items-center justify-center">
                 <Activity className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stability</p>
                 <p className="font-display font-bold text-lg">99.99% UP</p>
              </div>
           </div>
           <div className="bg-white border border-border rounded-2xl p-6 shadow-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                 <Globe className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cloud Sync</p>
                 <p className="font-display font-bold text-lg">Active</p>
              </div>
           </div>
        </div>

        {/* API Key Section */}
        <div className="settings-card lg:col-span-3 bg-white rounded-3xl border border-border p-10 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                  <Key className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">LLM Engine Configuration</h2>
              </div>
              <p className="text-muted-foreground text-sm pt-2">Enter your Groq API key to power the high-speed generation engine.</p>
            </div>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-border hover:bg-muted transition-all"
            >
              Get Key <ExternalLink className="w-3 h-3 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 bg-accent/5 border border-accent/10 rounded-2xl text-accent">
               <Lock className="w-5 h-5 shrink-0 mt-0.5" />
               <p className="text-xs leading-relaxed font-medium">
                 Your key is stored <strong className="underline">locally</strong> in your browser's persistent storage. We never transmit or store your key on our servers.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="password"
                className="input-field flex-1 h-14 px-6 text-base"
                placeholder="sk-forge_................................"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <button
                onClick={handleSaveKey}
                disabled={saving}
                className="btn-primary h-14 px-12 text-xs uppercase tracking-[0.2em] shadow-xl"
              >
                {saving ? 'Updating...' : 'Update Key'}
              </button>
            </div>
          </div>
        </div>

        {/* Security & Infrastructure */}
        <div className="settings-card lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-muted/30 border border-border rounded-3xl">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-white shadow-sm text-foreground">
                   <Shield className="w-4 h-4" />
                 </div>
                 <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Infrastructure</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                Forge utilizes enterprise-grade <strong className="text-foreground">Google OAuth2</strong> for authentication and <strong className="text-foreground">AES-256</strong> equivalent local storage for API keys.
              </p>
           </div>
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-white shadow-sm text-foreground">
                   <Database className="w-4 h-4" />
                 </div>
                 <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Data Storage</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                Generations are stored in <strong className="text-foreground">isolated Firestore shards</strong>, ensuring your content is always private and accessible across all your devices.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
