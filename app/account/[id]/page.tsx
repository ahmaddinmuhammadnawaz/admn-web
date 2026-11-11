import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LedgerClient from './LedgerClient'
import { toggleAccountStatus, deleteAccount } from '@/app/actions'
import DeleteAccountButton from './DeleteAccountButton'
import { ArrowLeft, Plus, User, Phone, MapPin, Handshake, Pencil, IdCard, Wheat, StickyNote } from 'lucide-react'
import BackButton from '@/components/BackButton'
import ToggleStatusButton from './ToggleStatusButton'
import DateRangeFilter from '@/components/DateRangeFilter'
import PrintButton from '@/components/PrintButton'

export default async function AccountLedger({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string; to?: string; page?: string; q?: string; type?: string }>
}) {
  const { id } = await params
  const { from, to, page = '1', q = '', type = 'All' } = await searchParams
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

    // Count ALL entries for this account (not affected by year/date filters)
const countFor = (table: string) =>
  supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('account_id', id)

const [ledgerRes, dailyRes, daybookRes] = await Promise.all([
  countFor('ledger_entries'),
  countFor('daily_entries'),
  countFor('daybook_entries'),
])

// If any count fails, treat it as "unknown" so we show the strongest warning
const countsUnknown = Boolean(ledgerRes.error || dailyRes.error || daybookRes.error)
const entryCounts = {
  ledger: ledgerRes.count ?? 0,
  daily: dailyRes.count ?? 0,
  daybook: daybookRes.count ?? 0,
}

  const hasDateRange = Boolean(from || to)

  // 2. Pagination & Search calculations
  const PAGE_SIZE = 100;
  const currentPage = parseInt(page, 10) || 1;
  const pageOffset = (currentPage - 1) * PAGE_SIZE; 
  
  // FIX: Build parameters object dynamically to strip out nulls
  const rpcParams: any = {
    p_account_id: id,
    p_limit: PAGE_SIZE + 1,
    p_offset: pageOffset,
    p_type: type
  }
  if (from) rpcParams.p_from_date = from
  if (to) rpcParams.p_to_date = to
  if (q) rpcParams.p_search = q

  // Fetch one extra row (+1) to accurately check if a next page exists
  const { data: rawEntries, error: entriesError } = await supabase
    .rpc('get_ledger_with_balances', rpcParams)

  if (entriesError || !rawEntries) {
    console.error(entriesError); // Prints to VS Code terminal
    return <div className="p-8 text-red-600">Error loading ledger entries: {entriesError?.message}</div>
  }

  const hasNextPage = rawEntries.length > PAGE_SIZE;
  
  // Convert running_balance to camelCase and cast to Number
  const processedEntries = rawEntries.slice(0, PAGE_SIZE).map((entry: any) => ({
    ...entry,
    runningBalance: Number(entry.running_balance) || 0
  }));

  // Extract the most recent balance to show in the header
  const currentBalance = processedEntries.length > 0 
    ? processedEntries[0].runningBalance 
    : 0;

  const toggleStatus = toggleAccountStatus.bind(null, account.id, account.status)
  const deleteAction = deleteAccount.bind(null, account.id) 

  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-[#131924] w-full safe-top no-print">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-6">

          {/* Row 1: Back + Actions */}
          <div className="flex items-center justify-between mb-6">
            <BackButton
              className="text-white/80 hover:text-white transition-opacity p-1 -ml-1"
              title="Back"
            >
              <ArrowLeft size={22} strokeWidth={2.25} />
            </BackButton>

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
                <DeleteAccountButton counts={entryCounts} countsUnknown={countsUnknown} />
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

      <LedgerClient 
        initialEntries={processedEntries} 
        currentPage={currentPage} 
        hasNextPage={hasNextPage}
        accountId={account.id}
        accountStatus={account.status}
      />
    </main>
  )
}