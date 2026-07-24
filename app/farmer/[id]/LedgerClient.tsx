'use client'

import { useState } from 'react'
import { deleteLedgerEntry } from '@/app/actions'
import Link from 'next/link'
import { Search, X, Pencil, Trash2, Receipt } from 'lucide-react'

export default function LedgerClient({ initialEntries }: { initialEntries: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('All')

  // Create a handler for the delete button
  const handleDelete = async (entryId: string, farmerId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction? This will recalculate the balance.')) {
      await deleteLedgerEntry(entryId, farmerId)
    }
  }

  const filteredEntries = initialEntries.filter((entry) => {
    // 1. Apply Type Filter
    if (filterType === 'Debit' && Number(entry.debit) === 0) return false
    if (filterType === 'Credit' && Number(entry.credit) === 0) return false

    // 2. Apply Search Filter
    if (searchQuery === '') return true

    const query = searchQuery.toLowerCase()
    const detailMatch = (entry.detail || '').toLowerCase().includes(query)
    const refMatch = (entry.reference || '').toLowerCase().includes(query)
    const pageMatch = (entry.page_no || '').toLowerCase().includes(query)

    // Format date to match typical search patterns
    const dateStr = new Date(entry.entry_date).toLocaleDateString()
    const dateMatch = dateStr.includes(query)

    return detailMatch || refMatch || pageMatch || dateMatch
  })

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm">
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
                  <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#6B7280] text-[11px] uppercase tracking-wider">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 font-semibold">Pg</th>
                    <th className="px-4 py-3 font-semibold">Detail</th>
                    <th className="px-4 py-3 font-semibold">Ref</th>
                    <th className="px-4 py-3 font-semibold text-right">Debit</th>
                    <th className="px-4 py-3 font-semibold text-right">Credit</th>
                    <th className="px-4 py-3 font-semibold text-right">Balance</th>
                    <th className="px-4 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredEntries.map((entry) => {
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        {/* Date */}
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap tnum">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </td>

                        {/* Page No */}
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {entry.page_no || '-'}
                        </td>

                        {/* Detail */}
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate" title={entry.detail}>
                          {entry.detail || '-'}
                        </td>

                        {/* Reference */}
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[140px] truncate" title={entry.reference}>
                          {entry.reference || '-'}
                        </td>

                        {/* Debit */}
                        <td className="px-4 py-3 text-sm text-right font-semibold text-[#DC2626] tnum whitespace-nowrap">
                          {Number(entry.debit) > 0 ? `Rs ${entry.debit}` : ''}
                        </td>

                        {/* Credit */}
                        <td className="px-4 py-3 text-sm text-right font-semibold text-[#16A34A] tnum whitespace-nowrap">
                          {Number(entry.credit) > 0 ? `Rs ${entry.credit}` : ''}
                        </td>

                        {/* Running Balance */}
                        <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                          <span className={`font-bold tnum ${entry.runningBalance < 0 ? 'text-[#16A34A]' : entry.runningBalance > 0 ? 'text-[#DC2626]' : 'text-gray-900'}`}>
                            {entry.runningBalance === 0 ? 'Rs 0' : `Rs ${Math.abs(entry.runningBalance)}`}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 ml-1">
                            {entry.runningBalance > 0 ? 'Debit' : entry.runningBalance < 0 ? 'Credit' : ''}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              href={`/farmer/${entry.farmer_id}/edit-entry/${entry.id}`}
                              className="text-gray-400 hover:text-[#131924] transition-colors p-1.5 rounded-lg hover:bg-gray-200"
                              title="Edit Entry"
                            >
                              <Pencil size={15} strokeWidth={2} />
                            </Link>

                            <button
                              onClick={() => handleDelete(entry.id, entry.farmer_id)}
                              className="text-gray-400 hover:text-[#DC2626] transition-colors p-1.5 rounded-lg hover:bg-red-50"
                              title="Delete Entry"
                            >
                              <Trash2 size={15} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}