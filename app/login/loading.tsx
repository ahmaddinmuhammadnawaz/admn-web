export default function LoginLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F8FA] p-5 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 animate-pulse">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-200 mb-5"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
          </div>
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-[50px] w-full bg-gray-100 rounded-xl border border-[#E5E7EB]"></div>
          </div>
          <div className="h-[50px] w-full bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </main>
  )
}