export default function SettingsLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
     {/* Top Header Skeleton */}
      {/* Match the pb-20 sm:pb-24 here */}
      <div className="bg-[#131924] w-full safe-top px-4 sm:px-6 py-6 sm:py-8 pb-20 sm:pb-24">
        <div className="max-w-2xl mx-auto w-full animate-pulse">
          <div className="w-8 h-8 bg-white/20 rounded-md mb-4 mt-5"></div>
          <div className="h-8 w-32 bg-white/20 rounded-lg"></div>
        </div>
      </div>

      {/* Content Container Skeleton */}
      {/* Match the -mt-12 sm:-mt-16 here */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full -mt-12 sm:-mt-16 pb-20">
        
        {/* 1. Change Password Card Skeleton */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-sm p-5 sm:p-8 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
            <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
            <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
            <div className="h-14 w-full bg-gray-300 rounded-xl mt-2"></div>
          </div>
        </div>

        {/* 2. Backup & Restore Card Skeleton */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-sm p-5 sm:p-8 mt-6 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
          </div>
          
          <div className="flex flex-col gap-6">
            {/* Export Section Skeleton */}
            <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E5E7EB]">
              <div className="h-5 w-32 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-5"></div>
              <div className="h-12 w-full sm:w-48 bg-gray-300 rounded-xl"></div>
            </div>
            
            {/* Import Section Skeleton */}
            <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E5E7EB]">
              <div className="h-5 w-40 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded mb-5"></div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="h-12 flex-1 bg-gray-200 rounded-xl"></div>
                <div className="h-12 w-full sm:w-36 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Danger Zone Card Skeleton */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-red-100 shadow-sm p-5 sm:p-8 mt-6 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg"></div>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-full bg-gray-100 rounded mb-6"></div>
          <div className="h-14 w-full sm:w-64 bg-red-200 rounded-xl"></div>
        </div>

      </div>
    </main>
  )
}