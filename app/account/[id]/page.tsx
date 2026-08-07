import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LedgerClient from './LedgerClient'
import { toggleAccountStatus, deleteAccount } from '@/app/actions'
import DeleteAccountButton from './DeleteAccountButton'
import { ArrowLeft, Plus, User, Phone, MapPin, Handshake, Pencil, IdCard, Wheat, StickyNote } from 'lucide-react'
import ToggleStatusButton from './ToggleStatusButton'
import DateRangeFilter from '@/components/DateRangeFilter'
import PrintButton from '@/components/PrintButton'


export default async function accountLedger({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const { id } = await params
  const { from, to } = await searchParams
  const supabase = await createClient()

  // 1. Safely decode the cookie to handle commas correctly
  const cookieStore = await cookies()
  const rawYear = cookieStore.get('selected_year')?.value
  const selectedYear = rawYear ? decodeURIComponent(rawYear) : new Date().getFullYear().toString()

  // Fetch account details...
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', id)
    .single()

  if (accountError || !account) notFound()

  const hasDateRange = Boolean(from || to)

  let entriesQuery = supabase
    .from('ledger_entries')
    .select('*')
    .eq('account_id', id)
    .limit(500000)

  // 1. Initialize past balance
  let pastBalance = 0

  // 2. Date range logic with historical balance calculations
  if (hasDateRange) {
    if (from) {
      // Fetch historical balance before the 'from' date
      const { data: pastEntries } = await supabase
        .from('ledger_entries')
        .select('debit, credit')
        .eq('account_id', id)
        .lt('entry_date', from)

      pastEntries?.forEach(e => {
        const d = Number(e.debit) || 0
        const c = Number(e.credit) || 0
        // FIX: Round at each step to prevent floating-point drift accumulation
        pastBalance = Math.round((pastBalance + d - c) * 100) / 100
      })

      entriesQuery = entriesQuery.gte('entry_date', from)
    }
    if (to) entriesQuery = entriesQuery.lte('entry_date', to)

  } else if (selectedYear !== 'All') {
    const yearsArray = selectedYear.split(',')
    const maxYear = Math.max(...yearsArray.map(y => parseInt(y.trim(), 10)))
    
    // Fetch all historical data up to the maximum selected year to ensure perfect math
    entriesQuery = entriesQuery.lte('entry_date', `${maxYear}-12-31`)
  }

  // 3. Execute the main query for the visible rows
  const { data: entries, error: entriesError } = await entriesQuery
    .order('entry_date', { ascending: true })
    .order('created_at', { ascending: true })

  if (entriesError || !entries) {
    return <div className="p-8 text-red-600">Error loading ledger entries.</div>
  }

  let currentBalance = pastBalance

  // 4. Calculate perfect running balances chronologically for all fetched entries
  const allProcessed = entries.map((entry) => {
    const debit = Number(entry.debit) || 0
    const credit = Number(entry.credit) || 0

    currentBalance = Math.round((currentBalance + debit - credit) * 100) / 100

    return {
      ...entry,
      runningBalance: currentBalance,
    }
  })

  // 5. After the math is done, filter out the years only if a custom date range isn't active
  const processedEntries = (selectedYear === 'All' || hasDateRange) 
    ? allProcessed 
    : allProcessed.filter((entry) => {
        const entryYear = entry.entry_date.split('-')[0]
        return selectedYear.split(',').includes(entryYear)
      })

  const toggleStatus = toggleAccountStatus.bind(null, account.id, account.status)
  const deleteAction = deleteAccount.bind(null, account.id) 

  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-[#131924] w-full safe-top no-print">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-6">

          {/* Row 1: Back + Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-opacity p-1 -ml-1"
              title="Back to Dashboard"
            >
              <ArrowLeft size={22} strokeWidth={2.25} />
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={`/account/${account.id}/edit`}
                className="text-white/80 hover:text-white p-2 sm:px-3 sm:py-2 flex items-center justify-center transition-colors rounded-lg hover:bg-white/10"
                title="Edit account"
              >
                <Pencil size={18} strokeWidth={2.25} />
                <span className="hidden md:inline ml-2 text-sm font-medium">Edit</span>
              </Link>
              <div className="w-px h-4 bg-white/20 hidden sm:block" />

              <form action={toggleStatus}>
                <ToggleStatusButton currentStatus={account.status} />
              </form>
              <div className="w-px h-4 bg-white/20" />
              <form action={deleteAction}>
                <DeleteAccountButton />
              </form>
            </div>
          </div>

          {/* Row 2: account info (left) + Balance/Add Entry (right) */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 break-words">
                {account.name}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-white/60">
                {account.father_name && (
                  <p className="flex items-center gap-1.5">
                    <User size={14} strokeWidth={2} /> S/O {account.father_name}
                  </p>
                )}
                {account.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone size={14} strokeWidth={2} /> {account.phone}
                  </p>
                )}
                {account.area && (
                  <p className="flex items-center gap-1.5">
                    <MapPin size={14} strokeWidth={2} /> {account.area}
                  </p>
                )}
                {account.reference_person && (
                  <p className="flex items-center gap-1.5">
                    <Handshake size={14} strokeWidth={2} /> Ref: {account.reference_person}
                  </p>
                )}
                {account.cnic && (
                  <p className="flex items-center gap-1.5">
                    <IdCard size={14} strokeWidth={2} /> {account.cnic}
                  </p>
                )}
                {account.crop && (
                  <p className="flex items-center gap-1.5">
                    <Wheat size={14} strokeWidth={2} /> {account.crop}
                  </p>
                )}
                {account.note && (
                <div className="mt-4 flex items-start gap-2.5 text-sm text-white/80 bg-white/10 p-3.5 rounded-xl border border-white/10 w-full max-w-xl">
                  <StickyNote size={18} strokeWidth={2} className="shrink-0 mt-0.5 text-white/60" />
                  <p className="leading-relaxed whitespace-pre-wrap">{account.note}</p>
                </div>
              )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <div className="text-left sm:text-right">
                <p className="text-white/50 text-[11px] uppercase tracking-wider mb-0.5">
                  Current Balance
                </p>
                <p className={`text-xl sm:text-2xl font-bold tnum whitespace-nowrap ${
                  currentBalance < 0 ? 'text-[#6EE7A8]' : currentBalance > 0 ? 'text-[#FCA5A5]' : 'text-white'
                }`}>
                  {currentBalance === 0
                    ? '0'
                    : currentBalance > 0
                      ? `Debit ${new Intl.NumberFormat('en-PK').format(currentBalance)}`
                      : `Credit ${new Intl.NumberFormat('en-PK').format(Math.abs(currentBalance))}`}
                </p>
              </div>

              {account.status === 'Active' && (
                <Link
                  href={`/account/${id}/add-entry`}
                  className="bg-white text-[#131924] w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full sm:rounded-xl font-bold text-sm hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Plus size={20} strokeWidth={2.5} className="sm:hidden" />
                  <Plus size={16} strokeWidth={2.5} className="hidden sm:block" />
                  <span className="hidden sm:inline">Add Entry</span>
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Filter + Print toolbar — compact single row, its own light strip */}
      <div className="no-print bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-2.5 flex items-center gap-2">
          <DateRangeFilter initialFrom={from} initialTo={to} />
          <PrintButton label="Print" />
        </div>
      </div>

      {/* Print-only header (shown only in the printed/PDF output) */}
      <div className="print-only px-4 sm:px-6 pt-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-extrabold mb-3">Ahmad Din Muhammad Nawaz Commission Shop</h1>
        <h1 className="text-xl font-bold mb-1">{account.name}</h1>
        <p className="text-sm text-gray-600 mb-1">
          {account.area ? `${account.area} · ` : ''}{account.phone || ''}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          {hasDateRange ? `Period: ${from || 'Start'} to ${to || 'Today'}` : `Year: ${selectedYear}`}
        </p>
        <p className="text-sm font-bold text-gray-900 mb-4">
          Balance: {currentBalance === 0 ? '0' : currentBalance > 0
            ? `Debit ${new Intl.NumberFormat('en-PK').format(currentBalance)}`
            : `Credit ${new Intl.NumberFormat('en-PK').format(Math.abs(currentBalance))}`}
        </p>
        <p className="text-xs text-gray-400 mb-4">Generated {new Date().toLocaleDateString('en-GB')}</p>
      </div>

      <LedgerClient initialEntries={processedEntries} />
    </main>
  )
}