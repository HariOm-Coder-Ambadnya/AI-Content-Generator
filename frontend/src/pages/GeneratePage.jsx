// src/pages/GeneratePage.jsx
import { useState, useCallback, useRef } from 'react'
import { Plus, StopCircle, Terminal, ArrowRight, MousePointer2, Clock, BookOpen, Cpu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { streamGenerateContent } from '../lib/groq'
import { saveGeneration } from '../lib/firestore'
import { useAuth } from '../hooks/useAuth'
import { CONTENT_TYPES } from '../components/ContentTypeCard'
import OutputPanel from '../components/OutputPanel'
import toast from 'react-hot-toast'

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'witty', label: 'Witty' },
  { id: 'inspirational', label: 'Inspirational' },
]

export default function GeneratePage() {
  const user = useAuth()
  const [contentType, setContentType] = useState('blog')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const abortControllerRef = useRef(null)

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsGenerating(false)
      toast.error('Session interrupted.')
    }
  }

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error('Briefing required.')
      return
    }

    setIsGenerating(true)
    setOutput('')

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const generator = streamGenerateContent({
        type: contentType,
        topic,
        tone,
        length: 'medium',
        audience: '',
        additionalContext: '',
        signal: controller.signal
      })

      for await (const chunk of generator) {
        setOutput(prev => prev + chunk)
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      toast.error(err.message || 'Generation failed.')
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }, [contentType, topic, tone])

  const handleSave = async () => {
    if (!output || !user) return
    setIsSaving(true)
    try {
      await saveGeneration(user.uid, {
        contentType,
        topic,
        tone,
        length: 'medium',
        output,
        wordCount: output.split(/\s+/).filter(Boolean).length,
      })
      toast.success('Archived successfully')
    } catch (err) {
      toast.error('Archive failed.')
    } finally {
      setIsSaving(false)
    }
  }

  const wordCount = output.split(/\s+/).filter(Boolean).length
  const estReadingTime = Math.ceil(wordCount / 200)

  return (
    <div className="w-full min-h-screen flex flex-col pt-32 pb-20 px-6 md:px-12 lg:pl-[140px] relative">
      <div className="noise-bg" />
      <div className="grid-background opacity-[0.015]" />
      <div className="border-frame" />

      <header className="mb-24 space-y-4 relative z-10">
        <div className="flex items-center gap-4 opacity-40 mb-8">
           <Terminal className="w-4 h-4 text-accent" />
           <span className="text-[9px] font-sans font-black uppercase tracking-[0.5em] text-accent">Influence_Generation_Protocol // v2.1.0</span>
        </div>
        <h1 className="font-sans font-black text-6xl md:text-9xl tracking-tighter leading-none uppercase">
          Forge <span className="text-accent opacity-100">Content.</span>
        </h1>
        <p className="text-gray font-mono text-sm max-w-2xl opacity-40 uppercase tracking-widest mt-6">Synthesize high-velocity narratives for algorithmic dominance.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-0 relative z-10 border border-white/5 bg-secondary/30 backdrop-blur-3xl shadow-2xl overflow-hidden rounded-3xl">
        
        {/* Configuration Sidebar */}
        <aside className="xl:col-span-3 border-r border-white/5 p-12 space-y-16 bg-[#0D1117]/50">
           <section className="space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#22C55E]" />
                 <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-accent">Medium_Selection</h2>
              </div>
              <div className="flex flex-col gap-1">
                 {CONTENT_TYPES.map(type => (
                    <button
                       key={type.id}
                       onClick={() => setContentType(type.id)}
                       className={`group relative text-left py-4 transition-all duration-500 hover:pl-2 ${
                          contentType === type.id 
                          ? 'text-accent' 
                          : 'text-gray opacity-30 hover:opacity-100'
                       }`}
                    >
                       <span className="text-[11px] font-sans font-black uppercase tracking-[0.2em]">{type.label}</span>
                       {contentType === type.id && (
                          <motion.div layoutId="type-dot" className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_#22C55E]" />
                       )}
                    </button>
                 ))}
              </div>
           </section>

           <section className="space-y-10">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 border border-accent rounded-full" />
                 <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] opacity-40">Voice_Tone</h2>
              </div>
              <div className="flex flex-col gap-1">
                 {TONES.map(t => (
                    <button
                       key={t.id}
                       onClick={() => setTone(t.id)}
                       className={`group relative text-left py-4 transition-all duration-500 hover:pl-2 ${
                          tone === t.id 
                          ? 'text-accent' 
                          : 'text-gray opacity-30 hover:opacity-100'
                       }`}
                    >
                       <span className="text-[11px] font-sans font-black uppercase tracking-[0.2em]">{t.label}</span>
                       {tone === t.id && (
                          <motion.div layoutId="tone-dot" className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_#22C55E]" />
                       )}
                    </button>
                 ))}
              </div>
           </section>

           <section className="pt-12 border-t border-white/5 space-y-10">
              <div className="flex items-center gap-4">
                 <Cpu className="w-3.5 h-3.5 opacity-20" />
                 <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] opacity-40">Telemetry</h2>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center gap-4 opacity-20">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em]">{estReadingTime} MIN_READ</span>
                 </div>
                 <div className="flex items-center gap-4 opacity-20">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em]">{wordCount} UNIT_STREAM</span>
                 </div>
                 <div className="flex items-center gap-4 text-accent/40">
                    <MousePointer2 className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em]">LIVE_SYNAPSE</span>
                 </div>
              </div>
           </section>
        </aside>

        {/* Workspace Main */}
        <main className="xl:col-span-9 p-12 md:p-20 flex flex-col gap-32 bg-secondary/20">
            <section className="space-y-12">
               <div className="flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-accent opacity-30" />
                  <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.5em] text-accent opacity-60">Objective_Input</h2>
               </div>
               <div className="relative">
                  <textarea
                     className="w-full bg-transparent py-8 min-h-[150px] text-4xl md:text-6xl font-black tracking-tighter text-white focus:outline-none focus:text-accent transition-all resize-none placeholder:opacity-5 border-none"
                     placeholder="Define_The_Topic..."
                     value={topic}
                     onChange={e => setTopic(e.target.value)}
                     disabled={isGenerating}
                  />
                  <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-12">
                     <div className="flex items-center gap-10">
                        {isGenerating && (
                           <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-100" />
                              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-200" />
                           </div>
                        )}
                        <span className="text-[9px] font-sans font-black uppercase tracking-[0.4em] opacity-30">Secure_Neural_Link</span>
                     </div>

                     <div className="overflow-hidden">
                        {isGenerating ? (
                           <button 
                              onClick={handleStop}
                              className="px-10 py-5 bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-red-500 hover:text-white transition-all group rounded-xl"
                           >
                              Terminate 
                              <StopCircle className="w-4 h-4 animate-pulse" />
                           </button>
                        ) : (
                           <button 
                              onClick={handleGenerate}
                              disabled={!topic.trim() || isGenerating}
                              className="px-10 py-5 bg-accent text-black text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-4 disabled:opacity-5 hover:bg-white transition-all group rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                           >
                              Forge Influence 
                              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </section>

            <section className="min-h-[500px]">
               <AnimatePresence mode="wait">
                  {output || isGenerating ? (
                     <motion.div
                        key="output"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full p-8 md:p-16 bg-[#0D1117]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl"
                     >
                        <OutputPanel
                           content={output}
                           isStreaming={isGenerating}
                           onRegenerate={handleGenerate}
                           onSave={handleSave}
                           isSaving={isSaving}
                        />
                     </motion.div>
                  ) : (
                     <div key="placeholder" className="w-full h-96 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl opacity-20 transition-all hover:opacity-40 hover:bg-white/[0.02] group">
                        <Plus className="w-12 h-12 mb-8 stroke-[1px] transition-transform group-hover:rotate-90" />
                        <p className="text-[12px] font-sans font-black uppercase tracking-[1em]">Awaiting_Synthesis</p>
                     </div>
                  )}
               </AnimatePresence>
            </section>

        </main>
      </div>
    </div>
  )
}



