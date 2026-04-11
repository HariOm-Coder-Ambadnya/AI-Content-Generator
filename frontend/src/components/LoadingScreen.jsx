import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Network, Shield, Zap, Database, Activity } from 'lucide-react'

const LOADING_PHASES = [
  { text: "INITIALIZING_SYSTEM_CORE_V3", icon: Cpu },
  { text: "CALIBRATING_NEURAL_SHARDING", icon: Network },
  { text: "SYNCHRONIZING_VAULT_LATENCY", icon: Database },
  { text: "ENCRYPTING_WORMHOLE_LINK", icon: Shield },
  { text: "ALLOCATING_SYNAPTIC_RESOURCES", icon: Activity },
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    const duration = 2800 
    const interval = 20
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        const next = Math.min(prev + increment, 100)
        const nextPhase = Math.floor((next / 100) * LOADING_PHASES.length)
        if (nextPhase < LOADING_PHASES.length) setPhaseIndex(nextPhase)
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(30px)' }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[1000] bg-[#0D1117] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div className="absolute inset-0 noise-bg opacity-[0.05] pointer-events-none" />
      
      {/* Dynamic Background Number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.h1 
            className="text-[30vw] font-black text-white/5 tabular-nums leading-none tracking-tighter"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {Math.round(progress)}
          </motion.h1>
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-16">
        
        {/* Core Icon Cluster */}
        <div className="flex flex-col items-center gap-8">
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-24 h-24 rounded-3xl bg-secondary/50 border border-white/5 flex items-center justify-center relative shadow-2xl"
           >
              <Zap className="w-12 h-12 text-white fill-white shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
              
              <motion.div 
                 animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                 transition={{ rotate: { duration: 4, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                 className="absolute -inset-4 border border-dashed border-accent/20 rounded-full"
              />
              <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                 className="absolute -inset-8 border border-dotted border-accent/10 rounded-full"
              />
           </motion.div>
           
           <div className="text-center space-y-4">
              <div className="flex flex-col items-center gap-1">
                <h2 className="font-mono text-[9px] font-black uppercase tracking-[0.6em] text-accent/60">
                  FORGE OS // V3_STABLE
                </h2>
                <div className="w-12 h-[1px] bg-accent/20" />
              </div>
              <div className="h-6 flex items-center justify-center">
                 <AnimatePresence mode="wait">
                   <motion.p
                     key={phaseIndex}
                     initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                     animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                     exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                     transition={{ duration: 0.4 }}
                     className="text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-white"
                   >
                     {LOADING_PHASES[phaseIndex].text}
                   </motion.p>
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Technical Progress Section */}
        <div className="space-y-6">
           <div className="relative h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-accent shadow-[0_0_15px_#22C55E]"
                style={{ width: `${progress}%` }}
              />
              <motion.div 
                 animate={{ x: ['-100%', '200%'] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
           </div>

           <div className="flex justify-between items-center text-[8px] font-mono font-black uppercase tracking-[0.5em]">
              <span className="flex items-center gap-3 text-white/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#22C55E]" />
                 UPTIME_STABLE_V3
              </span>
              <span className="text-accent tabular-nums flex items-center gap-2">
                {Math.round(progress)}% <span className="text-white/20">_SYNCED</span>
              </span>
           </div>
        </div>
      </div>

      {/* Cinematic HUD Elements */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-12 left-12 space-y-2 opacity-20">
            <div className="w-8 h-8 border-l border-t border-accent/40" />
            <span className="text-[7px] font-mono text-white tracking-[0.4em] uppercase">SYSTEM_NODE_01</span>
         </div>
         <div className="absolute top-12 right-12 flex flex-col items-end space-y-2 opacity-20">
            <div className="w-8 h-8 border-r border-t border-accent/40" />
            <span className="text-[7px] font-mono text-white tracking-[0.4em] uppercase">LINK_STATUS_STABLE</span>
         </div>
         <div className="absolute bottom-12 left-12 space-y-4 opacity-10 font-mono text-[7px] text-white tracking-[0.4em]">
            <p>CORE_TEMP // 32°C</p>
            <p>LATENCY // 0.24MS</p>
            <p>SHARD // ALPHA_09</p>
         </div>
         <div className="absolute bottom-12 right-12 text-right space-y-4 opacity-10 font-mono text-[7px] text-white tracking-[0.4em]">
            <p>MEMORY // 128.4GB_FREE</p>
            <p>NETWORK // ENCRYPTED_V6</p>
            <p>AUTH // VERIFIED_ROOT</p>
         </div>
      </div>
    </motion.div>
  )
}
