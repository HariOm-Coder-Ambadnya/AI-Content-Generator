// src/components/Sidebar.jsx
import { NavLink, Link } from 'react-router-dom'
import { 
  Settings, 
  LogOut, 
  Terminal,
  Grid,
  Moon,
  Sun,
  Layout
} from 'lucide-react'
import { logOut } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Logo from './Logo'

const NAV_ITEMS = [
  { to: '/app', icon: Layout, label: 'Compose', end: true },
  { to: '/app/settings', icon: Settings, label: 'Preferences' },
]

export default function Sidebar() {
  const user = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logOut()
      toast.success('Session Terminated')
    } catch (err) {
      toast.error('Logout Failed')
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
        className="hidden lg:flex fixed left-0 top-0 bottom-0 z-[100] flex-col items-center py-10 border-r border-border-color bg-secondary/50 backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden"
        style={{ width: isHovered ? '240px' : '90px' }}
      >
        {/* Brand */}
        <Link to="/app" className={`mb-16 w-full flex items-center transition-all duration-300 ${isHovered ? 'px-8' : 'justify-center'}`}>
            <Logo showText={isHovered} />
        </Link>

        {/* Navigation */}
        <nav className="flex-1 w-full space-y-3 px-4">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center h-14 px-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-accent/10 text-accent shadow-sm shadow-accent/5' 
                  : 'text-gray hover:bg-primary hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="w-[32px] flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 font-bold' : 'group-hover:scale-110'}`} />
                  </div>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="ml-4 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute right-0 w-[3px] h-6 bg-accent rounded-full mr-1"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="w-full px-4 space-y-6">
          
          {/* System Status (Replacing Theme Toggle) */}
          <div className="w-full h-14 flex items-center px-4 rounded-2xl text-gray transition-all group">
            <div className="w-[32px] flex items-center justify-center shrink-0">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#22C55E]" />
            </div>
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="ml-4 text-[9px] font-black uppercase tracking-widest text-accent"
              >
                Network_Active
              </motion.span>
            )}
          </div>

          {/* User Profile */}
          <div className="w-full h-14 flex items-center px-2 rounded-2xl bg-primary border border-white/5 shadow-2xl">
              <div className={`flex w-full items-center gap-3 ${isHovered ? 'px-1' : 'justify-center'}`}>
                <img
                    src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-white/10 object-cover transition-transform group-hover:scale-105 shadow-sm"
                  />
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 overflow-hidden"
                      >
                        <p className="text-[10px] font-black text-white truncate leading-none mb-1 uppercase tracking-tighter">
                            {user?.displayName?.split(' ')[0]}
                        </p>
                        <p className="text-[8px] font-black text-accent truncate leading-none uppercase tracking-widest">
                            Growth_Partner
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full h-12 flex items-center px-4 text-gray hover:text-red-500 transition-all group overflow-hidden mb-4"
          >
            <div className="w-[32px] flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="ml-4 text-[10px] font-black uppercase tracking-widest"
                >
                  Terminate
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-[100] bg-secondary/80 backdrop-blur-3xl border border-white/5 px-8 flex justify-between items-center h-20 shadow-2xl rounded-3xl">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1.5 transition-all ${
                isActive ? 'text-accent' : 'text-gray'
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

