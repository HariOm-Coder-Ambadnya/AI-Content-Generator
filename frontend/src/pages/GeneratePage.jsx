// src/pages/GeneratePage.jsx
import { useState, useCallback, useRef } from 'react'
import { Sparkles, StopCircle, Wand2, Zap, Target, Layers, Cpu, Bookmark, Share2, CornerRightDown, Fingerprint, Activity, Box, Terminal, Database, Command } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { streamGenerateContent } from '../lib/groq'
import { saveGeneration } from '../lib/firestore'
import { useAuth } from '../hooks/useAuth'
import { CONTENT_TYPES } from '../components/ContentTypeCard'
import OutputPanel from '../components/OutputPanel'
import toast from 'react-hot-toast'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'witty', label: 'Witty' },
  { id: 'inspirational', label: 'Inspirational' },
]

const LENGTHS = [
  { id: 'short', label: 'Short', hint: '~200 words' },
  { id: 'medium', label: 'Medium', hint: '~500 words' },
  { id: 'long', label: 'Long', hint: '~1000 words' },
]

export default function GeneratePage() {
  const user = useAuth()
  const [contentType, setContentType] = useState('blog')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [audience, setAudience] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const abortControllerRef = useRef(null)
  const containerRef = useRef(null)

  useGSAP(() => {
    gsap.from('.reveal-item', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: 'expo.out'
    })
  }, { scope: containerRef })

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsGenerating(false)
      toast.error('Neural transmission interrupted.')
    }
  }

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error('Project briefing required.')
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
        length,
        audience,
        additionalContext,
        signal: controller.signal
      })

      for await (const chunk of generator) {
        setOutput(prev => prev + chunk)
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      toast.error(err.message || 'Quantum processing failed.')
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }, [contentType, topic, tone, length, audience, additionalContext])

  const handleSave = async () => {
    if (!output || !user) return
    setIsSaving(true)
    try {
      await saveGeneration(user.uid, {
        contentType,
        topic,
        tone,
        length,
        audience,
        output,
        wordCount: output.split(/\s+/).filter(Boolean).length,
      })
      toast.success('Archived to Cloud Memory')
    } catch (err) {
      toast.error('Vault synchronization failed.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-black text-white flex flex-col pt-24 lg:pt-12 pb-32 lg:pb-12 px-6 md:px-12 lg:pl-32">
      
      {/* HUD Header */}
      <div className="reveal-item flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-white/20" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-white/30">Node_ID: US-EAST-1</span>
           </div>
           <h1 className="font-serif text-4xl md:text-8xl tracking-tighter leading-none">
              Architect <span className="text-white/20">Content.</span>
           </h1>
        </div>

        <div className="flex items-center gap-12 md:gap-20 font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">
           <div className="flex flex-col gap-1">
              <span>Status</span>
              <span className="text-white">Online</span>
           </div>
           <div className="flex flex-col gap-1">
              <span>Latency</span>
              <span className="text-white">12ms</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* SIDEBAR CONFIG (3 cols) */}
        <aside className="xl:col-span-3 space-y-12 reveal-item">
           
           {/* Archetype */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 text-white/20">
                 <Terminal className="w-3.5 h-3.5" />
                 <h2 className="font-mono text-[9px] font-black uppercase tracking-[0.5em]">Archetype</h2>
              </div>
              <div className="flex flex-col gap-2">
                 {CONTENT_TYPES.map(type => (
                    <button
                       key={type.id}
                       onClick={() => setContentType(type.id)}
                       className={`w-full text-left px-5 py-4 rounded-xl font-mono text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                          contentType === type.id 
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                       }`}
                    >
                       {type.label}
                    </button>
                 ))}
              </div>
           </section>

           {/* Tone */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 text-white/20">
                 <Target className="w-3.5 h-3.5" />
                 <h2 className="font-mono text-[9px] font-black uppercase tracking-[0.5em]">Tone_Logic</h2>
              </div>
              <div className="flex flex-col gap-2">
                 {TONES.map(t => (
                    <button
                       key={t.id}
                       onClick={() => setTone(t.id)}
                       className={`w-full text-left px-5 py-4 rounded-xl font-mono text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                          tone === t.id 
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                       }`}
                    >
                       {t.label}
                    </button>
                 ))}
              </div>
           </section>

           {/* Length */}
           <section className="space-y-6">
              <div className="flex items-center gap-3 text-white/20">
                 <Layers className="w-3.5 h-3.5" />
                 <h2 className="font-mono text-[9px] font-black uppercase tracking-[0.5em]">Span_Module</h2>
              </div>
              <div className="flex flex-col gap-2">
                 {LENGTHS.map(l => (
                    <button
                       key={l.id}
                       onClick={() => setLength(l.id)}
                       className={`w-full text-left px-5 py-4 rounded-xl font-mono text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${
                          length === l.id 
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                       }`}
                    >
                       {l.label}
                    </button>
                 ))}
              </div>
           </section>

        </aside>

        {/* MAIN WORKSPACE (9 cols) */}
        <main className="xl:col-span-9 space-y-12">
            
            {/* Briefing Area */}
            <section className="reveal-item space-y-6">
               <div className="flex items-center gap-3 text-white/20">
                  <Database className="w-3.5 h-3.5" />
                  <h2 className="font-mono text-[9px] font-black uppercase tracking-[0.5em]">System_Briefing</h2>
               </div>
               <div className="relative">
                  <textarea
                    className="w-full min-h-[240px] bg-white/[0.03] border border-white/5 rounded-[40px] p-10 text-2xl font-light text-white focus:outline-none focus:border-white/10 transition-all placeholder:text-white/5"
                    placeholder="Input protocol parameters..."
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                  />
                  <div className="absolute bottom-10 right-12 flex items-center gap-4">
                     {isGenerating ? (
                        <button onClick={handleStop} className="flex items-center gap-3 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-red-500 bg-red-500/5 px-6 py-3 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition-all">
                           <StopCircle className="w-4 h-4" /> Abort_Sequence
                        </button>
                     ) : (
                        <button 
                           onClick={handleGenerate}
                           disabled={!topic.trim()}
                           className="flex items-center gap-3 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-black bg-white px-10 py-5 rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] disabled:opacity-20"
                        >
                           <Zap className="w-4 h-4" /> Forge_Sequence
                        </button>
                     )}
                  </div>
               </div>
            </section>

            {/* Output Panel / Generated Content */}
            <section className="reveal-item space-y-8 min-h-[500px]">
               <div className="flex items-center gap-3 text-white/20">
                  <Command className="w-3.5 h-3.5" />
                  <h2 className="font-mono text-[9px] font-black uppercase tracking-[0.5em]">Output_Buffer</h2>
               </div>
               
               <AnimatePresence mode="wait">
                  {output || isGenerating ? (
                     <motion.div
                        key="output"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                     >
                        <OutputPanel
                           content={output}
                           isStreaming={isGenerating}
                           onRegenerate={handleGenerate}
                           onSave={handleSave}
                           isSaving={isSaving}
                        />
                        
                        {/* Technical Meta Footer */}
                        <div className="mt-8 flex justify-between items-center font-mono text-[8px] text-white/10 uppercase tracking-[0.4em] px-8">
                           <div className="flex items-center gap-4">
                              <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
                              {isGenerating ? 'STREAMING_ENCODED_DATA' : 'STREAMS_STABLE'}
                           </div>
                           <div className="flex gap-12">
                              <span>CHKSUM: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                              <span>TYPE: {contentType.toUpperCase()}</span>
                           </div>
                        </div>
                     </motion.div>
                  ) : (
                     <div key="placeholder" className="w-full h-96 flex flex-col items-center justify-center border border-white/5 rounded-[48px] bg-white/[0.01]">
                        <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center mb-8 opacity-20">
                           <Wand2 className="w-6 h-6" />
                        </div>
                        <p className="font-mono text-[9px] font-black uppercase tracking-[0.6em] text-white/10">Awaiting_Neural_Ping</p>
                     </div>
                  )}
               </AnimatePresence>
            </section>

        </main>
      </div>
    </div>
  )
}
