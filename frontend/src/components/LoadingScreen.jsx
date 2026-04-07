// src/components/LoadingScreen.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Network, Shield, Zap, Database, Activity, Command, Terminal, Layers } from 'lucide-react'

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
    const duration = 2400 
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
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div className="noise-bg opacity-10" />
      
      <div className="relative z-10 w-full max-w-sm space-y-12">
        
        {/* Core Icon Cluster */}
        <div className="flex flex-col items-center gap-6">
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden"
           >
              <Zap className="w-10 h-10 text-white fill-white" />
              
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border border-dashed border-white/20 rounded-2xl"
              />
           </motion.div>
           
           <div className="text-center space-y-2">
              <h2 className="font-mono text-[8px] font-black uppercase tracking-[0.5em] text-white/20">
                FORGE OS // V3_STABLE
              </h2>
              <div className="h-6 flex items-center justify-center">
                 <AnimatePresence mode="wait">
                   <motion.p
                     key={phaseIndex}
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -5 }}
                     className="text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-white"
                   >
                     {LOADING_PHASES[phaseIndex].text}
                   </motion.p>
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Technical Progress Bar */}
        <div className="space-y-4">
           <div className="relative h-[1px] w-full bg-white/5 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                style={{ width: `${progress}%` }}
              />
           </div>

           <div className="flex justify-between items-center text-[7px] font-mono font-black uppercase tracking-[0.4em] text-white/10">
              <span className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                 UPTIME_STABLE_V3
              </span>
              <span className="text-white/40 tabular-nums">{Math.round(progress)}%_SYNCED</span>
           </div>
        </div>
      </div>

      {/* Background Stats HUD */}
      <div className="absolute bottom-12 inset-x-12 flex justify-between items-end opacity-10 font-mono text-[7px] text-white pointer-events-none uppercase tracking-widest leading-relaxed">
         <div className="space-y-1">
            <p>LATENCY // 0.00MS</p>
            <p>THROUGHPUT // 4.5GB/S</p>
            <p>SHARD // ALPHA_9</p>
         </div>
         <div className="text-right space-y-1">
            <p>REGION // US_EAST_1</p>
            <p>ENCRYPTION // AES_256</p>
            <p>LICENSE // VERIFIED_UID</p>
         </div>
      </div>
    </motion.div>
  )
}
