'use client'

import { useState, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function DeleteFarmerButton() {
  const [showModal, setShowModal] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleConfirm = () => {
    // Find the closest form (the one holding the delete action) and submit it
    const form = buttonRef.current?.closest('form')
    if (form) form.requestSubmit()
    setShowModal(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button" // Changed from "submit" so it doesn't fire immediately
        onClick={() => setShowModal(true)}
        className="text-white/80 hover:text-red-400 p-2 sm:px-3 sm:py-2 flex items-center justify-center transition-colors rounded-lg hover:bg-red-500/10"
        title="Delete Account"
      >
        <Trash2 size={18} strokeWidth={2.25} />
        <span className="hidden md:inline ml-2 text-sm font-medium">Delete</span>
      </button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title="Delete Page"
        description="Are you sure you want to completely delete this page and all their ledger entries? This action cannot be undone."
        confirmText="Delete Forever"
        isDestructive={true}
        requireWord="DELETE" // This enables the text input requirement
      />
    </>
  )
}