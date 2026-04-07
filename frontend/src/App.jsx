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
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'

function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-bg-deep relative overflow-hidden">
      {/* Background Cinematic Elements */}
      <div className="noise-bg opacity-30" />
      <div className="glow-mesh top-[-200px] left-[-200px]" />
      <div className="glow-mesh bottom-[-200px] right-[-200px] opacity-40" />
      
      <Sidebar />
      
      <main className="flex-1 transition-all duration-700 min-h-screen relative z-10">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 py-10 flex-1 flex flex-col pl-[100px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(20px)' }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-col"
            >
              <Routes location={location}>
                <Route path="/" element={<GeneratePage />} />
                <Route path="/history" element={<HistoryPage />} />
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
          className="min-h-screen w-full"
        >
          {user === undefined ? (
            <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center space-y-6">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="w-12 h-12 border border-white/5 border-t-accent-orange rounded-full"
               />
               <span className="font-mono text-[8px] font-black uppercase tracking-[0.6em] text-white/20">Syncing_Auth_State</span>
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
            background: '#0A0705',
            backdropFilter: 'blur(30px)',
            color: '#FDFBD4',
            border: '1px solid rgba(192, 88, 0, 0.2)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderRadius: '0px',
            padding: '16px 32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          },
          success: { iconTheme: { primary: '#C05800', secondary: '#0A0705' } },
          error: { iconTheme: { primary: '#8B0000', secondary: '#FDFBD4' } },
        }}
      />
      <Root />
    </AuthProvider>
  )
}

