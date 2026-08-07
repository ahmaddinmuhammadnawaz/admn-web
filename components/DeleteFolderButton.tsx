'use client'

import { useState, useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteFolder } from '@/app/actions'
import { ConfirmModal } from './ConfirmModal'

export default function DeleteFolderButton({ folderId }: { folderId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    setErrorMsg(null) // Clear previous errors
    
    startTransition(async () => {
      const result = await deleteFolder(folderId)
      
      if (result?.error) {
        // Show graceful error (Wait, ConfirmModal needs to support showing errors!)
        // For now, we will use an alert, or you can add an error prop to ConfirmModal later.
        setErrorMsg(result.error)
        alert(`Error: ${result.error}`) 
        setIsOpen(false)
      } else {
        // Success! Redirect to home page
        router.push('/')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center bg-white/10 hover:bg-red-500/20 text-white/90 hover:text-red-400 p-2 sm:px-3 sm:py-2 rounded-lg text-sm font-medium transition-colors"
        title="Delete Folder"
      >
        <Trash2 size={16} />
        <span className="hidden sm:inline ml-2">Delete</span>
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Folder"
        description="Are you sure you want to delete this folder? Your accounts and ledger entries will NOT be deleted; they will simply be moved back to the home screen."
        confirmText="Delete Folder"
        isDestructive={true}
        isLoading={isPending}
      />
    </>
  )
}