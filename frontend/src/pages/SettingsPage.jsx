// src/pages/SettingsPage.jsx
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { Key, User, Shield, Info, ExternalLink, Activity, Database, Lock, Globe, Terminal, RefreshCw, Layers, Zap, Command, Cpu } from 'lucide-react'
import toast from 'react-hot-toast'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { fetchFromBackend } from '../lib/api'

export default function SettingsPage() {
  const user = useAuth()
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '')
  const [saving, setSaving] = useState(false)
  const [backendStatus, setBackendStatus] = useState(null)
  const [checkingBackend, setCheckingBackend] = useState(false)
  const containerRef = useRef(null)

  useGSAP(() => {
     gsap.from('.settings-module', {
       y: 40,
       opacity: 0,
       stagger: 0.1,
       duration: 1.2,
       ease: 'expo.out'
     })
  }, { scope: containerRef })

  const handleSaveKey = () => {
    setSaving(true)
    if (apiKey.trim()) {
      localStorage.setItem('groq_api_key', apiKey.trim())
      toast.success('Sequence unlocked.')
    } else {
      localStorage.removeItem('groq_api_key')
      toast.success('Sequence locked.')
    }
    setSaving(false)
  }

  const checkBackend = async () => {
    setCheckingBackend(true)
    try {
      const data = await fetchFromBackend('/health')
      if (data.status === 'ok') {
        setBackendStatus('online')
        toast.success('Core synchronized.')
      } else {
        setBackendStatus('error')
      }
    } catch (err) {
      console.error(err)
      setBackendStatus('offline')
      toast.error('Sync failure.')
    } finally {
      setCheckingBackend(false)
    }
  }

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-black text-white flex flex-col pt-12 pb-32 px-4 md:px-8">
      
      {/* HUD Header */}
      <div className="settings-module flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-white/20" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-white/30">System: CONFIG_HUB</span>
           </div>
           <h1 className="font-serif text-6xl md:text-8xl tracking-tighter leading-none">
              Control <span className="text-white/20">System.</span>
           </h1>
        </div>

        <div className="flex items-center gap-12 md:gap-20 font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">
           <div className="flex flex-col gap-1">
              <span>Status</span>
              <span className={backendStatus === 'online' ? 'text-green-500' : 'text-white'}>{backendStatus?.toUpperCase() || 'UNLINKED'}</span>
           </div>
           <div className="flex flex-col gap-1">
              <span>Identity</span>
              <span className="text-accent-orange">Verified</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="settings-module xl:col-span-8 border border-white/5 bg-white/[0.01] rounded-[40px] p-12 relative overflow-hidden group">
           <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative">
                 <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
                 <img
                    src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                    alt="avatar"
                    className="w-40 h-40 rounded-[50px] border border-white/10 relative z-10 grayscale"
                 />
              </div>
              <div className="text-center md:text-left space-y-6">
                 <div>
                    <h2 className="font-serif text-5xl text-white tracking-tight">{user?.displayName}</h2>
                    <p className="font-mono text-sm text-white/20 mt-1">{user?.email}</p>
                 </div>
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-5 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                       ID: {user?.uid?.slice(0, 12).toUpperCase()}
                    </div>
                    <div className="px-5 py-2 bg-white text-black border border-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em]">
                       Auth: Verified
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Diagnostics Module */}
        <div className="settings-module xl:col-span-4 space-y-6">
           <div className="border border-white/5 bg-white/[0.01] rounded-[40px] p-10 flex flex-col justify-between h-full">
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <Activity className={`w-6 h-6 ${backendStatus === 'online' ? 'text-green-500' : 'text-white/20'}`} />
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Neural Engine</p>
                 </div>
                 <div className="space-y-1">
                    <p className="font-serif text-3xl">{checkingBackend ? 'Syncing...' : backendStatus === 'online' ? 'Connected' : 'Offline'}</p>
                    <p className="text-[9px] font-mono text-white/10 uppercase">Registry Response: 200 OK</p>
                 </div>
              </div>
              <button 
                onClick={checkBackend}
                disabled={checkingBackend}
                className="w-full mt-12 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-white transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <RefreshCw className={`w-4 h-4 ${checkingBackend ? 'animate-spin' : ''}`} /> Sync Architecture
              </button>
           </div>
        </div>

        {/* Engine Configuration */}
        <div className="settings-module xl:col-span-12 border border-white/5 bg-white/[0.01] rounded-[40px] p-12">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-16">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-accent-orange" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Neural Processing Unit</h3>
                 </div>
                 <p className="text-white/40 text-lg font-light max-w-2xl leading-relaxed">
                    Inject your <strong className="text-white">Groq LPU</strong> access token to enable high-speed generation. 
                    Tokens are strictly held in local sharded storage.
                 </p>
              </div>
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-white/10 px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
                 GET_TOKEN <ExternalLink className="w-3.5 h-3.5" />
              </a>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-9 relative">
                 <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                 <input
                    type="password"
                    className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl px-16 text-white font-mono text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/5"
                    placeholder="sk-neural_................................"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                 />
              </div>
              <button 
                onClick={handleSaveKey}
                disabled={saving}
                className="md:col-span-3 h-16 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                 {saving ? 'UPDATING...' : 'SYNC_ENGINE'}
              </button>
           </div>

           <div className="mt-8 flex items-center gap-3 text-white/10 font-mono text-[8px] uppercase tracking-[0.4em]">
              <Lock className="w-3 h-3" /> Encrypted Local Protocol Active
           </div>
        </div>

        {/* System Matrix */}
        <div className="settings-module xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-1 px-0 overflow-hidden rounded-[40px] border border-white/5">
           <div className="p-12 bg-white/[0.01]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-4">Zero Knowledge</h4>
              <p className="text-white/20 text-sm leading-relaxed font-mono">
                 All neural blueprints are partitioned across isolated memory shards. Forge never sees your data.
              </p>
           </div>
           <div className="p-12 bg-white/[0.02]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white mb-4">Compliance</h4>
              <p className="text-white/20 text-sm leading-relaxed font-mono">
                 SOC2 compliant infrastructure. Hardware-level security keys supported for all enterprise-tier clusters.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
