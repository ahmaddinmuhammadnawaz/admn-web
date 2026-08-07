import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import EditEntryForm from './EditEntryForm' // <-- Import the new form

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string; entryId: string }>
}) {
  const { id, entryId } = await params
  const supabase = await createClient()

  // Fetch the existing entry data to pre-fill the form
  const { data: entry, error } = await supabase
    .from('ledger_entries')
    .select('*')
    .eq('id', entryId)
    .single()

  if (error || !entry) {
    notFound()
  }

  // Determine current type and amount for pre-filling
  const isDebit = Number(entry.debit) > 0
  const currentAmount = isDebit ? entry.debit : entry.credit

  return (
    <main className="bg-[#F7F8FA] min-h-screen p-4 sm:p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E5E7EB] p-5 sm:p-8 mt-2 sm:mt-10">

        <div className="flex flex-col gap-5 mb-6">
          <Link href={`/account/${id}`} className="text-[#6B7280] hover:text-[#131924] text-sm font-medium flex items-center gap-1.5 w-fit transition-colors">
            <ArrowLeft size={16} strokeWidth={2.25} /> Cancel
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#131924]">Edit Transaction</h1>
        </div>

        {/* Render the Client Component Form */}
        <EditEntryForm 
          accountId={id}
          entryId={entryId}
          entry={entry}
          isDebit={isDebit}
          currentAmount={currentAmount}
        />

      </div>
    </main>
  )
}