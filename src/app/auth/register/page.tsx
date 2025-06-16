'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const RATE_LIMIT_MS = 59000 // 59 Sekunden

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [lastRequestTime, setLastRequestTime] = useState<number>(0)

  // Überwache Auth-Status-Änderungen
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/check-user-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to check user existence')
      }

      const data = await response.json()
      return data.exists
    } catch (error) {
      console.error('Error checking user:', error)
      throw error
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const now = Date.now()
    if (now - lastRequestTime < RATE_LIMIT_MS) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastRequestTime)) / 1000)
      setStatus('error')
      setMessage(`Bitte warte noch ${remainingSeconds} Sekunden, bevor du einen neuen Magic Link anforderst.`)
      return
    }
    
    try {
      setStatus('loading')
      setMessage(null)
      
      // Prüfe ob die E-Mail bereits existiert
      const userExists = await checkUserExists(email)
      
      if (userExists) {
        setStatus('error')
        setMessage('Diese E-Mail ist bereits registriert. Bitte logge dich stattdessen ein.')
        return
      }

      // Wenn die E-Mail nicht existiert, sende Magic Link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setLastRequestTime(now)
      setStatus('success')
      setMessage('Prüfe deine E-Mails – du erhältst gleich deinen Zugang.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten')
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-[#204535] font-heading text-center mb-8">
            Willkommen bei NullCent
          </h1>

          <form onSubmit={handleMagicLink} className="space-y-6">
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
                disabled={status === 'loading'}
              />
            </div>

            {message && (
              <p className={`text-sm font-body ${
                status === 'success' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="w-full px-5 py-2 rounded-lg bg-[#428766] text-white font-heading hover:bg-[#306B51] transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Wird geprüft...' : 'Registrieren mit Magic Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 