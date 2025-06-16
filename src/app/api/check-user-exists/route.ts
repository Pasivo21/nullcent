import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Erstelle einen direkten Supabase-Client ohne Cookie-Handling
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Versuche einen Magic Link zu senden - wenn die E-Mail existiert, wird ein Fehler zurückgegeben
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false // Wichtig: Keinen neuen User erstellen
      }
    })

    // Wenn die E-Mail existiert, wird ein spezifischer Fehler zurückgegeben
    const exists = error?.message?.includes('User already registered')

    return NextResponse.json({
      exists: exists || false
    })

  } catch (error) {
    console.error('Error in check-user-exists:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 