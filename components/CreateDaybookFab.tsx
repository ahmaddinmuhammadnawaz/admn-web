'use client'
import { useState, useTransition } from 'react'
import { Plus, X, AlertCircle, Loader2 } from 'lucide-react'
import { createDaybookPage } from '@/app/actions'

export default function CreateDaybookFab() {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const getPKTDate = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Karachi' })

  const handleSubmit = (formData: FormData) => {
    setErrorMsg(null)
    startTransition(async () => {
      const result = await createDaybookPage(formData)
      if (result?.error) setErrorMsg(result.error)
    })
  }

  const handleClose = () => { setIsOpen(false); setErrorMsg(null); }

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#131924]/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-lg p-5 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-[#131924]">New Day Book Page</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-black transition-colors p-1 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-start gap-2 border border-red-100">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}
          <form action={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Date</label>
              <input name="date" type="date" required defaultValue={getPKTDate()} className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
            <button type="submit" disabled={isPending} className="w-full bg-[#131924] text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-gray-800 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isPending && <Loader2 size={18} className="animate-spin" />}
              {isPending ? 'Creating Page...' : 'Create Page'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed fab-safe-bottom right-5 sm:right-8 z-50">
      <button type="button" onClick={() => setIsOpen(true)} className="cursor-pointer w-14 h-14 sm:w-16 sm:h-16 bg-[#131924] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex items-center justify-center text-white active:bg-gray-800 md:hover:bg-gray-800 active:scale-95 transition-all" title="Create New Page">
        <Plus size={26} strokeWidth={2.5} />
      </button>
    </div>
  )
}