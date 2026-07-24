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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Stop immediate submission
    
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    if (formData.get('newPassword') !== formData.get('confirmPassword')) {
      alert("New passwords do not match!")
      return
    }
    
    setShowModal(true)
  }

  return (
    <>
      <form ref={formRef} action={action} onSubmit={handleSubmit} className="flex flex-col gap-5">
        {children}
      </form>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
           setShowModal(false)
           // requestSubmit is crucial here for React 19 Server Actions
           formRef.current?.requestSubmit() 
        }}
        title="Change Password"
        description="Are you sure you want to update your password? You will need to use the new password next time you log in."
        confirmText="Update Password"
      />
    </>
  )
}