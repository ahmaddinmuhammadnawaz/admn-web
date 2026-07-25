export default function EntryLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen p-4 sm:p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E5E7EB] p-5 sm:p-8 mt-2 sm:mt-10 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex flex-col gap-5 mb-6">
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
          <div className="h-8 w-40 bg-gray-200 rounded"></div>
        </div>
        
        {/* Form Fields Skeleton */}
        <div className="flex flex-col gap-5">
          {/* Debit/Credit Toggle Skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
            <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
            <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
          </div>
          
          <div className="h-24 w-full bg-gray-200 rounded-xl"></div>
          <div className="h-14 w-full bg-gray-300 rounded-xl mt-4"></div>
        </div>

      </div>
    </main>
  )
}