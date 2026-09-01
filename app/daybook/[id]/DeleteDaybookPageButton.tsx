'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteDaybookPage } from '@/app/actions'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function DeleteDaybookPageButton({ pageId }: { pageId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteDaybookPage(pageId)
      
      if (result?.error) {
        alert(result.error)
        setIsOpen(false)
      } else {
        router.replace('/daybook')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white/10 text-white/90 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-xl font-bold hover:bg-red-500/20 hover:text-red-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs sm:text-sm shrink-0"
        title="Delete Page"
      >
        <Trash2 size={18} strokeWidth={2.5} />
        <span className="hidden sm:inline">Delete Page</span>
      </button>

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Page"
        description="Are you sure you want to completely delete this page and all entries inside it? This action cannot be undone."
        confirmText="Delete Page"
        isDestructive={true}
        isLoading={isPending}
      />
    </>
  )
}