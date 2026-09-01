export default function DaybookDashboardLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col relative pb-28">
      {/* Top Bar Skeleton */}
      <div className="bg-[#131924] w-full safe-top shadow-md relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white/10 rounded-md animate-pulse shrink-0"></div>
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 animate-pulse"></div>
            <div className="w-28 h-6 bg-white/10 rounded-md animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Outstanding Link Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/10 rounded animate-pulse md:hidden"></div>
              <div className="w-20 h-5 bg-white/10 rounded-md animate-pulse hidden md:block"></div>
            </div>
            
            {/* Settings Link Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/10 rounded animate-pulse md:hidden"></div>
              <div className="w-16 h-5 bg-white/10 rounded-md animate-pulse hidden md:block"></div>
            </div>
            
            <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
            <div className="w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
        {/* Search Bar Skeleton */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm animate-pulse">
          <div className="h-[46px] w-full bg-[#F7F8FA] rounded-xl border border-transparent"></div>
        </div>

        {/* List Grid Skeleton */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm h-[90px] animate-pulse flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
                  <div className="h-3 w-20 bg-gray-100 rounded-md"></div>
                </div>
                <div className="h-6 w-16 bg-gray-100 rounded-lg shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}