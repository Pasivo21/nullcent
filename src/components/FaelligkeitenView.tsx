'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Credit {
  id: string
  title: string
  amount: number
  monthly_rate: number
  interest_rate: number
  start_date: string
  status: 'active' | 'paid'
}

export default function FaelligkeitenView() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const { data, error } = await supabase
          .from('credits')
          .select('*')
          .order('start_date', { ascending: true })

        if (error) {
          throw error
        }

        setCredits(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
      } finally {
        setLoading(false)
      }
    }

    fetchCredits()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-[#204535] font-body">Lade Fälligkeiten...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 font-body">{error}</p>
      </div>
    )
  }

  if (credits.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#204535] font-body">Keine Fälligkeiten vorhanden</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {credits.map((credit) => (
        <div
          key={credit.id}
          className="p-6 bg-[#DDEEE3] rounded-lg shadow-sm"
        >
          <h3 className="text-xl font-semibold text-[#204535] mb-4 font-heading">
            {credit.title}
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#204535] font-body">Betrag</span>
              <span className="font-medium text-[#204535] font-body">
                {credit.amount.toLocaleString('de-DE')} €
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#204535] font-body">Rate/Monat</span>
              <span className="font-medium text-[#204535] font-body">
                {credit.monthly_rate.toLocaleString('de-DE')} €
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#204535] font-body">Zinssatz</span>
              <span className="font-medium text-[#204535] font-body">
                {credit.interest_rate.toLocaleString('de-DE', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1
                })} % p.a.
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#204535] font-body">Status</span>
              <span className={`font-medium font-body ${
                credit.status === 'active' 
                  ? 'text-green-700' 
                  : 'text-gray-600'
              }`}>
                {credit.status === 'active' ? 'Aktiv' : 'Abbezahlt'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 