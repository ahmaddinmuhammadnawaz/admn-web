export default function HubLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col relative pb-28">
      {/* Top Bar Skeleton */}
      <div className="bg-[#131924] w-full safe-top shadow-md relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 animate-pulse"></div>
            <div className="w-20 h-6 bg-white/10 rounded-md animate-pulse"></div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-5 bg-white/10 rounded-md animate-pulse hidden md:block"></div>
            <div className="w-16 h-5 bg-white/10 rounded-md animate-pulse hidden md:block"></div>
            <div className="w-px h-5 bg-white/20 hidden sm:block"></div>
            <div className="w-6 h-6 bg-white/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Workspace Skeleton */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 max-w-4xl mx-auto mt-4 sm:mt-8">
          
          {/* Book 1 Skeleton */}
          <div className="bg-white rounded-r-3xl rounded-l-md p-8 sm:p-12 shadow-sm flex flex-col h-[420px] border-y border-[#E5E7EB] border-r-[4px] border-r-gray-200 border-l-[32px] border-l-[#131924] animate-pulse">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-[52px] h-[52px] bg-gray-200 rounded-2xl"></div>
              <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
            </div>
            
            <div className="w-48 h-10 bg-gray-200 rounded-xl mb-4"></div>
            
            <div className="mt-auto pt-6 border-t-2 border-gray-100">
              <div className="w-full h-3 bg-gray-100 rounded mb-2.5"></div>
              <div className="w-2/3 h-3 bg-gray-100 rounded"></div>
            </div>
          </div>

          {/* Book 2 Skeleton */}
          <div className="bg-white rounded-r-3xl rounded-l-md p-8 sm:p-12 shadow-sm flex flex-col h-[420px] border-y border-[#E5E7EB] border-r-[4px] border-r-gray-200 border-l-[32px] border-l-[#131924] animate-pulse">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-[52px] h-[52px] bg-gray-200 rounded-2xl"></div>
              <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
            </div>
            
            <div className="w-56 h-10 bg-gray-200 rounded-xl mb-4"></div>
            
            <div className="mt-auto pt-6 border-t-2 border-gray-100">
              <div className="w-full h-3 bg-gray-100 rounded mb-2.5"></div>
              <div className="w-2/3 h-3 bg-gray-100 rounded"></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}