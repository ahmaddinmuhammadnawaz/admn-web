'use client'

import { useState, useRef } from 'react'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function ToggleStatusButton({ currentStatus }: { currentStatus: string }) {
  const [showModal, setShowModal] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const isActive = currentStatus === 'Active'
  const buttonText = isActive ? 'Close Account' : 'Re-open Account'
  const modalTitle = isActive ? 'Close Account' : 'Re-open Account'
  const modalDesc = isActive 
    ? 'Are you sure you want to close this account? It will be moved to your Closed History.'
    : 'Are you sure you want to re-open this account? It will become active and appear on your main dashboard again.'

  const handleConfirm = () => {
    // Find the parent form containing the server action and submit it
    const form = buttonRef.current?.closest('form')
    if (form) form.requestSubmit()
    setShowModal(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowModal(true)}
        className="text-white/70 hover:text-white text-sm font-medium transition-colors"
      >
        {buttonText}
      </button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title={modalTitle}
        description={modalDesc}
        confirmText={buttonText}
        isDestructive={isActive} // Makes the confirm button red only if closing
      />
    </>
  )
}