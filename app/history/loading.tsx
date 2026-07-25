export default function HistoryLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      
      {/* Top Header Skeleton */}
      <div className="bg-[#131924] w-full safe-top pt-6 pb-5 sm:pt-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto w-full">
          
          {/* Title Row Skeleton */}
          <div className="flex items-center gap-3 mb-8 mt-6">
            <div className="w-10 h-10 bg-white/10 rounded-lg animate-pulse -ml-2"></div>
            <div className="h-8 w-64 bg-white/10 rounded-md animate-pulse"></div>
          </div>

          {/* Stacked Cards Skeleton */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="bg-[#2A313C]/50 rounded-2xl p-5 sm:p-6 border border-white/10 h-[96px] sm:h-[104px] animate-pulse"></div>
            <div className="bg-[#2A313C]/50 rounded-2xl p-5 sm:p-6 border border-white/10 h-[96px] sm:h-[104px] animate-pulse"></div>
          </div>
          
        </div>
      </div>

      {/* Filter + Print Toolbar Skeleton */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-2.5 flex items-center gap-2">
          <div className="h-9 w-32 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-9 w-24 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Table Content Skeleton */}
      <div className="flex-1 px-4 sm:px-6 pb-8 max-w-5xl mx-auto w-full pt-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-md overflow-hidden">
          
          {/* Table Header Row Skeleton */}
          <div className="h-[49px] bg-[#F7F8FA] border-b border-[#E5E7EB]"></div>
          
          {/* Table Rows Skeleton */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center px-5 py-5 border-b border-[#E5E7EB] gap-4">
              
              {/* account Name (40%) */}
              <div className="w-[40%]">
                <div className="h-4 w-32 sm:w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Total Debit (20%) */}
              <div className="w-[20%] flex justify-end">
                <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              {/* Total Credit (20%) */}
              <div className="w-[20%] flex justify-end">
                <div className="h-4 w-16 sm:w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Current Balance (20%) */}
              <div className="w-[20%] flex justify-end">
                <div className="h-4 w-20 sm:w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>

            </div>
          ))}
          
        </div>
      </div>
    </main>
  )
}