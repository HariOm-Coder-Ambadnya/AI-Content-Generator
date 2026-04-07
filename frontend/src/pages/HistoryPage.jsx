// src/pages/HistoryPage.jsx
import { useEffect, useState, useRef } from 'react'
import { Trash2, FileText, Clock, Search, Copy, Database, ShieldCheck, Zap, Terminal, Command, ChevronDown } from 'lucide-react'
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
    setLoading(true)
    getUserGenerations(user.uid)
      .then(setItems)
      .catch(() => toast.error('Vault access denied.'))
      .finally(() => setLoading(false))
  }, [user])

  useGSAP(() => {
    if (!loading) {
      gsap.from('.vault-item', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.out'
      })
    }
  }, { scope: containerRef, dependencies: [loading] })

  const handleDelete = async (id) => {
    try {
      await deleteGeneration(id)
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success('Sequence purged.')
    } catch {
      toast.error('Purge failed.')
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Sequence copied.')
  }

  const filtered = items.filter(item => {
    const matchesSearch = item.topic?.toLowerCase().includes(search.toLowerCase()) ||
      item.output?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || item.contentType === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-black text-white flex flex-col pt-12 pb-32 px-4 md:px-8">
      
      {/* HUD Header */}
      <div className="vault-item flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-white/20" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-white/30">Registry: SECURE_VAULT</span>
           </div>
           <h1 className="font-serif text-6xl md:text-8xl tracking-tighter leading-none">
              Archived <span className="text-white/20">Data.</span>
           </h1>
        </div>

        <div className="flex items-center gap-12 md:gap-20 font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">
           <div className="flex flex-col gap-1">
              <span>Records</span>
              <span className="text-white">{items.length}</span>
           </div>
           <div className="flex flex-col gap-1">
              <span>Security</span>
              <span className="text-accent-orange">Encrypted</span>
           </div>
        </div>
      </div>

      {/* Filter Hub */}
      <div className="vault-item grid grid-cols-1 xl:grid-cols-12 gap-8 mb-16">
        <div className="xl:col-span-4 relative group">
          <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors z-10" />
          <input
            type="text"
            className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 text-white text-sm font-light focus:outline-none focus:border-white/20 transition-all relative z-10 placeholder:text-white/5"
            placeholder="Search record identifiers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="xl:col-span-8 flex gap-2 overflow-x-auto pb-4 xl:pb-0 scrollbar-hide">
          {['all', ...CONTENT_TYPES.map(t => t.id)].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all border shrink-0 ${
                filter === f
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 border-white/5 text-white/30 hover:text-white hover:bg-white/10'
              }`}
            >
              {f === 'all' ? 'Universal' : CONTENT_TYPES.find(t => t.id === f)?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* Vault Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white/5 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="vault-item py-48 flex flex-col items-center justify-center border border-white/5 rounded-[40px] bg-white/[0.01]">
            <Database className="w-10 h-10 text-white/5 mb-8" />
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.6em] text-white/10">Archive_Empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-20">
            <AnimatePresence mode='popLayout'>
              {filtered.map((item) => {
                const type = CONTENT_TYPES.find(t => t.id === item.contentType)
                const isExpanded = expanded === item.id
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group border transition-all duration-500 rounded-3xl overflow-hidden ${
                      isExpanded ? 'border-white/20 bg-white/[0.03]' : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                    }`}
                  >
                    <div
                      className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                    >
                      <div className="flex items-center gap-8 flex-1 min-w-0">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                            isExpanded ? 'bg-white text-black border-white' : 'bg-white/5 text-white/20 border-white/5'
                         }`}>
                            <FileText className="w-5 h-5" />
                         </div>
                         <div className="space-y-1 flex-1 min-w-0">
                            <h3 className="text-white font-serif text-2xl truncate">{item.topic}</h3>
                            <div className="flex items-center gap-6 font-mono text-[8px] text-white/20 uppercase tracking-[0.2em]">
                               <span className="flex items-center gap-2 text-accent-orange">
                                  <Clock className="w-3 h-3" /> {formatDate(item.createdAt)}
                               </span>
                               <span>{type?.label || item.contentType}</span>
                               <span>ID: {item.id.slice(-6).toUpperCase()}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={e => { e.stopPropagation(); handleCopy(item.output) }}
                          className="p-4 rounded-xl border border-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleDelete(item.id) }}
                          className="p-4 rounded-xl border border-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/5 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronDown className={`w-5 h-5 text-white/10 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5"
                        >
                           <div className="p-10 bg-black/50">
                              <div className="flex items-center gap-3 mb-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
                                 <Command className="w-3.5 h-3.5" /> Output_Stream
                              </div>
                              <pre className="font-mono text-base text-white/60 whitespace-pre-wrap leading-relaxed">
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

