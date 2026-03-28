// src/components/OutputPanel.jsx
import { useState } from 'react'
import { Copy, Check, Download, RotateCcw, Save, Eye, Code, Activity, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-display font-bold mt-8 mb-3 text-foreground">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-display font-bold mt-10 mb-4 text-foreground border-b border-border pb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-display font-bold mt-12 mb-6 text-foreground">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-accent italic font-medium">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-muted text-foreground px-1.5 py-0.5 rounded font-mono text-sm border border-border/50">$1</code>')
    .replace(/```(\w*)\n([\s\S]+?)```/g, '<div class="my-8 rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 shadow-xl"><div class="bg-white/5 px-4 py-2 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/30 border-b border-white/5"><span>$1</span></div><pre class="p-6 overflow-x-auto text-zinc-100 font-mono text-sm leading-relaxed"><code>$2</code></pre></div>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-3 flex items-start gap-3 text-foreground/70"><span class="text-accent mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-accent" /><span>$1</span></li>')
    .replace(/(<li.*<\/li>\n?)+/g, m => `<ul class="my-6 space-y-1">${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-3 list-decimal text-foreground/70">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent/30 pl-8 py-4 italic text-muted-foreground my-8 bg-muted/50 rounded-r-2xl">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="mb-6 text-foreground/80 leading-relaxed text-lg">')
    .replace(/^(?!<[a-z])(.+)$/gm, (m) => m.trim() ? m : '')
    .split('\n')
    .map(m => m.trim() && !m.startsWith('<') ? `<p class="mb-6 text-foreground/80 leading-relaxed text-lg">${m}</p>` : m)
    .join('')
}

export default function OutputPanel({ content, isStreaming, onRegenerate, onSave, isSaving }) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState('rendered')

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
    <div className="bg-white rounded-3xl overflow-hidden border border-border shadow-xl relative">
      {/* Header Controller */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-5 border-b border-border bg-muted/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-border shadow-md flex items-center justify-center">
            {isStreaming ? (
              <Activity className="w-5 h-5 text-accent animate-pulse" />
            ) : (
              <Sparkles className="w-5 h-5 text-accent" />
            )}
          </div>
          <div>
            <span className="font-display font-bold text-lg text-foreground block leading-none mb-1">
              {isStreaming ? 'Forging Content…' : 'Final Output'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              {wordCount} words • {readTime} min read
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isStreaming && (
            <div className="flex p-1 bg-white rounded-xl border border-border shadow-sm">
              <button
                onClick={() => setView('rendered')}
                className={`p-2 rounded-lg transition-all ${view === 'rendered' ? 'bg-muted text-black' : 'text-muted-foreground hover:text-black'}`}
                title="Rendered View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('raw')}
                className={`p-2 rounded-lg transition-all ${view === 'raw' ? 'bg-muted text-black' : 'text-muted-foreground hover:text-black'}`}
                title="Raw Markdown"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>
          )}

          {!isStreaming && content && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl border border-border hover:bg-muted transition-all"
                title="Copy"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="btn-primary py-2.5 px-6 text-xs uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving…' : 'Save to History'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Canvas */}
      <div className="p-10 pb-16 max-h-[75vh] overflow-y-auto selection:bg-accent/10">
        <AnimatePresence mode="wait">
          {view === 'raw' || isStreaming ? (
            <motion.div
              key="raw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <pre className="font-mono text-base text-foreground/70 whitespace-pre-wrap leading-[1.8]">
                {content}
                {isStreaming && <span className="inline-block w-2 h-5 bg-accent animate-pulse ml-1" />}
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="rendered"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="prose-clean max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Floating Action Bar */}
      {!isStreaming && content && (
        <div className="absolute bottom-6 right-8 flex gap-2">
           <button 
             onClick={onRegenerate}
             className="p-3 rounded-full bg-white border border-border shadow-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
             title="Regenerate"
           >
             <RotateCcw className="w-5 h-5" />
           </button>
           <button 
             onClick={handleDownload}
             className="p-3 rounded-full bg-white border border-border shadow-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95"
             title="Download Markdown"
           >
             <Download className="w-5 h-5" />
           </button>
        </div>
      )}
    </div>
  )
}
