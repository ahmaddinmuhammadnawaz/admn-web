import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LedgerClient from './LedgerClient'
import { toggleFarmerStatus, deleteFarmer } from '@/app/actions'
import DeleteFarmerButton from './DeleteFarmerButton'
import { ArrowLeft, Plus, User, Phone, MapPin, Handshake } from 'lucide-react'

export default async function FarmerLedger({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch farmer details
  const { data: farmer, error: farmerError } = await supabase
    .from('farmers')
    .select('*')
    .eq('id', id)
    .single()

  if (farmerError || !farmer) {
    notFound()
  }

  // Fetch ledger entries
  const { data: entries, error: entriesError } = await supabase
    .from('ledger_entries')
    .select('*')
    .eq('farmer_id', id)
    .order('entry_date', { ascending: true })

  if (entriesError) {
    return <div className="p-8 text-red-600">Error loading ledger entries.</div>
  }

  // Calculate running balance and reverse for display (newest first)
  let currentBalance = 0
  const processedEntries = entries.map((entry) => {
    const debit = Number(entry.debit) || 0
    const credit = Number(entry.credit) || 0
    currentBalance += (debit - credit)
    return {
      ...entry,
      runningBalance: currentBalance,
    }
  }).reverse()

  const toggleStatus = toggleFarmerStatus.bind(null, farmer.id, farmer.status)
  const deleteAccount = deleteFarmer.bind(null, farmer.id)

  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      {/* Top Header */}
<div className="bg-[#131924] w-full safe-top">
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

      <div className="flex items-center gap-3">
        <form action={toggleStatus}>
          <button
            type="submit"
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            {farmer.status === 'Active' ? 'Close Account' : 'Re-open Account'}
          </button>
        </form>
        <div className="w-px h-4 bg-white/20" />
        <form action={deleteAccount}>
          <DeleteFarmerButton />
        </form>
      </div>
    </div>

    {/* Row 2: Farmer info (left) + Balance/Add Entry (right) */}
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 truncate">
          {farmer.name}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-white/60">
          {farmer.father_name && (
            <p className="flex items-center gap-1.5">
              <User size={14} strokeWidth={2} /> S/O {farmer.father_name}
            </p>
          )}
          {farmer.phone && (
            <p className="flex items-center gap-1.5">
              <Phone size={14} strokeWidth={2} /> {farmer.phone}
            </p>
          )}
          {farmer.area && (
            <p className="flex items-center gap-1.5">
              <MapPin size={14} strokeWidth={2} /> {farmer.area}
            </p>
          )}
          {farmer.reference_person && (
            <p className="flex items-center gap-1.5">
              <Handshake size={14} strokeWidth={2} /> Ref: {farmer.reference_person}
            </p>
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
              ? 'Rs 0'
              : currentBalance > 0
                ? `Rs ${currentBalance} Debit`
                : `Rs ${Math.abs(currentBalance)} Credit`}
          </p>
        </div>

        {farmer.status === 'Active' && (
          <Link
            href={`/farmer/${id}/add-entry`}
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

      <LedgerClient initialEntries={processedEntries} />
    </main>
  )
}