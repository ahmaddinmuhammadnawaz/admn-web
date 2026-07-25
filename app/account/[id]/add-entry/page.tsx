import { addLedgerEntry } from '@/app/actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SubmitButton } from '@/components/SubmitButton'

export default async function AddEntryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Bind the account ID to the server action so it knows which ledger to update
  const addEntryWithId = addLedgerEntry.bind(null, id)

  const getPKTDate = () => {
  const date = new Date()
  const options = { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' } as const
  const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date)
  const year = parts.find(p => p.type === 'year')?.value
  const month = parts.find(p => p.type === 'month')?.value
  const day = parts.find(p => p.type === 'day')?.value
  return `${year}-${month}-${day}`
}

  return (
    <main className="bg-[#F7F8FA] min-h-screen p-4 sm:p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E5E7EB] p-5 sm:p-8 mt-2 sm:mt-10">

        {/* Responsive Header: Stacks "Cancel" and "Add Entry" neatly */}
        <div className="flex flex-col gap-5 mb-6">
          <Link href={`/account/${id}`} className="text-[#6B7280] hover:text-[#131924] text-sm font-medium flex items-center gap-1.5 w-fit transition-colors">
            <ArrowLeft size={16} strokeWidth={2.25} /> Cancel
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#131924]">Add Entry</h1>
        </div>

        <form action={addEntryWithId} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <label className="cursor-pointer">
              <input type="radio" name="type" value="Debit" className="peer sr-only" defaultChecked />
              <div className="text-center py-3 rounded-xl border border-[#E5E7EB] peer-checked:bg-[#DC2626]/10 peer-checked:border-[#DC2626] peer-checked:text-[#DC2626] font-bold transition-all">
                Debit
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="type" value="Credit" className="peer sr-only" />
              <div className="text-center py-3 rounded-xl border border-[#E5E7EB] peer-checked:bg-[#16A34A]/10 peer-checked:border-[#16A34A] peer-checked:text-[#16A34A] font-bold transition-all">
                Credit
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input 
                name="entry_date" 
                type="date" 
                required 
                defaultValue={getPKTDate()} 
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount*</label>
              <input name="amount" type="number" step="1" max="9999999999" required className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page No.</label>
              <input name="page_no" type="text" className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
              <input name="reference" type="text" className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Detail</label>
            <textarea 
              name="detail" 
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none resize-y" 
            />
          </div>

          <SubmitButton>Save Entry</SubmitButton>
        </form>
      </div>
    </main>
  )
}
