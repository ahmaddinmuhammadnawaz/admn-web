'use client'

import { useState, useTransition } from 'react'
import { CheckSquare, X, Search, Loader2, Check } from 'lucide-react'
import { manageFolderAccounts } from '@/app/actions'

export default function ManageFolderAccounts({ folderId, allAccounts }: { folderId: string, allAccounts: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()
  
  // Track which accounts are currently selected
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(allAccounts.filter(a => a.folder_id === folderId).map(a => a.id))
  )

  const toggleAccount = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const handleSave = () => {
    startTransition(async () => {
      await manageFolderAccounts(folderId, Array.from(selectedIds))
      setIsOpen(false)
    })
  }

  // Filter the master list so it only shows accounts in THIS folder, or accounts in NO folder.
  const availableAccounts = allAccounts.filter(a => 
    a.folder_id === folderId || !a.folder_id
  )

  // Apply the search filter to the available accounts
  const filteredAccounts = availableAccounts.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    (a.area || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleOpen = () => {
    setIsOpen(true)
    setSearch('') // Clear search bar on open
    // Reset checkboxes to their actual saved state in case user canceled previously
    setSelectedIds(new Set(allAccounts.filter(a => a.folder_id === folderId).map(a => a.id)))
  }

  return (
    <>
      <button 
        onClick={handleOpen}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <CheckSquare size={16} />
        <span className="hidden sm:inline">Manage Accounts</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#131924]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-lg border border-[#E5E7EB] flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] shrink-0">
              <h2 className="text-lg font-bold text-[#131924]">Add or Remove Accounts</h2>
              <button onClick={() => setIsOpen(false)} className="text-[#9CA3AF] hover:text-[#131924] transition-colors p-1 rounded-md">
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-[#E5E7EB] shrink-0 bg-[#F7F8FA]">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#131924] text-sm"
                />
              </div>
            </div>

            {/* Account List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredAccounts.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  {search !== '' 
                    ? 'No accounts found.' 
                    : 'No available accounts. (Accounts in other folders must be removed from them first).'}
                </div>
              ) : (
                filteredAccounts.map(account => {
                  const isSelected = selectedIds.has(account.id)
                  return (
                    <div 
                      key={account.id}
                      onClick={() => toggleAccount(account.id)}
                      className={`flex items-center justify-between p-3 m-1 rounded-xl cursor-pointer transition-colors border ${
                        isSelected ? 'bg-[#F7F8FA] border-[#131924] shadow-sm' : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{account.name}</p>
                        {account.area && <p className="text-xs text-gray-500 mt-0.5">{account.area}</p>}
                      </div>
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-[#131924] border-[#131924]' : 'bg-white border-[#D1D5DB]'
                      }`}>
                        {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E5E7EB] shrink-0 bg-[#F7F8FA] rounded-b-2xl sm:rounded-b-3xl">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="w-full bg-[#131924] text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                {isPending ? 'Saving...' : `Save ${selectedIds.size} Accounts to Folder`}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}