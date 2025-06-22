import { supabase } from './client.js'

/**
 * Authentication service for Supabase
 * Handles user registration, login, logout, and profile management
 */

// Sign up with email and password
export const signUp = async (email, password, userData = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { data: null, error }
  }
}

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { data: null, error }
  }
}

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Google sign in error:', error)
    return { data: null, error }
  }
}

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    
    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

// Reset password
export const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Password reset error:', error)
    return { data: null, error }
  }
}

// Update password
export const updatePassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Password update error:', error)
    return { data: null, error }
  }
}

// Update user profile
export const updateProfile = async (updates) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Profile update error:', error)
    return { data: null, error }
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    return { user, error: null }
  } catch (error) {
    console.error('Get current user error:', error)
    return { user: null, error }
  }
}

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    return { session, error: null }
  } catch (error) {
    console.error('Get current session error:', error)
    return { session: null, error }
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Verify OTP (for email verification)
export const verifyOtp = async (email, token, type) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { data: null, error }
  }
}

// Refresh session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Session refresh error:', error)
    return { data: null, error }
  }
}

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    console.error('Authentication check error:', error)
    return false
  }
}

// Get user metadata
export const getUserMetadata = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.user_metadata || null
  } catch (error) {
    console.error('Get user metadata error:', error)
    return null
  }
}

export default {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  resetPassword,
  updatePassword,
  updateProfile,
  getCurrentUser,
  getCurrentSession,
  onAuthStateChange,
  verifyOtp,
  refreshSession,
  isAuthenticated,
  getUserMetadata
} 