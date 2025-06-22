import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase/client.js'
import * as authService from '../lib/supabase/auth.js'

// Create authentication context
const AuthContext = createContext({})

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting initial session:', error)
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await authService.signUp(email, password, userData)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      setError(error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await authService.signIn(email, password)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      setError(error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await authService.signInWithGoogle()
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      setError(error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      const { error } = await authService.signOut()
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      setUser(null)
      setSession(null)
      return { success: true }
    } catch (error) {
      setError(error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await authService.resetPassword(email)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      setError(error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await authService.updatePassword(newPassword)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      return { success: true, data }
    } catch (error) {
      setError(error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Update profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await authService.updateProfile(updates)
      
      if (error) {
        setError(error)
        return { success: false, error }
      }
      
      // Update local user state
      if (data?.user) {
        setUser(data.user)
      }
      
      return { success: true, data }
    } catch (error) {
      setError(error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth()
    
    if (loading) {
      return <div>Loading...</div>
    }
    
    if (!user) {
      return <div>Please sign in to access this page.</div>
    }
    
    return <Component {...props} />
  }
}

// Hook for checking if user has specific role
export const useUserRole = () => {
  const { user } = useAuth()
  
  const hasRole = (role) => {
    return user?.user_metadata?.role === role
  }
  
  const isAdmin = () => {
    return hasRole('admin')
  }
  
  const isPremium = () => {
    return hasRole('premium')
  }
  
  return {
    hasRole,
    isAdmin,
    isPremium,
    role: user?.user_metadata?.role || 'user'
  }
}

export default useAuth 