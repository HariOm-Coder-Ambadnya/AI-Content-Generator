// src/components/Sidebar.jsx
import { NavLink, Link } from 'react-router-dom'
import { 
  History, 
  Settings, 
  LogOut, 
  Zap,
  Activity,
  Box,
  Terminal,
  Grid,
  Menu,
  X
} from 'lucide-react'
import { logOut } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const NAV_ITEMS = [
  { to: '/app', icon: Terminal, label: 'Generator', end: true },
  { to: '/app/history', icon: Box, label: 'Vault' },
  { to: '/app/settings', icon: Settings, label: 'Systems' },
]

export default function Sidebar() {
  const user = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logOut()
      toast.success('SYSTEM_OFFLINE')
    } catch (err) {
      toast.error('LOGOUT_FAULT')
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-[100] flex-col items-center py-8 border-r border-white/5 bg-black/80 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden"
        style={{ width: isHovered ? '240px' : '80px' }}
      >
        {/* Brand Icon */}
        <Link to="/app" className="mb-16 relative group">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center transition-all group-active:scale-95 shadow-2xl shadow-white/5">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                  <span className="font-mono text-[10px] font-black text-white tracking-[0.5em] uppercase">Forge</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 w-full space-y-2 px-4 text-white">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center h-12 rounded-xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-white text-black' 
                  : 'text-white/20 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="w-[48px] flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  </div>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-[9px] font-mono font-black uppercase tracking-[0.4em] whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="w-full px-4 space-y-10">
          <div className="h-[1px] bg-white/5 mx-2" />
          
          {/* User Profile */}
          <div className="relative group p-2 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className={`flex items-center gap-3 ${isHovered ? '' : 'justify-center'}`}>
              <img
                  src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-lg object-cover grayscale transition-transform group-hover:scale-110"
                />
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[9px] font-mono font-black text-white truncate uppercase tracking-widest leading-none mb-1">
                          {user?.displayName?.split(' ')[0] || 'ENGINEER'}
                      </p>
                      <p className="text-[7px] font-mono font-bold text-white/20 truncate tracking-widest uppercase italic">SYS_ADMIN</p>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full h-12 flex items-center rounded-xl text-white/10 hover:text-red-500 hover:bg-red-500/5 transition-all group overflow-hidden mb-4"
          >
            <div className="w-[48px] flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-[9px] font-mono font-black uppercase tracking-[0.4em]"
                >
                  Disconnect
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navbar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-3xl border-t border-white/5 px-6 py-4 flex justify-between items-center h-20">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                isActive ? 'text-white' : 'text-white/20'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="font-mono text-[7px] font-black uppercase tracking-[0.2em]">{label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="mobile-indicator"
                    className="absolute -bottom-4 w-8 h-[2px] bg-white rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
        
        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1.5 px-4 py-2 text-white/20"
        >
          <Menu className="w-5 h-5" />
          <span className="font-mono text-[7px] font-black uppercase tracking-[0.2em]">Menu</span>
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] lg:hidden"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-black border-l border-white/5 p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <Zap className="w-5 h-5 text-black fill-black" />
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/20 hover:text-white">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="flex-1 space-y-12">
                 <div className="space-y-4">
                    <p className="font-mono text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Operator</p>
                    <div className="flex items-center gap-4">
                       <img
                          src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                          className="w-12 h-12 rounded-2xl border border-white/10 grayscale"
                        />
                        <div>
                           <p className="font-serif text-xl text-white">{user?.displayName?.split(' ')[0]}</p>
                           <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest italic">Node_Admin</p>
                        </div>
                    </div>
                 </div>

                 <div className="h-[1px] bg-white/5" />
                 
                 <div className="space-y-6">
                    <p className="font-mono text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Protocol</p>
                    <button onClick={handleLogout} className="flex items-center gap-4 text-white hover:text-red-500 transition-colors group">
                       <LogOut className="w-5 h-5 text-white/20 group-hover:text-red-500" />
                       <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em]">Terminate_Session</span>
                    </button>
                 </div>
              </div>

              <div className="mt-auto">
                 <p className="font-mono text-[7px] text-white/10 uppercase tracking-[0.5em]">Forge_OS // V3.4.9</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
