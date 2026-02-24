// src/pages/HistoryPage.jsx
import { useEffect, useState } from 'react'
import { Trash2, FileText, Clock, Search, Copy, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getUserGenerations, deleteGeneration } from '../lib/firestore'
import { useAuth } from '../hooks/useAuth'
import { CONTENT_TYPES } from '../components/ContentTypeCard'
import toast from 'react-hot-toast'

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

  useEffect(() => {
    if (!user) return
    getUserGenerations(user.uid)
      .then(setItems)
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (id) => {
    try {
      await deleteGeneration(id)
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success('Deleted')
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
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-4xl font-bold mb-2 tracking-tight"
          >
            History
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/40 font-body text-sm"
          >
            {items.length} saved generation{items.length !== 1 ? 's' : ''} • Manage and reuse your past content.
          </motion.p>
        </header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-ember-400 transition-colors" />
            <input
              type="text"
              className="input-field pl-11 bg-ink-900/50 border-white/5 focus:bg-ink-900 transition-all"
              placeholder="Search your history…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap h-fit">
            {['all', ...CONTENT_TYPES.map(t => t.id)].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold uppercase tracking-widest transition-all border ${filter === f
                    ? 'bg-white/10 border-white/20 text-white shadow-lg'
                    : 'bg-transparent border-white/5 text-white/30 hover:text-white/70 hover:border-white/15'
                  }`}
              >
                {f === 'all' ? 'All' : CONTENT_TYPES.find(t => t.id === f)?.label || f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* List Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass rounded-2xl p-6 h-24 shimmer-loading opacity-50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 glass rounded-3xl border-dashed border-white/10"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white/10" />
              </div>
              <h3 className="font-display font-bold text-white/40 text-2xl mb-2">
                {search ? 'No matches found' : 'Empty history'}
              </h3>
              <p className="text-white/20 text-sm font-body max-w-xs mx-auto">
                {search ? 'Try adjusting your search terms or filters' : 'Start generating amazing content to see it here!'}
              </p>
            </motion.div>
          ) : (
            <motion.div layout className="space-y-4 pb-12">
              <AnimatePresence mode='popLayout'>
                {filtered.map((item) => {
                  const type = CONTENT_TYPES.find(t => t.id === item.contentType)
                  const isExpanded = expanded === item.id
                  return (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass rounded-2xl overflow-hidden group transition-all hover:border-white/10"
                    >
                      <div
                        className="flex items-start gap-5 p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => setExpanded(isExpanded ? null : item.id)}
                      >
                        <div className={`w-12 h-12 rounded-xl ${type?.bgClass || 'bg-white/5'} flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110`}>
                          {type?.emoji || '📄'}
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${type?.accentClass || 'text-white/40'} border border-current opacity-70`}>
                              {type?.label || item.contentType}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/20 border border-white/5 px-2 py-0.5 rounded-md">
                              {item.tone}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/20 border border-white/5 px-2 py-0.5 rounded-md">
                              {item.wordCount || '?'} words
                            </span>
                          </div>
                          <h3 className="text-white/90 font-medium text-base truncate mb-1 pr-4">{item.topic}</h3>
                          <div className="flex items-center gap-1.5 opacity-30 group-hover:opacity-50 transition-opacity">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-body tracking-tight">{formatDate(item.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={e => { e.stopPropagation(); handleCopy(item.output) }}
                            className="p-2.5 rounded-xl text-white/20 hover:text-frost-400 hover:bg-frost-400/10 transition-all active:scale-90"
                            title="Copy output"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDelete(item.id) }}
                            className="p-2.5 rounded-xl text-white/20 hover:text-ember-400 hover:bg-ember-400/10 transition-all active:scale-90"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="border-t border-white/5 bg-ink-950/40"
                          >
                            <div className="p-6 relative">
                              <pre className="font-mono text-sm text-white/50 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
