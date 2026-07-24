export default function SettingsLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      {/* Top Header Skeleton */}
        <div className="bg-[#131924] w-full safe-top px-4 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-14">
        <div className="max-w-2xl mx-auto w-full animate-pulse">
            {/* Added mt-5 here to push the back button and title down */}
            <div className="w-8 h-8 bg-white/20 rounded-md mb-4 mt-5"></div>
            <div className="h-8 w-32 bg-white/20 rounded-lg"></div>
        </div>
        </div>

      {/* Settings Card Skeleton */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full -mt-6 sm:-mt-10">
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
      </div>
    </main>
  )
}