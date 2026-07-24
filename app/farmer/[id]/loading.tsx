export default function FarmerLedgerLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      {/* Top Header Skeleton */}
      <div className="bg-[#131924] w-full safe-top">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-6">
          
          {/* Row 1: Back + Actions Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 bg-white/10 rounded-md animate-pulse"></div>
            <div className="w-32 h-8 bg-white/10 rounded-lg animate-pulse"></div>
          </div>

          {/* Row 2: Farmer info (left) + Balance (right) */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="min-w-0 flex-1 w-full">
              <div className="h-8 w-48 sm:w-64 bg-white/10 rounded-lg animate-pulse mb-4"></div>
              
              {/* Badges Skeleton */}
              <div className="flex flex-wrap gap-2">
                <div className="h-5 w-24 bg-white/5 rounded-md animate-pulse"></div>
                <div className="h-5 w-28 bg-white/5 rounded-md animate-pulse"></div>
                <div className="h-5 w-20 bg-white/5 rounded-md animate-pulse"></div>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
              <div className="h-3 w-24 bg-white/10 rounded animate-pulse"></div>
              <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        {/* Search/Filter Skeleton */}
        <div className="bg-gray-200/50 p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm h-20 animate-pulse"></div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="h-10 bg-[#F7F8FA] border-b border-[#E5E7EB]"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 border-b border-[#E5E7EB] flex items-center px-4 gap-4 animate-pulse">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded hidden sm:block"></div>
              <div className="h-4 flex-1 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}