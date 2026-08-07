import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import DashboardClient from '@/app/DashboardClient'
import { signOut } from '@/app/actions'
import Image from 'next/image'
import { Settings } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'
import CreateActionFab from '@/components/CreateActionFab'

export default async function Home() {
  const supabase = await createClient()

  const cookieStore = await cookies()
  const rawYear = cookieStore.get('selected_year')?.value
  const selectedYear = rawYear ? decodeURIComponent(rawYear) : new Date().getFullYear().toString()
  
  // Format the date for our new database function
  let cutoffDate = null
  if (selectedYear !== 'All') {
    const yearsArray = selectedYear.split(',')
    const maxYear = Math.max(...yearsArray.map(y => parseInt(y.trim(), 10)))
    cutoffDate = `${maxYear}-12-31`
  }

  // Fetch accounts, folders, and our aggregated balances directly from the database
  const [ { data: accounts }, { data: folders }, { data: balances } ] = await Promise.all([
    supabase.from('accounts').select('*').order('name', { ascending: true }),
    supabase.from('folders').select('*').order('name', { ascending: true }),
    supabase.rpc('get_account_balances', { cutoff_date: cutoffDate }) // Extremely fast RPC call
  ])

  // Map the pre-calculated balances for quick lookup
  const balanceMap: Record<string, number> = {}
  balances?.forEach((b: any) => {
    balanceMap[b.account_id] = Number(b.balance) || 0
  })

  // Attach balance to each account object
  const accountsWithBalance = accounts?.map(account => {
    const balance = Math.round((balanceMap[account.id] || 0) * 100) / 100
    return {
      ...account,
      balance,
    }
  }) || []

  // Calculate Folder Stats (Debit, Credit, and Account Count)
  const foldersWithStats = folders?.map(folder => {
    let totalDebit = 0
    let totalCredit = 0
    let accountCount = 0

    accountsWithBalance.forEach(account => {
      if (account.folder_id === folder.id) {
        accountCount++
        if (account.balance > 0) totalDebit += account.balance
        if (account.balance < 0) totalCredit += Math.abs(account.balance)
      }
    })

    return {
      ...folder,
      totalDebit,
      totalCredit,
      accountCount
    }
  }) || []

  // Calculate Dashboard Stats cleanly directly from the accounts array
  const activeCount = accounts?.filter(f => f.status === 'Active').length || 0
  const closedCount = accounts?.filter(f => f.status === 'Closed').length || 0

  let netBalance = 0
  accountsWithBalance.forEach(account => {
    if (account.status === 'Active') {
      netBalance += account.balance
    }
  })

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
        <DashboardClient 
          initialaccounts={accountsWithBalance} 
          folders={foldersWithStats}
          stats={{
            activeCount,
            closedCount,
            netBalance,
            balanceLabel
          }}
        />
      </div>

      <CreateActionFab />
    </main>
  )
}