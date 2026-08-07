'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { editLedgerEntry } from '@/app/actions'

export default function EditEntryForm({
  accountId,
  entryId,
  entry,
  isDebit,
  currentAmount
}: {
  accountId: string
  entryId: string
  entry: any
  isDebit: boolean
  currentAmount: number
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      // Execute the server action
      await editLedgerEntry(entryId, accountId, formData)
      
      // Replace the browser history state to prevent swiping back to the form
      router.replace(`/account/${accountId}`)
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      {/* Debit / Credit Toggle */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <label className="cursor-pointer">
          <input type="radio" name="type" value="Debit" className="peer sr-only" defaultChecked={isDebit} />
          <div className="text-center py-3 rounded-xl border border-[#E5E7EB] peer-checked:bg-[#DC2626]/10 peer-checked:border-[#DC2626] peer-checked:text-[#DC2626] font-bold transition-all">
            Debit
          </div>
        </label>
        <label className="cursor-pointer">
          <input type="radio" name="type" value="Credit" className="peer sr-only" defaultChecked={!isDebit} />
          <div className="text-center py-3 rounded-xl border border-[#E5E7EB] peer-checked:bg-[#16A34A]/10 peer-checked:border-[#16A34A] peer-checked:text-[#16A34A] font-bold transition-all">
            Credit
          </div>
        </label>
      </div>

      {/* Date & Page No Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            name="entry_date"
            type="date"
            required
            defaultValue={entry.entry_date}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page No.</label>
          <input
            name="page_no"
            type="text"
            defaultValue={entry.page_no || ''}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none"
          />
        </div>
      </div>

      {/* Detail Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Detail</label>
        <textarea
          name="detail"
          rows={3}
          defaultValue={entry.detail || ''}
          className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none resize-y"
        />
      </div>

      {/* Reference & Amount Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
          <input
            name="reference"
            type="text"
            defaultValue={entry.reference || ''}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount*</label>
          <input
            name="amount"
            type="number"
            step="1"
            max="9999999999"
            required
            defaultValue={currentAmount}
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#131924] text-white font-bold py-3.5 sm:py-4 rounded-xl mt-4 hover:bg-gray-800 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending && <Loader2 size={18} className="animate-spin" />}
        {isPending ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </form>
  )
}