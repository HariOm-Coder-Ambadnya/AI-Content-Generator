// src/components/OutputPanel.jsx
import { useState } from 'react'
import { Copy, Check, Download, RotateCcw, Save, Activity, Sparkles, Share2, FileText, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-4 text-accent uppercase tracking-wider">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-extrabold mt-10 mb-6 text-white leading-tight border-b-2 border-accent/20 pb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-5xl font-black mt-12 mb-8 text-white leading-[0.9] tracking-tighter">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic font-semibold text-gray">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-accent/5 text-accent px-2 py-1 rounded font-mono text-sm border border-accent/10">$1</code>')
    .replace(/```(\w*)\n([\s\S]+?)```/g, '<div class="my-8 rounded-2xl overflow-hidden border border-white/5 shadow-sm"><div class="bg-secondary px-6 py-2 text-[10px] uppercase font-bold tracking-widest text-gray border-b border-white/5 flex justify-between"><span>$1</span><span class="text-accent uppercase">Source Node</span></div><pre class="p-8 overflow-x-auto bg-primary text-gray font-mono text-sm leading-relaxed"><code>$2</code></pre></div>')
    .replace(/^- (.+)$/gm, '<li class="ml-2 mb-4 flex items-start gap-4 text-gray text-[17px] leading-relaxed font-medium"><span class="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 bg-accent" /><span>$1</span></li>')
    .replace(/(<li.*<\/li>\n?)+/g, m => `<ul class="my-8 space-y-2">${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-2 mb-4 text-gray text-[17px] leading-relaxed font-medium">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent pl-10 py-8 text-gray my-10 bg-accent/5 rounded-r-2xl text-xl leading-relaxed italic">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="mb-6 text-gray leading-relaxed text-[17px] font-medium">')
    .replace(/^(?!<[a-z])(.+)$/gm, (m) => m.trim() ? m : '')
    .split('\n')
    .map(m => m.trim() && !m.startsWith('<') ? `<p class="mb-6 text-gray leading-relaxed text-[17px] font-medium">${m}</p>` : m)
    .join('')
}

export default function OutputPanel({ content, isStreaming, onRegenerate, onSave, isSaving }) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState('rendered')

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forge-content-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported successfully')
  }

  if (!content && !isStreaming) return null

  const wordCount = content.split(/\s+/).filter(Boolean).length

  return (
    <div className="flex flex-col h-full bg-secondary/40 backdrop-blur-xl">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between px-10 py-6 border-b border-white/5 bg-secondary/80">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
             <FileText className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold leading-none mb-1 text-white">
              {isStreaming ? 'Synthesis Active' : 'Final Draft'}
            </h3>
            <div className="flex items-center gap-3">
               <span className="pill-badge bg-accent/10 text-accent border-accent/20 py-0.5 px-3">
                 {wordCount} words
               </span>
               {isStreaming && (
                 <motion.span 
                   animate={{ opacity: [0.3, 1, 0.3] }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                   className="text-[10px] font-black uppercase tracking-widest text-accent"
                 >
                   Realtime Flow...
                 </motion.span>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex bg-primary p-1 rounded-xl border border-white/5 shadow-inner">
            <button
              onClick={() => setView('rendered')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                view === 'rendered' ? 'bg-white text-primary shadow-sm' : 'text-gray opacity-40 hover:opacity-60'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setView('raw')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                view === 'raw' ? 'bg-white text-primary shadow-sm' : 'text-gray opacity-40 hover:opacity-60'
              }`}
            >
              Raw Node
            </button>
          </div>

          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileActive={{ scale: 0.9 }}
              onClick={handleCopy}
              className="w-10 h-10 rounded-xl bg-primary border border-white/5 flex items-center justify-center text-gray hover:text-accent transition-colors shadow-sm"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
            </motion.button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-accent text-black font-black text-[10px] uppercase tracking-widest transition-all hover:bg-white active:scale-95 disabled:opacity-30 disabled:grayscale"
            >
              {isSaving ? 'Archiving...' : 'Save to Cloud'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-10 md:p-16 flex-1 overflow-y-auto custom-scrollbar bg-primary/30">
        <AnimatePresence mode="wait">
          {view === 'raw' || isStreaming ? (
            <motion.div
              key="raw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <pre className="font-mono text-lg text-gray whitespace-pre-wrap leading-[1.8] bg-secondary/30 p-8 rounded-3xl border border-white/5">
                {content}
                {isStreaming && (
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2.5 h-6 bg-accent ml-2 align-middle rounded-sm shadow-lg shadow-accent/40" 
                  />
                )}
              </pre>
            </motion.div>
          ) : (
            <motion.div
              key="rendered"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              className="max-w-4xl mx-auto text-white"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Actions */}
      <footer className="px-10 py-6 border-t border-white/5 flex justify-between items-center bg-secondary/40 backdrop-blur-md">
         <div className="flex items-center gap-10">
            <button 
              onClick={onRegenerate}
              className="flex items-center gap-3 text-xs font-bold text-gray hover:text-accent transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                <RotateCcw className="w-4 h-4 text-accent" />
              </div>
              New Iteration
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-3 text-xs font-bold text-gray hover:text-accent transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-4 h-4 text-accent" />
              </div>
              Offline Export
            </button>
         </div>
         <div className="flex items-center gap-6 opacity-40">
            <div className="flex -space-x-3">
               {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-secondary overflow-hidden shadow-sm">
                     <img src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${i+10}`} alt="avatar" />
                  </div>
               ))}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">+12 viewing</span>
         </div>
      </footer>
    </div>
  )
}



