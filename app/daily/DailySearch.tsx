'use client'

import { useRouter } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { useRef, useTransition } from 'react'

export default function DailySearch({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter()
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSearch = (term: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      startTransition(() => {
        if (term) {
          router.replace(`/daily?q=${encodeURIComponent(term)}`)
        } else {
          router.replace('/daily')
        }
      })
    }, 300) 
  }

  return (
    <div className="relative w-full">
      {isPending ? (
        <Loader2 size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#131924] animate-spin pointer-events-none" />
      ) : (
        <Search size={17} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
      )}
      
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