export default function FarmerLedgerLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      {/* Top Header Skeleton */}
      <div className="bg-[#131924] w-full safe-top">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-6">
          
          {/* Row 1: Back + Actions Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 bg-white/10 rounded-md animate-pulse"></div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-20 h-9 bg-white/10 rounded-lg animate-pulse hidden sm:block"></div>
              <div className="w-px h-4 bg-white/20 hidden sm:block"></div>
              <div className="w-28 h-9 bg-white/10 rounded-lg animate-pulse"></div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="w-10 sm:w-24 h-9 bg-white/10 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Row 2: Farmer info (left) + Balance (right) */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="min-w-0 flex-1 w-full">
              <div className="h-8 w-48 sm:w-64 bg-white/10 rounded-lg animate-pulse mb-4"></div>
              
              {/* Badges Skeleton */}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <div className="h-5 w-24 bg-white/5 rounded-md animate-pulse"></div>
                <div className="h-5 w-32 bg-white/5 rounded-md animate-pulse"></div>
                <div className="h-5 w-20 bg-white/5 rounded-md animate-pulse"></div>
                <div className="h-5 w-28 bg-white/5 rounded-md animate-pulse"></div>
              </div>
              
              {/* Notes Skeleton */}
              <div className="mt-4 h-16 w-full max-w-xl bg-white/5 rounded-xl animate-pulse"></div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <div className="text-left sm:text-right">
                <div className="h-3 w-24 bg-white/10 rounded animate-pulse mb-1.5"></div>
                <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-11 w-11 sm:w-28 sm:h-10 bg-white rounded-full sm:rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter + Print toolbar Skeleton */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-2.5 flex items-center gap-2">
          <div className="h-9 w-32 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-9 w-20 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Ledger Table area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        
        {/* Search/Filter Skeleton */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] mb-6 shadow-sm">
          <div className="h-12 w-full bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] mb-4 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-9 w-14 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-9 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-9 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="overflow-x-auto thin-scrollbar">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] h-[45px] divide-x divide-[#E5E7EB]">
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="divide-x divide-[#E5E7EB] animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-12 bg-gray-200 rounded"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-6 bg-gray-200 rounded"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-40 bg-gray-200 rounded"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div></td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-end gap-1.5">
                         <div className="h-3 w-10 bg-gray-200 rounded"></div>
                         <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <div className="h-7 w-7 bg-gray-200 rounded-lg"></div>
                        <div className="h-7 w-7 bg-gray-200 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}