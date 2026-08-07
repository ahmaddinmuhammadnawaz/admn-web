'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { addaccount } from '@/app/actions'

export default function AddAccountForm({ folders }: { folders: any[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      // Call the server action directly
      const newAccountId = await addaccount(formData)
      
      // Replace the current history entry so the user can't swipe back into the form
      router.replace(`/account/${newAccountId}`)
    })
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input 
          name="name" 
          type="text" 
          required 
          className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
          <input 
            name="father_name" 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            name="phone" 
            type="tel" 
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
          <input 
            name="area" 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reference Person</label>
          <input 
            name="reference_person" 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
          <input 
            name="cnic" 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Crop</label>
          <input 
            name="crop" 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
        <select 
          name="folder_id" 
          defaultValue="none"
          className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus:ring-1 focus:ring-[#131924] focus:outline-none"
        >
          <option value="none">No Folder (Home Screen)</option>
          {folders?.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Note / Remarks</label>
        <textarea 
          name="note" 
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#131924] text-white font-bold py-3.5 sm:py-4 rounded-xl mt-4 hover:bg-gray-800 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPending && <Loader2 size={18} className="animate-spin" />}
        {isPending ? 'Saving Account...' : 'Save Account'}
      </button>
    </form>
  )
}