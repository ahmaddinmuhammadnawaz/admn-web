'use client'

import { useState, useRef } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { ConfirmModal } from './ConfirmModal'

export function LogoutButton() {
  const [showModal, setShowModal] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // This hook detects if the parent form is currently submitting
  const { pending } = useFormStatus()

  return (
    <>
      <button 
        ref={buttonRef}
        type="button" 
        // If it's pending, clicking does nothing
        onClick={() => !pending && setShowModal(true)}
        disabled={pending}
        className="text-white/90 hover:text-white transition-colors p-1 disabled:opacity-50" 
        title={pending ? "Signing out..." : "Sign out"}
      >
        {/* Swap the icon for a spinner when pending */}
        {pending ? (
          <Loader2 size={21} strokeWidth={2} className="animate-spin" />
        ) : (
          <LogOut size={21} strokeWidth={2} />
        )}
      </button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          // Close the modal instantly
          setShowModal(false)
          // Submit the form, triggering the 'pending' state above
          const form = buttonRef.current?.closest('form')
          if (form) form.requestSubmit()
        }}
        title="Sign Out"
        description="Are you sure you want to log out of your account?"
        confirmText="Log Out"
      />
    </>
  )
}