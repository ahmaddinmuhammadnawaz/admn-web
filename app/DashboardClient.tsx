'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, X, MapPin, Phone, ChevronRight, Users, User, Folder } from 'lucide-react'

interface DashboardClientProps {
  initialaccounts: any[]
  folders?: any[] // Made optional
  stats?: { // Made optional
    activeCount: number
    closedCount: number
    netBalance: number
    balanceLabel: string
  }
  isFolderView?: boolean // NEW: Tells the client it's rendering inside a folder
}

export default function DashboardClient({ initialaccounts, folders = [], stats, isFolderView = false }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Active')

  // Filter the accounts based on search query and tab status
  const filteredaccounts = initialaccounts.filter((account) => {
    // Only apply the Active/Closed filter if we are NOT in folder view
    if (!isFolderView && account.status !== statusFilter) return false
    
    if (searchQuery === '') return true

    const query = searchQuery.toLowerCase()
    const nameMatch = account.name.toLowerCase().includes(query)
    const areaMatch = (account.area || '').toLowerCase().includes(query)
    const phoneMatch = (account.phone || '').toLowerCase().includes(query)
    const refMatch = (account.reference_person || '').toLowerCase().includes(query)
    const fatherMatch = (account.father_name || '').toLowerCase().includes(query)

    return nameMatch || areaMatch || phoneMatch || refMatch || fatherMatch
  })

  // NEW: If we are in folder view, show all filtered accounts. 
  // If on the home screen, only show "loose" accounts that don't belong to a folder.
  const displayAccounts = isFolderView ? filteredaccounts : filteredaccounts.filter(a => !a.folder_id)

  const filteredFolders = folders.filter(folder => 
    searchQuery === '' || folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {/* Interactive Stats Row - ONLY SHOW IF NOT IN FOLDER VIEW */}
      {!isFolderView && stats && (
        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setStatusFilter('Active')}
            className={`rounded-2xl p-4 sm:p-5 border shadow-sm shrink-0 min-w-[72px] text-center transition-all ${
              statusFilter === 'Active' ? 'bg-white border-[#16A34A] ring-1 ring-[#16A34A]' : 'bg-white border-[#E5E7EB] hover:border-[#131924]'
            }`}
          >
            <p className="text-lg sm:text-xl font-bold text-gray-900 tnum">{stats.activeCount}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Active</p>
          </button>
          
          <button 
            onClick={() => setStatusFilter('Closed')}
            className={`rounded-2xl p-4 sm:p-5 border shadow-sm shrink-0 min-w-[72px] text-center transition-all ${
              statusFilter === 'Closed' ? 'bg-white border-[#6B7280] ring-1 ring-[#6B7280]' : 'bg-white border-[#E5E7EB] hover:border-[#131924]'
            }`}
          >
            <p className="text-lg sm:text-xl font-bold text-gray-900 tnum">{stats.closedCount}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">Closed</p>
          </button>
          
          <Link 
            href="/history"
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] hover:border-[#131924] shadow-sm flex-1 min-w-0 text-center transition-all cursor-pointer block"
          >
            <p className={`text-base sm:text-lg font-bold truncate tnum ${
              stats.netBalance > 0 
                ? 'text-[#DC2626]' 
                : stats.netBalance < 0 
                ? 'text-[#16A34A]' 
                : 'text-gray-900'
            }`}>
              {stats.balanceLabel}
            </p>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1">Outstanding</p>
          </Link>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm">
        <div className="relative">
          <Search size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, area, phone, father name..."
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
      </div>

      {/* Main Grid for Folders and Accounts */}
      {!isFolderView && filteredFolders.length === 0 && displayAccounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-[#6B7280]">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-4">
            <Users size={24} strokeWidth={1.75} />
          </div>
          <p className="text-base font-medium text-gray-700">
            {searchQuery !== '' ? 'No matches found' : `No ${statusFilter.toLowerCase()} accounts or folders yet`}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery !== '' ? 'Try a different search term.' : 'Items you add will show up here.'}
          </p>
        </div>
      ) : isFolderView && displayAccounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-[#6B7280]">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-4">
            <Folder size={24} strokeWidth={1.75} />
          </div>
          <p className="text-base font-medium text-gray-700">Folder is empty</p>
          <p className="text-sm text-gray-400 mt-1">Move an account here by editing it.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          
          {/* Render Folders First (Only on Home Screen) */}
          {!isFolderView && filteredFolders.map(folder => (
            <Link href={`/folder/${folder.id}`} key={folder.id} className="block group">
              <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm group-hover:border-[#131924] group-hover:shadow-md transition-all h-full flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-[#E5E7EB]">
                    <Folder size={24} className="text-[#131924]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">{folder.name}</h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{folder.accountCount} Accounts</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 text-xs font-semibold pt-3 border-t border-gray-200">
                  <span className="text-[#16A34A]">Credit {new Intl.NumberFormat('en-PK').format(folder.totalCredit)}</span>
                  <span className="text-[#DC2626]">Debit {new Intl.NumberFormat('en-PK').format(folder.totalDebit)}</span>
                </div>
              </div>
            </Link>
          ))}

          {/* Render Accounts */}
          {(() => {
            const pkrFormatter = new Intl.NumberFormat('en-PK')
            
            return displayAccounts.map((account) => {
              const bal = account.balance || 0
              const formattedBal = pkrFormatter.format(Math.abs(bal))
              
              return (
                <Link href={`/account/${account.id}`} key={account.id} className="block group">
                  <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm group-hover:border-[#131924] group-hover:shadow-md transition-all h-full flex flex-col justify-between gap-4">
                    
                    {/* Top: Name & Balance */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-bold text-lg text-gray-800 truncate">{account.name}</h2>
                        {account.father_name && (
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 truncate">
                            <User size={12} strokeWidth={2} className="shrink-0" />
                            S/O {account.father_name}
                          </p>
                        )}
                      </div>

                      {/* Balance Badge */}
                      <div className="text-right shrink-0">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold tnum ${
                          bal > 0 
                            ? 'bg-red-50 text-[#DC2626]' 
                            : bal < 0 
                            ? 'bg-green-50 text-[#16A34A]' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {bal === 0 ? '0' : bal > 0 ? `Debit ${formattedBal}` : `Credit ${formattedBal}`}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Location & Phone info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-3 truncate">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin size={12} strokeWidth={2} className="shrink-0" />
                          {account.area || 'No location'}
                        </span>
                        {account.phone && (
                          <span className="flex items-center gap-1 truncate">
                            <Phone size={12} strokeWidth={2} className="shrink-0" />
                            {account.phone}
                          </span>
                        )}
                      </div>
                      <ChevronRight size={16} strokeWidth={2} className="text-gray-300 group-hover:text-[#131924] transition-colors shrink-0 ml-2" />
                    </div>

                  </div>
                </Link>
              )
            })
          })()}
        </div>
      )}
    </>
  )
}