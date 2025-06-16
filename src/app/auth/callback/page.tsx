'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setError('Ein Fehler ist bei der Session-Überprüfung aufgetreten.')
          return
        }
        
        if (!session) {
          setError('Dein Magic Link ist abgelaufen. Bitte fordere einen neuen an.')
          return
        }

        router.push('/dashboard')
      } catch (error) {
        setError('Ein unerwarteter Fehler ist aufgetreten.')
        console.error('Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router])

  return (
    <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#428766]"></div>
          </div>
        ) : error ? (
          <p className="text-[#204535] font-body">{error}</p>
        ) : (
          <p className="text-[#204535] font-body">Überprüfe deine Anmeldung...</p>
        )}
      </div>
    </div>
  )
} 