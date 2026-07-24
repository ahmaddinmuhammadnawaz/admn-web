import { Loader2 } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen relative pb-28">
      {/* Top Bar Skeleton */}
      <div className="bg-[#131924] w-full safe-top">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 animate-pulse"></div>
            <div className="h-4 w-32 sm:w-48 bg-white/10 rounded-md animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stats Row Skeleton */}
        <div className="flex gap-3 mb-6">
          <div className="bg-gray-200/50 rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shrink-0 min-w-[72px] h-20 animate-pulse"></div>
          <div className="bg-gray-200/50 rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shrink-0 min-w-[72px] h-20 animate-pulse"></div>
          <div className="bg-gray-200/50 rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] flex-1 h-20 animate-pulse"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-gray-200/50 rounded-2xl border border-[#E5E7EB] mb-6 h-[72px] animate-pulse shadow-sm"></div>

        {/* Farmers Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 bg-gray-200/50 border border-[#E5E7EB] rounded-xl shadow-sm h-[104px] animate-pulse flex flex-col justify-center gap-3">
              <div className="h-5 w-3/4 bg-gray-300/50 rounded-md"></div>
              <div className="h-3 w-1/2 bg-gray-300/50 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}