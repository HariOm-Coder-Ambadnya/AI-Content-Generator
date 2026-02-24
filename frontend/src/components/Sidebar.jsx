// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { Zap, History, Settings, LogOut, LayoutDashboard, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { logOut } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/app', icon: LayoutDashboard, label: 'Generator', end: true },
  { to: '/app/history', icon: History, label: 'History' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const user = useAuth()

  const handleLogout = async () => {
    try {
      await logOut()
      toast.success('Signed out successfully')
    } catch (err) {
      toast.error('Sign out failed')
    }
  }

  return (
    <aside className="w-72 h-screen flex flex-col glass border-r border-white/5 sticky top-0 shrink-0 z-50">
      {/* Logo Area */}
      <div className="px-8 py-10">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="relative">
            <div className="absolute inset-0 bg-ember-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-12 h-12 rounded-[18px] bg-gradient-to-br from-ember-500 to-frost-500 flex items-center justify-center shadow-2xl scale-100 group-hover:scale-105 transition-transform duration-500">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
          <div>
            <span className="font-display font-black text-2xl tracking-tighter leading-none block text-white/90">Forge</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-2.5 h-2.5 text-ember-400" />
              <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-white/20">Studio v1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5">
        <p className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-white/15 px-4 pb-4">
          Main Console
        </p>
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative group flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-display font-bold transition-all duration-300 ${isActive
                ? 'text-white bg-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-white/5'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.01]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-ember-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-ember-400' : 'text-white/20 group-hover:text-white/40'}`} />
                <span className="tracking-tight">{label}</span>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-ember-400 shadow-[0_0_8px_rgba(255,77,0,0.6)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/[0.02] rounded-3xl p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="relative">
              <img
                src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                alt="avatar"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/5"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-sage-500 rounded-full border-2 border-ink-950 shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold text-white/90 truncate leading-none mb-1">
                {user?.displayName?.split(' ')[0] || 'Member'}
              </p>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-sage-500 opacity-50" />
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-white/20 truncate">Active session</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-display font-black uppercase tracking-widest text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
