// src/App.jsx
import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import LoadingScreen from './components/LoadingScreen'
import LoginPage from './pages/LoginPage'
import GeneratePage from './pages/GeneratePage'
import SettingsPage from './pages/SettingsPage'

function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-primary relative overflow-hidden selection:bg-accent selection:text-black">
      {/* Background Cinematic Elements */}
      <div className="noise-bg opacity-40" />
      <div className="network-bg opacity-10" />
      <div className="glow-mesh top-[-100px] left-[-100px] opacity-20" />
      <div className="glow-mesh bottom-[-100px] right-[-100px] opacity-30" />
      <div className="grid-background" />
      
      <Sidebar />
      
      <main className="flex-1 transition-all duration-1000 min-h-screen relative z-10">
        <div className="max-w-[1700px] mx-auto px-6 md:px-16 py-10 flex-1 flex flex-col pl-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20, filter: 'blur(20px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-col"
            >
              <Routes location={location}>
                <Route path="/" element={<GeneratePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function Root() {
  const user = useAuth()
  const [isSystemLoading, setIsSystemLoading] = useState(true)

  return (
    <AnimatePresence mode="wait">
      {isSystemLoading ? (
        <LoadingScreen key="loader" onComplete={() => setIsSystemLoading(false)} />
      ) : (
        <motion.div 
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen w-full bg-primary"
        >
          {user === undefined ? (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center space-y-8">
               <motion.div
                 animate={{ 
                   rotate: 360,
                   scale: [1, 1.1, 1],
                   borderColor: ["rgba(34,197,94,0.1)", "rgba(34,197,94,0.8)", "rgba(34,197,94,0.1)"]
                 }}
                 transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                 className="w-16 h-16 border-2 border-accent/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.1)]"
               >
                 <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
               </motion.div>
               <div className="flex flex-col items-center gap-2">
                 <span className="font-mono text-[9px] font-black uppercase tracking-[0.8em] text-accent/40">Syncing_Neural_Auth</span>
                 <div className="w-32 h-[1px] bg-white/5 relative overflow-hidden">
                   <motion.div 
                    animate={{ x: [-128, 128] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 bg-accent w-1/2"
                   />
                 </div>
               </div>
            </div>
          ) : !user ? (
            <LoginPage />
          ) : (
            <Routes>
              <Route path="/app/*" element={<AppLayout />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#161B22',
            backdropFilter: 'blur(32px)',
            color: '#ffffff',
            border: '1px solid rgba(34, 197, 94, 0.15)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px',
            fontWeight: '900',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            borderRadius: '12px',
            padding: '20px 40px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#0D1117' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0D1117' } },
        }}
      />
      <Root />
    </AuthProvider>
  )
}

