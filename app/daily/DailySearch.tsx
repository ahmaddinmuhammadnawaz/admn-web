'use client'

import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { useRef } from 'react'

export default function DailySearch({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter()
  // This ref will hold our timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = (term: string) => {
    // Clear the previous timer if the user is still typing
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set a new timer to wait 300ms before hitting the server
    debounceTimer.current = setTimeout(() => {
      if (term) {
        router.replace(`/daily?q=${encodeURIComponent(term)}`)
      } else {
        router.replace('/daily')
      }
    }, 300) 
  }

  return (
    <div className="relative w-full">
      <Search size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
      <input 
        type="text"
        defaultValue={initialQuery} 
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by Date (DD-MM-YYYY) or Page No..." 
        className="w-full bg-[#F7F8FA] pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#131924] text-sm border border-transparent" 
      />
    </div>
  )
}