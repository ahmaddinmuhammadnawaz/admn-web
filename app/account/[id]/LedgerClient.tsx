'use client'

import { useState, useTransition, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { deleteLedgerEntry, addLedgerEntry, editLedgerEntry } from '@/app/actions'
import { ConfirmModal } from '@/components/ConfirmModal'
import { Search, X, Pencil, Trash2, Receipt, Loader2 } from 'lucide-react'

export default function LedgerClient({ 
  initialEntries, 
  currentPage = 1, 
  hasNextPage = false,
  accountId,
  accountStatus // <-- NEW
}: { 
  initialEntries: any[], 
  currentPage?: number, 
  hasNextPage?: boolean,
  accountId: string,
  accountStatus: string // <-- NEW
}) {
  const router = useRouter()
  
  // --- INLINE FORM STATE ---
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [editingEntry, setEditingEntry] = useState<any | null>(null)
  const [isDebit, setIsDebit] = useState(true)

  // Update toggle state automatically if an entry is selected for editing
  useEffect(() => {
    if (editingEntry) {
      setIsDebit(Number(editingEntry.debit) > 0)
    } else {
      setIsDebit(true)
    }
  }, [editingEntry])

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      if (editingEntry) {
        await editLedgerEntry(editingEntry.id, accountId, formData)
        setEditingEntry(null)
      } else {
        await addLedgerEntry(accountId, formData)
        setIsDebit(true) // Reset toggle after adding
      }
      formRef.current?.reset()
    })
  }

  const cancelEdit = () => {
    setEditingEntry(null)
    formRef.current?.reset()
  }
  // -------------------------

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [isDeleting, setIsDeleting] = useState(false)

  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, entryId: string | null, accountId: string | null}>({
    isOpen: false,
    entryId: null,
    accountId: null
  })

  const handleConfirmDelete = async () => {
    if (deleteModal.entryId && deleteModal.accountId) {
      setIsDeleting(true)
      try {
        await deleteLedgerEntry(deleteModal.entryId, deleteModal.accountId)
      } catch (error) {
        console.error("Failed to delete entry:", error)
        alert("Failed to delete the transaction. Please try again.")
      } finally {
        setIsDeleting(false) 
        setDeleteModal({ isOpen: false, entryId: null, accountId: null })
      }
    }
  }

  const filteredEntries = useMemo(() => {
    return initialEntries.filter((entry) => {
      if (filterType === 'Debit' && Number(entry.debit) === 0) return false
      if (filterType === 'Credit' && Number(entry.credit) === 0) return false
      if (searchQuery === '') return true

      const query = searchQuery.toLowerCase()
      const detailMatch = (entry.detail || '').toLowerCase().includes(query)
      const refMatch = (entry.reference || '').toLowerCase().includes(query)
      const pageMatch = (entry.page_no || '').toLowerCase().includes(query)

      const [year, month, day] = entry.entry_date.split('-')
      const dateStr = `${parseInt(day)}/${parseInt(month)}/${year.slice(-2)}`
      const dateMatch = dateStr.includes(query)

      return detailMatch || refMatch || pageMatch || dateMatch
    })
  }, [initialEntries, filterType, searchQuery])

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">

      {/* 1. Search and Filters (Moved to top) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm">
        <div className="relative mb-4">
          <Search size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          <input
            type="text"
            placeholder="Search detail, ref, date, pg..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F8FA] pl-10 pr-10 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#131924] text-sm"
          />
          {searchQuery !== '' && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#131924] transition-colors"
              title="Clear search"
            >
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
              filterType === 'All'
                ? 'bg-[#6B7280] text-white border-[#6B7280]'
                : 'bg-[#F7F8FA] text-[#6B7280] border-[#E5E7EB] hover:border-[#6B7280]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('Debit')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
              filterType === 'Debit'
                ? 'bg-[#DC2626] text-white border-[#DC2626]'
                : 'bg-[#F7F8FA] text-[#DC2626] border-[#E5E7EB] hover:border-[#DC2626]'
            }`}
          >
            Debit
          </button>
          <button
            onClick={() => setFilterType('Credit')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
              filterType === 'Credit'
                ? 'bg-[#16A34A] text-white border-[#16A34A]'
                : 'bg-[#F7F8FA] text-[#16A34A] border-[#E5E7EB] hover:border-[#16A34A]'
            }`}
          >
            Credit
          </button>
        </div>
      </div>

      {/* 2. ADD / EDIT ENTRY FORM (Moved below search) */}
      {accountStatus === 'Active' && (
        <form 
          key={editingEntry ? editingEntry.id : 'new'} 
          ref={formRef} 
          action={handleSubmit} 
          className={`no-print p-5 rounded-2xl shadow-sm border mb-6 flex flex-col lg:flex-row gap-4 items-start transition-all ${
            editingEntry ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-[#E5E7EB]'
          }`}
        >
          {/* Fixed width for Date */}
          <div className="w-full lg:w-[14%] shrink-0">
            <label className="block text-xs font-bold text-gray-500 mb-1">Date *</label>
            <input name="entry_date" type="date" required defaultValue={editingEntry?.entry_date || new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Karachi' })} className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm h-[42px]" />
          </div>
          
          {/* Allowed to shrink */}
          <div className="w-full lg:w-[10%] shrink">
            <label className="block text-xs font-bold text-gray-500 mb-1">Page No</label>
            <input name="page_no" type="text" defaultValue={editingEntry?.page_no || ""} className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm h-[42px]" />
          </div>
          
          {/* Flex-1 but strictly prevented from shrinking below 200px */}
          <div className="w-full lg:flex-1 lg:min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 mb-1">Detail</label>
            <textarea name="detail" rows={1} defaultValue={editingEntry?.detail || ""} className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm resize-y h-[42px] min-h-[42px]" />
          </div>
          
          {/* Allowed to shrink */}
          <div className="w-full lg:w-[10%] shrink">
            <label className="block text-xs font-bold text-gray-500 mb-1">Reference</label>
            <input name="reference" type="text" defaultValue={editingEntry?.reference || ""} className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm h-[42px]" />
          </div>
          
          <div className="w-full lg:w-[22%] shrink-0 flex gap-2">
            <div className="w-[45%]">
              <label className="block text-xs font-bold text-gray-500 mb-1">Type *</label>
              <input type="hidden" name="type" value={isDebit ? 'Debit' : 'Credit'} />
              <button
                type="button"
                onClick={() => setIsDebit(!isDebit)}
                className={`w-full h-[42px] rounded-xl text-sm font-bold text-white transition-colors flex items-center justify-center shadow-sm ${
                  isDebit ? 'bg-[#DC2626] hover:bg-red-700' : 'bg-[#16A34A] hover:bg-green-700'
                }`}
              >
                {isDebit ? 'Debit' : 'Credit'}
              </button>
            </div>
            
            <div className="w-[55%]">
              <label className="block text-xs font-bold text-gray-500 mb-1">Amount *</label>
              <input name="amount" type="number" required min="1" defaultValue={editingEntry ? (Number(editingEntry.debit) > 0 ? editingEntry.debit : editingEntry.credit) : ''} className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm font-bold tnum h-[42px]" />
            </div>
          </div>
          
          {/* Strictly locked to 140px width to prevent layout shifting during edit */}
          <div className="w-full lg:w-[140px] shrink-0 flex flex-col">
            <label className="block text-xs font-bold text-transparent mb-1 hidden lg:block" aria-hidden="true">Action</label>
            <div className="flex gap-2 w-full h-[42px]">
              {editingEntry && (
                <button type="button" onClick={cancelEdit} className="px-4 h-full rounded-xl font-bold bg-white border border-[#E5E7EB] text-gray-600 hover:bg-gray-50 transition-colors shrink-0">
                  <X size={18} />
                </button>
              )}
              <button type="submit" disabled={isPending} className={`flex-1 text-white px-2 h-full rounded-xl font-bold transition-colors disabled:opacity-70 flex items-center justify-center ${editingEntry ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#131924] hover:bg-gray-800'}`}>
                {isPending ? <Loader2 size={18} className="animate-spin" /> : (editingEntry ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Empty state */}
      {filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-[#6B7280]">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-4">
            <Receipt size={24} strokeWidth={1.75} />
          </div>
          <p className="text-base font-medium text-gray-700">No entries match your search</p>
          <p className="text-sm text-gray-400 mt-1">Try clearing the search or filter.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto thin-scrollbar">
              <table className="w-full text-left border-collapse min-w-[760px]">
               <thead>
                 <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#6B7280] text-[11px] uppercase tracking-wider divide-x divide-[#E5E7EB]">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 font-semibold">Pg</th>
                    <th className="px-4 py-3 font-semibold">Detail</th>
                    <th className="px-4 py-3 font-semibold">Ref</th>
                    <th className="px-4 py-3 font-semibold text-right">Debit</th>
                    <th className="px-4 py-3 font-semibold text-right">Credit</th>
                    <th className="px-4 py-3 font-semibold text-right">Balance</th>
                    <th className="px-4 py-3 font-semibold text-center no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {(() => {
                    const pkrFormatter = new Intl.NumberFormat('en-PK')
                    // Reverses the array to display oldest at the top, newest at the bottom
                    return [...filteredEntries].reverse().map((entry) => {
                      const formattedDebit = Number(entry.debit) > 0 ? pkrFormatter.format(entry.debit) : ''
                      const formattedCredit = Number(entry.credit) > 0 ? pkrFormatter.format(entry.credit) : ''
                      const formattedRunningBalance = entry.runningBalance === 0 ? '0' : pkrFormatter.format(Math.abs(entry.runningBalance))
                      const isBeingEdited = editingEntry?.id === entry.id

                      return (
                        <tr key={entry.id} className={`divide-x divide-[#E5E7EB] transition-colors ${isBeingEdited ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap tnum">
                            {(() => {
                              const [y, m, d] = entry.entry_date.split('-')
                              return `${parseInt(d)}/${parseInt(m)}/${y.slice(-2)}`
                            })()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{entry.page_no || ''}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 max-w-[250px] truncate" title={entry.detail}>{entry.detail || ''}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 max-w-[140px] truncate" title={entry.reference}>{entry.reference || ''}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-[#DC2626] tnum whitespace-nowrap">{formattedDebit}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-[#16A34A] tnum whitespace-nowrap">{formattedCredit}</td>
                          <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                            <span className={`font-bold tnum ${entry.runningBalance < 0 ? 'text-[#16A34A]' : entry.runningBalance > 0 ? 'text-[#DC2626]' : 'text-gray-900'}`}>
                              {entry.runningBalance > 0 ? 'Debit ' : entry.runningBalance < 0 ? 'Credit ' : ''}{formattedRunningBalance}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center no-print">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingEntry(entry)
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${isBeingEdited ? 'bg-amber-200 text-amber-800' : 'text-gray-400 hover:text-[#131924] hover:bg-gray-200'}`}
                                title="Edit Entry"
                              >
                                <Pencil size={15} strokeWidth={2} />
                              </button>
                              <button
                                onClick={() => setDeleteModal({ isOpen: true, entryId: entry.id, accountId: entry.account_id })}
                                className="text-gray-400 hover:text-[#DC2626] transition-colors p-1.5 rounded-lg hover:bg-red-50"
                                title="Delete Entry"
                              >
                                <Trash2 size={15} strokeWidth={2} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  })()}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-between no-print">
              <button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('page', (currentPage - 1).toString());
                  router.push(`?${params.toString()}`);
                }}
                disabled={currentPage <= 1}
                className="px-4 py-2 text-sm font-bold bg-white border border-[#E5E7EB] rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-500">Page {currentPage}</span>
              <button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  params.set('page', (currentPage + 1).toString());
                  router.push(`?${params.toString()}`);
                }}
                disabled={!hasNextPage}
                className="px-4 py-2 text-sm font-bold bg-white border border-[#E5E7EB] rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

     <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, entryId: null, accountId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? The running balance will be automatically recalculated."
        confirmText="Delete Entry"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  )
}