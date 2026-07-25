import { changePassword, importData, deleteAllData, setYearFilter } from '@/app/actions'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, KeyRound, CalendarDays } from 'lucide-react'
import PasswordInput from '@/app/login/PasswordInput'
import SettingsForm from './SettingsForm' 
import { SubmitButton } from '@/components/SubmitButton'
import DataManagementClient from './DataManagementClient'
import YearFilterForm from './YearFilterForm' // <-- IMPORT THE NEW COMPONENT

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams

  // Get the selected year from cookies, default to current year
  const cookieStore = await cookies()
  const currentYear = new Date().getFullYear().toString()
  const selectedYear = cookieStore.get('selected_year')?.value || currentYear

  // Generate an array of years starting from 2026 up to 4 years into the future
  const years = Array.from({ length: parseInt(currentYear) - 2026 + 5 }, (_, i) => (2026 + i).toString()).reverse()

  return (
    <main className="bg-[#F7F8FA] min-h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-[#131924] w-full safe-top px-4 sm:px-6 py-6 sm:py-8 pb-20 sm:pb-24">
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

      {/* Content Container */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full -mt-12 sm:-mt-16 pb-20">
        
        {/* Global Notifications for settings page */}
        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-2xl text-sm font-medium border border-red-100 shadow-sm">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-medium border border-green-100 shadow-sm">{success}</div>}

        {/* Financial Year Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-sm p-5 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#131924]/5 p-2 rounded-lg">
              <CalendarDays size={20} strokeWidth={2} className="text-[#131924]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Financial Years</h2>
          </div>

          {/* NEW: Using the Client Component for interactive checkbox logic */}
          <YearFilterForm 
            years={years} 
            initialSelected={selectedYear} 
            action={setYearFilter} 
          />
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5E7EB] shadow-sm p-5 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#131924]/5 p-2 rounded-lg">
              <KeyRound size={20} strokeWidth={2} className="text-[#131924]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Change Password</h2>
          </div>

          <SettingsForm action={changePassword}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
              <PasswordInput name="oldPassword" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <PasswordInput name="newPassword" minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <PasswordInput name="confirmPassword" minLength={6} />
            </div>

            <SubmitButton>Update Password</SubmitButton>
          </SettingsForm>
        </div>

        {/* Data Management Features */}
        <DataManagementClient 
          importAction={importData} 
          deleteAllAction={deleteAllData} 
        />

      </div>
    </main>
  )
}