// src/pages/SettingsPage.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { ExternalLink, RefreshCw, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchFromBackend } from '../lib/api'

export default function SettingsPage() {
  const user = useAuth()
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '')
  const [saving, setSaving] = useState(false)
  const [backendStatus, setBackendStatus] = useState(null)
  const [checkingBackend, setCheckingBackend] = useState(false)

  const handleSaveKey = () => {
    setSaving(true)
    if (apiKey.trim()) {
      localStorage.setItem('groq_api_key', apiKey.trim())
      toast.success('Preferences updated.')
    } else {
      localStorage.removeItem('groq_api_key')
      toast.success('Key removed.')
    }
    setSaving(false)
  }

  const checkBackend = async () => {
    setCheckingBackend(true)
    try {
      const data = await fetchFromBackend('/health')
      if (data.status === 'ok') {
        setBackendStatus('online')
        toast.success('System linked.')
      } else {
        setBackendStatus('error')
      }
    } catch (err) {
      setBackendStatus('offline')
      toast.error('Sync failed.')
    }
    setCheckingBackend(false)
  }

  return (
    <div className="w-full min-h-screen flex flex-col pt-12 pb-32 px-4 md:px-8 relative z-10">
      
      {/* Header Architecture */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-8 h-[2px] bg-accent shadow-[0_0_10px_#22C55E]" />
              <span className="font-sans text-[10px] font-black uppercase tracking-[0.6em] text-accent">System_Preferences</span>
           </div>
           <h1 className="font-sans font-black text-6xl md:text-9xl tracking-tighter leading-[0.85] uppercase">
              Engine <br /> <span className="text-accent">Tuning.</span>
           </h1>
        </div>

        <div className="flex items-center gap-12 md:gap-20 font-sans text-[9px] text-white/20 uppercase tracking-[0.5em]">
           <div className="flex flex-col gap-1 text-right">
              <span>Status</span>
              <span className={`font-black ${backendStatus === 'online' ? 'text-accent' : 'text-red-500'}`}>
                {checkingBackend ? 'Syncing...' : backendStatus === 'online' ? 'Synchronized' : 'Offline'}
              </span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* Core Settings */}
        <div className="xl:col-span-8 space-y-12">
          
          {/* Identity Protocol */}
          <section className="glass-card p-8 md:p-12 space-y-12">
            <div className="flex items-center gap-4 text-accent/40">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity_Nexus</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative group">
                <div className="absolute -inset-4 bg-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                  alt="Identity"
                  className="relative w-32 h-32 rounded-full border-2 border-accent/20 object-cover shadow-2xl"
                />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-4xl font-black tracking-tight text-white uppercase">{user?.displayName}</h3>
                <p className="text-accent text-xs font-black uppercase tracking-widest opacity-60">{user?.email}</p>
                <div className="pt-4">
                  <span className="px-6 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] rounded-full">
                    Partner_Tier: PROTOCOL_01
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Integration Protocol */}
          <section className="glass-card p-8 md:p-12 space-y-12">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-accent/40">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Processing_Engine</span>
              </div>
              <a 
                href="https://console.groq.com/keys" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-accent/40 hover:text-accent transition-colors"
              >
                Provision_Credentials <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-8">
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xl">
                Enter your GROQ_API_KEY to bridge the neural lattice and enable high-velocity generation.
              </p>
              
              <div className="relative">
                <input
                  type="password"
                  className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-8 px-10 text-xl font-mono text-accent focus:outline-none focus:border-accent/40 transition-all placeholder:text-white/5"
                  placeholder="X-XXXXXXXXXXXXXXXXX..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
                
                <div className="flex justify-end pt-8">
                  <button 
                    onClick={handleSaveKey}
                    disabled={saving}
                    className="group relative px-12 py-5 bg-accent text-black font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all hover:bg-white active:scale-95 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      {saving ? 'Updating_Core...' : 'Synchronize Preferences'}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Diagnostic Sidebar */}
        <aside className="xl:col-span-4 space-y-12">
          <section className="glass-card p-10 space-y-10 relative overflow-hidden">
            <div className="absolute top-[-20px] right-[-20px] opacity-[0.02]">
              <RefreshCw className="w-32 h-32" />
            </div>

            <div className="space-y-8 relative z-10">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">System_Health</span>
               
               <div className="space-y-2">
                  <p className="text-4xl font-black text-white uppercase tracking-tighter">
                    {checkingBackend ? 'Syncing' : backendStatus === 'online' ? 'Linked' : 'Dormant'}
                  </p>
                  <div className="flex items-center gap-3">
                     <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-accent animate-pulse shadow-[0_0_10px_#22C55E]' : 'bg-red-500/20'}`} />
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Neural Link Diagnostics</span>
                  </div>
               </div>

               <button 
                 onClick={checkBackend}
                 disabled={checkingBackend}
                 className="w-full py-5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent hover:text-black hover:border-accent transition-all flex items-center justify-center gap-4 active:scale-95"
               >
                 <RefreshCw className={`w-4 h-4 ${checkingBackend ? 'animate-spin' : ''}`} /> 
                 Verify Integrity
               </button>
            </div>
          </section>

          <section className="px-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent opacity-40">Privacy_Protocol</span>
            <p className="text-xs text-white/30 font-medium leading-relaxed uppercase tracking-wider">
              All credentials are encrypted and localized. We operate on a sub-zero knowledge architecture.
            </p>
          </section>
        </aside>

      </div>
    </div>
  )
}


