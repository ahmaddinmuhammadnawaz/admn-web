import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import DashboardClient from './DashboardClient'
import { signOut } from './actions'
import Image from 'next/image'
import { Settings, Plus } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'

export default async function Home() {
  const supabase = await createClient()

  const cookieStore = await cookies()
  const rawYear = cookieStore.get('selected_year')?.value
  const selectedYear = rawYear ? decodeURIComponent(rawYear) : new Date().getFullYear().toString()
  
  // Build the query
  let entriesQuery = supabase.from('ledger_entries').select('account_id, debit, credit')
  
  if (selectedYear !== 'All') {
    const yearsArray = selectedYear.split(',')
    const orConditions = yearsArray
      .map(y => `and(entry_date.gte.${y.trim()}-01-01,entry_date.lte.${y.trim()}-12-31)`)
      .join(',')
    
    entriesQuery = entriesQuery.or(orConditions)
  }

  // Fetch accounts and filtered ledger entries
  const [ { data: accounts }, { data: entries } ] = await Promise.all([
    supabase.from('accounts').select('*').order('name', { ascending: true }),
    entriesQuery
  ])

  // Calculate individual balances per account
  const balanceMap: Record<string, number> = {}
  entries?.forEach(e => {
    const current = balanceMap[e.account_id] || 0
    balanceMap[e.account_id] = current + (Number(e.debit) || 0) - (Number(e.credit) || 0)
  })

// Attach balance to each account object
  const accountsWithBalance = accounts?.map(account => {
    const balance = Math.round((balanceMap[account.id] || 0) * 100) / 100
    return {
      ...account,
      balance,
    }
  }) || []

  // Calculate Dashboard Stats
  const activeCount = accounts?.filter(f => f.status === 'Active').length || 0
  const closedCount = accounts?.filter(f => f.status === 'Closed').length || 0

  const activeIds = new Set(accounts?.filter(f => f.status === 'Active').map(f => f.id))
  let netBalance = 0
  entries?.forEach(e => {
    if (activeIds.has(e.account_id)) {
      netBalance += (Number(e.debit) || 0) - (Number(e.credit) || 0)
    }
  })

  // NEW: Format the net balance with commas
  const balanceLabel = netBalance === 0
    ? '0'
    : new Intl.NumberFormat('en-PK').format(Math.abs(netBalance))

  return (
    <main className="bg-[#F7F8FA] min-h-screen relative pb-28">
      {/* Top Bar */}
      <div className="bg-[#131924] w-full safe-top">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center shadow-inner overflow-hidden bg-[#2A313C]">
              <Image
                src="/icon.png"
                alt="App Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="font-semibold text-[13px] sm:text-sm truncate">Commission Shop Ledger</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            <Link href="/settings" className="text-white/90 hover:text-white transition-colors" title="Settings">
              <Settings size={21} strokeWidth={2} />
            </Link>

            <form action={signOut}>
              <LogoutButton />
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Pass the stats into the client component */}
        <DashboardClient 
          initialaccounts={accountsWithBalance} 
          stats={{
            activeCount,
            closedCount,
            netBalance,
            balanceLabel
          }}
        />
      </div>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/add-account"
        className="fixed fab-safe-bottom right-5 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-[#131924] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex items-center justify-center text-white hover:bg-gray-800 active:scale-95 transition-all z-50"
        title="Add account"
      >
        <Plus size={26} strokeWidth={2.5} />
      </Link>
    </main>
  )
}
