'use client'

import { useState, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ConfirmModal'

type Counts = { ledger: number; daily: number; daybook: number }

export default function DeleteAccountButton({
  counts,
  countsUnknown = false,
}: {
  counts: Counts
  countsUnknown?: boolean
}) {
  const [showModal, setShowModal] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleConfirm = () => {
    const form = buttonRef.current?.closest('form')
    if (form) form.requestSubmit()
    setShowModal(false)
  }

  const total = counts.ledger + counts.daily + counts.daybook

  let description: string
  if (countsUnknown) {
    description =
      'We could not check whether this account has entries. It may have entries in the Ledger, Entry Book and Day Book, and they will ALL be permanently deleted with the account. This cannot be undone.'
  } else if (total === 0) {
    description =
      'This account has no entries. It will be permanently deleted. This cannot be undone.'
  } else {
    const parts: string[] = []
    if (counts.ledger > 0) parts.push(`${counts.ledger} Ledger ${counts.ledger === 1 ? 'entry' : 'entries'}`)
    if (counts.daily > 0) parts.push(`${counts.daily} Entry Book ${counts.daily === 1 ? 'entry' : 'entries'}`)
    if (counts.daybook > 0) parts.push(`${counts.daybook} Day Book ${counts.daybook === 1 ? 'entry' : 'entries'}`)
    description = `This account has ${parts.join(', ')}. All of them will also be permanently deleted along with the account, and the totals of the Entry Book and Day Book pages will change. This cannot be undone.`
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
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
        title="Delete Account"
        description={description}
        confirmText="Delete Forever"
        isDestructive={true}
        requireWord="DELETE"
      />
    </>
  )
}