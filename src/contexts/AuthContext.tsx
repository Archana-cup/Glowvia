import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile, UserRole } from '../types'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  isLiveSupabase: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string; message?: string }>
  signOut: () => Promise<void>
  demoLogin: (role: UserRole) => void
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_CUSTOMER: UserProfile = {
  id: 'dev-cust-001',
  email: 'customer@glowvia.com',
  fullName: 'Aditi Sharma',
  phone: '+91 98765 43210',
  role: 'customer',
  createdAt: '2026-01-01T00:00:00Z',
}

const DEMO_ADMIN: UserProfile = {
  id: 'dev-admin-001',
  email: 'admin@glowvia.com',
  fullName: 'Glowvia Store Administrator',
  phone: '+91 99999 88888',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z',
}

const AUTH_STORAGE_KEY = 'glowvia_auth_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const isLiveSupabase = isSupabaseConfigured()

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      try {
        // Remove credentials saved by an older insecure development build.
        localStorage.removeItem('glowvia_dev_registered_users')
        if (isLiveSupabase && supabase) {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                fullName: profile.full_name,
                phone: profile.phone,
                role: profile.role || 'customer',
                createdAt: profile.created_at,
              })
            }
          }
        } else {
          // Local storage session fallback for development
          const savedUser = localStorage.getItem(AUTH_STORAGE_KEY)
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser))
            } catch {
              localStorage.removeItem(AUTH_STORAGE_KEY)
            }
          }
        }
      } catch (err) {
        console.error('Error initializing auth state:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    if (isLiveSupabase && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              phone: profile.phone,
              role: profile.role || 'customer',
              createdAt: profile.created_at,
            })
          }
        } else {
          setUser(null)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [isLiveSupabase])

  // Sign In function
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isLiveSupabase && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } else {
      // Local development sign in
      const trimmedEmail = email.trim().toLowerCase()

      if (trimmedEmail === DEMO_CUSTOMER.email && password === 'Customer@123') {
        setUser(DEMO_CUSTOMER)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_CUSTOMER))
        return { success: true }
      }

      if (trimmedEmail === DEMO_ADMIN.email && password === 'Admin@123') {
        setUser(DEMO_ADMIN)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_ADMIN))
        return { success: true }
      }

      return {
        success: false,
        error: 'Invalid credentials. In Dev Mode, try the quick-login demo buttons or check your password.',
      }
    }
  }

  // Sign Up function
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    if (isLiveSupabase && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: 'customer',
          },
        },
      })
      if (error) {
        return { success: false, error: error.message }
      }
      if (data.session) {
        return { success: true, message: 'Account created and signed in successfully!' }
      }
      return {
        success: true,
        message: 'Account created! Please check your email inbox to confirm your address.',
      }
    } else {
      // Local dev signup
      const trimmedEmail = email.trim().toLowerCase()
      const newUser: UserProfile = {
        id: 'dev-user-' + Date.now(),
        email: trimmedEmail,
        fullName: fullName.trim(),
        role: 'customer',
        createdAt: new Date().toISOString(),
      }

      // This is a temporary UI preview only; never persist the password locally.
      setUser(newUser)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))

      return {
        success: true,
        message: 'Registration successful! Welcome to Glowvia.',
      }
    }
  }

  // Password reset request
  const requestPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    if (isLiveSupabase && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) {
        return { success: false, error: error.message }
      }
      return {
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.',
      }
    } else {
      // Local dev simulated reset
      return {
        success: true,
        message: 'Password reset simulation: If connected to Supabase, an email with a secure reset link would be sent to your inbox.',
      }
    }
  }

  // Sign out
  const signOut = async () => {
    if (isLiveSupabase && supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  // Quick demo login for testing
  const demoLogin = (role: UserRole) => {
    const selected = role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER
    setUser(selected)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(selected))
  }

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'No user signed in' }

    if (isLiveSupabase && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName,
          phone: updates.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) return { success: false, error: error.message }
    }

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    if (!isLiveSupabase) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))
    }
    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLiveSupabase,
        signIn,
        signUp,
        signOut,
        demoLogin,
        updateProfile,
        requestPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

