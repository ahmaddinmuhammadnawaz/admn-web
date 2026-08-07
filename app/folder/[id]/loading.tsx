import { ArrowLeft, Folder } from 'lucide-react'

export default function FolderLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen relative pb-28">
      {/* Top Bar Skeleton matching the Folder Page */}
      <div className="bg-[#131924] w-full safe-top">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          
          {/* Back Button & Title Skeleton */}
          <div className="flex items-center gap-4 text-white/50 min-w-0 pr-4">
            <ArrowLeft size={24} className="opacity-50 shrink-0" />
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Folder size={24} className="opacity-50 shrink-0" />
              <div className="h-6 w-32 sm:w-48 bg-white/10 rounded-md animate-pulse"></div>
            </div>
          </div>
          
          {/* Action Buttons Skeleton (Manage, Edit, Delete) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Manage Accounts */}
            <div className="h-[36px] w-[36px] sm:w-[155px] bg-white/10 rounded-lg animate-pulse"></div>
            {/* Edit */}
            <div className="h-[36px] w-[36px] sm:w-[75px] bg-white/10 rounded-lg animate-pulse"></div>
            {/* Delete */}
            <div className="h-[36px] w-[36px] sm:w-[90px] bg-white/10 rounded-lg animate-pulse"></div>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Search Bar Skeleton (Notice there are no stats boxes above this!) */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm">
           <div className="h-11 w-full bg-[#F7F8FA] rounded-xl animate-pulse"></div>
        </div>

        {/* Accounts Grid Skeleton */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 sm:p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-sm h-[120px] flex flex-col justify-between gap-4">
              
              {/* Top: Name & Balance Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex flex-col gap-1.5 mt-0.5">
                  <div className="h-5 w-32 sm:w-40 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="shrink-0">
                  <div className="h-6 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Bottom: Location & Chevron */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="h-4 w-4 bg-gray-200 rounded-sm shrink-0 animate-pulse"></div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  )
}