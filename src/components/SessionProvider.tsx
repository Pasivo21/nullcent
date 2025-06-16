'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

// Geschützte Routen
const PROTECTED_ROUTES = ['/dashboard', '/account']
// Auth-Routen
const AUTH_ROUTES = ['/auth']

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        // Wenn auf einer geschützten Route und keine Session
        if (PROTECTED_ROUTES.some(route => pathname?.startsWith(route)) && !session) {
          router.push('/auth')
          return
        }

        // Wenn auf einer Auth-Route und Session existiert
        if (AUTH_ROUTES.some(route => pathname?.startsWith(route)) && session) {
          router.push('/dashboard')
          return
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard')
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#428766]"></div>
      </div>
    )
  }

  return <>{children}</>
} 