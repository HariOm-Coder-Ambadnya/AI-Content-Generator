// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import GeneratePage from './pages/GeneratePage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'

function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Navbar />
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden text-foreground">
        <div className="max-w-7xl mx-auto px-6 w-full py-10 flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function Root() {
  const user = useAuth()
  console.log('Auth state:', user === undefined ? 'loading' : user ? 'logged in' : 'logged out')

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div
          className="w-12 h-12 border-4 border-muted border-t-accent rounded-full animate-spin"
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
            background: '#fff',
            color: '#111827',
            border: '1px solid #e5e7eb',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      <Root />
    </AuthProvider>
  )
}
