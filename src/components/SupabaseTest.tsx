'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SupabaseTest() {
  useEffect(() => {
    const testSupabase = async () => {
      try {
        // 1. Insert test credit
        const { data: insertData, error: insertError } = await supabase
          .from('credits')
          .insert([
            {
              title: 'Testkredit',
              amount: 1000,
              interest_rate: 5.5,
              monthly_rate: 100,
              start_date: new Date().toISOString().split('T')[0],
              status: 'active',
              user_id: '00000000-0000-0000-0000-000000000000' // Dummy UUID
            }
          ])
          .select()

        if (insertError) {
          console.error('Error inserting credit:', insertError)
          return
        }

        console.log('Inserted credit:', insertData)

        // 2. Fetch all credits
        const { data: credits, error: fetchError } = await supabase
          .from('credits')
          .select('*')

        if (fetchError) {
          console.error('Error fetching credits:', fetchError)
          return
        }

        console.log('All credits:', credits)
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Supabase Test</h2>
      <p>Check the browser console for results</p>
    </div>
  )
} 