export default function DaybookPageLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col relative pb-28">
      {/* Top Bar Skeleton */}
      <div className="bg-[#131924] w-full safe-top shadow-md relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 text-white">
            <div className="w-6 h-6 bg-white/10 rounded-md animate-pulse shrink-0 mt-0.5 sm:mt-0"></div>
            <div className="flex flex-col gap-2">
              <div className="h-7 w-32 sm:w-40 bg-white/10 rounded-md animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-4 w-24 bg-white/10 rounded-md animate-pulse"></div>
                <div className="h-5 w-16 bg-white/10 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto pl-[34px] sm:pl-0">
             <div className="h-10 w-full sm:w-[120px] bg-white/10 rounded-xl animate-pulse"></div>
             <div className="h-10 w-full sm:w-[140px] bg-white/10 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          
          {/* Add Entry Form Skeleton */}
          <div className="p-5 rounded-2xl shadow-sm border bg-white border-[#E5E7EB] flex flex-col lg:flex-row gap-4 items-start animate-pulse">
            <div className="w-full lg:w-[22%] h-[66px] bg-gray-100 rounded-xl"></div>
            <div className="w-full lg:flex-1 h-[66px] bg-gray-100 rounded-xl"></div>
            <div className="w-full lg:w-[12%] h-[66px] bg-gray-100 rounded-xl"></div>
            <div className="w-full lg:w-[25%] h-[66px] bg-gray-100 rounded-xl"></div>
            <div className="w-full lg:w-[90px] h-[42px] mt-[24px] bg-gray-200 rounded-xl hidden lg:block"></div>
            <div className="w-full h-[42px] bg-gray-200 rounded-xl lg:hidden mt-2"></div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto thin-scrollbar">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-[#F7F8FA] border-b border-[#E5E7EB] h-[45px] divide-x divide-[#E5E7EB]">
                    <th className="px-4 py-3"></th><th className="px-4 py-3"></th><th className="px-4 py-3"></th><th className="px-4 py-3"></th><th className="px-4 py-3"></th><th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="divide-x divide-[#E5E7EB] animate-pulse">
                      <td className="px-4 py-4"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-48 bg-gray-100 rounded"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-gray-100 rounded"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div></td>
                      <td className="px-4 py-4"><div className="h-7 w-16 bg-gray-200 rounded-lg mx-auto"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}