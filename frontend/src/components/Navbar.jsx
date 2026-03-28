// src/components/Navbar.jsx
import { NavLink, Link } from 'react-router-dom'
import { Zap, History, Settings, LogOut, LayoutDashboard, User } from 'lucide-react'
import { logOut } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const NAV = [
  { to: '/app', icon: LayoutDashboard, label: 'Generator', end: true },
  { to: '/app/history', icon: History, label: 'History' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

export default function Navbar() {
  const user = useAuth()
  const navRef = useRef(null)

  const handleLogout = async () => {
    try {
      await logOut()
      toast.success('Signed out successfully')
    } catch (err) {
      toast.error('Sign out failed')
    }
  }

  useGSAP(() => {
     gsap.from('.nav-link', { 
       opacity: 0, 
       y: -10, 
       stagger: 0.1, 
       duration: 0.6, 
       ease: 'power2.out' 
     })
  }, { scope: navRef })

  return (
    <nav ref={navRef} className="h-16 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-[100] flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/app" className="flex items-center gap-2 group nav-link">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display font-black text-lg tracking-tight uppercase">Forge</span>
        </Link>
        
        {/* Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                  ? 'text-black bg-muted'
                  : 'text-muted-foreground hover:text-black hover:bg-muted/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-accent' : ''}`} />
                  <span>{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-muted rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 nav-link">
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full border border-border bg-muted/50">
            <img
              src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover ring-1 ring-white/5"
            />
            <span className="text-xs font-semibold text-foreground/80">{user?.displayName?.split(' ')[0] || 'User'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
