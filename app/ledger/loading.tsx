export default function GlobalLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen relative pb-28">
      {/* Top Bar Skeleton */}
      {/* --- STANDARD DARK TOP BAR --- */}
      <div className="bg-[#131924] w-full safe-top shadow-md relative z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-6 h-6 bg-white/10 rounded-md animate-pulse shrink-0 p-1 -ml-1"></div>
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 animate-pulse"></div>
            <div className="h-6 w-32 bg-white/10 rounded-md animate-pulse"></div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
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
        {/* Stats Row Skeleton */}
        <div className="flex gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm shrink-0 min-w-[72px] h-[76px] sm:h-[84px] animate-pulse flex flex-col items-center justify-center">
            <div className="w-8 h-6 bg-gray-200 rounded-md mb-2"></div>
            <div className="w-10 h-3 bg-gray-100 rounded-md"></div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm shrink-0 min-w-[72px] h-[76px] sm:h-[84px] animate-pulse flex flex-col items-center justify-center">
            <div className="w-8 h-6 bg-gray-200 rounded-md mb-2"></div>
            <div className="w-10 h-3 bg-gray-100 rounded-md"></div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5E7EB] shadow-sm flex-1 h-[76px] sm:h-[84px] animate-pulse flex flex-col items-center justify-center">
            <div className="w-24 sm:w-32 h-6 bg-gray-200 rounded-md mb-2"></div>
            <div className="w-16 h-3 bg-gray-100 rounded-md"></div>
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm animate-pulse">
          <div className="h-[46px] w-full bg-[#F7F8FA] rounded-xl border border-transparent"></div>
        </div>

        {/* Accounts & Folders Grid Skeleton */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm h-[114px] animate-pulse flex flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-5 w-32 bg-gray-200 rounded-md"></div>
                  <div className="h-3 w-20 bg-gray-100 rounded-md"></div>
                </div>
                <div className="h-6 w-16 bg-gray-100 rounded-lg shrink-0"></div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                <div className="h-3 w-24 bg-gray-100 rounded-md"></div>
                <div className="h-4 w-4 bg-gray-100 rounded-sm shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}