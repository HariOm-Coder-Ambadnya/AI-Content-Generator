// src/pages/GeneratePage.jsx
import { useState, useCallback, useRef } from 'react'
import { Sparkles, ChevronDown, ChevronUp, StopCircle, Wand2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { streamGenerateContent } from '../lib/groq'
import { saveGeneration } from '../lib/firestore'
import { useAuth } from '../hooks/useAuth'
import ContentTypeCard, { CONTENT_TYPES } from '../components/ContentTypeCard'
import OutputPanel from '../components/OutputPanel'
import toast from 'react-hot-toast'

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

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

    // Create new abort controller for this request
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
        signal: controller.signal // Signal will be handled by fetch in groq.js (need to update groq.js)
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
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8 pb-20"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="relative">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Create Content
            </h1>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${selectedType?.bgClass} ${selectedType?.accentClass} border border-current`}>
              {selectedType?.emoji} {selectedType?.label}
            </div>
          </div>
          <p className="text-white/40 font-body text-lg max-w-2xl leading-relaxed">
            Harness the power of Llama 3.3 to generate high-quality {selectedType?.label.toLowerCase()} content in seconds.
          </p>
        </motion.div>

        {/* Content Type Grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-display font-bold uppercase tracking-widest text-white/30">
              Output Format
            </label>
            <span className="text-[10px] font-body text-white/20 italic">Choose what to generate</span>
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
        </motion.div>

        {/* Main Input */}
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="block text-xs font-display font-bold uppercase tracking-widest text-white/30">
            Topic & Briefing
          </label>
          <div className="relative group">
            <textarea
              className="input-field min-h-[160px] resize-none text-base bg-ink-900/40 border-white/5 focus:bg-ink-900 focus:border-white/10 transition-all font-body leading-relaxed p-6"
              placeholder={
                contentType === 'blog' ? 'What should the article be about? Mention specific points or keywords you want covered...' :
                  contentType === 'social' ? 'What are we promoting? What is the main message or offer for social media?' :
                    contentType === 'marketing' ? 'Describe the product or service and the primary goal of this copy (e.g., clicks, sales).' :
                      'What code should I write or document? Be specific about technologies and requirements.'
              }
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleGenerate() }}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="text-white/10 text-[10px] font-mono tracking-tighter">⌘+ENTER TO FORGE</span>
            </div>
          </div>
        </motion.div>

        {/* Tone & Length */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-xs font-display font-bold uppercase tracking-widest text-white/30 text-center md:text-left">
              Content Tone
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-display font-semibold transition-all duration-300 ${tone === t.id
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(255,77,0,0.1)]'
                    : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20 hover:text-white/70'
                    }`}
                >
                  <span className={`${tone === t.id ? 'scale-125' : ''} transition-transform`}>{t.emoji}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-display font-bold uppercase tracking-widest text-white/30 text-center md:text-left">
              Target Length
            </label>
            <div className="flex flex-col gap-3">
              {LENGTHS.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLength(l.id)}
                  className={`flex items-center justify-between px-5 py-3 rounded-2xl border text-sm font-body transition-all duration-300 ${length === l.id
                    ? 'bg-frost-500/10 border-frost-500/50 text-frost-400 shadow-[0_0_20px_rgba(77,159,255,0.1)]'
                    : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20 hover:text-white/70'
                    }`}
                >
                  <span className="font-bold tracking-tight uppercase text-xs">{l.label}</span>
                  <span className={`text-[10px] font-medium opacity-40`}>{l.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Advanced Options */}
        <motion.div variants={itemVariants} className="pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white/60 transition-colors mx-auto"
          >
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showAdvanced ? 'Hide' : 'Show'} Advanced configurations
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-widest text-white/30">Target Audience</label>
                    <input
                      type="text"
                      className="input-field bg-ink-950/50"
                      placeholder="e.g. SaaS founders, Gen Z, senior devs…"
                      value={audience}
                      onChange={e => setAudience(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-display font-bold uppercase tracking-widest text-white/30">Style Context</label>
                    <input
                      type="text"
                      className="input-field bg-ink-950/50"
                      placeholder="e.g. Minimalist, technical, high-energy…"
                      value={additionalContext}
                      onChange={e => setAdditionalContext(e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Generate Button container with shadow */}
        <motion.div
          variants={itemVariants}
          className="sticky bottom-8 z-20 pointer-events-none flex justify-center w-full"
        >
          <div className="pointer-events-auto w-full max-w-sm">
            {isGenerating ? (
              <button
                onClick={handleStop}
                className="w-full flex items-center justify-center gap-3 py-4 text-sm font-display font-bold uppercase tracking-widest rounded-3xl bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 transition-all shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
              >
                <StopCircle className="w-5 h-5 animate-pulse" />
                Stop Generation
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="group w-full flex items-center justify-center gap-3 py-4 text-sm font-display font-bold uppercase tracking-widest rounded-3xl bg-gradient-to-r from-ember-500 to-frost-500 text-white shadow-[0_10px_30px_rgba(255,77,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,77,0,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 transition-all cursor-pointer"
              >
                <Wand2 className="w-5 h-5" />
                Forge Content
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Output */}
        <AnimatePresence>
          {(output || isGenerating) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
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
      </motion.div>
    </div>
  )
}
