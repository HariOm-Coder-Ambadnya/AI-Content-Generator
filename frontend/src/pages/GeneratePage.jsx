// src/pages/GeneratePage.jsx
import { useState, useCallback, useRef } from 'react'
import { Sparkles, ChevronDown, ChevronUp, StopCircle, Wand2, ArrowRight, Zap, Target, AlignLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { streamGenerateContent } from '../lib/groq'
import { saveGeneration } from '../lib/firestore'
import { useAuth } from '../hooks/useAuth'
import ContentTypeCard, { CONTENT_TYPES } from '../components/ContentTypeCard'
import OutputPanel from '../components/OutputPanel'
import toast from 'react-hot-toast'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const TONES = [
  { id: 'professional', label: 'Professional', emoji: '👔' },
  { id: 'casual', label: 'Casual', emoji: '😊' },
  { id: 'witty', label: 'Witty', emoji: '😏' },
  { id: 'inspirational', label: 'Inspirational', emoji: '🔥' },
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
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const abortControllerRef = useRef(null)
  const containerRef = useRef(null)

  useGSAP(() => {
    gsap.from('.reveal-item', {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    })
  }, { scope: containerRef })

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsGenerating(false)
      toast.error('Generation stopped.')
    }
  }

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic or brief.')
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
      toast.error(err.message || 'Generation failed.')
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
      toast.success('Saved to history!')
    } catch (err) {
      toast.error('Failed to save.')
    } finally {
      setIsSaving(false)
    }
  }

  const selectedType = CONTENT_TYPES.find(t => t.id === contentType)

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto w-full space-y-12 pb-32">
      {/* Header Section */}
      <div className="reveal-item space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
           <Zap className="w-3 h-3 text-accent" />
           <span>FORGE GENERATOR v2.0</span>
        </div>
        <h1 className="font-display text-5xl font-bold tracking-tight text-foreground">
          What are we <span className="text-accent underline decoration-accent/10">creating</span> today?
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Select a format, provide a few details, and watch our AI forge high-performance content for your brand.
        </p>
      </div>

      {/* Grid: Type & Input */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
        <div className="space-y-10">
          {/* Format Selection */}
          <div className="reveal-item space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" /> 1. CHOOSE FORMAT
              </label>
              <span className="text-[10px] text-muted-foreground/50">Pick a specialized AI engine</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CONTENT_TYPES.map(type => (
                <ContentTypeCard
                  key={type.id}
                  type={type}
                  selected={contentType === type.id}
                  onSelect={setContentType}
                />
              ))}
            </div>
          </div>

          {/* Prompt Area */}
          <div className="reveal-item space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlignLeft className="w-4 h-4" /> 2. PROVIDE CONTEXT
            </label>
            <div className="relative group">
              <textarea
                className="input-field min-h-[200px] bg-white text-lg p-8 shadow-md group-focus-within:shadow-xl transition-all leading-relaxed"
                placeholder={
                  contentType === 'blog' ? 'Enter the topic for your article...' :
                  contentType === 'social' ? 'What should the caption be about?' :
                  contentType === 'marketing' ? 'Describe the product or campaign...' :
                  'What technical document or code should we generate?'
                }
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleGenerate() }}
              />
              <div className="absolute bottom-6 right-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 pointer-events-none">
                ⌘ + ENTER TO FORGE
              </div>
            </div>
          </div>

          {/* Secondary Controls */}
          <div className="reveal-item grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Tone</label>
               <div className="grid grid-cols-2 gap-2">
                 {TONES.map(t => (
                   <button
                     key={t.id}
                     onClick={() => setTone(t.id)}
                     className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                       tone === t.id 
                       ? 'bg-black text-white border-black shadow-xl active:scale-[0.98]' 
                       : 'bg-white text-foreground border-border hover:bg-muted'
                     }`}
                   >
                     <span className="text-lg">{t.emoji}</span>
                     {t.label}
                   </button>
                 ))}
               </div>
             </div>
             
             <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Desired Length</label>
               <div className="flex flex-col gap-2">
                  {LENGTHS.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLength(l.id)}
                      className={`flex items-center justify-between px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
                        length === l.id 
                        ? 'bg-black text-white border-black shadow-xl active:scale-[0.98]' 
                        : 'bg-white text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      <span className="uppercase tracking-tighter text-xs font-bold">{l.label}</span>
                      <span className={`text-[10px] opacity-40`}>{l.hint}</span>
                    </button>
                  ))}
               </div>
             </div>
          </div>

          {/* Advanced Dropdown */}
          <div className="reveal-item pt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="group mx-auto flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-foreground transition-all"
            >
              <span>{showAdvanced ? 'Simplify Context' : 'Advanced Configuration'}</span>
              <div className="w-8 h-[1px] bg-border group-hover:w-16 transition-all" />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-muted/30 border border-border rounded-2xl">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target Audience</label>
                      <input
                        type="text"
                        className="input-field h-12 bg-white"
                        placeholder="e.g. Content Marketers, Developers..."
                        value={audience}
                        onChange={e => setAudience(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Additional Context</label>
                      <input
                        type="text"
                        className="input-field h-12 bg-white"
                        placeholder="e.g. Mention our new features..."
                        value={additionalContext}
                        onChange={e => setAdditionalContext(e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Generation Bar (Sticky) */}
      <div className="sticky bottom-10 z-[30] flex justify-center w-full reveal-item pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm">
          {isGenerating ? (
            <button
              onClick={handleStop}
              className="w-full flex items-center justify-center gap-3 py-5 rounded-full bg-red-50 text-red-600 border border-red-100 font-bold uppercase text-xs tracking-widest shadow-xl hover:bg-red-100 transition-all"
            >
              <StopCircle className="w-5 h-5 animate-pulse" />
              Abort Forging
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!topic.trim()}
              className="w-full group flex items-center justify-center gap-4 py-5 rounded-full bg-black text-white font-bold uppercase text-xs tracking-[0.2em] shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all disabled:opacity-20 disabled:grayscale"
            >
              <Sparkles className="w-5 h-5" />
              Forge Content
              <ArrowRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            </button>
          )}
        </div>
      </div>

      {/* Output Result */}
      <AnimatePresence>
        {(output || isGenerating) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="reveal-item"
          >
            <OutputPanel
              content={output}
              isStreaming={isGenerating && !output}
              onRegenerate={handleGenerate}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
