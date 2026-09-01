'use client'

import { useState, useTransition } from 'react'
import { transferDaybookToLedger } from '@/app/actions'
import { Loader2, ArrowRightLeft } from 'lucide-react'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function TransferButton({ pageId }: { pageId: string }) {
  const [isTransferring, startTransfer] = useTransition()
  const [showModal, setShowModal] = useState(false)

  const handleConfirm = () => {
    setShowModal(false)
    startTransfer(async () => {
      await transferDaybookToLedger(pageId)
    })
  }

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={isTransferring}
        className="w-full bg-white text-[#131924] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
      >
        {isTransferring ? <Loader2 size={18} className="animate-spin" /> : <ArrowRightLeft size={18} strokeWidth={2.5} />}
        <span className="hidden sm:inline">{isTransferring ? 'Transferring...' : 'Transfer to Ledger'}</span>
        <span className="sm:hidden">{isTransferring ? 'Wait...' : 'Transfer'}</span>
      </button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title="Transfer to Ledger"
        description="Are you sure? This will push all entries directly into their respective ledgers and permanently lock this page. This action cannot be undone."
        confirmText="Transfer Entries"
        isLoading={isTransferring}
      />
    </>
  )
}