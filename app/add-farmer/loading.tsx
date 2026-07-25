export default function AddFarmerLoading() {
  return (
    <main className="bg-[#F7F8FA] min-h-screen p-4 sm:p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E5E7EB] p-5 sm:p-8 mt-2 sm:mt-10 animate-pulse">

        {/* Header Skeleton */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>
          <div className="h-7 sm:h-8 w-48 bg-gray-200 rounded-md"></div>
        </div>

        {/* Form Fields Skeleton */}
        <div className="flex flex-col gap-5">
          
          {/* Name */}
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
          </div>

          {/* Father Name / Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
            </div>
            <div>
              <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>
              <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
            </div>
          </div>

          {/* Area / Reference Person */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="h-4 w-12 bg-gray-200 rounded mb-2"></div>
              <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
            </div>
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
            </div>
          </div>
          
          {/* CNIC / Main Crop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="h-4 w-12 bg-gray-200 rounded mb-2"></div>
              <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
            </div>
            <div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-[100px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
          </div>

          {/* Submit Button */}
          <div className="h-[56px] w-full bg-gray-200 rounded-xl mt-4"></div>
        </div>

      </div>
    </main>
  )
}