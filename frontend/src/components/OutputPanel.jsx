// src/components/OutputPanel.jsx
import { useState } from 'react'
import { Copy, Check, Download, RotateCcw, Save, Eye, Code, Activity, Sparkles, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-xl md:text-2xl font-serif font-bold mt-10 mb-4 text-white uppercase tracking-wider">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-3xl md:text-4xl font-serif font-bold mt-12 mb-6 text-white leading-tight border-b border-white/5 pb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-5xl md:text-6xl font-serif font-black mt-16 mb-8 text-gradient leading-[0.9] tracking-tighter">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-accent-blue italic font-medium">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/5 text-accent-blue px-2 py-1 rounded font-mono text-sm border border-white/10">$1</code>')
    .replace(/```(\w*)\n([\s\S]+?)```/g, '<div class="my-10 rounded-[32px] overflow-hidden bg-[#060910]/80 border border-white/5 shadow-2xl backdrop-blur-3xl"><div class="bg-white/5 px-6 py-3 flex justify-between items-center text-[10px] uppercase font-black tracking-[0.3em] text-white/30 border-b border-white/5"><span>$1_MODULE</span></div><pre class="p-8 overflow-x-auto text-zinc-300 font-mono text-sm leading-relaxed"><code>$2</code></pre></div>')
    .replace(/^- (.+)$/gm, '<li class="ml-2 mb-4 flex items-start gap-4 text-text-dim text-lg leading-relaxed font-light"><span class="text-accent-blue mt-3 w-1.5 h-1.5 rounded-full shrink-0 bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]" /><span>$1</span></li>')
    .replace(/(<li.*<\/li>\n?)+/g, m => `<ul class="my-8 space-y-2">${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-2 mb-4 text-text-dim text-lg leading-relaxed font-light">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-accent-gold/30 pl-10 py-6 italic text-text-dim/80 my-10 bg-white/[0.02] rounded-r-[32px] font-serif text-2xl leading-relaxed">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="mb-8 text-text-dim/90 leading-relaxed text-xl font-light">')
    .replace(/^(?!<[a-z])(.+)$/gm, (m) => m.trim() ? m : '')
    .split('\n')
    .map(m => m.trim() && !m.startsWith('<') ? `<p class="mb-8 text-text-dim/90 leading-relaxed text-xl font-light">${m}</p>` : m)
    .join('')
}

export default function OutputPanel({ content, isStreaming, onRegenerate, onSave, isSaving }) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState('rendered')

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('DATA_COPIED')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forge-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('MODULE_EXPORTED')
  }

  if (!content && !isStreaming) return null

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.round(wordCount / 200))

  return (
    <div className="glass-panel rounded-[40px] overflow-hidden border border-white/10 shadow-3xl relative backdrop-blur-3xl group/panel min-h-[700px] flex flex-col">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-blue/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-gold/5 blur-[100px] pointer-events-none" />

      {/* Header Controller */}
      <div className="flex flex-col md:flex-row items-center justify-between px-10 py-8 border-b border-white/5 bg-white/[0.02] z-10">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
            {isStreaming ? (
              <Activity className="w-6 h-6 text-accent-blue animate-pulse" />
            ) : (
              <Sparkles className="w-6 h-6 text-accent-gold" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h3 className="font-serif text-2xl text-white block leading-tight mb-1">
              {isStreaming ? 'Neural Synthesis' : 'Forged Content'}
            </h3>
            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
              <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> {wordCount} words</span>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <span className="flex items-center gap-1.5"><RotateCcw className="w-3 h-3" /> {readTime} min read</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-xl">
            <button
              onClick={() => setView('rendered')}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                view === 'rendered' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'
              }`}
            >
              Vision
            </button>
            <button
              onClick={() => setView('raw')}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                view === 'raw' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'
              }`}
            >
              Binary
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white"
              title="Copy Sequence"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="btn-premium py-0 px-8 h-11 flex items-center gap-3 text-[10px] disabled:opacity-30"
            >
              {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Synchronizing...' : 'Commit to Vault'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Canvas */}
      <div className="p-12 md:p-16 flex-1 overflow-y-auto selection:bg-accent-blue/30 relative z-10 scrollbar-premium">
        <AnimatePresence mode="wait">
          {view === 'raw' || isStreaming ? (
            <motion.div
              key="raw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <pre className="font-mono text-lg text-text-dim/80 whitespace-pre-wrap leading-[1.8]">
                {content}
                {isStreaming && (
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-6 bg-accent-blue ml-2 shadow-[0_0_15px_rgba(59,130,246,1)]" 
                  />
                )}
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="rendered"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto cinematic-rendered"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Global Actions */}
      <div className="px-10 py-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between z-10">
         <div className="flex items-center gap-8">
            <button 
              onClick={onRegenerate}
              className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-accent-blue transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Re-Forge Sequence
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all"
            >
              <Download className="w-4 h-4" /> Export MD
            </button>
         </div>
         <div className="flex items-center gap-3">
            <Share2 className="w-4 h-4 text-white/10" />
            <span className="text-[8px] font-black text-white/10 tracking-[0.5em] uppercase">Security Level 4</span>
         </div>
      </div>
    </div>
  )
}

