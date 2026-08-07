'use client'

import { useTransition, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { addLedgerEntry } from '@/app/actions'

export default function AddEntryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const getPKTDate = () => {
    return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Karachi' })
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      // Call the server action directly
      await addLedgerEntry(id, formData)
      
      // Replace the current history entry ('/add-entry') with the account page URL
      router.replace(`/account/${id}`)
    })
  }

  return (
    <main className="bg-[#F7F8FA] min-h-screen p-4 sm:p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E5E7EB] p-5 sm:p-8 mt-2 sm:mt-10">
        <div className="flex flex-col gap-5 mb-6">
          <Link
            href={`/account/${id}`}
            className="text-[#6B7280] hover:text-[#131924] text-sm font-medium flex items-center gap-1.5 w-fit transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2.25} /> Cancel
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#131924]">
            Add Entry
          </h1>
        </div>

        <form action={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value="Debit"
                className="peer sr-only"
                defaultChecked
              />
              <div className="text-center py-3 rounded-xl border border-[#E5E7EB] peer-checked:bg-[#DC2626]/10 peer-checked:border-[#DC2626] peer-checked:text-[#DC2626] font-bold transition-all">
                Debit
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="type"
                value="Credit"
                className="peer sr-only"
              />
              <div className="text-center py-3 rounded-xl border border-[#E5E7EB] peer-checked:bg-[#16A34A]/10 peer-checked:border-[#16A34A] peer-checked:text-[#16A34A] font-bold transition-all">
                Credit
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                name="entry_date"
                type="date"
                required
                defaultValue={getPKTDate()}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page No.
              </label>
              <input
                name="page_no"
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detail
            </label>
            <textarea
              name="detail"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference
              </label>
              <input
                name="reference"
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount*
              </label>
              <input
                name="amount"
                type="number"
                step="1"
                max="9999999999"
                required
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
            {isPending ? 'Saving Entry...' : 'Save Entry'}
          </button>
        </form>
      </div>
    </main>
  )
}