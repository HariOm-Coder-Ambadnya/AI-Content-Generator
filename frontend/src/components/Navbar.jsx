// src/components/Navbar.jsx
import { NavLink, Link } from 'react-router-dom'
import { Zap, History, Settings, LogOut, LayoutDashboard, Terminal, Activity } from 'lucide-react'
import { logOut } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const NAV = [
  { to: '/app', icon: Terminal, label: 'Workspace', end: true },
  { to: '/app/history', icon: History, label: 'Vault' },
  { to: '/app/settings', icon: Settings, label: 'Config' },
]

export default function Navbar() {
  const user = useAuth()

  const handleLogout = async () => {
    try {
      await logOut()
      toast.success('Protocol terminated.')
    } catch (err) {
      toast.error('Sign out failed')
    }
  }

  return (
    <nav className="h-20 border-b border-white/5 bg-black sticky top-0 z-[100] flex items-center px-4 md:px-8">
      <div className="w-full flex justify-between items-center">
        
        {/* Brand */}
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center transition-transform group-hover:scale-110">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tighter text-white leading-none">Forge</span>
              <span className="font-mono text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mt-1">FORGE_CORE_v3.2</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {NAV.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-2.5 rounded-xl font-mono text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${isActive
                    ? 'text-white border-white/20 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                    : 'text-white/30 border-transparent hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* System HUD */}
        <div className="flex items-center gap-8">
          
          <div className="hidden md:flex items-center gap-6 px-5 py-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="flex flex-col items-end">
               <span className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-white/60">{user?.displayName?.split(' ')[0] || 'Operator'}</span>
               <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent-orange animate-pulse" />
                  <span className="font-mono text-[7px] text-white/20 uppercase tracking-[0.2em]">Active</span>
               </div>
            </div>
            <img
              src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
              alt="avatar"
              className="w-8 h-8 rounded-lg object-cover border border-white/10"
            />
          </div>

          <button
            onClick={handleLogout}
            className="p-3 rounded-xl border border-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>

        </div>
      </div>
    </nav>
  )
}
