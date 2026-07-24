'use client'

import { Trash2 } from 'lucide-react'

export default function DeleteFarmerButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm('Are you sure you want to completely delete this farmer and all their ledger entries? This action cannot be undone.')) {
          e.preventDefault()
        }
      }}
      className="text-white/80 hover:text-red-400 p-2 sm:px-3 sm:py-2 flex items-center justify-center transition-colors rounded-lg hover:bg-red-500/10"
      title="Delete Account"
    >
      <Trash2 size={18} strokeWidth={2.25} />
      <span className="hidden md:inline ml-2 text-sm font-medium">Delete</span>
    </button>
  )
}