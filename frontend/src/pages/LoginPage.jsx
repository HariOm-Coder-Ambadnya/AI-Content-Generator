import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signInWithGoogle } from '../lib/firebase'
import { ArrowRight, Globe, TrendingUp, Cpu, Rocket } from 'lucide-react'
import Logo from '../components/Logo'
import { GridScan } from '../components/GridScan'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [isEntryStarted, setIsEntryStarted] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Login Error:', err)
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-primary text-white overflow-hidden selection:bg-accent selection:text-black">
      
      {/* Background Architecture */}
      <div className="absolute inset-0 z-0">
        <GridScan 
          scanColor="#22C55E"
          linesColor="#1F2937"
          gridScale={0.15}
          scanOpacity={0.6}
          scanDuration={3}
          bloomIntensity={0.8}
        />
      </div>
      <div className="noise-bg opacity-[0.05] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        {!isEntryStarted ? (
          <motion.div 
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(50px)' }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-primary/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="space-y-16 text-center"
            >
              <div className="flex flex-col items-center gap-6">
                <Logo className="scale-[3.5] text-accent" />
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/40 mt-12">System_Initialization_Protocol</p>
              </div>

              <button 
                onClick={() => setIsEntryStarted(true)}
                className="group relative px-12 py-5 bg-transparent border border-accent overflow-hidden transition-all hover:bg-accent active:scale-95"
              >
                <div className="absolute inset-0 bg-accent/10 translate-y-full transition-transform group-hover:translate-y-0" />
                <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.4em] text-accent group-hover:text-black">
                  Access Growth Engine
                </span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 w-full min-h-screen flex flex-col"
          >
            {/* Minimal Top Nav */}
            <nav className="px-8 md:px-16 py-10 flex justify-between items-center relative z-20">
              <Logo className="text-accent" />
              <div className="flex items-center gap-12">
                 <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                    <span className="hover:text-accent transition-colors cursor-pointer">Intelligence</span>
                    <span className="hover:text-accent transition-colors cursor-pointer">Protocols</span>
                 </div>
                 <button 
                   onClick={handleLogin}
                   className="text-[10px] font-black uppercase tracking-[0.4em] px-8 py-4 border border-accent/20 bg-surface/50 backdrop-blur-xl rounded-full hover:bg-accent hover:text-black hover:border-accent transition-all"
                 >
                   {loading ? 'Powering Up' : 'Join the Collective'}
                 </button>
              </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center px-8 text-center sm:pb-20">
              
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-16 max-w-6xl"
              >
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent opacity-60">Architecting Modern Influence</span>
                  <h1 className="text-[clamp(3.5rem,14vw,10rem)] font-extrabold leading-[0.85] tracking-tighter text-white">
                    Create <span className="italic text-accent">Faster.</span> <br />
                    Grow <span className="text-accent">Smarter.</span>
                  </h1>
                </div>

                <div className="space-y-8 max-w-2xl mx-auto">
                   <p className="text-sm md:text-lg text-[#8B949E] font-medium leading-[1.6] opacity-80 uppercase tracking-[0.1em]">
                      The definitive toolkit for high-velocity content <br /> and algorithmic scale.
                   </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6">
                  <button 
                    onClick={handleLogin}
                    className="w-full sm:w-auto px-12 py-6 bg-accent text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] flex items-center justify-center gap-6 group"
                  >
                    {loading ? 'Syncing...' : 'Initiate Sequence'}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </button>
                  <button className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-opacity">
                    View Network Stats
                  </button>
                </div>
              </motion.div>
            </main>

            {/* Sub-Footer Architecture */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
            
            <footer className="px-8 md:px-16 py-12 flex flex-col sm:flex-row justify-between items-center gap-8 relative z-20 border-t border-white/5 bg-[#0D1117]/40 backdrop-blur-md">
               <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                  <span className="flex items-center gap-3"><TrendingUp className="w-3.5 h-3.5" /> High-Density Scale</span>
                  <span className="flex items-center gap-3"><Rocket className="w-3.5 h-3.5" /> Neural Synthesis</span>
                  <span className="flex items-center gap-3"><Cpu className="w-3.5 h-3.5" /> Core Engine v2</span>
               </div>
               <div className="flex items-center gap-6 opacity-30">
                  <div className="w-8 h-[1px] bg-white" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">FORGE // PROTOCOL // 2026</p>
               </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}





