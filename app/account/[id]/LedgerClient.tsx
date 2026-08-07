'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { deleteLedgerEntry } from '@/app/actions'
import { ConfirmModal } from '@/components/ConfirmModal'
import { Search, X, Pencil, Trash2, Receipt, Loader2 } from 'lucide-react'

export default function LedgerClient({ initialEntries }: { initialEntries: any[] }) {
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

  const router = useRouter()
  const [isNavigating, startNavigation] = useTransition()
  const [navigatingId, setNavigatingId] = useState<string | null>(null)

  const handleEditNavigation = (accountId: string, entryId: string) => {
    setNavigatingId(entryId)
    startNavigation(() => {
      router.push(`/account/${accountId}/edit-entry/${entryId}`)
    })
  }

  // Wrapped in useMemo for performance and updated to match 31/8 format
  const filteredEntries = useMemo(() => {
    return initialEntries.filter((entry) => {
      // 1. Apply Type Filter
      if (filterType === 'Debit' && Number(entry.debit) === 0) return false
      if (filterType === 'Credit' && Number(entry.credit) === 0) return false

      // 2. Apply Search Filter
      if (searchQuery === '') return true

      const query = searchQuery.toLowerCase()
      const detailMatch = (entry.detail || '').toLowerCase().includes(query)
      const refMatch = (entry.reference || '').toLowerCase().includes(query)
      const pageMatch = (entry.page_no || '').toLowerCase().includes(query)

      // Format date manually by splitting the string to prevent UTC shifts
      const [year, month, day] = entry.entry_date.split('-')
      const dateStr = `${parseInt(day)}/${parseInt(month)}`
      const dateMatch = dateStr.includes(query)

      return detailMatch || refMatch || pageMatch || dateMatch
    })
  }, [initialEntries, filterType, searchQuery])

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">

      {/* Search and Filters */}
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
          {/* Full table for all screen sizes */}
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
                    // Instantiate exactly ONCE before the loop for massive performance gains
                    const pkrFormatter = new Intl.NumberFormat('en-PK')
                    
                    return filteredEntries.map((entry) => {
                      const formattedDebit = Number(entry.debit) > 0 ? pkrFormatter.format(entry.debit) : ''
                      const formattedCredit = Number(entry.credit) > 0 ? pkrFormatter.format(entry.credit) : ''
                      const formattedRunningBalance = entry.runningBalance === 0 ? '0' : pkrFormatter.format(Math.abs(entry.runningBalance))

                      return (
                        <tr key={entry.id} className="hover:bg-gray-50 transition-colors divide-x divide-[#E5E7EB]">
                          {/* Date */}
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap tnum">
                            {(() => {
                              const [y, m, d] = entry.entry_date.split('-')
                              return `${parseInt(d)}/${parseInt(m)}`
                            })()}
                          </td>

                          {/* Page No */}
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {entry.page_no || ''}
                          </td>

                          {/* Detail */}
                          <td className="px-4 py-3 text-sm text-gray-900 min-w-[200px] max-w-[300px] whitespace-pre-wrap break-words">
                            {entry.detail || ''}
                          </td>

                          {/* Reference */}
                          <td className="px-4 py-3 text-sm text-gray-500 max-w-[140px] truncate" title={entry.reference}>
                            {entry.reference || ''}
                          </td>

                          {/* Debit */}
                          <td className="px-4 py-3 text-sm text-right font-semibold text-[#DC2626] tnum whitespace-nowrap">
                            {formattedDebit}
                          </td>

                          {/* Credit */}
                          <td className="px-4 py-3 text-sm text-right font-semibold text-[#16A34A] tnum whitespace-nowrap">
                            {formattedCredit}
                          </td>

                          {/* Running Balance */}
                          <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                            <span
                              className={`font-bold tnum ${
                                entry.runningBalance < 0
                                  ? 'text-[#16A34A]'
                                  : entry.runningBalance > 0
                                  ? 'text-[#DC2626]'
                                  : 'text-gray-900'
                              }`}
                            >
                              {entry.runningBalance > 0
                                ? 'Debit '
                                : entry.runningBalance < 0
                                ? 'Credit '
                                : ''}
                              {formattedRunningBalance}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-center no-print">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditNavigation(entry.account_id, entry.id)}
                                disabled={isNavigating && navigatingId === entry.id}
                                className="text-gray-400 hover:text-[#131924] transition-colors p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                                title="Edit Entry"
                              >
                                {isNavigating && navigatingId === entry.id ? (
                                  <Loader2 size={15} strokeWidth={2} className="animate-spin text-[#131924]" />
                                ) : (
                                  <Pencil size={15} strokeWidth={2} />
                                )}
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