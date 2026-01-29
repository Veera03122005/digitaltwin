import { create } from 'zustand'
import api from '@/lib/api'

// Define types based on MongoDB backend response
export interface User {
    id: string
    email: string
    fullName: string
    phone: string
    role: 'passenger' | 'conductor' | 'admin'
}

interface AuthState {
    user: User | null
    profile: User | null // In Supabase user & profile were separate, here they are merged
    loading: boolean
    initialized: boolean
    setUser: (user: User | null) => void
    setProfile: (profile: User | null) => void // Kept for compatibility
    initialize: () => Promise<void>
    login: (userData: User, token: string) => void
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    loading: true,
    initialized: false,

    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),

    initialize: async () => {
        try {
            set({ loading: true })
            const token = localStorage.getItem('token')

            if (token) {
                // Verify token and get user data
                const response = await api.get('/auth/me')
                const user = response.data.user

                // In our MongoDB setup, user and profile are the same object
                set({ user, profile: user })
            }
        } catch (error) {
            console.error('Error initializing auth:', error)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            set({ user: null, profile: null })
        } finally {
            set({ initialized: true, loading: false })
        }
    },

    login: (user: User, token: string) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ user, profile: user })
    },

    signOut: async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ user: null, profile: null })
    }
}))
