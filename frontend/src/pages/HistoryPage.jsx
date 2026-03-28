// src/pages/HistoryPage.jsx
import { useEffect, useState, useRef } from 'react'
import { Trash2, FileText, Clock, Search, Copy, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getUserGenerations, deleteGeneration } from '../lib/firestore'
import { useAuth } from '../hooks/useAuth'
import { CONTENT_TYPES } from '../components/ContentTypeCard'
import toast from 'react-hot-toast'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function HistoryPage() {
  const user = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')
  const containerRef = useRef(null)

  useEffect(() => {
    if (!user) return
    getUserGenerations(user.uid)
      .then(setItems)
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, [user])

  useGSAP(() => {
    if (!loading) {
      gsap.from('.history-item', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      })
    }
  }, { scope: containerRef, dependencies: [loading] })

  const handleDelete = async (id) => {
    try {
      await deleteGeneration(id)
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success('Deleted successfully')
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const filtered = items.filter(item => {
    const matchesSearch = item.topic?.toLowerCase().includes(search.toLowerCase()) ||
      item.output?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || item.contentType === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto w-full space-y-12">
      {/* Header */}
      <div className="history-item space-y-4">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          Your <span className="text-accent underline decoration-accent/10">History</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Access and manage your previously generated high-performance content.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="history-item flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            className="input-field pl-11 h-12 bg-white shadow-md group-focus-within:shadow-xl"
            placeholder="Search generations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['all', ...CONTENT_TYPES.map(t => t.id)].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border shrink-0 ${
                filter === f
                  ? 'bg-black text-white border-black shadow-xl'
                  : 'bg-white border-border text-muted-foreground hover:border-accent/30 hover:text-black'
              }`}
            >
              {f === 'all' ? 'All' : CONTENT_TYPES.find(t => t.id === f)?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-border rounded-2xl p-8 h-24 shimmer-loading opacity-40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-muted/20 border border-dashed border-border rounded-3xl">
            <div className="w-20 h-20 bg-white border border-border rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <Sparkles className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              {search ? 'No results found' : 'No history yet'}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {search ? 'Try adjusting your search terms or filters.' : 'Start forging content to see your history grow.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-12">
            <AnimatePresence mode='popLayout'>
              {filtered.map((item) => {
                const type = CONTENT_TYPES.find(t => t.id === item.contentType)
                const isExpanded = expanded === item.id
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 ${
                      isExpanded ? 'border-accent shadow-xl' : 'border-border shadow-md hover:border-accent/40'
                    }`}
                  >
                    <div
                      className="flex items-center gap-6 p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-colors ${
                        isExpanded ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {type?.emoji || <FileText className="w-6 h-6" />}
                      </div>

                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-border text-muted-foreground">
                              {type?.label || item.contentType}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-border text-muted-foreground">
                              {item.tone}
                            </span>
                         </div>
                         <h3 className="text-foreground font-bold text-lg truncate mb-1">{item.topic}</h3>
                         <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                               <Clock className="w-3.5 h-3.5" />
                               <span className="text-xs font-medium">{formatDate(item.createdAt)}</span>
                            </div>
                            <span className="text-xs text-muted-foreground/50 tabular-nums">{item.wordCount} words</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-2 pr-2">
                        <button
                          onClick={e => { e.stopPropagation(); handleCopy(item.output) }}
                          className="p-3 rounded-full text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all active:scale-90"
                          title="Copy Output"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(item.id) }}
                          className="p-3 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="mx-2 text-muted-foreground/30">
                           {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border bg-muted/10"
                        >
                          <div className="p-8 relative">
                             <div className="absolute top-4 right-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20">PREVIEW</div>
                            <pre className="font-mono text-sm text-foreground/60 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                              {item.output}
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
