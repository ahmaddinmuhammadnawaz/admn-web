import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AddAccountForm from './AddAccountForm'

export default async function AddaccountPage() {
  const supabase = await createClient()
  
  // Fetch available folders to populate the dropdown
  const { data: folders } = await supabase.from('folders').select('id, name').order('name')

  return (
    <main className="bg-[#F7F8FA] min-h-screen p-4 sm:p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E5E7EB] p-5 sm:p-8 mt-2 sm:mt-10">

        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link
            href="/"
            className="text-[#6B7280] hover:text-[#131924] transition-colors p-1 -ml-1 shrink-0"
            title="Cancel"
          >
            <ArrowLeft size={22} strokeWidth={2.25} />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[#131924]">Add New Account</h1>
        </div>

        <AddAccountForm folders={folders || []} />
        
      </div>
    </main>
  )
}