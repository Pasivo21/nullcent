'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Überwache Auth-Status-Änderungen
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Weiterleitung erfolgt durch onAuthStateChange
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#428766]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-[#204535] font-heading text-center mb-8">
            Willkommen zurück
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[#204535] font-body mb-1"
              >
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#428766] focus:ring-2 focus:ring-[#428766]/20 outline-none transition-colors duration-200 font-body text-[#204535]"
                placeholder="deine@email.de"
                disabled={isLoading}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[#204535] font-body mb-1"
              >
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#428766] focus:ring-2 focus:ring-[#428766]/20 outline-none transition-colors duration-200 font-body text-[#204535]"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-body">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-5 py-2 rounded-lg bg-[#428766] text-white font-heading hover:bg-[#306B51] transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Lädt...
                </div>
              ) : (
                'Einloggen'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 