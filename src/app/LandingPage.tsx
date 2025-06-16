'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F8F4] flex items-center justify-center">
        <p className="text-[#204535] font-body">Lade...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F1F8F4]">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-[#204535] font-heading">Nullcent</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth"
                className="px-5 py-2 rounded-lg bg-[#428766] text-white font-heading hover:bg-[#306B51] transition-colors duration-200 text-sm"
              >
                Einloggen
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2 rounded-lg bg-[#428766] text-white font-heading hover:bg-[#306B51] transition-colors duration-200 text-sm"
              >
                Registrieren
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B392D] font-heading leading-tight">
              Dein Weg zur finanziellen Freiheit
            </h1>
            <p className="mt-6 text-xl text-[#204535] font-body max-w-3xl mx-auto">
              Entdecke, wie du deine Finanzen optimieren und deine Ziele erreichen kannst.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/50 p-6 rounded-xl shadow-sm">
              <div className="text-2xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-[#1B392D] font-heading mb-2">
                Übersichtliche Finanzplanung
              </h3>
              <p className="text-[#204535] font-body">
                Behalte den Überblick über deine Einnahmen und Ausgaben.
              </p>
            </div>

            <div className="bg-white/50 p-6 rounded-xl shadow-sm">
              <div className="text-2xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-[#1B392D] font-heading mb-2">
                Intelligente Budgetierung
              </h3>
              <p className="text-[#204535] font-body">
                Erstelle und verwalte dein Budget mit KI-gestützten Empfehlungen.
              </p>
            </div>

            <div className="bg-white/50 p-6 rounded-xl shadow-sm">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-[#1B392D] font-heading mb-2">
                Optimierte Ausgaben
              </h3>
              <p className="text-[#204535] font-body">
                Finde Einsparpotenziale und optimiere deine Finanzen.
              </p>
            </div>
          </div>

          {/* Visual Placeholder */}
          <div className="mt-16 mb-16">
            <div className="aspect-video bg-white/50 rounded-xl shadow-sm flex items-center justify-center">
              <p className="text-[#204535] font-body">Hier kommt später ein Bild oder eine Animation</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 