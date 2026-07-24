'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, X, MapPin, Phone, ChevronRight, Users } from 'lucide-react'

export default function DashboardClient({ initialFarmers }: { initialFarmers: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Active')

  // Filter the farmers just like the Dart logic in home_screen.dart
  const filteredFarmers = initialFarmers.filter((farmer) => {
    if (farmer.status !== statusFilter) return false

    if (searchQuery === '') return true

    const query = searchQuery.toLowerCase()
    const nameMatch = farmer.name.toLowerCase().includes(query)
    const areaMatch = (farmer.area || '').toLowerCase().includes(query)
    const phoneMatch = (farmer.phone || '').toLowerCase().includes(query)
    const refMatch = (farmer.reference_person || '').toLowerCase().includes(query)

    return nameMatch || areaMatch || phoneMatch || refMatch
  })

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm">
        <div className="relative mb-4">
          <Search size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, area, phone..."
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

        <div className="flex gap-2 overflow-x-auto thin-scrollbar -mx-1 px-1 pb-0.5">
          <button
            onClick={() => setStatusFilter('Active')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border whitespace-nowrap shrink-0 ${
              statusFilter === 'Active'
                ? 'bg-[#16A34A] text-white border-[#16A34A]'
                : 'bg-[#F7F8FA] text-[#16A34A] border-[#E5E7EB] hover:border-[#16A34A]'
            }`}
          >
            Active Accounts
          </button>
          <button
            onClick={() => setStatusFilter('Closed')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border whitespace-nowrap shrink-0 ${
              statusFilter === 'Closed'
                ? 'bg-[#6B7280] text-white border-[#6B7280]'
                : 'bg-[#F7F8FA] text-[#6B7280] border-[#E5E7EB] hover:border-[#6B7280]'
            }`}
          >
            Closed History
          </button>
        </div>
      </div>

      {/* Farmers Grid */}
      {filteredFarmers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-[#6B7280]">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center mb-4">
            <Users size={24} strokeWidth={1.75} />
          </div>
          <p className="text-base font-medium text-gray-700">
            {searchQuery !== '' ? 'No matches found' : `No ${statusFilter.toLowerCase()} accounts yet`}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery !== '' ? 'Try a different name, area, or phone number.' : 'New farmers you add will show up here.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredFarmers.map((farmer) => (
            <Link href={`/farmer/${farmer.id}`} key={farmer.id} className="block group">
              <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm group-hover:border-[#131924] group-hover:shadow-md transition-all h-full flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold text-lg text-gray-800 truncate">{farmer.name}</h2>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 truncate">
                    <MapPin size={13} strokeWidth={2} className="shrink-0" />
                    {farmer.area || 'No area specified'}
                  </p>
                  {farmer.phone && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 truncate">
                      <Phone size={13} strokeWidth={2} className="shrink-0" />
                      {farmer.phone}
                    </p>
                  )}
                </div>
                <ChevronRight size={18} strokeWidth={2} className="text-gray-300 group-hover:text-[#131924] transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
