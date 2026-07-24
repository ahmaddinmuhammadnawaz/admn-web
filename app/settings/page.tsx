import { changePassword } from '@/app/actions'
import Link from 'next/link'
import { ArrowLeft, KeyRound } from 'lucide-react'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams

  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-[#131924] w-full safe-top px-4 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-14">
        <div className="max-w-2xl mx-auto w-full">
          <Link
            href="/"
            className="text-white opacity-80 hover:opacity-100 transition-opacity px-1 py-5 -ml-1 inline-block"
            title="Back to Dashboard"
          >
            <ArrowLeft size={24} strokeWidth={2.25} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
        </div>
      </div>

      {/* Settings Card */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full -mt-6 sm:-mt-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-sm p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#131924]/5 p-2 rounded-lg">
              <KeyRound size={20} strokeWidth={2} className="text-[#131924]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Change Password</h2>
          </div>

          <form action={changePassword} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
              <input
                name="oldPassword"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                name="newPassword"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] focus:ring-1 focus:ring-[#131924] focus:outline-none text-gray-900"
              />
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
            {success && <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-100">{success}</div>}

            <button type="submit" className="w-full bg-[#131924] text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-gray-800 active:scale-[0.99] transition-all">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
