'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Receipt, Loader2 } from 'lucide-react'

export default function LedgerClient({ 
  initialEntries, 
  currentPage = 1, 
  hasNextPage = false,
  accountId,
  accountStatus
}: { 
  initialEntries: any[], 
  currentPage?: number, 
  hasNextPage?: boolean,
  accountId: string,
  accountStatus: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')

  const filteredEntries = useMemo(() => {
    return initialEntries.filter((entry) => {
      if (filterType === 'Debit' && Number(entry.debit) === 0) return false
      if (filterType === 'Credit' && Number(entry.credit) === 0) return false
      if (searchQuery === '') return true

      const query = searchQuery.toLowerCase()
      const detailMatch = (entry.detail || '').toLowerCase().includes(query)
      const refMatch = (entry.reference || '').toLowerCase().includes(query)

      const [year, month, day] = entry.entry_date.split('-')
      const dateStr = `${parseInt(day)}/${parseInt(month)}/${year.slice(-2)}`
      const dateMatch = dateStr.includes(query)

      return detailMatch || refMatch || dateMatch
    })
  }, [initialEntries, filterType, searchQuery])

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">

      {/* 1. Search and Filters */}
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
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="overflow-x-auto thin-scrollbar">
              <table className="w-full text-left border-collapse min-w-[760px]">
               <thead>
                 <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#6B7280] text-[11px] uppercase tracking-wider divide-x divide-[#E5E7EB]">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 font-semibold">Detail</th>
                    <th className="px-4 py-3 font-semibold">Ref</th>
                    <th className="px-4 py-3 font-semibold text-right">Debit</th>
                    <th className="px-4 py-3 font-semibold text-right">Credit</th>
                    <th className="px-4 py-3 font-semibold text-right">Balance</th>
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

                      return (
                        <tr key={entry.id} className="divide-x divide-[#E5E7EB] transition-colors hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap tnum">
                            {(() => {
                              const [y, m, d] = entry.entry_date.split('-')
                              return `${parseInt(d)}/${parseInt(m)}/${y.slice(-2)}`
                            })()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 min-w-[200px] break-words whitespace-pre-wrap" title={entry.detail}>{entry.detail || ''}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 min-w-[120px] break-words whitespace-pre-wrap" title={entry.reference}>{entry.reference || ''}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-[#DC2626] tnum whitespace-nowrap">{formattedDebit}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-[#16A34A] tnum whitespace-nowrap">{formattedCredit}</td>
                          <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                            <span className={`font-bold tnum ${entry.runningBalance < 0 ? 'text-[#16A34A]' : entry.runningBalance > 0 ? 'text-[#DC2626]' : 'text-gray-900'}`}>
                              {entry.runningBalance > 0 ? 'Debit ' : entry.runningBalance < 0 ? 'Credit ' : ''}{formattedRunningBalance}
                            </span>
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
                  startTransition(() => {
                    const params = new URLSearchParams(window.location.search);
                    params.set('page', (currentPage - 1).toString());
                    router.push(`?${params.toString()}`);
                  })
                }}
                disabled={currentPage <= 1 || isPending}
                className="px-4 py-2 text-sm font-bold bg-white border border-[#E5E7EB] rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isPending && currentPage > 1 && <Loader2 size={14} className="animate-spin" />}
                Previous
              </button>
              <span className="text-sm font-medium text-gray-500">Page {currentPage}</span>
              <button
                onClick={() => {
                  startTransition(() => {
                    const params = new URLSearchParams(window.location.search);
                    params.set('page', (currentPage + 1).toString());
                    router.push(`?${params.toString()}`);
                  })
                }}
                disabled={!hasNextPage || isPending}
                className="px-4 py-2 text-sm font-bold bg-white border border-[#E5E7EB] rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isPending && hasNextPage && <Loader2 size={14} className="animate-spin" />}
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}