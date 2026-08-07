'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, FolderPlus, UserPlus, X } from 'lucide-react'
import { createFolder } from '@/app/actions'
import { SubmitButton } from './SubmitButton'

export default function CreateActionFab() {
  const [isOpen, setIsOpen] = useState(false)
  const [showFolderForm, setShowFolderForm] = useState(false)

  if (showFolderForm) {
    return (
      <div className="fixed inset-0 z-50 bg-[#131924]/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#131924]">New Folder</h2>
            <button onClick={() => { setShowFolderForm(false); setIsOpen(false) }} className="text-gray-400 hover:text-black">
              <X size={20} />
            </button>
          </div>
          <form action={async (formData) => {
            await createFolder(formData)
            setShowFolderForm(false)
            setIsOpen(false)
          }} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 pb-2">Folder Name</label>
              <input name="name" type="text" required autoFocus className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none" />
            </div>
            <SubmitButton>Create Folder</SubmitButton>
          </form>
        </div>
      </div>
    )
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
      )}
      <div className="fixed fab-safe-bottom right-5 sm:right-8 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="flex flex-col gap-2 mb-2 animate-in slide-in-from-bottom-4">
            <button 
              onClick={() => setShowFolderForm(true)}
              className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-lg border border-[#E5E7EB] hover:bg-gray-50 font-semibold text-sm text-gray-800"
            >
              <FolderPlus size={18} /> Create Folder
            </button>
            <Link 
              href="/add-account"
              className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-lg border border-[#E5E7EB] hover:bg-gray-50 font-semibold text-sm text-gray-800"
            >
              <UserPlus size={18} /> Add Account
            </Link>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-[#131924] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex items-center justify-center text-white hover:bg-gray-800 active:scale-95 transition-all"
        >
          <Plus size={26} strokeWidth={2.5} className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        </button>
      </div>
    </>
  )
}