// frontend/src/lib/api.js
import { auth } from './firebase'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const fetchFromBackend = async (endpoint, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    // Automatically add Firebase ID token if user is logged in
    if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken()
        headers['Authorization'] = `Bearer ${idToken}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Backend request failed' }))
        throw new Error(error.message || 'Backend request failed')
    }

    return response.json()
}
