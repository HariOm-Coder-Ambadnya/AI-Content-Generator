// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import GeneratePage from './pages/GeneratePage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'

function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden text-white">
        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

function Root() {
  const user = useAuth()
  console.log('Auth state:', user === undefined ? 'loading' : user ? 'logged in' : 'logged out')

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center" style={{ backgroundColor: '#09090f' }}>
        <div
          className="w-10 h-10 border-4 border-white/10 border-t-ember-400 rounded-full animate-spin"
          style={{ borderTopColor: '#ff4d00' }}
        />
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <Routes>
      <Route path="/app/*" element={<AppLayout />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#16162a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4dff7a', secondary: '#16162a' } },
          error: { iconTheme: { primary: '#ff4d00', secondary: '#16162a' } },
        }}
      />
      <Root />
    </AuthProvider>
  )
}
