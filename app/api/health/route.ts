import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  // We use the basic supabase-js client here because Uptime Robot doesn't have cookies or a login session
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // A lightweight query just to touch the database engine and register activity.
    // Even if Row Level Security (RLS) returns 0 rows, it successfully pings the database compute instance.
    const { error } = await supabase.from('folders').select('id').limit(1)

    if (error) throw error

    return NextResponse.json(
      { status: 'Active', message: 'Database ping successful', timestamp: new Date().toISOString() },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { status: 'Error', message: error.message },
      { status: 500 }
    )
  }
}