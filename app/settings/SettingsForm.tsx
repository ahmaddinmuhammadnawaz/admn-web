'use client'

import { useState, useRef } from 'react'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function SettingsForm({ 
  children,
  action 
}: { 
  children: React.ReactNode,
  action: (formData: FormData) => void | Promise<void>
}) {
  const [showModal, setShowModal] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const isConfirmed = useRef(false)

  const handleSubmit = (e: React.FormEvent) => {
    // If the user already confirmed via the modal, let the submission pass through
    if (isConfirmed.current) return 
    
    e.preventDefault() // Stop immediate submission
    
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    if (formData.get('newPassword') !== formData.get('confirmPassword')) {
      alert("New passwords do not match!")
      return
    }
    
    setShowModal(true)
  }

  return (
    <form ref={formRef} action={action} onSubmit={handleSubmit} className="flex flex-col gap-5">
      {children}

      <ConfirmModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          isConfirmed.current = false // reset flag on cancel
        }}
        onConfirm={() => {
           isConfirmed.current = true
           setShowModal(false)
           formRef.current?.requestSubmit() 
        }}
        title="Change Password"
        description="Are you sure you want to update your password? You will need to use the new password next time you log in."
        confirmText="Update Password"
      />
    </form>
  )
}