import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import DashboardClient from './DashboardClient'
import { signOut } from './actions'
import Image from 'next/image'
import { Settings, LogOut, Plus } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  // Fetch farmers and ledger entries to calculate stats
  const [ { data: farmers }, { data: entries } ] = await Promise.all([
    supabase.from('farmers').select('*').order('name', { ascending: true }),
    supabase.from('ledger_entries').select('farmer_id, debit, credit')
  ])

  // Calculate Dashboard Stats
  const activeCount = farmers?.filter(f => f.status === 'Active').length || 0
  const closedCount = farmers?.filter(f => f.status === 'Closed').length || 0

  const activeIds = new Set(farmers?.filter(f => f.status === 'Active').map(f => f.id))
  let netBalance = 0
  entries?.forEach(e => {
    if (activeIds.has(e.farmer_id)) {
      netBalance += (Number(e.debit) || 0) - (Number(e.credit) || 0)
    }
  })

  const balanceLabel = netBalance === 0
    ? 'Settled'
    : netBalance > 0
      ? `Rs ${netBalance.toFixed(0)}`
      : `Rs ${Math.abs(netBalance).toFixed(0)}`

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
              <button type="submit" className="text-white/90 hover:text-white transition-colors" title="Sign out">
                <LogOut size={21} strokeWidth={2} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stats Row */}
        <div className="flex gap-3 mb-6">
          {/* Active Block - Takes only needed space */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm shrink-0 min-w-[72px] text-center">
            <p className="text-lg sm:text-xl font-bold text-gray-900 tnum">{activeCount}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Active</p>
          </div>
          
          {/* Closed Block - Takes only needed space */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm shrink-0 min-w-[72px] text-center">
            <p className="text-lg sm:text-xl font-bold text-gray-900 tnum">{closedCount}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Closed</p>
          </div>
          
          {/* Outstanding Block - Takes all remaining space */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm flex-1 min-w-0 text-center">
            <p className="text-base sm:text-lg font-bold text-gray-900 truncate tnum">{balanceLabel}</p>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1">Outstanding</p>
          </div>
        </div>

        {/* Client Component (Search, Filters, and List) */}
        <DashboardClient initialFarmers={farmers || []} />
      </div>

      {/* Floating Action Button (FAB) */}
      <Link
        href="/add-farmer"
        className="fixed fab-safe-bottom right-5 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-[#131924] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex items-center justify-center text-white hover:bg-gray-800 active:scale-95 transition-all z-50"
        title="Add farmer"
      >
        <Plus size={26} strokeWidth={2.5} />
      </Link>
    </main>
  )
}
