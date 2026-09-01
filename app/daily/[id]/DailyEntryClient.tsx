'use client'

import { useTransition, useRef, useState, useEffect } from 'react'
import { addDailyEntry, deleteDailyEntry, updateDailyEntry } from '@/app/actions'
import { Loader2, Trash2, Pencil, X, ExternalLink } from 'lucide-react'
import { ConfirmModal } from '@/components/ConfirmModal'
import Link from 'next/link'

export default function DailyEntryClient({ page, entries, accounts }: { page: any, entries: any[], accounts: any[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [editingEntry, setEditingEntry] = useState<any | null>(null)
  
  // Delete modal state
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, entryId: string | null}>({
    isOpen: false,
    entryId: null
  })

  // --- CUSTOM ACCOUNT SEARCH STATE ---
  const [accountSearch, setAccountSearch] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Sync custom dropdown when clicking "Edit" on an entry
  useEffect(() => {
    if (editingEntry) {
      setSelectedAccountId(editingEntry.account_id)
      const acc = accounts.find(a => a.id === editingEntry.account_id)
      setAccountSearch(acc ? `${acc.name} ${acc.area ? `(${acc.area})` : ''}` : '')
    } else {
      setSelectedAccountId('')
      setAccountSearch('')
    }
  }, [editingEntry, accounts])

  // Filter accounts based on typing
  const filteredAccounts = accounts.filter(acc => {
    const searchStr = `${acc.name} ${acc.area || ''}`.toLowerCase()
    return searchStr.includes(accountSearch.toLowerCase())
  })

  const handleConfirmDelete = async () => {
    if (deleteModal.entryId) {
      setIsDeleting(true)
      try {
        await deleteDailyEntry(deleteModal.entryId, page.id)
      } catch (error) {
        console.error("Failed to delete entry:", error)
        alert("Failed to delete the entry. Please try again.")
      } finally {
        setIsDeleting(false)
        setDeleteModal({ isOpen: false, entryId: null })
      }
    }
  }
  
  // Single state for the button toggle
  const [isDebit, setIsDebit] = useState(true)

  // Update toggle state automatically if an entry is selected for editing
  useEffect(() => {
    if (editingEntry) {
      setIsDebit(editingEntry.debit > 0)
    } else {
      setIsDebit(true)
    }
    
    // Auto-resize detail textarea when editing an entry with long text
    setTimeout(() => {
      const textarea = formRef.current?.querySelector('textarea[name="detail"]') as HTMLTextAreaElement
      if (textarea) {
        textarea.style.height = '42px'
        textarea.style.height = textarea.scrollHeight + 'px'
      }
    }, 0)
  }, [editingEntry])

  const totalDebit = entries.reduce((sum, e) => sum + Number(e.debit), 0)
  const totalCredit = entries.reduce((sum, e) => sum + Number(e.credit), 0)
  const pkrFormatter = new Intl.NumberFormat('en-PK')

  const handleSubmit = (formData: FormData) => {
    if (!selectedAccountId) {
      alert('Please select a valid account from the dropdown list.')
      return
    }

    startTransition(async () => {
      if (editingEntry) {
        await updateDailyEntry(editingEntry.id, page.id, formData)
        setEditingEntry(null)
      } else {
        await addDailyEntry(page.id, formData)
        setIsDebit(true) // Reset toggle after adding
        formRef.current?.reset()
        // Clear search box after successful addition
        setSelectedAccountId('')
        setAccountSearch('')
      }
      // Reset textarea height after submit
      const textarea = formRef.current?.querySelector('textarea[name="detail"]') as HTMLTextAreaElement
      if (textarea) textarea.style.height = '42px'
    })
  }

  const cancelEdit = () => {
    setEditingEntry(null)
    setSelectedAccountId('')
    setAccountSearch('')
    formRef.current?.reset()
    // Reset textarea height
    const textarea = formRef.current?.querySelector('textarea[name="detail"]') as HTMLTextAreaElement
    if (textarea) textarea.style.height = '42px'
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* ADD / EDIT ENTRY FORM */}
      {!page.is_transferred && (
        <form 
          key={editingEntry ? editingEntry.id : 'new'} 
          ref={formRef} 
          action={handleSubmit} 
          className={`p-5 rounded-2xl shadow-sm border flex flex-col lg:flex-row gap-4 items-start transition-all ${
            editingEntry ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-[#E5E7EB]'
          }`}
        >
          <div className="w-full lg:w-[22%] relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-gray-500 mb-1">Name *</label>
            {/* Hidden input actually sends the ID to the server action */}
             <input type="hidden" name="account_id" value={selectedAccountId} />
            
            <input 
              type="text"
              placeholder="Search Account..."
              value={accountSearch}
              onChange={(e) => {
                setAccountSearch(e.target.value)
                setIsDropdownOpen(true)
                setSelectedAccountId('') // Clear valid selection if they start typing again
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm h-[42px]"
              autoComplete="off"
            />
            
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg max-h-60 overflow-y-auto thin-scrollbar">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map(acc => (
                    <div 
                      key={acc.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                      onClick={() => {
                        setSelectedAccountId(acc.id)
                        setAccountSearch(`${acc.name} ${acc.area ? `(${acc.area})` : ''}`)
                        setIsDropdownOpen(false)
                      }}
                    >
                      <div className="font-bold text-gray-900 text-sm">{acc.name}</div>
                      {acc.area && <div className="text-[11px] text-gray-500 mt-0.5">{acc.area}</div>}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-sm text-gray-500 text-center">No accounts found</div>
                )}
              </div>
            )}
          </div>
          
          <div className="w-full lg:flex-1">
            <label className="block text-xs font-bold text-gray-500 mb-1">Detail</label>
            <textarea 
              name="detail" 
              rows={1} 
              defaultValue={editingEntry?.detail || ""} 
              onInput={(e) => {
                e.currentTarget.style.height = '42px'
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm resize-none overflow-hidden min-h-[42px] transition-all duration-75" 
            />
          </div>
          
          <div className="w-full lg:w-[12%]">
            <label className="block text-xs font-bold text-gray-500 mb-1">Reference</label>
            <input name="reference" type="text" defaultValue={editingEntry?.reference || ""} className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm h-[42px]" />
          </div>
          
          <div className="w-full lg:w-[25%] flex gap-2">
            <div className="w-[40%]">
              <label className="block text-xs font-bold text-gray-500 mb-1">Type *</label>
              {/* Hidden input to actually submit the value */}
              <input type="hidden" name="type" value={isDebit ? 'Debit' : 'Credit'} />
              {/* THE SINGLE TOGGLE BUTTON */}
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
            
            <div className="w-[60%]">
              <label className="block text-xs font-bold text-gray-500 mb-1">Amount *</label>
              <input name="amount" type="number" required min="1" defaultValue={editingEntry ? (editingEntry.debit > 0 ? editingEntry.debit : editingEntry.credit) : ''} className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] bg-white text-sm font-bold tnum h-[42px]" />
            </div>
          </div>
          
          <div className="w-full lg:w-auto flex flex-col">
            <label className="block text-xs font-bold text-transparent mb-1 hidden lg:block" aria-hidden="true">Action</label>
            <div className="flex gap-2 w-full h-[42px]">
              {editingEntry && (
                <button type="button" onClick={cancelEdit} className="px-4 h-full rounded-xl font-bold bg-white border border-[#E5E7EB] text-gray-600 hover:bg-gray-50 transition-colors">
                  <X size={18} />
                </button>
              )}
              <button type="submit" disabled={isPending} className={`flex-1 lg:flex-none text-white px-6 h-full rounded-xl font-bold transition-colors disabled:opacity-70 flex items-center justify-center min-w-[90px] ${editingEntry ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#131924] hover:bg-gray-800'}`}>
                {isPending ? <Loader2 size={18} className="animate-spin" /> : (editingEntry ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#6B7280] text-[11px] uppercase tracking-wider divide-x divide-[#E5E7EB]">
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Name</th>
                <th className="px-4 py-3 font-semibold">Detail</th>
                <th className="px-4 py-3 font-semibold">Ref</th>
                <th className="px-4 py-3 font-semibold text-right">Debit</th>
                <th className="px-4 py-3 font-semibold text-right">Credit</th>
                {!page.is_transferred && <th className="px-4 py-3 font-semibold text-center w-[80px]">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {entries.map(entry => {
                const isBeingEdited = editingEntry?.id === entry.id
                return (
                  <tr key={entry.id} className={`divide-x divide-[#E5E7EB] transition-colors ${isBeingEdited ? 'bg-amber-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 whitespace-nowrap">
                      {page.is_transferred ? (
                        <Link 
                          href={`/account/${entry.account_id}`}
                          className="inline-flex items-center gap-1.5 text-gray-900 hover:text-blue-600 transition-colors group/link"
                          title="Open Account Ledger to Edit"
                        >
                          {entry.accounts.name}
                          <ExternalLink size={14} className="text-gray-400 group-hover/link:text-blue-600 transition-colors" strokeWidth={2.5} />
                        </Link>
                      ) : (
                        entry.accounts.name
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 min-w-[200px] break-words whitespace-pre-wrap" title={entry.detail}>
                      {entry.detail || ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 min-w-[120px] break-words whitespace-pre-wrap">{entry.reference || ''}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-[#DC2626] tnum whitespace-nowrap">
                      {entry.debit > 0 ? pkrFormatter.format(entry.debit) : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-[#16A34A] tnum whitespace-nowrap">
                      {entry.credit > 0 ? pkrFormatter.format(entry.credit) : ''}
                    </td>
                    {!page.is_transferred && (
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => setEditingEntry(entry)} 
                            className={`p-1.5 rounded-lg transition-colors ${isBeingEdited ? 'bg-amber-200 text-amber-800' : 'text-gray-400 hover:text-[#131924] hover:bg-gray-200'}`}
                            title="Edit Entry"
                          >
                            <Pencil size={15} strokeWidth={2} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setDeleteModal({ isOpen: true, entryId: entry.id })} 
                            className="text-gray-400 hover:text-[#DC2626] transition-colors p-1.5 rounded-lg hover:bg-red-50"
                            title="Delete Entry"
                          >
                            <Trash2 size={15} strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
              
              {entries.length > 0 && (
                <tr className="bg-[#F7F8FA] divide-x divide-[#E5E7EB] border-t-2 border-[#E5E7EB]">
                  <td colSpan={3} className="px-4 py-4 text-xs font-bold text-right text-gray-500 uppercase tracking-wider">Total</td>
                  <td className="px-4 py-4 text-sm text-right font-bold text-[#DC2626] tnum">{pkrFormatter.format(totalDebit)}</td>
                  <td className="px-4 py-4 text-sm text-right font-bold text-[#16A34A] tnum">{pkrFormatter.format(totalCredit)}</td>
                  {!page.is_transferred && <td></td>}
                </tr>
              )}
            </tbody>
          </table>
          
          {entries.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-500">
              No entries for this day yet. Fill out the form above to add one.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, entryId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Entry"
        description="Are you sure you want to delete this entry? This action cannot be undone."
        confirmText="Delete Entry"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  )
}