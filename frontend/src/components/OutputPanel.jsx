// src/components/OutputPanel.jsx
import { useState } from 'react'
import { Copy, Check, Download, RotateCcw, Save, Eye, Code, FileText, Share2, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

function renderMarkdown(text) {
  if (!text) return ''
  // Improved markdown-to-HTML converter
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-2 text-white/90">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3 text-white border-b border-white/5 pb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4 text-white">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-frost-400 italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-ink-700 text-ember-400 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>')
    .replace(/```(\w*)\n([\s\S]+?)```/g, '<div class="my-6 rounded-xl overflow-hidden bg-ink-950 border border-white/5"><div class="bg-white/5 px-4 py-1.5 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/20 border-b border-white/5"><span>$1</span></div><pre class="p-4 overflow-x-auto text-sage-400 font-mono text-sm leading-relaxed"><code>$2</code></pre></div>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2 flex items-start gap-2 text-white/70"><span class="text-ember-500 mt-1.5 w-1 h-1 rounded-full shrink-0" /><span>$1</span></li>')
    // Wrap lists
    .replace(/(<li.*<\/li>\n?)+/g, m => `<ul class="my-4 space-y-1">${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-2 list-decimal text-white/70">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-ember-500 pl-6 py-2 italic text-white/50 my-6 bg-white/[0.02] rounded-r-xl">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="mb-5 text-white/70 leading-relaxed text-base">')
    .replace(/^(?!<[a-z])(.+)$/gm, (m) => m.trim() ? m : '')
    .split('\n')
    .map(m => m.trim() && !m.startsWith('<') ? `<p class="mb-5 text-white/70 leading-relaxed text-base">${m}</p>` : m)
    .join('')
}

export default function OutputPanel({ content, isStreaming, onRegenerate, onSave, isSaving }) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState('rendered') // 'rendered' | 'raw'

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard!')
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
    toast.success('Downloaded successfully!')
  }

  if (!content && !isStreaming) return null

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.round(wordCount / 200))

  return (
    <div className="glass rounded-3xl overflow-hidden border-white/10 shadow-2xl relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-ember-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-frost-500/5 blur-[120px] pointer-events-none" />

      {/* Control Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b border-white/5 gap-4 relative z-10 bg-white/[0.01] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-ember-500 animate-ping absolute inset-0' : ''}`} />
            <div className={`w-3 h-3 rounded-full relative ${isStreaming ? 'bg-ember-400' : 'bg-sage-400 shadow-[0_0_10px_rgba(77,255,122,0.3)]'}`} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-tight text-white/90">
              {isStreaming ? 'Forging Content…' : 'Final Output'}
            </span>
            {!isStreaming && content && (
              <span className="text-[10px] font-display font-black uppercase tracking-[0.1em] text-white/20">
                {wordCount} words • {readTime} min read
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          {!isStreaming && (
            <div className="flex p-1 bg-ink-950/80 rounded-xl border border-white/5 mr-2">
              <button
                onClick={() => setView('rendered')}
                className={`p-1.5 rounded-lg transition-all ${view === 'rendered' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                title="Rendered View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('raw')}
                className={`p-1.5 rounded-lg transition-all ${view === 'raw' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                title="Raw Markdown"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Actions */}
          {!isStreaming && content && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onRegenerate}
                className="p-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
                title="Regenerate"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl text-white/30 hover:text-frost-400 hover:bg-frost-400/5 transition-all"
                title="Copy"
              >
                {copied ? <Check className="w-4 h-4 text-sage-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
                title="Download .md"
              >
                <Download className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-6 bg-white/5 mx-1" />
              <button
                onClick={onSave}
                disabled={isSaving}
                className="btn-primary py-2 px-5 text-xs font-display font-bold uppercase tracking-widest flex items-center gap-2 active:scale-95 disabled:grayscale"
              >
                {isSaving ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {isSaving ? 'Storing…' : 'Save History'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-8 pb-12 max-h-[70vh] overflow-y-auto custom-scrollbar bg-transparent relative z-10 selection:bg-ember-500/30">
        <AnimatePresence mode="wait">
          {view === 'raw' || isStreaming ? (
            <motion.div
              key="raw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <pre className={`font-mono text-sm text-white/60 whitespace-pre-wrap leading-[1.8] ${isStreaming ? 'typing-cursor' : ''}`}>
                {content}
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="rendered"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="content-prose prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator overlay at bottom */}
      {!isStreaming && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-ink-950/80 to-transparent pointer-events-none z-20" />
      )}
    </div>
  )
}
